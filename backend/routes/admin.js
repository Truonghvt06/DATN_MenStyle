const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin'); // ✅ dùng DB thay vì .env
const Banner = require('../models/Banner');
const User = require('../models/User');

// GET /admin → tự chuyển hướng
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/admin/home');
  }
  res.redirect('/admin/login');
});

// GET /admin/login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/admin/home');
  res.render('login', { error: null });
});

// POST /admin/login (xác thực mật khẩu từ DB)
router.post('/login', async (req, res) => {
  const { password } = req.body;

  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.render('login', { error: '❌ Chưa thiết lập mật khẩu quản trị.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('login', { error: '❌ Sai mật khẩu, vui lòng thử lại.' });
    }

    req.session.loggedIn = true;
    return res.redirect('/admin/home');
  } catch (error) {
    console.error('Lỗi xác thực admin:', error);
    return res.render('login', { error: '⚠️ Đã xảy ra lỗi máy chủ.' });
  }
});

// GET /admin/home – Trang chính quản trị
router.get('/home', async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/admin/login');

  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    const userCount = await User.countDocuments();
    res.render('home', { banners, userCount });
  } catch (error) {
    res.status(500).send('Lỗi khi tải trang quản trị: ' + error.message);
  }
});

// GET /admin/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;
