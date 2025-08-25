const Voucher = require("../models/Voucher");

// Hàm kiểm tra và cập nhật trạng thái voucher dựa trên ngày hết hạn
const updateVoucherStatus = async () => {
  try {
    const now = new Date();

    // Tìm các voucher đã hết hạn và đang kích hoạt
    const expiredVouchers = await Voucher.find({
      date_to: { $lt: now },
      is_active: true,
    });

    if (expiredVouchers.length > 0) {
      await Voucher.updateMany(
        { _id: { $in: expiredVouchers.map((v) => v._id) } },
        { is_active: false }
      );
      console.log(`Đã tự động tắt ${expiredVouchers.length} voucher hết hạn`);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái voucher:", error);
  }
};

// Hiển thị danh sách voucher
exports.viewVouchers = async (req, res) => {
  try {
    // Cập nhật trạng thái voucher trước khi hiển thị
    await updateVoucherStatus();

    const vouchers = await Voucher.find().sort({ is_active: -1, date_to: -1 });

    // ===== Lịch sử sử dụng voucher từ usage của Voucher (ưu tiên dữ liệu thực tế) =====
    const Order = require("../models/Order");

    const { month, voucher_code } = req.query || {};

    let start = null;
    let end = null;
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split("-").map((s) => parseInt(s, 10));
      start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
      end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
    }

    const voucherQuery = {};
    if (voucher_code && typeof voucher_code === "string") {
      voucherQuery.code = voucher_code.trim();
    }

    // Lấy mã voucher và usage
    const vouchersUsageSource = await Voucher.find(voucherQuery)
      .select("code voucher_usage voucher_scope used_count")
      .lean();

    const usageEntries = [];
    for (const v of vouchersUsageSource) {
      const list = Array.isArray(v.voucher_usage) ? v.voucher_usage : [];
      const filtered = list.filter((u) => {
        if (!start || !end) return true;
        if (!u.used_at) return false;
        const t = new Date(u.used_at);
        return t >= start && t <= end;
      });
      for (const u of filtered) {
        usageEntries.push({
          voucher_code: v.code,
          order_id: u.order_id || null,
          user_id: u.user_id || null,
          used_at: u.used_at || null,
        });
      }
    }

    // Lấy đơn hàng tương ứng các usage có order_id để tính giảm giá và chi tiết
    const orderIds = Array.from(
      new Set(
        usageEntries
          .filter((e) => e.order_id)
          .map((e) => String(e.order_id))
      )
    );

    let ordersById = new Map();
    if (orderIds.length) {
      const orders = await Order.find({ _id: { $in: orderIds } })
        .select("code items total_amount createdAt user_id voucher_code")
        .populate("user_id", "name email")
        .populate("items.product_id", "name")
        .lean();
      ordersById = new Map(orders.map((o) => [String(o._id), o]));
    }

    const historyMap = new Map();

    for (const entry of usageEntries) {
      const key = entry.voucher_code;
      // Lấy voucher_scope từ vouchersUsageSource
      const voucherObj = vouchersUsageSource.find(v => v.code === key);
      const voucher_scope = voucherObj ? voucherObj.voucher_scope : 'order';

      const acc = historyMap.get(key) || {
        voucher_code: key,
        voucher_scope, // Thêm dòng này
        use_count: 0,
        total_discount: 0,
        orders: [],
      };
      acc.voucher_scope = voucher_scope; // Đảm bảo luôn có trường này

      acc.use_count += 1;

      if (entry.order_id && ordersById.has(String(entry.order_id))) {
        const ord = ordersById.get(String(entry.order_id));
        const subtotal = Array.isArray(ord.items)
          ? ord.items.reduce(
              (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
              0
            )
          : 0;

        let order_discount = 0;
        let shipping_discount = 0;
        let voucher_type = voucher_scope; // 'order' hoặc 'shipping'
        let discount = 0;

        if (Array.isArray(ord.voucher_code)) {
          const vcode = ord.voucher_code[0];
          order_discount = vcode.order_discount || 0;
          shipping_discount = vcode.shipping_discount || 0;
          // Tính discount theo loại voucher
          if (voucher_type === 'shipping') {
            discount = shipping_discount;
          } else {
            discount = order_discount;
          }
        }

        const productNames = Array.isArray(ord.items)
          ? ord.items
              .map((it) =>
                it.product_id && it.product_id.name ? it.product_id.name : null
              )
              .filter(Boolean)
          : [];

        acc.total_discount += discount;
        acc.orders.push({
          code: ord.code,
          createdAt: ord.createdAt,
          user: ord.user_id || null,
          productNames,
          subtotal,
          voucher_type, // Loại voucher: 'order' hoặc 'shipping'
          discount,     // Số tiền giảm theo loại voucher
          total_amount: ord.total_amount || 0,
        });
      }

      historyMap.set(key, acc);
    }

    const voucherHistoryStats = Array.from(historyMap.values()).sort(
      (a, b) => b.total_discount - a.total_discount
    );

    // Fallback: nếu không có usage nào, lấy từ Order.voucher_code
    if (voucherHistoryStats.length === 0) {
      const orderFilter = { voucher_code: { $ne: "" } };
      if (voucher_code && typeof voucher_code === "string") {
        orderFilter.voucher_code = voucher_code.trim();
      }
      if (start && end) {
        orderFilter.createdAt = { $gte: start, $lte: end };
      }

      const ordersWithVoucher = await Order.find(orderFilter)
        .select("code voucher_code items total_amount createdAt user_id ")
        .populate("user_id", "name email")
        .populate("items.product_id", "name")
        .sort({ createdAt: -1 })
        .lean();

      const fallbackMap = new Map();
      for (const ord of ordersWithVoucher) {
        const subtotal = Array.isArray(ord.items)
          ? ord.items.reduce(
              (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
              0
            )
          : 0;
        const discount = Math.max(0, subtotal - (ord.total_amount || 0));
        const productNames = Array.isArray(ord.items)
          ? ord.items
              .map((it) =>
                it.product_id && it.product_id.name ? it.product_id.name : null
              )
              .filter(Boolean)
          : [];

        const acc = fallbackMap.get(ord.voucher_code) || {
          voucher_code: ord.voucher_code,
          voucher_scope: ord.voucher_scope || 'order', // Thêm dòng này
          use_count: 0,
          total_discount: 0,
          orders: [],
        };
        acc.use_count += 1;
        acc.total_discount += discount;
        acc.orders.push({
          code: ord.code,
          createdAt: ord.createdAt,
          user: ord.user_id || null,
          productNames,
          subtotal,
          discount,
          total_amount: ord.total_amount || 0,
        });
        fallbackMap.set(ord.voucher_code, acc);
      }

      const fbStats = Array.from(fallbackMap.values()).sort(
        (a, b) => b.total_discount - a.total_discount
      );

      res.render("voucher", { vouchers, voucherHistoryStats: fbStats, historyFilters: { month: month || "", voucher_code: voucher_code || "" } });
      return;
    }

    const historyFilters = { month: month || "", voucher_code: voucher_code || "" };

    res.render("voucher", { vouchers, voucherHistoryStats, historyFilters });
  } catch (error) {
    // console.log(error);
    
    res.render("voucher", { 
    vouchers: [], 
    voucherHistoryStats: [], 
    historyFilters: {}, 
    errorMessage: "Không có voucher được sử dụng trong tháng này!" 
  });
  }
};

// Hiển thị form thêm voucher
exports.addVoucherForm = (req, res) => {
  res.render("voucher_add"); // Sẽ tạo file này sau
};

// Hiển thị form sửa voucher
exports.editVoucherForm = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).send("Không tìm thấy voucher");
    }
    res.render("voucher_edit", { voucher });
  } catch (error) {
    console.error("Error loading voucher for edit:", error);
    res.status(500).send("Lỗi khi tải voucher để sửa");
  }
};

