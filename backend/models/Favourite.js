const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true
});

// Chống trùng dữ liệu yêu thích
favouriteSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
