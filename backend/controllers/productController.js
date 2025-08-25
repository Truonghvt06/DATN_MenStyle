const Product = require("../models/Product");

// POST /products
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, description, price, variants } = req.body;

    if (!name || !category_id || !description || !price || !variants) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm." });
    }

    const newProduct = new Product({
      name,
      category_id,
      description,
      price,
      variants,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Tạo sản phẩm thành công.", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo sản phẩm.", error: error.message });
  }
};
//get Pro
exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find({ is_activiti: true });

    res.json({
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
};

// GET products?page=1&limit=10: K random
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const page_ = parseInt(page);
    const limit_ = parseInt(limit);

    // ✅ chỉ đếm sản phẩm đang hoạt động
    const total = await Product.countDocuments({ is_activiti: true });
    // Tính tổng số lượng tồn kho (chỉ sản phẩm đang hoạt động)
const allActiveProducts = await Product.find({ is_activiti: true });

const grandTotal = allActiveProducts.reduce((sum, p) => {
  return sum + (p.variants ? p.variants.reduce((s, v) => s + (v.quantity || 0), 0) : 0);
}, 0);

    // ✅ chỉ lấy sản phẩm đang hoạt động
    const products = await Product.find({ is_activiti: true })
      .skip((page_ - 1) * limit_)
      .limit(limit_)
      .populate("type");

    // console.log("DATA:", products.length);
    // console.log("TOTAL:", total);

    res.json({
      total,
      page: page_,
      limit: limit_,
      data: products,
      grandTotal,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

// GET /products/category/:categoryId
exports.getProductsByCategory = async (req, res) => {
  try {
    const { type } = req.params;
    const products = await Product.find({
      type: type,
      is_activiti: true,
    }).populate("type");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo thể loại." });
  }
};
// GET /products/category/:categoryId?sort=new|best|priceAsc|priceDesc&page=&limit=
exports.getProductsByCategorySort = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      sort = "new", // new | best | priceAsc | priceDesc
      page = 1,
      limit = 12,
    } = req.query;

    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: "categoryId không hợp lệ" });
    }

    const page_ = Math.max(1, parseInt(page));
    const limit_ = Math.max(1, parseInt(limit));

    /*-------------- 1. Chọn field sort ----------------*/
    let sortOption = { createdAt: -1 }; // mặc định: mới nhất
    switch (sort) {
      case "best":
        sortOption = { sold_count: -1 };
        break;
      case "priceAsc":
        sortOption = { price: 1 };
        break;
      case "priceDesc":
        sortOption = { price: -1 };
        break;
      // default -> new
    }

    /*-------------- 2. Đếm tổng & lấy dữ liệu --------*/
    const filter = { category_id: categoryId };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("type")
      .sort(sortOption)
      .skip((page_ - 1) * limit_)
      .limit(limit_);

    res.json({
      total,
      page: page_,
      limit: limit_,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy sản phẩm theo thể loại" });
  }
};

// GET /products/best-seller?limit=10
exports.getBestSellerProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({ is_activiti: true })
      .sort({ sold_count: -1 })
      .limit(parseInt(limit));
    // .populate("type");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm bán chạy" });
  }
};

// GET /products/newest?limit=10
exports.getNewestProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({ is_activiti: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("type");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm mới nhất" });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("type");
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

    // Lấy sản phẩm cùng thể loại (ngoại trừ sản phẩm hiện tại)
    const related = await Product.find({
      is_activiti: true,
      type: product.type._id,
      _id: { $ne: product._id },
    }).limit(10); // lấy tối đa 10 sản phẩm cùng loại

    res.json({
      product,
      relatedProducts: related, //sản phẩm liên quan
    });
  } catch (error) {
    console.error("Lỗi getProductDetail:", error);
    res.status(500).json({ message: "Lỗi khi lấy chi tiết sản phẩm." });
  }
};
exports.searchSort = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, categoryId } = req.query;

    const conditions = [];

    // Tìm theo tên (có thể bỏ trống)
    if (name) {
      const normalized = removeVietnameseTones(name);
      const keywords = normalized.split(" ").filter(Boolean);
      const regexConditions = keywords.map((word) => ({
        normalized_name: { $regex: word, $options: "i" },
      }));
      conditions.push({ $and: regexConditions });
    }

    // Lọc theo khoảng giá
    if (minPrice && maxPrice) {
      conditions.push({
        price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) },
      });
    }

    // Lọc theo loại sản phẩm
    if (categoryId) {
      conditions.push({ type: categoryId });
    }

    const products = await Product.find(
      conditions.length > 0 ? { $and: conditions } : {}
    ).populate("type");

    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi tìm kiếm sản phẩm", error: err.message });
  }
};
