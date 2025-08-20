const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Lấy sản phẩm đã giao  (chưa quá 7 ngày)
router.get(
  "/reviewable",
  authMiddleware,
  reviewController.getPendingReviewItems
);

// Lấy review của user
router.get("/", authMiddleware, reviewController.getMyReviews);

// Tạo review mới
router.post("/add-review", authMiddleware, reviewController.createReview);
router.get(
  "/product/:productId",
  reviewController.getReviewsByProduct
);
router.get("/:id/toggle", reviewController.toggleReviewActivity);


module.exports = router;
