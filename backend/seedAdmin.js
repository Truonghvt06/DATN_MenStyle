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

  const hashed = await bcrypt.hash('admin123', 10);
  await Admin.create({ password: hashed });
  console.log('✅ Tạo admin thành công! Mật khẩu: admin123');
  process.exit();
}).catch(err => {
  console.error('❌ Kết nối MongoDB lỗi:', err);
});
