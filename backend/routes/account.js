const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order=require("../models/Order");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const favoriteController = require("../controllers/favoriteController");
const accountController = require("../controllers/accountController");

const upload = require("../utils/upload");

router.get("/view", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // trang hiện tại
    const limit = parseInt(req.query.limit) || 10; // số user mỗi trang
    const skip = (page - 1) * limit;

    // Tổng số user
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    // Lấy user theo trang
    const users = await User.find()
      .populate("favorites.productId")
      .populate("cart.productId")
      .skip(skip)
      .limit(limit);

    const products = await Product.find();

    res.render("users", {
      users,
      products,
      currentPage: page,
      totalPages
    });
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
// router.put("/change-password", authMiddleware, authController.changePassword);
router.post("/verify-password", authMiddleware, authController.verifyPassword);
router.patch("/update-password", authMiddleware, authController.updatePassword);

// Yêu thích
router.post(
  "/favorite/toggle",
  authMiddleware,
  favoriteController.toggleFavorite
);
router.get("/favorite", authMiddleware, favoriteController.getFavorites);
router.delete(
  "/favorite/delete-all",
  authMiddleware,
  favoriteController.clearFavorites
);
router.delete(
  "/favorite/delete/:productId",
  authMiddleware,
  favoriteController.removeFavorite
);

//update fcm token
router.put("/update-fcm-token", authMiddleware, authController.updateFcmToken);
//
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

    // 👉 Lấy tất cả đơn hàng của user
    const orders = await Order.find({ user_id: req.params.id })
      .populate("items.product_id", "name price") // populate thêm sản phẩm
      .sort({ createdAt: -1 })
      .lean();

    res.render("user_detail", { user, products, orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
});

router.post("/:id/cart/add-variant", async (req, res) => {
  const userId = req.params.id;
  const { productId, variantIndex, quantity } = req.body;

  // parse & validate
  const variantIdx = Number(variantIndex);
  const qty = Number(quantity) || 1; // nếu không truyền thì mặc định 1

  if (isNaN(variantIdx) || variantIdx < 0) {
    return res.status(400).json({ message: "VariantIndex không hợp lệ" });
  }
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
  }

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Tùy chọn: xác thực product và biến thể tồn tại, và kiểm tra tồn kho
    const product = await Product.findById(productId).lean();
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    if (
      !Array.isArray(product.variants) ||
      variantIdx >= product.variants.length
    ) {
      return res.status(400).json({ message: "Biến thể không tồn tại" });
    }

    const variant = product.variants[variantIdx];
    // Nếu muốn kiểm tra tồn kho:
    if (variant.quantity < qty) {
      return res.status(400).json({
        message: "Không đủ số lượng trong kho",
        available: variant.quantity,
      });
    }

    // Tìm item đã có trong giỏ với cùng product và biến thể
    const existing = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantIndex === variantIdx
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      user.cart.push({ productId, variantIndex: variantIdx, quantity: qty });
    }

    await user.save();

    return res.status(200).json({
      message: "Thêm vào giỏ hàng thành công",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
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

  } catch (err) {
    console.error("Lỗi thêm vào yêu thích:", err);
    res.status(500).send("Lỗi server khi thêm vào yêu thích");
  }
});
router.post("/:id/cart/update-all", async (req, res) => {
  // console.log("Request body:", req.body);
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
router.get("/admin/orders", accountController.getAllOrders);
router.get("/:id/cart/checkout", accountController.showCheckoutPage);
router.post("/:id/cart/checkout", accountController.processCheckout);
router.get("/:id/orders", accountController.showOrderPage);
// router.put('/update-status/:id', orderController.updateStatus);

// API trả về giỏ hàng dạng JSON cho app mobile
router.get("/api/cart/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("cart.productId")
      .lean();
    const sortCart = user.cart.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ cart: sortCart });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// router.post('/api/orders', accountController.apiCreateOrder);
// API thống kê dashboard
// API thống kê dashboard
router.get("/api/dashboard-stats", async (req, res) => {
  try {
    const now = new Date();

    // Lấy 0h hôm nay
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Lấy 0h của 7 ngày trước
    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);

    // Lấy 23:59:59 hôm nay
    const endOfToday = new Date(startOfToday);
    endOfToday.setHours(23, 59, 59, 999);

    // ===== Doanh thu 7 ngày gần nhất =====
    const revenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOf7DaysAgo, $lte: endOfToday }, // ✅ đổi từ updatedAt → createdAt
          payment_status: "paid" // ✅ đúng field
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" } // ✅ đúng field
        }
      }
    ]);
    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // ===== Đơn hàng mới =====
    const newOrders = await Order.countDocuments({
      createdAt: { $gte: startOf7DaysAgo, $lte: endOfToday },
      payment_status: "paid" // ✅ hợp lý hơn "delivered"
    });

    // ===== Khách hàng mới =====
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startOf7DaysAgo, $lte: endOfToday }
    });

    res.json({
      revenue,
      newOrders,
      newCustomers
    });
  } catch (err) {
    console.error("Lỗi lấy dashboard stats:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
