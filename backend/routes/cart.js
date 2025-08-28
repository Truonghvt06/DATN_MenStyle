const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/", authMiddleware, cartController.getCart);


router.post("/add", authMiddleware, cartController.addToCart);


router.patch("/item", authMiddleware, cartController.updateCartItem);


router.delete("/remove", authMiddleware, cartController.removeCartItems);


router.post("/checkout", authMiddleware, cartController.checkout);

module.exports = router;
