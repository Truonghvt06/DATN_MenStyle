const mongoose = require("mongoose");

const NOTIFICATION_ENUM = ["order", "promotion", "system"];

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, reqiured: true },
    content: { type: String, reqiured: false, default: "" },
    image: { type: String, reqiured: false, default: "" },
    type: { type: String, enum: NOTIFICATION_ENUM, required: true },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
