const mongoose = require("mongoose");

const NOTIFICATION_ENUM = ["order", "promotion", "system"];

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    type: { type: String, enum: NOTIFICATION_ENUM, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }, // <- payload mở thẳng đơn
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user_id: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
