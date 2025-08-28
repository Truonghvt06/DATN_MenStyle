const Voucher = require("../models/Voucher"); // đường dẫn tuỳ theo cấu trúc project


exports.getActiveVouchers = async (req, res) => {
  try {
    const now = new Date();
    const {
      scope, // voucher_scope filter
      is_public, // lọc public hay không
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {
      is_active: true,
      date_from: { $lte: now },
      date_to: { $gte: now },
      $expr: { $lt: ["$used_count", "$quantity"] }, // còn voucher để dùng
    };

    if (scope && ["order", "shipping"].includes(scope)) {
      filter.voucher_scope = scope;
    }

    if (typeof is_public !== "undefined") {
      if (is_public === "true") filter.is_public = true;
      else if (is_public === "false") filter.is_public = false;
    }

    // Nếu muốn giới hạn theo user (ví dụ voucher chỉ dành cho một số user)
    if (req.user && req.user._id) {
      // voucher có applicable_users rỗng (ai cũng được) hoặc chứa user này
      filter.$or = [
        { applicable_users: { $exists: true, $size: 0 } },
        { applicable_users: req.user._id },
      ];
    }

    const skip =
      (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const limitNum = Math.max(1, parseInt(limit));

    // Lấy total để client biết paging
    const [total, vouchers] = await Promise.all([
      Voucher.countDocuments(filter),
      Voucher.find(filter)
        .sort({ date_to: 1 }) // sắp xếp theo hết hạn gần nhất
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
    ]);


    if (req.user && req.user._id) {
     
    }

    res.json({
      success: true,
      data: {
        total,
        page: parseInt(page),
        limit: limitNum,
        vouchers,
      },
    });
  } catch (error) {
    console.error("getActiveVouchers error:", error);
    res.status(500).json({
      success: false,
      message: "Lấy voucher thất bại",
      error: error.message,
    });
  }
};

//LẤY DANH SACH VOUCHER
exports.getAvailableVouchers = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user.id;

    const vouchers = await Voucher.find({
      is_active: true,
      quantity: { $gt: 0 },
      $expr: { $gt: ["$quantity", "$used_count"] },
      date_from: { $lte: now },
      date_to: { $gte: now },
      // Ẩn voucher mà user này đã dùng đủ số lần
      $or: [
        { voucher_usage: { $size: 0 } },
        {
          voucher_usage: {
            $not: {
              $elemMatch: {
                user_id: userId,
              },
            },
          },
        },
        {
          voucher_usage: {
            $elemMatch: {
              user_id: userId,
            },
          },
        },
      ],
    }).sort({ createdAt: -1 });

    // Lọc thêm ở phía server để đảm bảo không trả voucher user đã dùng hết lượt
    const filteredVouchers = vouchers.filter((voucher) => {
      const userUsedCount = voucher.voucher_usage.filter(
        (usage) => usage.user_id.toString() === userId.toString()
      ).length;
      return userUsedCount < voucher.usage_limit_per_user;
    });

    return res.status(200).json({
      success: true,
      total: filteredVouchers.length,
      vouchers: filteredVouchers,
    });
  } catch (error) {
    console.error("getAvailableVouchers error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách voucher",
    });
  }
};

// UPDATE VOUCHER: Sử dụng voucher
exports.useVoucher = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { orderId } = req.body; // nhận orderId từ body khi áp dụng voucher
    const userId = req.user.id; // giả sử middleware auth đã gắn req.user

    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher không tồn tại" });
    }

    const now = new Date();

    // 1. Kiểm tra điều kiện khả dụng
    if (!voucher.is_active) {
      return res
        .status(400)
        .json({ success: false, message: "Voucher không hoạt động" });
    }
    if (voucher.date_from > now || voucher.date_to < now) {
      return res.status(400).json({
        success: false,
        message: "Voucher đã hết hạn hoặc chưa bắt đầu",
      });
    }
    if (voucher.used_count >= voucher.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Voucher đã hết lượt sử dụng" });
    }

    // 2. Kiểm tra số lần user đã dùng voucher này
    const userUsedCount = voucher.voucher_usage.filter(
      (usage) => usage.user_id.toString() === userId.toString()
    ).length;

    if (userUsedCount >= voucher.usage_limit_per_user) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã sử dụng hết số lần cho phép",
      });
    }

    // 3. Cập nhật used_count, voucher_usage (thêm order_id)
    voucher.used_count += 1;
    voucher.voucher_usage.push({
      user_id: userId,
      order_id: orderId || null, // thêm orderId, nếu chưa có thì để null
      voucher_id: voucher._id,
      used_at: now,
    });

    await voucher.save();

    return res.status(200).json({
      success: true,
      message: "Sử dụng voucher thành công",
      voucher,
    });
  } catch (error) {
    console.error("useVoucher error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi sử dụng voucher",
    });
  }
};
