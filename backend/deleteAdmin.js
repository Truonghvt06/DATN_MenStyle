const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Admin.deleteMany({});
  console.log(`🗑️ Đã xoá ${result.deletedCount} admin khỏi hệ thống.`);
  process.exit();
}).catch(err => {
  console.error('❌ Kết nối MongoDB lỗi:', err);
});