// Xử lý thêm voucher
exports.addVoucher = async (req, res) => {
  try {
    const {
      title,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      quantity,
      date_from,
      date_to,
      is_status,
      voucher_scope,
    } = req.body;

    // Tự động sinh mã và kiểm tra trùng
    let voucherCode;
    let isUnique = false, attempts = 0;
    while (!isUnique && attempts < 5) {
      voucherCode = generateVoucherCode();
      const existed = await Voucher.findOne({ code: voucherCode });
      if (!existed) isUnique = true;
      attempts++;
    }
    if (!isUnique) {
      return res.status(500).send("Không thể tạo mã voucher, vui lòng thử lại.");
    }

    // Tạo voucher mới
    const voucher = new Voucher({
      title,
      code: voucherCode,
      description,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      quantity,
      date_from: new Date(date_from),
      date_to: new Date(date_to),
      is_status: is_status === "true" || is_status === true,
      max_discount_value:
        discount_type === "percentage" ? req.body.max_discount : undefined,
      voucher_scope,
    });

    await voucher.save();
    res.redirect('/voucher/view');
  } catch (error) {
    res.status(500).send("Lỗi khi thêm voucher: " + error.message);
  }
};

// Xử lý sửa voucher
exports.editVoucher = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      quantity,
      date_from,
      date_to,
      is_status,
      voucher_scope,
    } = req.body;

    // Validate mã voucher
    const codeRegex = /^.{12}$/; // Đúng 12 ký tự bất kỳ
    if (!codeRegex.test(code)) {
      return res.status(400).send("Mã voucher phải gồm đúng 12 ký tự.");
    }
    const existed = await Voucher.findOne({ code, _id: { $ne: req.params.id } });
    if (existed) {
      return res.status(400).send("Mã voucher đã tồn tại.");
    }

    const updateData = {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      quantity,
      date_from: new Date(date_from), // Sửa dòng này
      date_to: new Date(date_to),     // Sửa dòng này
      is_status:
        typeof is_status !== "undefined"
          ? is_status === "true" || is_status === true
          : false,
      max_discount_value:
        discount_type === "percentage" ? req.body.max_discount : undefined,
      voucher_scope, // Thêm dòng này
    };

    console.log("Update data to save:", updateData);

    const voucher = await Voucher.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!voucher) {
      return res.status(404).send("Không tìm thấy voucher để cập nhật");
    }

    
    console.log('Voucher updated successfully');
    res.redirect('/voucher/view');
  } catch (error) {
    console.error("Error updating voucher:", error);
    res.status(500).send("Lỗi khi cập nhật voucher: " + error.message);
  }
};

