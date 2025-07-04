const mongoose = require("mongoose");

const VOUCHER_ENUM = ["percentage", "fixed"];

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, reqiured: true },
    description: { type: String, reqiured: false, default: "" },
    discount_type: { type: String, enum: VOUCHER_ENUM, reqiured: true },
    discount_value: { type: String, reqiured: true },
    min_order_amount: { type: Number, reqiured: false, default: 0 },
    quantity: { type: Number, reqiured: true },
    used_count: { type: Number, default: 0 },
    date_from: { type: String, reqiured: true },
    date_to: { type: String, reqiured: true },
    is_status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
