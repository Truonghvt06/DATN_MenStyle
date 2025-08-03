const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-order", orderController.createOrder);
// Lấy danh sách đơn hàng của người dùng
router.get("/my-orders", authMiddleware, orderController.getOrders);

// Lấy chi tiết 1 đơn hàng
router.get(
  "/my-orders/:orderId",
  authMiddleware,
  orderController.getOrderDetail
);

module.exports = router;