// Xử lý xoá voucher
exports.deleteVoucher = async (req, res) => {
  try {
    console.log("Deleting voucher with ID:", req.params.id);

    const voucher = await Voucher.findByIdAndDelete(req.params.id);

    if (!voucher) {
      return res.status(404).send("Không tìm thấy voucher để xoá");
    }

    
    console.log('Voucher deleted successfully');
    res.redirect('/voucher/view');
  } catch (error) {
    console.error("Error deleting voucher:", error);
    res.status(500).send("Lỗi khi xoá voucher: " + error.message);
  }
};

// Toggle trạng thái voucher
exports.toggleVoucherStatus = async (req, res) => {
  try {
    console.log("Toggling voucher status for ID:", req.params.id);
    console.log("New status:", req.body.is_status);

    const voucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      { is_status: req.body.is_status },
      { new: true }
    );

    if (!voucher) {
      return res.status(404).json({ error: "Không tìm thấy voucher" });
    }

    console.log("Voucher status updated successfully");
    res.json({ success: true, is_status: voucher.is_status });
  } catch (error) {
    console.error("Error toggling voucher status:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái voucher" });
  }
};

// API trả về danh sách voucher cho mobile app (fix cứng)
exports.apiGetVouchers = async (req, res) => {
  try {
    const vouchers = [
      {
        _id: "1",
        code: "WELCOME10",
        description: "Giảm 10% cho đơn hàng đầu tiên",
        discount_type: "percentage",
        discount_value: 10,
        min_order_amount: 200000,
        max_discount: 50000,
        is_status: true,
      },
      {
        _id: "2",
        code: "FREESHIP",
        description: "Miễn phí vận chuyển",
        discount_type: "fixed",
        discount_value: 0,
        min_order_amount: 500000,
        shipping_discount: 30000,
        is_status: true,
      },
      {
        _id: "3",
        code: "SAVE20",
        description: "Giảm 20% tối đa 100k",
        discount_type: "percentage",
        discount_value: 20,
        min_order_amount: 300000,
        max_discount: 100000,
        is_status: true,
      },
    ];
    res.status(200).json({ vouchers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách voucher", error: error.message });
  }
};

const generateVoucherCode=()=> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const prefix = `VCH${day}${month}${year}`;
  return `${prefix}${random}`;
};
