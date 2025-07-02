const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product"); 
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// [GET] Xem danh sách user + populate favorites và cart
router.get("/view", async (req, res) => {
  try {
    const users = await User.find()
      .populate("favorites.productId")
      .populate("cart.productId");

    const products = await Product.find(); // truyền thêm danh sách sản phẩm

    res.render("users", { users, products });
  } catch (err) {
    res.status(500).send("Lỗi khi tải tài khoản: " + err.message);
  }
});


// [POST] Đăng nhập và đăng ký
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/profile", auth, authController.profile);

// =======================


// ✅ [GET] Danh sách yêu thích (kèm chi tiết product + variant)
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites.productId");

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

// ✅ Thêm vào yêu thích theo userId
router.post("/favorites/add-by-id",auth, async (req, res) => {
  try {
    const { userId, productId, variantIndex = 0 } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const exists = user.favorites.some(
      (item) => item.productId.toString() === productId && item.variantIndex === variantIndex
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

// ✅ Thêm vào giỏ hàng theo userId
router.post("/cart/add-by-id",auth, async (req, res) => {
  try {
    const { userId, productId, variantIndex = 0, quantity = 1 } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const existing = user.cart.find(
      (item) => item.productId.toString() === productId && item.variantIndex === variantIndex
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





module.exports = router;
