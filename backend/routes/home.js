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

  // Lấy thời gian hiện tại ở VN
  const vnNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  // Tạo mốc đầu ngày VN
  const start = new Date(vnNow);
  start.setHours(0, 0, 0, 0);

  // Mốc đầu ngày hôm sau VN
  const nextStart = new Date(start);
  nextStart.setDate(start.getDate() + 1);

  return { start, nextStart };
}


// ===== /admin/home -> render views/home.ejs =====
router.get("/home", async (req, res, next) => {
  try {
    const { start, nextStart } = getTodayRangeVN();

    // Đơn tạo trong hôm nay (theo giờ VN)
    const todayOrdersFilter = { createdAt: { $gte: start, $lt: nextStart } };

    const todayOrderCount = await Order.countDocuments(todayOrdersFilter);

    const revAgg = await Order.aggregate([
      { $match: { ...todayOrdersFilter, payment_status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    const todayRevenue = revAgg.length ? revAgg[0].total : 0;

    const pendingOrderCount = await Order.countDocuments({ order_status: "pending" });
    const userCount = await User.countDocuments({});

    let banners = [];
    try {
      banners = await Banner.find({ active: true }).lean();
      if (!banners.length) banners = await Banner.find({}).lean();
    } catch (e) {
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
