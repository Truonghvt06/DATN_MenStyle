// const mongoose = require("mongoose");

// const VOUCHER_ENUM = ["percentage", "fixed"];

// const voucherSchema = new mongoose.Schema(
//   {
//     code: { type: String, reqiured: true },
//     description: { type: String, reqiured: false, default: "" },
//     discount_type: { type: String, enum: VOUCHER_ENUM, reqiured: true },// loại giảm giá: percentage hoặc fixed
//     discount_value: { type: Number, reqiured: true },//giá trị giảm giá: có thể là số hoặc phần trăm
//     max_discount_value: { type: Number, required: false, default: null }, //giảm tối đa bao nhiêu: áp dụng cho loại percentage
//     min_order_amount: { type: Number, reqiured: false, default: 0 },//giá trị đơn hàng tối thiểu để áp dụng voucher
//     quantity: { type: Number, reqiured: true },// tổng số lượng voucher có sẵn
//     used_count: { type: Number, default: 0 },// số lượng đã sử dụng
//     usage_limit_per_user: { type: Number, default: 1 },// giới hạn sử dụng voucher cho mỗi người dùng
//     date_from: { type: String, reqiured: true },
//     date_to: { type: String, reqiured: true },
//     is_status: { type: Boolean, default: false },// trạng thái hoạt động của voucher
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Voucher", voucherSchema);

const mongoose = require("mongoose");

const VOUCHER_ENUM = ["percentage", "fixed"];
// Các kiểu giảm giá: percentage (theo %), fixed (giảm số tiền cố định)
const VOUCHER_SCOPE = ["order", "shipping"];

const voucherSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
