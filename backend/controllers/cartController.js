const User = require("../models/User");
const Product = require("../models/Product");

/**
 * Lấy giỏ hàng của user (populate product cơ bản)
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("cart.productId").lean();

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    const sortCart = user.cart.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ cart: sortCart });
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng" });
  }
};

/**
 * Thêm item vào giỏ (nếu đã có thì cộng số lượng)
 * body: { productId, variantIndex, quantity }
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantIndex, quantity = 1 } = req.body;

    if (!productId || variantIndex === undefined)
      return res
        .status(400)
        .json({ message: "Thiếu productId hoặc variantIndex" });

    if (quantity < 1)
      return res.status(400).json({ message: "Quantity phải >= 1" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    if (
      variantIndex < 0 ||
      variantIndex >= product.variants.length ||
      !product.variants[variantIndex]
    ) {
      return res.status(400).json({ message: "Variant không hợp lệ" });
    }

    const variant = product.variants[variantIndex];
    if (variant.quantity < quantity) {
      return res
        .status(400)
        .json({ message: `Còn lại ${variant.quantity} sản phẩm trong kho` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // Tìm item đã có
    const existingIndex = user.cart.findIndex(
      (ci) =>
        ci.productId.toString() === productId.toString() &&
        ci.variantIndex === variantIndex
    );

    if (existingIndex !== -1) {
      // cộng số lượng, kiểm tra tồn kho
      const newQty = user.cart[existingIndex].quantity + quantity;
      if (newQty > variant.quantity) {
        return res
          .status(400)
          .json({ message: `Tối đa chỉ còn ${variant.quantity} cái` });
      }
      user.cart[existingIndex].quantity = newQty;
    } else {
      user.cart.push({
        productId: product._id,
        variantIndex,
        variant_id: `${variant.size}|${variant.color}`,
        quantity,
      });
    }

    await user.save();
    res.json({ message: "Thêm vào giỏ thành công", cart: user.cart });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Lỗi server khi thêm vào giỏ" });
  }
};

/**
 * Cập nhật số lượng cho 1 item
 * params: none (dùng body)
 * body: { productId, variantIndex, quantity }
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantIndex, quantity } = req.body;
    if (!productId || variantIndex === undefined || quantity === undefined)
      return res
        .status(400)
        .json({ message: "Thiếu productId, variantIndex hoặc quantity" });

    if (quantity < 0)
      return res.status(400).json({ message: "Quantity không hợp lệ" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    if (
      variantIndex < 0 ||
      variantIndex >= product.variants.length ||
      !product.variants[variantIndex]
    ) {
      return res.status(400).json({ message: "Variant không hợp lệ" });
    }

    const variant = product.variants[variantIndex];
    if (quantity > variant.quantity) {
      return res
        .status(400)
        .json({ message: `Tối đa chỉ còn ${variant.quantity} cái` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    const existingIndex = user.cart.findIndex(
      (ci) =>
        ci.productId.toString() === productId.toString() &&
        ci.variantIndex === variantIndex
    );

    if (existingIndex === -1)
      return res.status(404).json({ message: "Item trong giỏ không tồn tại" });

    if (quantity === 0) {
      // Xóa item
      user.cart.splice(existingIndex, 1);
    } else {
      user.cart[existingIndex].quantity = quantity;
    }

    await user.save();
    res.json({ message: "Cập nhật giỏ thành công", cart: user.cart });
  } catch (err) {
    console.error("updateCartItem error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật giỏ" });
  }
};

/**
 * Xóa item hoặc xóa nhiều item
 * body: { items: [{ productId, variantIndex }, ...] }
 */
exports.removeCartItems = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Phải gửi mảng items để xóa" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    // Lọc ra những item không bị xóa
    user.cart = user.cart.filter((ci) => {
      return !items.some(
        (it) =>
          it.productId &&
          it.variantIndex !== undefined &&
          ci.productId.toString() === it.productId.toString() &&
          ci.variantIndex === it.variantIndex
      );
    });

    await user.save();
    res.json({ message: "Xóa thành công", cart: user.cart });
  } catch (err) {
    console.error("removeCartItems error:", err);
    res.status(500).json({ message: "Lỗi server khi xóa giỏ" });
  }
};

/**
 * Checkout các item được chọn (chỉ tính tổng, kiểm tra tồn kho)
 * body: { items: [{ productId, variantIndex, quantity }...] }
 */
exports.checkout = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Phải có item để thanh toán" });

    const user = await User.findById(req.user.id).populate({
      path: "cart.productId",
    });

    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    let total = 0;
    const problems = [];

    for (const it of items) {
      const { productId, variantIndex, quantity } = it;

      const cartItem = user.cart.find(
        (ci) =>
          ci.productId.toString() === productId.toString() &&
          ci.variantIndex === variantIndex
      );
      if (!cartItem) {
        problems.push({
          productId,
          variantIndex,
          reason: "Không có trong giỏ",
        });
        continue;
      }

      const product = await Product.findById(productId);
      if (!product) {
        problems.push({
          productId,
          variantIndex,
          reason: "Sản phẩm không tồn tại",
        });
        continue;
      }

      if (
        variantIndex < 0 ||
        variantIndex >= product.variants.length ||
        !product.variants[variantIndex]
      ) {
        problems.push({ productId, variantIndex, reason: "Variant sai" });
        continue;
      }

      const variant = product.variants[variantIndex];
      if (quantity > variant.quantity) {
        problems.push({
          productId,
          variantIndex,
          reason: `Còn lại ${variant.quantity}`,
        });
        continue;
      }

      total += product.price * quantity;
    }

    if (problems.length > 0) {
      return res.status(400).json({
        message: "Một số item có vấn đề, không thể checkout đầy đủ",
        problems,
      });
    }

    // TODO: tạo order, trừ tồn kho, thanh toán...
    res.json({
      message: "Tính toán checkout thành công",
      total,
      items,
      // orderPlaceholder: {...}
    });
  } catch (err) {
    console.error("checkout error:", err);
    res.status(500).json({ message: "Lỗi server khi checkout" });
  }
};
