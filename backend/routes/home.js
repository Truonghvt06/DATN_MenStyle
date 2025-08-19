// routes/admin.js
const express = require("express");
const router = express.Router();

// ===== Models (chỉnh path nếu khác) =====
const Order  = require("../models/Order");
const User   = require("../models/User");
const Banner = require("../models/Banner");

// ===== Lấy khoảng hôm nay theo giờ VN (GMT+7) =====
function getTodayRangeVN() {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnNow  = new Date(utcNow + 7 * 60 * 60000);
  const y = vnNow.getUTCFullYear();
  const m = vnNow.getUTCMonth();
  const d = vnNow.getUTCDate();
  const start = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
  const nextStart = new Date(Date.UTC(y, m, d + 1, 0, 0, 0, 0));
  return { start, nextStart };
}

// ===== /admin/home -> render views/home.ejs =====
router.get("/home", async (req, res, next) => {
  try {
    const { start, nextStart } = getTodayRangeVN();

    // Đơn tạo trong hôm nay
    const todayOrdersFilter = { createdAt: { $gte: start, $lt: nextStart } };

    // 1) Đơn hàng hôm nay (đếm mọi đơn tạo hôm nay)
    const todayOrderCount = await Order.countDocuments(todayOrdersFilter);

    // 2) Doanh thu hôm nay (chỉ đơn đã thanh toán)
    const revAgg = await Order.aggregate([
      { $match: { ...todayOrdersFilter, payment_status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    const todayRevenue = revAgg.length ? revAgg[0].total : 0;

    // 3) Đơn hàng chờ xử lý (dựa trên order_status trong DB)
    const pendingOrderCount = await Order.countDocuments({ order_status: "pending" });

    // 4) Tổng người dùng
    const userCount = await User.countDocuments({});

    // Banners: ưu tiên active:true, nếu không có thì lấy tất cả
    let banners = [];
    try {
      banners = await Banner.find({ active: true }).lean();
      if (!banners.length) banners = await Banner.find({}).lean();
    } catch (e) {
      console.warn("Banner query failed:", e?.message);
      banners = [];
    }

    res.render("home", {
      banners,
      todayRevenue,
      todayOrderCount,
      pendingOrderCount,
      userCount,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
