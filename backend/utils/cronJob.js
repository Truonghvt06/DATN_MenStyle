// utils/cronJobs.js: Ẩn ẩn item order chưa đánh giá sau 7 ngày
const Order = require("../models/order.model");
const Review = require("../models/review.model");

const hideExpiredNotReviewed = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 1. Tìm đơn hàng đã giao cách đây hơn 7 ngày
    const orders = await Order.find({
      status: "Delivered",
      deliveredAt: { $lte: sevenDaysAgo },
    });

    for (const order of orders) {
      let modified = false;

      for (let item of order.items) {
        if (item.isExpired) continue;

        // Kiểm tra nếu user đã đánh giá sản phẩm đó chưa
        const hasReviewed = await Review.exists({
          user_id: order.user_id,
          product_id: item.product_id,
        });

        if (!hasReviewed) {
          item.isExpired = true;
          modified = true;
        }
      }

      if (modified) {
        await order.save();
      }
    }

    console.log("✅ Cron job đã xử lý xong sản phẩm chưa đánh giá quá 7 ngày.");
  } catch (err) {
    console.error("❌ Cron job lỗi:", err);
  }
};

module.exports = { hideExpiredNotReviewed };
