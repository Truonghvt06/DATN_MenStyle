const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Admin = require('../models/admin');

router.get('/view', (req, res) => {
  res.render('setting'); // sẽ render file views/setting.ejs
});
router.get('/change-password', (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/admin/login');
  res.render('change_password', { error: null, success: null });
});
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.render('change_password', {
        error: 'Không tìm thấy tài khoản admin.',
        success: null,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.render('change_password', {
        error: 'Mật khẩu hiện tại không đúng.',
        success: null,
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res.render('change_password', {
      error: null,
      success: '✅ Mật khẩu đã được đổi thành công!',
    });
  } catch (err) {
    res.render('change_password', {
      error: 'Lỗi máy chủ: ' + err.message,
      success: null,
    });
  }
});
module.exports = router;
