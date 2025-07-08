const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema cho từng item trong giỏ hàng
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantIndex: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const favoriteItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    gender: {
      type: String,
      required: false,
      enum: ["Nam", "Nữ", "Khác"],
      default: "",
    },
    avatar: { type: String, required: false, default: "" },
    date_of_birth: { type: String, required: false, default: "" },
    password: { type: String, required: true },

    resetOTP: { type: String, require: false, default: "" },
    resetOTPExpires: { type: Date, require: false, default: null },
    otpVerified: { type: Boolean, require: false, default: false },

    // Giỏ hàng
    cart: [cartItemSchema],
    // ✅ Danh sách yêu thích (đã sửa)
    favorites: [favoriteItemSchema],
  },
  {
    timestamps: true,
  }
);

// Mã hóa mật khẩu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
