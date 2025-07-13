const mongoose = require("mongoose");

const VOUCHER_ENUM = ["percentage", "fixed"];

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    discount_type: { type: String, enum: VOUCHER_ENUM, required: true },
    discount_value: { type: String, required: true },
    min_order_amount: { type: Number, required: false, default: 0 },
    quantity: { type: Number, required: true },
    used_count: { type: Number, default: 0 },
    date_from: { type: String, required: true },
    date_to: { type: String, required: true },
    is_status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
