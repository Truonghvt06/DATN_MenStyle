const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_variant_id: {
      type: String,
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
    is_activity: { type: Boolean, default: true }, // Trạng thái đánh giá (đang hoạt động hoặc bị xóa)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
