const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Hàm chuyển đổi ngày sang múi giờ Việt Nam
const toVietnamDate = (date) => {
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  return new Date(date.toLocaleString("en-US", options));
};

// Trang view thống kê
router.get("/stats-overview", (req, res) => {
  const today = toVietnamDate(new Date());
  const from = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const to = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  res.render("stats-overview", { defaultFrom: from, defaultTo: to });
});

// API thống kê
router.get("/stats", async (req, res) => {
  try {
    const { from, to } = req.query;

    // Chuyển đổi from, to sang múi giờ Việt Nam
    const startVN = toVietnamDate(new Date(from));
    startVN.setHours(0, 0, 0, 0);
    const endVN = toVietnamDate(new Date(to));
    endVN.setHours(23, 59, 59, 999);

    // 1. Đơn hàng đã thanh toán
    const orders = await Order.find({
      payment_status: "paid",
      createdAt: { $gte: startVN, $lte: endVN }
    });

    const revenue = orders.reduce((t, o) => t + o.total_amount, 0);
    const orderCount = orders.length;

    // 2. Top 5 sản phẩm bán chạy
    const bestSellers = await Order.aggregate([
      { $match: { payment_status: "paid", createdAt: { $gte: startVN, $lte: endVN } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalSold: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          totalRevenue: 1,
          totalSold: 1
        }
      }
    ]);

    // 3. Người dùng mới
    const newUsers = await User.find({
      createdAt: { $gte: startVN, $lte: endVN }
    }).sort({ createdAt: -1 });

    // 4. Tổng hợp cho biểu đồ
    const generateDateMap = (from, to) => {
      const map = {};
      let cur = new Date(from);
      while (cur <= to) {
        const key = cur.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        map[key] = 0;
        cur.setDate(cur.getDate() + 1);
      }
      return map;
    };

    // Doanh thu theo ngày
    const dailyRevenueMap = generateDateMap(startVN, endVN);
    orders.forEach(o => {
      const date = o.createdAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      if (dailyRevenueMap[date] !== undefined) {
        dailyRevenueMap[date] += o.total_amount;
      }
    });

    // Người dùng mới theo ngày
    const dailyUserMap = generateDateMap(startVN, endVN);
    newUsers.forEach(u => {
      const date = u.createdAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      if (dailyUserMap[date] !== undefined) {
        dailyUserMap[date] += 1;
      }
    });

    res.json({
      revenue,
      orderCount,
      newCustomers: newUsers.length,
      newUsers: newUsers.map((u, i) => ({
        index: i + 1,
        fullName: u.fullname || "Không tên",
        email: u.email,
        createdAt: u.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      })),
      bestSellers,
      dailyRevenue: Object.entries(dailyRevenueMap).map(([date, total]) => ({ date, total })),
      dailyUsers: Object.entries(dailyUserMap).map(([date, count]) => ({ date, count }))
    });

  } catch (err) {
    console.error("Lỗi thống kê:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;