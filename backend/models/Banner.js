const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL ảnh hoặc đường dẫn nội bộ
    required: true,
  },
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Banner', bannerSchema);
