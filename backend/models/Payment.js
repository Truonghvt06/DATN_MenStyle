const mongoose = require("mongoose");

const PAYMENT_ENUM = ["pending", "success", "failed"];

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payment_status: { type: String, enum: PAYMENT_ENUM, default: "pending" },
    transaction_id: { type: String, required: true },
    paid_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
