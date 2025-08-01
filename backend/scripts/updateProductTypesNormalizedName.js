// scripts/updateProductTypesNormalizedName.js
const mongoose = require("mongoose");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const ProductType = require("../models/ProductType");

async function updateNormalizedNames() {
  await mongoose.connect(
    "mongodb+srv://nt111197:1234@menstyle.rjzjcth.mongodb.net/MenStyle"
  ); // ⚠️ sửa lại URI

  const types = await ProductType.find();
  for (const type of types) {
    type.normalized_name = removeVietnameseTones(type.name)
      .toLowerCase()
      .trim();
    await type.save();
  }

  console.log("✅ Đã cập nhật normalized_name cho tất cả ProductType");
  mongoose.disconnect();
}

updateNormalizedNames();
