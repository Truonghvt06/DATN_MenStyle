const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantIndex: { type: Number, required: true }, // chỉ số trong mảng variants
  quantity: { type: Number, required: true, default: 1 },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, require: false, default: "" },
  avatar: { type: String, require: false, default: "" },
  date_of_birth: { type: String, require: false, default: "" },
  password: { type: String, required: true },
  cart: [cartItemSchema],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // danh sách yêu thích

  resetOTP: { type: String, require: false, default: "" },
  resetOTPExpires: { type: Date, require: false, default: null },
  otpVerified: { type: Boolean, require: false, default: false },
});

// Mã hoá mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu khi login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
