const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String ,require: true},
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type:String,required: true,},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating_avg: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    sold_count: { type: Number, default: 0 },

    variants: [variantSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
