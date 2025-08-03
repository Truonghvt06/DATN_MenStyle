const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.post("/add-order", orderController.createOrder);
// Lấy danh sách đơn hàng của người dùng
router.get("/my-orders", orderController.getOrders);

// Lấy chi tiết 1 đơn hàng
router.get(
  "/my-orders/:orderId",
  orderController.getOrderDetail
);
// POST method để cập nhật trạng thái
router.post('/update-status/:id', orderController.updateStatus);

module.exports = router;
