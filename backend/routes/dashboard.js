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

module.exports = router;
