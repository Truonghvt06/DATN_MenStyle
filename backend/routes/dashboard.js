const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Route VIEW: Giao diện tổng quan dashboard
router.get('/stats-overview', (req, res) => {
  const today = new Date();
  const from = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // đầu ngày
  const to = new Date().toISOString(); // hiện tại

  res.render('stats-overview', { defaultFrom: from, defaultTo: to });
});

// Route API: Trả về JSON thống kê dashboard
router.get("/stats", async (req, res) => {
  try {
    const { from, to } = req.query;
    const start = new Date(from);
    const end = new Date(to);

    // Xử lý múi giờ Việt Nam (UTC+7)
    const VN_OFFSET = 7 * 60 * 60 * 1000;
    const startVN = new Date(start.getTime() - VN_OFFSET);
    const endVN = new Date(end.getTime() - VN_OFFSET);
    startVN.setHours(0, 0, 0, 0);
    endVN.setHours(23, 59, 59, 999);

    // 1. Đơn hàng đã thanh toán
    const orders = await Order.find({
      payment_status: "paid",
      createdAt: { $gte: startVN, $lte: endVN }
    });

    const revenue = orders.reduce((total, order) => total + order.total_amount, 0);
    const orderCount = orders.length;

    // 2. Top 5 sản phẩm bán chạy
    const bestSellers = await Order.aggregate([
      {
        $match: {
          payment_status: "paid",
          createdAt: { $gte: startVN, $lte: endVN }
        }
      },
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
      createdAt: { $gte: startVN, $lte: endVN },
    }).sort({ createdAt: -1 });

    // 4. Tổng hợp theo ngày cho biểu đồ
    const generateDateMap = (from, to) => {
      const map = {};
      const current = new Date(from);
      while (current <= to) {
        const key = current.toISOString().split("T")[0];
        map[key] = 0;
        current.setDate(current.getDate() + 1);
      }
      return map;
    };

    const dailyRevenueMap = generateDateMap(startVN, endVN);
    orders.forEach(order => {
      const date = new Date(order.createdAt.getTime() + VN_OFFSET).toISOString().split("T")[0];
      if (dailyRevenueMap[date] !== undefined) {
        dailyRevenueMap[date] += order.total_amount;
      }
    });

    const dailyUserMap = generateDateMap(startVN, endVN);
    newUsers.forEach(user => {
      const date = new Date(user.createdAt.getTime() + VN_OFFSET).toISOString().split("T")[0];
      if (dailyUserMap[date] !== undefined) {
        dailyUserMap[date] += 1;
      }
    });

    res.json({
      revenue,
      orderCount,
      newCustomers: newUsers.length,
      newUsers: newUsers.map((u, index) => ({
        index: index + 1,
        fullName: u.fullname || "Không tên",
        email: u.email,
        createdAt: u.createdAt.toISOString().split("T")[0]
      })),
      bestSellers,
      dailyRevenue: Object.entries(dailyRevenueMap).map(([date, total]) => ({ date, total })),
      dailyUsers: Object.entries(dailyUserMap).map(([date, count]) => ({ date, count }))
    });

  } catch (err) {
    console.error("Lỗi khi lấy thống kê:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
