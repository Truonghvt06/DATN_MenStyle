const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// [GET] Xem danh sách user + populate favorites và cart
router.get("/view", async (req, res) => {
  try {
    const users = await User.find()
      .populate("favorites") // populate sản phẩm yêu thích
      .populate("cart.productId"); // populate sản phẩm trong giỏ
    console.log(JSON.stringify(users[0].cart, null, 2));
    res.render("users", { users });
  } catch (err) {
    res.status(500).send("Lỗi khi tải tài khoản: " + err.message);
  }
});

// [POST] Đăng nhập và đăng ký
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/profile", auth, authController.profile);

// =======================
// ➕ Thêm sản phẩm vào yêu thích
router.post("/favorites/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ success: true, message: "Đã thêm vào yêu thích." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ❌ Xóa sản phẩm khỏi yêu thích
router.post("/favorites/remove", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    res.json({ success: true, message: "Đã xóa khỏi yêu thích." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🛒 Thêm sản phẩm vào giỏ hàng
router.post("/cart/add", auth, async (req, res) => {
  try {
    const { productId, variantIndex, quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantIndex === variantIndex
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, variantIndex, quantity });
    }

    await user.save();
    res.json({ success: true, message: "Đã thêm vào giỏ hàng." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🧺 Xóa sản phẩm khỏi giỏ hàng
router.post("/cart/remove", auth, async (req, res) => {
  try {
    const { productId, variantIndex } = req.body;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) =>
        item.productId.toString() !== productId ||
        item.variantIndex !== variantIndex
    );

    await user.save();
    res.json({ success: true, message: "Đã xóa khỏi giỏ hàng." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
