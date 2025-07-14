const mongoose = require("mongoose");

const CODE_ENUM = ["COD", "BankTransfer"];
const paymentMethodSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, enum: CODE_ENUM }, 
    name: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
