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

// GET products?page=1&limit=10
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const page_ = parseInt(page);
    const limit_ = parseInt(limit);

    const total = await Product.countDocuments();

    // const products = await Product.aggregate([
    //   { $sample: { size: limit_ } }, // random sản phẩm
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "category",
    //       foreignField: "_id",
    //       as: "category",
    //     },
    //   },
    //   { $unwind: "$category" },
    // ]);
    const products = await Product.aggregate([
      { $sample: { size: total } }, // random sản phẩm
      { $skip: (page_ - 1) * limit_ },
      { $limit: limit_ },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          // preserveNullAndEmptyArrays: true   // ✅ giữ lại product không có category
        },
      },
    ]);

    res.json({
      total,
      page: page_,
      limit: limit_,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

// GET /products/category/:categoryId
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category_id: categoryId }).populate(
      "category_id"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo thể loại." });
  }
};

// GET /products/best-seller?limit=10
exports.getBestSellerProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find()
      .sort({ sold_count: -1 })
      .limit(parseInt(limit))
      .populate("category_id");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm bán chạy" });
  }
};

// GET /products/newest?limit=10
exports.getNewestProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("category_id");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm mới nhất" });
  }
};
