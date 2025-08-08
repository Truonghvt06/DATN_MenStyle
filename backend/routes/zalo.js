// routes/zaloPayRoutes.js
const express = require("express");
const router = express.Router();
const zaloPayController = require("../controllers/zaloPayController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, zaloPayController.createZaloPayOrder);
router.post("/callback", zaloPayController.zaloCallback);

module.exports = router;
