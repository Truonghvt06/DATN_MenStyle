// scripts/updateProductsNormalizedName.js
const mongoose = require("mongoose");
const Product = require("../models/Product");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

async function updateNormalizedNames() {
  await mongoose.connect(
    "mongodb+srv://nt111197:1234@menstyle.rjzjcth.mongodb.net/MenStyle"
  ); // ⚠️ sửa lại URI

  const products = await Product.find();
  for (const product of products) {
    product.normalized_name = removeVietnameseTones(product.name)
      .toLowerCase()
      .trim();
    await product.save();
  }

  console.log("✅ Đã cập nhật normalized_name cho tất cả sản phẩm");
  mongoose.disconnect();
}

updateNormalizedNames();
