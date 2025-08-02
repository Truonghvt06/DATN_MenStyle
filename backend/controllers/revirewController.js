const Order = require("../models/Order");
const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Helper: tính lại rating trung bình của product
const recalcProductRating = async (product_id) => {
  const reviews = await Review.find({ product_id });
  const rating_count = reviews.length;
  const rating_sum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const rating_avg =
    rating_count > 0 ? parseFloat((rating_sum / rating_count).toFixed(1)) : 0;

  await Product.findByIdAndUpdate(product_id, {
    rating_avg,
    rating_count,
  });
};

// GET /reviews/reviewable
// Lấy tất cả sản phẩm đã giao trong vòng 7 ngày để hiển thị ở "chưa đánh giá" (không loại trừ đã từng review)
exports.getPendingReviewItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Lấy tất cả đơn hàng đã giao của user
    const orders = await Order.find({
      user_id: userId,
      status: "Delivered",
    })
      .lean()
      .exec();

    const pending = [];

    for (const order of orders) {
      const deliveredAt = order.deliveredAt
        ? new Date(order.deliveredAt)
        : null;
      if (!deliveredAt) continue;

      const daysSinceDelivery =
        (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > 7) continue; // quá hạn thì không cho đánh giá

      for (const item of order.items) {
        // Kiểm tra xem order-item này đã có review (cùng order_id + product + variant) chưa
        const existing = await Review.findOne({
          user_id: userId,
          order_id: order._id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,
        }).lean();

        if (existing) {
          continue; // đã đánh giá trên chính order này, bỏ qua
        }

        pending.push({
          order_id: order._id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,
          price: item.price,
          quantity: item.quantity,
          deliveredAt,
        });
      }
    }

    return res.status(200).json({ pending }); // trả về "chưa đánh giá"
  } catch (err) {
    console.error("Error in getPendingReviewItems:", err);
    return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};
// POST /reviews — tạo review cho 1 order-item
exports.createReview = async (req, res) => {
  try {
    const { product_id, order_id, product_variant_id, rating, comment } =
      req.body;
    const user_id = req.user._id;

    if (!product_id || !order_id || !product_variant_id || rating == null) {
      return res.status(400).json({ message: "Thiếu thông tin đánh giá" });
    }

    // 1. Kiểm tra order thuộc user và đã Delivered
    const order = await Order.findOne({
      _id: order_id,
      user_id,
      status: "Delivered",
    })
      .lean()
      .exec();
    if (!order) {
      return res
        .status(400)
        .json({ message: "Đơn hàng không hợp lệ hoặc chưa được giao" });
    }

    // 2. Kiểm tra item tồn tại trong order
    const matchedItem = order.items.find(
      (it) =>
        it.product_id.toString() === product_id &&
        it.product_variant_id === product_variant_id
    );
    if (!matchedItem) {
      return res.status(400).json({ message: "Sản phẩm không thuộc đơn hàng" });
    }

    // 3. Kiểm tra thời hạn 7 ngày kể từ deliveredAt
    if (!order.deliveredAt) {
      return res.status(400).json({ message: "Thời điểm giao không rõ" });
    }
    const now = new Date();
    const deliveredAt = new Date(order.deliveredAt);
    const diffDays =
      (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res.status(400).json({ message: "Hết hạn đánh giá" });
    }

    // 4. Tránh đánh giá trùng cho chính order-item này
    const existing = await Review.findOne({
      user_id,
      order_id,
      product_id,
      product_variant_id,
    }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này" });
    }

    // 5. Tạo review mới
    const review = new Review({
      user_id,
      order_id,
      product_id,
      product_variant_id,
      rating,
      comment: comment || "",
    });
    await review.save();

    // 6. Cập nhật lại rating trung bình của product
    await recalcProductRating(product_id);

    return res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (err) {
    console.error("Lỗi tạo đánh giá:", err);
    return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// GET /reviews/my — lấy review đã tạo của user (có thể dùng để hiển thị tab "Đã đánh giá")
exports.getMyReviews = async (req, res) => {
  try {
    const user_id = req.user._id;

    // Lấy tất cả review của user, kèm info product + order
    const reviews = await Review.find({ user_id })
      .populate({
        path: "product_id",
        select: "name variants price rating_avg rating_count",
      })
      .populate({
        path: "order_id",
        select: "status deliveredAt",
      })
      .lean()
      .exec();

    // Có thể format thêm để frontend dễ dùng
    const formatted = reviews.map((r) => ({
      review_id: r._id,
      order_id: r.order_id?._id,
      order_status: r.order_id?.status,
      deliveredAt: r.order_id?.deliveredAt,
      product_id: r.product_id?._id,
      product_name: r.product_id?.name,
      product_variant_id: r.product_variant_id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      product_snapshot: {
        rating_avg: r.product_id?.rating_avg,
        rating_count: r.product_id?.rating_count,
        price: r.product_id?.price,
        variants: r.product_id?.variants,
      },
    }));

    return res.status(200).json({ reviews: formatted });
  } catch (err) {
    console.error("Lỗi lấy review của user:", err);
    return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};
