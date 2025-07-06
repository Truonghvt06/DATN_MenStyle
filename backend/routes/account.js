const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../utils/upload");

router.get("/view", async (req, res) => {
  try {
    const users = await User.find()
      .populate("favorites.productId")
      .populate("cart.productId");

    const products = await Product.find();
    res.render("users", { users, products });
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

router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites.productId");
    const favoritesWithDetails = user.favorites.map((fav) => {
      const product = fav.productId;
      const variant = product?.variants?.[fav.variantIndex] || {};
      return {
        productId: product?._id,
        name: product?.name,
        image: variant.image || product.image,
        price: product?.price,
        variant: {
          size: variant.size,
          color: variant.color,
        },
      };
    });
    res.json({ success: true, favorites: favoritesWithDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/favorites/add-by-id", async (req, res) => {
  try {
    const { userId, productId, variantIndex = 0 } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const exists = user.favorites.some(
      (item) =>
        item.productId.toString() === productId &&
        item.variantIndex === variantIndex
    );

    if (!exists) {
      user.favorites.push({ productId, variantIndex });
      await user.save();
    }
    res.json({ success: true, message: "Đã thêm vào yêu thích." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/cart/add-by-id", async (req, res) => {
  try {
    const { userId, productId, variantIndex = 0, quantity = 1 } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const existing = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantIndex === variantIndex
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, variantIndex, quantity });
    }
    await user.save();
    res.json({ success: true, message: "Đã thêm vào giỏ hàng." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("cart.productId")
      .populate("favorites.productId")
      .lean();
    const products = await Product.find().lean();
    console.log('Products sent to template:', products);
    res.render("user_detail", { user, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;