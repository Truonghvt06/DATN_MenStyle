const express = require('express');
const router = express.Router();
const User = require('../models/User'); // nếu User là tài khoản

router.get('/view', async (req, res) => {
  try {
    const users = await User.find()
      .populate('favorites') // Lấy thông tin sản phẩm yêu thích
      .populate('cart.productId'); 
      console.log(JSON.stringify(users[0].cart, null, 2)); // Lấy thông tin sản phẩm trong giỏ hàng
    res.render('users', { users });
  } catch (err) {
    res.status(500).send('Lỗi khi tải tài khoản: ' + err.message);
  }
});

module.exports = router;
