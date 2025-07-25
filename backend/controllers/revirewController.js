// controllers/review.controller.js
const Order = require("../models/Order");
const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// GET: Lấy tất cả sản phẩm đã mua và phân loại
exports.getPurchasedProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Lấy tất cả sản phẩm đã mua và giao thành công
    const orders = await Order.find({
      user_id: userId,
      status: "Delivered",
    });

    const now = new Date();
    const reviewedProductIds = (
      await Review.find({ user_id: userId }).select("product_id")
    ).map((r) => r.product_id.toString());

    const reviewed = [];
    const notReviewed = [];

    // 2. Lọc sản phẩm đã/ chưa đánh giá
    orders.forEach((order) => {
      const deliveredAt = new Date(order.deliveredAt);
      const daysSinceDelivery =
        (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);

      order.items.forEach((item) => {
        const productId = item.product_id.toString();

        const isReviewed = reviewedProductIds.includes(productId);

        const productData = {
          product_id: productId,
          product_variant_id: item.product_variant_id,
          price: item.price,
          quantity: item.quantity,
          order_id: order._id,
          deliveredAt,
        };

        if (isReviewed) {
          reviewed.push(productData);
        } else if (daysSinceDelivery <= 7) {
          notReviewed.push(productData);
        }
        // else if (daysSinceDelivery <= 7 && !item.isExpired) {
        //   notReviewed.push(productData);
        // }
      });
    });

    return res.status(200).json({ reviewed, notReviewed });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Tạo đánh giá
exports.createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user._id;

    if (!product_id || !rating) {
      return res.status(400).json({ message: "Thiếu thông tin đánh giá" });
    }

    // 1. Khởi tạo và lưu review mới
    const review = new Review({
      user_id,
      product_id,
      rating,
      comment,
    });

    await review.save(); // dùng save()

    // 2. Tính lại trung bình đánh giá cho sản phẩm
    const reviews = await Review.find({ product_id });
    const rating_count = reviews.length;
    const rating_sum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const rating_avg = parseFloat((rating_sum / rating_count).toFixed(1));

    // 3. Cập nhật thông tin rating vào Product
    await Product.findByIdAndUpdate(product_id, {
      rating_avg,
      rating_count,
    });

    return res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (err) {
    console.error("Lỗi tạo đánh giá:", err);
    return res.status(500).json({ error: err.message });
  }
};
