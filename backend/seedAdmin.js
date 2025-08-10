const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const exists = await Admin.findOne();
  if (exists) {
    console.log('⚠️ Admin đã tồn tại.');
    process.exit();
  }

  const hashed = await bcrypt.hash('menstyle', 10);
  await Admin.create({
    email: 'quyet18t@gmail.com',  // ✅ thêm email bắt buộc
    password: hashed,
  });

  console.log('✅ Tạo admin thành công!');
  console.log('📧 Email: quyet18t@gmail.com');
  console.log('🔑 Mật khẩu: menstyle');
  process.exit();
}).catch(err => {
  console.error('❌ Kết nối MongoDB lỗi:', err);
});
