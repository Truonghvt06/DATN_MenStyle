const mongoose = require("mongoose");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Ví dụ: "Áo", "Quần", "Giày"
    description: { type: String, default: "" }, // Mô tả thêm
    image: { type: String, default: "" }, // ✅ Ảnh đại diện của loại sản phẩm (URL)
    normalized_name: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Tự động cập nhật normalized_name trước khi save
productTypeSchema.pre("save", function (next) {
  if (this.name) {
    this.normalized_name = removeVietnameseTones(this.name)
      .toLowerCase()
      .trim();
  }
  next();
});

module.exports = mongoose.model("ProductType", productTypeSchema);
