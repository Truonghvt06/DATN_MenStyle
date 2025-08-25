const admin = require("../utils/firebaseAdmin");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ép toàn bộ data sang string theo yêu cầu FCM
const toStringData = (obj = {}) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v ?? "")]));

/**
 * Gửi FCM rồi lưu Notification vào MongoDB
 * @param {Object} param0
 * @param {string|ObjectId} param0.userId
 * @param {string} param0.title
 * @param {string} param0.content
 * @param {string} [param0.image]
 * @param {"order"|"promotion"|"system"} param0.type
 * @param {Object} [param0.data]  // ví dụ: { orderId, orderStatus, deeplink, type }
 */
async function sendFCMAndSave({
  userId,
  title,
  content,
  image = "",
  type = "system",
  data = {},
}) {
  const user = await User.findById(userId, "fcmToken");

  // đảm bảo mọi field trong data là string (theo yêu cầu FCM)
  const strData = toStringData(data);

  if (user?.fcmToken) {
    // KHÔNG đặt tag / collapse-id để tránh replace -> cho phép cộng dồn
    const message = {
      token: user.fcmToken,

      // OS sẽ hiển thị khi app ở BG/QUIT
      notification: {
        title,
        body: content,
        // (tuỳ chọn) Một số thiết bị hỗ trợ notification.image; Android ưu tiên android.notification.imageUrl
        // image: image || undefined,
      },

      // payload để app điều hướng
      data: strData,

      android: {
        priority: "high",
        notification: {
          clickAction: strData.click_action || "OPEN_ORDER_DETAIL",
          channelId: "orders", // ✅ kênh có âm thanh (đã tạo ở app)
          sound: "default", // ✅ cho Android < 8; >=8 lấy theo channel
          // defaultSound: true,    // (không bắt buộc)
          imageUrl: image || undefined,
          // KHÔNG dùng tag/collapseKey để không replace
          // tag: undefined,
        },
      },

      apns: {
        // KHÔNG dùng apns-collapse-id để không replace
        // headers: { 'apns-collapse-id': undefined },
        payload: {
          aps: {
            sound: "default", // ✅ iOS có âm thanh
            "content-available": 1, // cho phép app nhận thêm data
            // badge: 1,                // (tuỳ chọn) nếu bạn muốn tăng badge
          },
        },
        // fcmOptions: { image: image || undefined }, // (tuỳ chọn) với HTTP v1
      },
    };

    try {
      await admin.messaging().send(message);
    } catch (err) {
      const code = err?.errorInfo?.code || err?.code;
      if (code === "messaging/registration-token-not-registered") {
        user.fcmToken = "";
        await user.save();
      }
      console.error("FCM send error:", err);
      // vẫn lưu notification dù FCM fail
    }
  }

  // Lưu MongoDB (bản gốc data để app đọc dễ)
  await Notification.create({
    user_id: userId,
    title,
    content,
    image,
    type,
    data,
    is_read: false,
  });
}

/**
 * Gửi thông báo cập nhật đơn (status/payment) + lưu DB
 * @param {Object} param0
 * @param {string|ObjectId} param0.userId
 * @param {Object} param0.order
 * @param {"status"|"payment"} param0.reason
 */
async function sendOrderNotification({ userId, order, reason }) {
  const shortId = String(order.code);
  // .slice(-6);
  if (reason === "status") {
    const VI_STATUS = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao hàng",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    const viStatus = VI_STATUS[order.order_status] || order.order_status;

    const content =
      order.order_status === "delivered"
        ? "Đơn hàng của bạn đã giao thành công. Cảm ơn bạn đã mua sắm tại MenStyle!"
        : `Đơn hàng của bạn được cập nhật: ${viStatus}.`;

    await sendFCMAndSave({
      userId,
      title: `Cập nhật đơn hàng: ${shortId}`,
      content,
      type: "order",
      data: {
        category: "order",
        type: "ORDER_STATUS",
        orderId: String(order._id),
        orderStatus: String(order.order_status || ""),
        paymentStatus: String(order.payment_status || ""),
        deeplink: `menstyle://order/${order._id}`, // RN deep link
        click_action: "OPEN_ORDER_DETAIL",
        web_url: `/order/${order._id}`, // nếu có webapp
      },
    });
  } else {
    const viPayment =
      order.payment_status === "paid"
        ? "Đã thanh toán"
        : order.payment_status === "unpaid"
        ? "Chưa thanh toán"
        : order.payment_status === "refunded"
        ? "Đã hoàn tiền"
        : order.payment_status;

    const content =
      order.payment_status === "paid"
        ? "Chúng tôi đã nhận được thanh toán của bạn. Cảm ơn bạn!"
        : order.payment_status === "refunded"
        ? "Đơn hàng của bạn đã được hoàn tiền."
        : `Trạng thái thanh toán: ${viPayment}.`;

    await sendFCMAndSave({
      userId,
      title: `Thanh toán đơn hàng ${shortId}`,
      content,
      type: "order",
      data: {
        category: "order",
        type: "PAYMENT_STATUS",
        orderId: String(order._id),
        orderStatus: String(order.order_status || ""),
        paymentStatus: String(order.payment_status || ""),
        deeplink: `menstyle://order/${order._id}`,
        click_action: "OPEN_ORDER_DETAIL",
        web_url: `/order/${order._id}`,
      },
    });
  }
}

module.exports = { sendFCMAndSave, sendOrderNotification };
