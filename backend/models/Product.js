const mongoose = require("mongoose");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    normalized_name: { type: String }, // 🔍 Tên không dấu để tìm kiếm
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating_avg: { type: Number, default: 5 },
    rating_count: { type: Number, default: 0 },
    sold_count: { type: Number, default: 0 },
    is_fovorite: { type: Boolean, default: false },
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

// ✅ Tự động cập nhật normalized_name trước khi lưu
productSchema.pre("save", function (next) {
  if (this.name) {
    this.normalized_name = removeVietnameseTones(this.name)
      .toLowerCase()
      .trim();
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
