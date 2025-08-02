const Voucher = require("../models/Voucher");

// Hàm kiểm tra và cập nhật trạng thái voucher dựa trên ngày hết hạn
const updateVoucherStatus = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Tìm các voucher đã hết hạn và đang kích hoạt
    const expiredVouchers = await Voucher.find({
      date_to: { $lt: today },
      is_status: true,
    });

    if (expiredVouchers.length > 0) {
      // Cập nhật trạng thái thành false cho các voucher hết hạn
      await Voucher.updateMany(
        { _id: { $in: expiredVouchers.map((v) => v._id) } },
        { is_status: false }
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

    const vouchers = await Voucher.find();
    res.render("voucher", { vouchers });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách voucher");
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
    console.log("Received voucher data:", req.body);

    const {
      title,
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      quantity,
      date_from,
      date_to,
      is_status,
    } = req.body;

    console.log("Parsed data:", {
      title,
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      quantity,
      date_from,
      date_to,
      is_status,
    });

    // Tạo voucher mới
    const voucher = new Voucher({
      title,
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      quantity,
      date_from,
      date_to,
      is_status: is_status === "true" || is_status === true,
      max_discount_value:
        discount_type === "percentage" ? req.body.max_discount : undefined,
    });

    console.log("Voucher object to save:", voucher);

    await voucher.save();
    console.log("Voucher saved successfully");

    res.redirect("/coupons/view");
  } catch (error) {
    console.error("Error adding voucher:", error);
    res.status(500).send("Lỗi khi thêm voucher: " + error.message);
  }
};

// Xử lý sửa voucher
exports.editVoucher = async (req, res) => {
  try {
    console.log("Updating voucher with ID:", req.params.id);
    console.log("Update data:", req.body);

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
    } = req.body;

    const updateData = {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      quantity,
      date_from,
      date_to,
      is_status:
        typeof is_status !== "undefined"
          ? is_status === "true" || is_status === true
          : false,
      max_discount_value:
        discount_type === "percentage" ? req.body.max_discount : undefined,
    };

    console.log("Update data to save:", updateData);

    const voucher = await Voucher.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!voucher) {
      return res.status(404).send("Không tìm thấy voucher để cập nhật");
    }

    console.log("Voucher updated successfully");
    res.redirect("/coupons/view");
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

    console.log("Voucher deleted successfully");
    res.redirect("/coupons/view");
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

/// API APP MOBILE
