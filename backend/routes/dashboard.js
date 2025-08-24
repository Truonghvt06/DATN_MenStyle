const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Hàm định dạng ngày thành YYYY-MM-DD theo múi giờ Việt Nam
const formatDateToYMD = (date) => {
  return date.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
};

// Trang view thống kê
router.get("/stats-overview", (req, res) => {
  const today = new Date();
  const from = formatDateToYMD(new Date(today.setHours(0, 0, 0, 0)));
  const to = formatDateToYMD(new Date(today.setHours(23, 59, 59, 999)));
  res.render("stats-overview", { defaultFrom: from, defaultTo: to });
});

// API thống kê
router.get("/stats", async (req, res) => {
  try {
    const { from, to } = req.query;

    // Chuyển đổi from, to sang Date objects
    const startVN = new Date(from);
    startVN.setHours(0, 0, 0, 0);
    const endVN = new Date(to);
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
    // Doanh thu theo ngày
    const dailyRevenue = await Order.aggregate([
      { $match: { payment_status: "paid", createdAt: { $gte: startVN, $lte: endVN } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Ho_Chi_Minh"
            }
          },
          total: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1
        }
      }
    ]);

    // Người dùng mới theo ngày
    const dailyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: startVN, $lte: endVN } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Ho_Chi_Minh"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1
        }
      }
    ]);

    // Doanh thu theo năm
    const yearlyRevenue = await Order.aggregate([
      { $match: { payment_status: "paid", createdAt: { $gte: startVN, $lte: endVN } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y",
              date: "$createdAt",
              timezone: "Asia/Ho_Chi_Minh"
            }
          },
          total: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id",
          total: 1
        }
      }
    ]);

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
      dailyRevenue,
      dailyUsers,
      yearlyRevenue
    });

  } catch (err) {
    console.error("Lỗi thống kê:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;