const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema cho từng item trong giỏ hàng
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantIndex: {
    type: Number,
    required: true, // vị trí biến thể trong mảng variants
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
}, { _id: false }); // không tạo _id cho mỗi item

// Schema chính của User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Nam", "Nữ", "Khác"], // gợi ý
  },
  avatar: {
    type: String,
    required: false,
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },

  // Giỏ hàng
  cart: [cartItemSchema],

  // Danh sách yêu thích
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
}, {
  timestamps: true // tự động thêm createdAt, updatedAt
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu nhập vào khi login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
