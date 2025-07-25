const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/revirewController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-orders", authMiddleware, reviewController.getPurchasedProducts);
router.post("/review", authMiddleware, reviewController.createReview);

module.exports = router;
