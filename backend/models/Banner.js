const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
