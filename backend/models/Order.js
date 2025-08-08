const mongoose = require("mongoose");

const ORDER_STATUS_ENUM = [
  "pending", // Chờ xác nhận
  "confirmed", // Đã xác nhận
  "shipping", // Đang giao
  "delivered", // Đã giao
  "cancelled", // Đã huỷ
];

const PAYMENT_STATUS_ENUM = [
  "unpaid", // Chưa thanh toán
  "paid", // Đã thanh toán
  "refunded", // Hoàn tiền
];

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  product_variant_id: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: { type: String, required: true },
    voucher_code: { type: String, default: "" },
    total_amount: { type: Number, required: true },

    // Tách 2 trạng thái
    order_status: { type: String, enum: ORDER_STATUS_ENUM, default: "pending" },
    payment_status: {
      type: String,
      enum: PAYMENT_STATUS_ENUM,
      default: "unpaid",
    },

    shipping_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    reason: { type: String, default: "" },
    payment_method_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },

    items: { type: [orderItemSchema], default: [] },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
