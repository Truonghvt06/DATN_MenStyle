const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Admin = require('../models/admin');
const Banner = require('../models/Banner');
const User = require('../models/User');

/* ------------ Helpers / Middleware ------------ */
function ensureAdmin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  return res.redirect('/admin/login');
}

// Tách handler để dùng chung cho 2 kiểu URL
function renderChangePassword(req, res) {
  return res.render('change_password', { error: null, success: null });
}

async function postChangePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const email = req.session.adminEmail;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.render('change_password', { error: '❌ Tài khoản không tồn tại.', success: null });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.render('change_password', { error: '❌ Mật khẩu hiện tại không đúng.', success: null });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    return res.render('change_password', { success: '✅ Đổi mật khẩu thành công!', error: null });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    return res.render('change_password', { error: '❌ Có lỗi xảy ra khi đổi mật khẩu.', success: null });
  }
}

/* ------------ Auth & Home ------------ */
// GET /admin → tự chuyển hướng
router.get('/', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/admin/home');
  return res.redirect('/admin/login');
});

// GET /admin/login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) return res.redirect('/admin/home');
  res.render('login', { error: null });
});

// POST /admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.render('login', { error: '❌ Email không tồn tại trong hệ thống.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('login', { error: '❌ Sai mật khẩu, vui lòng thử lại.' });
    }

    req.session.loggedIn = true;
    req.session.adminEmail = email;

    return res.redirect('/admin/home');
  } catch (error) {
    console.error('Lỗi xác thực admin:', error);
    return res.render('login', { error: '⚠️ Đã xảy ra lỗi máy chủ.' });
  }
});

// GET /admin/home
router.get('/home', ensureAdmin, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    const userCount = await User.countDocuments();
    res.render('home', { banners, userCount });
  } catch (error) {
    res.status(500).send('Lỗi khi tải trang quản trị: ' + error.message);
  }
});

// Đổi mật khẩu từ trong quản trị
router.get('/change_password', (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/admin/login');
  res.render('change_password', { error: null, success: null });
});

router.post('/change_password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const email = req.session.adminEmail;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.render('change_password', { error: '❌ Tài khoản không tồn tại.', success: null });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.render('change_password', { error: '❌ Mật khẩu hiện tại không đúng.', success: null });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res.render('change_password', {
      success: '✅ Đổi mật khẩu thành công!',
      error: null,
    });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    res.render('change_password', {
      error: '❌ Có lỗi xảy ra khi đổi mật khẩu.',
      success: null,
    });
  }
});
/* ------------ Đăng xuất ------------ */
router.get('/logout', ensureAdmin, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

/* ------------ Quên mật khẩu (OTP) ------------ */
// B1: Hiển thị form nhập email
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { error: null, success: null });
});

// B1: Gửi OTP đến email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.render('forgot-password', { error: '❌ Email không tồn tại.', success: null });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.resetEmail = email;
  req.session.otp = otp;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Mã OTP xác minh',
    html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>`,
  });

  res.redirect('/admin/verify-otp');
});

// B2: Trang nhập mã OTP
router.get('/verify-otp', (req, res) => {
  res.render('verify-otp', { error: null });
});

// B2: Kiểm tra mã OTP
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (!req.session.resetEmail || otp !== req.session.otp) {
    return res.render('verify-otp', { error: '❌ Mã OTP không hợp lệ.' });
  }

  req.session.verified = true;
  res.redirect('/admin/reset-password');
});

// B3: Đổi mật khẩu nếu xác minh OTP thành công
router.get('/reset-password', (req, res) => {
  if (!req.session.verified) return res.redirect('/admin/login');
  res.render('reset-password', { error: null, success: null });
});

router.post('/reset-password', async (req, res) => {
  if (!req.session.verified) return res.redirect('/admin/login');

  const email = req.session.resetEmail;
  const { newPassword } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.render('reset-password', { error: '❌ Không tìm thấy tài khoản.', success: null });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  admin.password = hashed;
  await admin.save();

  delete req.session.resetEmail;
  delete req.session.otp;
  delete req.session.verified;

  res.render('reset-password', {
    success: '✅ Đặt lại mật khẩu thành công!',
    error: null,
  });
});

module.exports = router;
