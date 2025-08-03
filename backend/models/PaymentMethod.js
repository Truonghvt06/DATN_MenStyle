const mongoose = require("mongoose");

const CODE_ENUM = ["COD", "ZALOPAY"];
const paymentMethodSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, enum: CODE_ENUM },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
