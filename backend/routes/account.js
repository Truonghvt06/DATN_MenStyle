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
//
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "favorites.productId"
    );
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
router.get("/detail/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("cart.productId")
      .populate("favorites.productId")
      .lean();
    const products = await Product.find().lean();
    console.log("Số lượng sản phẩm trong giỏ hàng:", products.length);
    res.render("user_detail", { user, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("cart.productId")
      .populate("favorites.productId")
      .lean();
    const products = await Product.find().lean();
    console.log("Số lượng sản phẩm trong giỏ hàng:", products.length);
    res.render("user_detail", { user, products });
    // =======
    //     const { userId, productId, variantIndex = 0 } = req.body;
    //     const user = await User.findById(userId);
    //     if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    //     const exists = user.favorites.some(
    //       (item) =>
    //         item.productId.toString() === productId &&
    //         item.variantIndex === variantIndex
    //     );

    //     if (!exists) {
    //       user.favorites.push({ productId, variantIndex });
    //       await user.save();
    //     }
    //     res.json({ success: true, message: "Đã thêm sản phẩm vào yêu thích." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
});
router.post("/:id/cart/add-variant", async (req, res) => {
  const userId = req.params.id;
  const { productId } = req.body;
  const variantIndex = Number(req.body.variantIndex);

  try {
    if (isNaN(variantIndex)) {
      return res.status(400).send("Biến thể không hợp lệ");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    const existing = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantIndex === variantIndex
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      user.cart.push({ productId, variantIndex, quantity: 1 });
    }

    await user.save();
    res.redirect(`/accounts/detail/${userId}`);
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
    res.status(500).send("Lỗi server");
  }
});

router.post("/:id/favorites/add", async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    const exists = user.favorites.some(
      (item) => item.productId.toString() === productId
    );

    if (!exists) {
      user.favorites.push({ productId });
      await user.save();
    }

    res.redirect(`/accounts/detail/${userId}`);
    // =======
    //     const user = await User.findById(req.params.id)
    //       .populate("cart.productId")
    //       .populate("favorites.productId")
    //       .lean();
    //     const products = await Product.find().lean();
    //     console.log('Số lượng sản phẩm trong giỏ hàng:', products.length);
    //     res.render("user_detail", { user, products });
    // >>>>>>> Stashed changes
  } catch (err) {
    console.error("Lỗi thêm vào yêu thích:", err);
    res.status(500).send("Lỗi server khi thêm vào yêu thích");
  }
});
router.post("/:id/cart/update-all", async (req, res) => {
  console.log("Request body:", req.body);
  const { action } = req.body;
  const userId = req.params.id;

  try {
    const users = await User.findById(userId);
    if (!users) return res.status(404).send("Không tìm thấy người dùng");
    if (users.cart.length === 0) {
      return res.status(400).send("Giỏ hàng trống, không thể cập nhật");
    }

    if (!action || !action.includes("-")) {
      return res.status(400).send("Thiếu hoặc sai định dạng action");
    }

    const [type, indexStr] = action.split("-");
    const index = parseInt(indexStr);

    if (isNaN(index)) {
      return res.status(400).send("Index không hợp lệ");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    if (user.cart[index]) {
      if (type === "increase") {
        user.cart[index].quantity += 1;
      } else if (type === "decrease") {
        user.cart[index].quantity -= 1;

        // Nếu giảm về 0 hoặc nhỏ hơn thì xóa luôn sản phẩm
        if (user.cart[index].quantity <= 0) {
          user.cart.splice(index, 1);
        }
      }
    }

    await user.save();
    res.redirect(`/accounts/detail/${userId}`);
  } catch (err) {
    console.error("Lỗi cập nhật giỏ hàng:", err.message);
    res.status(500).send("Lỗi server");
  }
});

router.post("/:id/cart/remove-item", async (req, res) => {
  const { id } = req.params;
  const { index } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    if (index >= 0 && index < user.cart.length) {
      user.cart.splice(index, 1);
      await user.save();
    }

    res.redirect(`/accounts/detail/${id}`);
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ:", err.message);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
