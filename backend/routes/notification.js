const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Người dùng
router.get("/", authMiddleware, notificationController.getNotifications);
router.patch(
  "/update-isread/:id",
  authMiddleware,
  notificationController.markAsRead
);
router.delete(
  "/delete-noti/:id",
  authMiddleware,
  notificationController.deleteNotification
);

// Admin gửi
router.post(
  "/send-notification",
  authMiddleware,
  notificationController.sendNotificationFromAdmin
);

module.exports = router;
