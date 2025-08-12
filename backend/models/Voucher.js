const mongoose = require("mongoose");

const VOUCHER_ENUM = ["percentage", "fixed"];
// Các kiểu giảm giá: percentage (theo %), fixed (giảm số tiền cố định)
const VOUCHER_SCOPE = ["order", "shipping"];

const voucherUsageSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: true,
    },
    used_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề voucher, bắt buộc
    code: { type: String, required: true, unique: true }, // Mã voucher, bắt buộc, không được trùng lặp
    image: { type: String, default: "" }, // Hình ảnh đại diện voucher, có thể để trống
    description: { type: String, default: "" }, // Mô tả voucher, có thể để trống
    voucher_scope: { type: String, enum: VOUCHER_SCOPE, default: "order" }, // Phạm vi áp dụng voucher: order (đơn hàng) hoặc shipping (vận chuyển)
    discount_type: { type: String, enum: VOUCHER_ENUM, required: true }, // Kiểu giảm giá, chỉ nhận 'percentage' hoặc 'fixed'
    discount_value: { type: Number, required: true }, // Giá trị giảm: nếu là percentage thì 0-100 (%), nếu fixed thì số tiền giảm
    max_discount_value: { type: Number, default: null }, // (Tuỳ chọn) Số tiền giảm tối đa khi discount_type = percentage
    min_order_amount: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu để được áp dụng voucher
    quantity: { type: Number, required: true }, // Số lượng voucher phát hành (tổng số lần có thể dùng)
    used_count: { type: Number, default: 0 }, // Số lần voucher đã được sử dụng
    usage_limit_per_user: { type: Number, default: 1 }, // Giới hạn số lần 1 user được dùng voucher
    applicable_products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ], // Danh sách sản phẩm áp dụng (nếu để rỗng thì áp dụng cho tất cả)
    applicable_category: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ProductType" },
    ], // Danh sách thể loại áp dụng (nếu để rỗng thì áp dụng cho tất cả)
    applicable_users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách user được phép dùng voucher (nếu để rỗng thì ai cũng dùng được)
    is_public: { type: Boolean, default: true }, // Voucher công khai (true) hay chỉ dành cho 1 số user nhất định (false)
    date_from: { type: Date, required: true }, // Ngày bắt đầu hiệu lực
    date_to: { type: Date, required: true }, // Ngày hết hạn
    is_active: { type: Boolean, default: true }, // Trạng thái voucher (đang hoạt động hoặc bị khóa)
    voucher_usage: { type: [voucherUsageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
