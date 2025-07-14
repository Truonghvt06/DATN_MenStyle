const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Ví dụ: "Áo", "Quần", "Giày"
    description: { type: String, default: "" }, // Mô tả thêm
    image: { type: String, default: "" }, // ✅ Ảnh đại diện của loại sản phẩm (URL)
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductType", productTypeSchema);
