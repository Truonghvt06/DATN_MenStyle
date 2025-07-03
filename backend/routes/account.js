const express = require("express");
const router = express.Router();
const User = require("../models/User"); // nếu User là tài khoản
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../utils/upload");
router.get("/view", async (req, res) => {
  try {
    const users = await User.find()
      .populate("favorites") // Lấy thông tin sản phẩm yêu thích
      .populate("cart.productId");
    console.log(JSON.stringify(users[0].cart, null, 2)); // Lấy thông tin sản phẩm trong giỏ hàng
    res.render("users", { users });
  } catch (err) {
    res.status(500).send("Lỗi khi tải tài khoản: " + err.message);
  }
});

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/profile", authMiddleware, authController.profile);
router.put("/update-profile", authMiddleware, authController.updateProfile);
router.put(
  "/update-avatar",
  authMiddleware,
  upload.single("avatar"),
  authController.updateAvatar
);
router.post("/forgot-password", authController.forgotPass);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
