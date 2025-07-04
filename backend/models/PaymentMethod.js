const mongoose = require("mongoose");

const CODE_ENUM = ["COD", "ZaloPay"];
const paymentMethodSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, eum: CODE_ENUM },
    name: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
