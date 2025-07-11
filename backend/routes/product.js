const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductType = require("../models/ProductType");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const User = require("../models/User");

// API JSON
router.get("/categories", categoryController.getAllCategories);
router.post("/add-product", productController.createProduct);
router.get("/product-all", productController.getAllProducts);
router.get("/product-category/:type", productController.getProductsByCategory);
router.get(
  "/product-category/:type",
  productController.getProductsByCategorySort
); // thể loại sắp sếp
router.get("/best-seller", productController.getBestSellerProducts);
router.get("/product-new", productController.getNewestProducts);
router.get("/product-detail/:id", productController.getProductDetail); //chi tiêt
// router.get("/products/search", productController.searchProducts); //search

// API: Lấy toàn bộ sản phẩm dạng JSON
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

router.get("/view", async (req, res) => {
  try {
    const typeFilter = req.query.type || "all";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const types = await ProductType.find();

    let query = {};
    if (typeFilter !== "all") {
      query.type = typeFilter;
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .populate("type")
      .skip((page - 1) * limit)
      .limit(limit);

    // 🟢 TRUYỀN ĐẦY ĐỦ DỮ LIỆU CHO EJS
    res.render("products", {
      products,
      types,
      selectedType: typeFilter,
      currentPage: page,
      totalPages, // ← Bắt buộc phải truyền biến này
    });
  } catch (error) {
    console.error("Error fetching products for view:", error);
    res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
  }
});

// Form thêm sản phẩm
router.get("/add", async (req, res) => {
  try {
    const types = await ProductType.find();
    res.render("product_add", { types });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Lỗi khi tải form thêm sản phẩm");
  }
});

// Xử lý thêm sản phẩm
router.post("/add", async (req, res) => {
  try {
    const { name, type, description, price, variants } = req.body;

    if (
      !name ||
      !type ||
      !description ||
      !price ||
      !variants ||
      !Array.isArray(variants)
    ) {
      return res
        .status(400)
        .send("Thiếu thông tin bắt buộc hoặc variants không đúng định dạng");
    }

    const typeDoc = await ProductType.findById(type);
    if (!typeDoc) return res.status(400).send("Loại sản phẩm không tồn tại");

    const productPrice = Number(price);
    if (isNaN(productPrice))
      return res.status(400).send("Giá sản phẩm phải là số");

    for (const v of variants) {
      if (!v.size || !v.color || !v.quantity) {
        return res.status(400).send("Thiếu trường trong biến thể");
      }
      v.quantity = Number(v.quantity);
      if (isNaN(v.quantity)) return res.status(400).send("Số lượng phải là số");
    }

    const product = new Product({
      name,
      type,
      description,
      price: productPrice,
      variants,
      rating_avg: 5,
      rating_count: 0,
      sold_count: 0,
    });

    await product.save();
    console.log("✅ Product added:", product._id);
    res.redirect("/products/view");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Lỗi server khi thêm sản phẩm");
  }
});

// Form chỉnh sửa sản phẩm
router.get("/edit/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("ID sản phẩm không hợp lệ");
    }
    const product = await Product.findById(req.params.id);
    const types = await ProductType.find();
    if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
    res.render("product_edit", { product, types });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).send("Lỗi server khi lấy sản phẩm để chỉnh sửa");
  }
});

// Xử lý chỉnh sửa sản phẩm
router.post("/edit/:id", async (req, res) => {
  try {
    const { name, type, variants } = req.body;

    const updatedVariants = Object.values(variants).map((v) => ({
      size: v.size,
      color: v.color,
      quantity: Number(v.quantity),
      image: v.image,
    }));

    const typeDoc = await ProductType.findById(type);
    if (!typeDoc) return res.status(400).send("Loại sản phẩm không hợp lệ");

    await Product.findByIdAndUpdate(
      req.params.id,
      { name, type, variants: updatedVariants },
      { new: true }
    );

    res.redirect("/products/view");
  } catch (err) {
    console.error("❌ Lỗi update sản phẩm:", err);
    res.status(500).send("Lỗi khi cập nhật sản phẩm");
  }
});

// Chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Kiểm tra định dạng ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("ID sản phẩm không hợp lệ");
  }

  try {
    const product = await Product.findById(id)
      .populate("type") // Populate để lấy tên loại
      .lean(); // Convert Mongoose Document -> plain JS object

    if (!product) {
      return res.status(404).send("Không tìm thấy sản phẩm bạn cần");
    }

    res.render("product_detail", { product });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    res.status(500).send("Lỗi server khi lấy chi tiết sản phẩm");
  }
});
router.get("/check-edit/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Tìm tất cả user có cart chứa sản phẩm này (bất kỳ biến thể nào)
    const users = await User.find({ "cart.productId": productId });

    // Kiểm tra sản phẩm có tồn tại trong giỏ hàng của bất kỳ user nào không
    const isInCart = users.some((user) =>
      user.cart.some((item) => item.productId.toString() === productId)
    );

    if (isInCart) {
      return res
        .status(400)
        .send(
          "❌ Không thể sửa vì sản phẩm đang có trong giỏ hàng của người dùng."
        );
    }

    // ✅ Nếu không tồn tại → Cho phép chuyển đến trang sửa sản phẩm
    return res.redirect(`/products/edit/${productId}`);
  } catch (err) {
    console.error("Lỗi kiểm tra giỏ hàng:", err);
    return res.status(500).send("Đã xảy ra lỗi máy chủ.");
  }
});

module.exports = router;
