const mongoose = require("mongoose");

const ORDER_ENUM = [
  "Pending",
  "Confirmed",
  "Shipping",
  "Delivered",
  "Paid",
  "Canceled",
];
const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  product_variant_id: { type: String, required: true },
  price: { type: Number },
  quantity: { type: Number },
  isExpired: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: { type: Number },
    status: { type: String, enum: ORDER_ENUM, default: "Pending" },
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
