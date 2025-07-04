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
  product_variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: { type: Number },
  quantity: { type: Number },
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
    items: [orderItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
