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
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const page_ = parseInt(page);
    const limit_ = parseInt(limit);

    const total = await Product.countDocuments();
    const products = await Product.find()
      .populate("type")
      .skip((page_ - 1) * limit_)
      .limit(limit_)
      .lean();
    res.json({
      total,
      page: page_,
      limit: limit_,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
});

// GET products?random=true&limit=10: Có random
// exports.getAllProducts = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, random } = req.query;

//     const page_ = parseInt(page);
//     const limit_ = parseInt(limit);

//     let products = [];
//     const total = await Product.countDocuments();

//     if (random === "true") {
//       // Random không phân trang
//       products = await Product.aggregate([
//         { $sample: { size: limit_ } },
//         {
//           $lookup: {
//             from: "producttypes",
//             localField: "type",
//             foreignField: "_id",
//             as: "producttype",
//           },
//         },
//         {
//           $unwind: {
//             path: "$producttype",
//           },
//         },
//       ]);
//     } else {
//       // Phân trang chuẩn
//       products = await Product.aggregate([
//         { $sort: { createdAt: -1 } },
//         { $skip: (page_ - 1) * limit_ },
//         { $limit: limit_ },
//         {
//           $lookup: {
//             from: "producttypes",
//             localField: "type",
//             foreignField: "_id",
//             as: "producttype",
//           },
//         },
//         {
//           $unwind: {
//             path: "$producttype",
//           },
//         },
//       ]);
//     }

//     res.json({
//       total,
//       page: page_,
//       limit: limit_,
//       data: products,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
//   }
// };

// GET products?page=1&limit=10: K random
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const page_ = parseInt(page);
    const limit_ = parseInt(limit);

    const total = await Product.countDocuments();

    const products = await Product.find()
      .skip((page_ - 1) * limit_)
      .limit(limit_)
      .populate("type"); // nếu dùng mongoose schema reference

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
    const { type } = req.params;
    const products = await Product.find({ type: type }).populate("type");
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

    const products = await Product.find()
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

    const products = await Product.find()
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
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "")
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm." });

    const products = await Product.find({
      name: { $regex: q, $options: "i" }, // không phân biệt hoa thường
    }).populate("category_id");

    res.json(products);
  } catch (error) {
    console.error("Lỗi searchProducts:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm." });
  }
};
