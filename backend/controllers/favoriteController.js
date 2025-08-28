const Product = require("../models/Product");
const User = require("../models/User");

exports.toggleFavorite = async (req, res) => {
  const userId = req.user.id; // từ authMiddleware
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res
        .status(404)
        .json({ message: "Người dùng hoặc sản phẩm không tồn tại" });
    }

    const isFavorite = user.favorites.some(
      (fav) => fav.productId.toString() === productId
    );

    if (isFavorite) {
      // Xoá khỏi danh sách yêu thích
      user.favorites = user.favorites.filter(
        (fav) => fav.productId.toString() !== productId
      );
      product.is_fovorite = false;
    } else {
      user.favorites.push({ productId });
      product.is_fovorite = true;
    }

    await user.save();
    await product.save();

    return res.status(200).json({
      message: isFavorite ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích",
      isFavorite: !isFavorite,
    });
  } catch (err) {
    console.error("Lỗi toggle yêu thích:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites.productId")
      .lean();
    const sortedFavorites = user.favorites
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((f) => f.productId); // chỉ trả về mảng product

    res.status(200).json({ favorites: sortedFavorites });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


exports.clearFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = [];
    await user.save();
    res.status(200).json({ message: "Đã xoá toàn bộ sản phẩm yêu thích" });
  } catch (err) {
    console.error("Lỗi xoá toàn bộ yêu thích:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


exports.removeFavorite = async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const before = user.favorites.length;
    user.favorites = user.favorites.filter(
      (f) => f.productId.toString() !== productId
    );

    if (user.favorites.length === before) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong danh sách yêu thích" });
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Đã xoá sản phẩm khỏi yêu thích", productId });
  } catch (err) {
    console.error("Lỗi xoá yêu thích:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
