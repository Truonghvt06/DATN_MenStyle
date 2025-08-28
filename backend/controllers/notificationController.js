const Notification = require("../models/Notification");
const User = require("../models/User");
const admin = require("../utils/firebaseAdmin");

// Gửi thông báo FCM + lưu DB
const sendFCMAndSave = async ({ userId, title, content, image = "", type }) => {
  const user = await User.findById(userId);
  if (!user || !user.fcmToken) return;

  const message = {
    notification: { title, body: content, image },
    token: user.fcmToken,
    data: { type },
  };

  await admin.messaging().send(message);

  const newNotification = new Notification({
    user_id: userId,
    title,
    content,
    image,
    type,
    is_read: false,
  });

  await newNotification.save();
};

// GET: Lấy thông báo người dùng
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ message: "Lấy danh sách thành công", notifications });
  } catch (err) {
    console.error("Lỗi getNotifications:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// PATCH: Cập nhật trạng thái đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    notification.is_read = true;
    await notification.save();

    res.json({ message: "Đã đánh dấu là đã đọc", notification });
  } catch (err) {
    console.error("Lỗi markAsRead:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// DELETE: Xoá thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }

    await Notification.deleteOne({ _id: req.params.id });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    console.error("Lỗi deleteNotification:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


exports.sendNotificationFromAdmin = async (req, res) => {
  try {
    const {
      title,
      content,
      image = "",
      type,
      data = {},
      targetUserId = null,
    } = req.body;
    if (!["order", "promotion", "system"].includes(type)) {
      return res.status(400).json({ message: "Loại thông báo không hợp lệ" });
    }

    if (type === "promotion" || (type === "system" && !targetUserId)) {
      const users = await User.find({ fcmToken: { $ne: "" } }).select("_id");
      for (const user of users) {
        await sendFCMAndSave({
          userId: user._id,
          title,
          content,
          image,
          type,
          data,
        });
      }
    } else if (targetUserId) {
      await sendFCMAndSave({
        userId: targetUserId,
        title,
        content,
        image,
        type,
        data,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Thiếu targetUserId cho loại cá nhân" });
    }

    res.json({ message: "Đã gửi thông báo thành công" });
  } catch (err) {
    console.error("Lỗi sendNotificationFromAdmin:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
