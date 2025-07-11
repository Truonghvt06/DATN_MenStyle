const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },

    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating_avg: { type: Number, default: 5 },
    rating_count: { type: Number, default: 0 },
    sold_count: { type: Number, default: 0 },
    is_fovorite: { type: Boolean, default: false },
    variants: { type: [variantSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
