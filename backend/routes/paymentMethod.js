const express = require("express");
const router = express.Router();

const paymentMethodController = require("../controllers/paymentMethodController");

// POST /payment-methods
router.post("/add-payment", paymentMethodController.createPaymentMethod);

// GET /payment-methods
router.get("/", paymentMethodController.getAllPaymentMethods);

// PUT /payment-methods/:id
router.put("update-payment/:id", paymentMethodController.updatePaymentMethod);

// DELETE /payment-methods/:id
router.delete(
  "delete-payment/:id",
  paymentMethodController.deletePaymentMethod
);

module.exports = router;
