const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// /dashboard/view
router.get('/view', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buyersToday = await User.find({
      updatedAt: { $gte: today },
      cart: { $exists: true, $not: { $size: 0 } }
    }).countDocuments();

    const totalVariants = await Product.aggregate([
      { $unwind: '$variants' },
      { $group: { _id: null, total: { $sum: '$variants.quantity' } } }
    ]);

    res.render('dashboard', {
      revenueToday: 0,
      buyersToday: buyersToday,
      userCount: userCount,
      totalRevenue: 0,
      totalProductQuantity: totalVariants[0]?.total || 0
    });

  } catch (err) {
    res.status(500).send('Lỗi Dashboard: ' + err.message);
  }
});

router.get('/stats-overview', async (req, res) => {
  // Giả sử bạn muốn thống kê 10 ngày cho newUsers và doanh thu daily
  const userLabels = ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7', 'Ngày 8', 'Ngày 9', 'Ngày 10'];
  const newUsersData = [0, 0, 3, 0, 1, 0, 0, 0, 0, 0];
  const dailyLabels = ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'];
  const revenueDaily = [0, 0, 0, 0, 0, 0, 0];
  const monthlyLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const revenueMonthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  res.render('stats-overview', {
    title: 'Thống kê',
    userLabels,
    newUsersData,
    dailyLabels,
    revenueDaily,
    monthlyLabels,
    revenueMonthly
  });
});

module.exports = router;
