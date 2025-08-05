const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * GET /cart
 * Lấy giỏ hàng
 */
router.get("/", authMiddleware, cartController.getCart);

/**
 * POST /cart/add
 * Thêm vào giỏ
 */
router.post("/add", authMiddleware, cartController.addToCart);

/**
 * PATCH /cart/item
 * Cập nhật số lượng item
 */
router.patch("/item", authMiddleware, cartController.updateCartItem);

/**
 * DELETE /cart/remove
 * Xóa nhiều item
 * body: { items: [{ productId, variantIndex }, ...] }
 */
router.delete("/remove", authMiddleware, cartController.removeCartItems);

/**
 * POST /cart/checkout
 * Checkout các item gửi lên
 */
router.post("/checkout", authMiddleware, cartController.checkout);

module.exports = router;
