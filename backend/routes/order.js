const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add-order", orderController.createOrder);
// Lấy danh sách đơn hàng của người dùng
router.get("/my-orders", authMiddleware, orderController.getOrders);


router.get(
  "/order-detail/:orderId",
  authMiddleware,
  orderController.getOrderDetailApp
);
router.put("/cancelOrder/:id", orderController.cancelOrder);
router.post("/buyAgain", authMiddleware, orderController.buyAgain);

router.post("/update-status/:id", orderController.updateStatus);
router.post("/update-payment-status/:id", orderController.updatePaymentStatus);

router.get("/order_detail/:id", orderController.getOrderDetail);
router.get("/payment-by-order/:orderId", orderController.getPaymentByOrderId);
router.get("/by-date", orderController.getOrdersByDate);

module.exports = router;
