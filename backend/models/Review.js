const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      reqiured: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
