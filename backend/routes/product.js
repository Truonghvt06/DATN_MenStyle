const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductType = require("../models/ProductType");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const User = require("../models/User");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

// API JSON
router.get("/categories", categoryController.getAllCategories);
router.get("/searchCategory", categoryController.searchCategory);
router.get("/product-all", productController.getAllProducts);
router.get("/product-category/:type", productController.getProductsByCategory);
router.get(
  "/product-category/:type",
  productController.getProductsByCategorySort
);
router.get("/sp", productController.getProduct);
router.get("/best-seller", productController.getBestSellerProducts);
router.get("/product-new", productController.getNewestProducts);
router.get("/product-detail/:id", productController.getProductDetail);
router.get("/searchSort", productController.searchSort);

// Routes for adding product type
router.get("/product-types/add", categoryController.getAddProductTypeForm);
router.post("/product-types", categoryController.addProductType);
// routes/productType.js hoặc thêm vào router chính
router.get("/product-types/view", categoryController.getAllProductTypesView);

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

// API: Thêm sản phẩm (Mobile)
router.post("/add-product", async (req, res) => {
  try {
    const { name, type, description, price, variants } = req.body;
    if (!name || !type || !description || !price || !Array.isArray(variants)) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin hoặc biến thể không hợp lệ" });
    }
    const product = new Product({
      name,
      type,
      description,
      price,
      variants,
      rating_avg: 0,
      rating_count: 0,
      sold_count: 0,
    });
    await product.save();
    res.status(201).json({ message: "Đã thêm sản phẩm", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi thêm sản phẩm", error: error.message });
  }
});

// API: Lấy tất cả sản phẩm (Mobile)
router.get("/product-all", async (req, res) => {
  try {
    const products = await Product.find().populate("type").lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm", error: err.message });
  }
});

// API: Lọc sản phẩm theo loại + sắp xếp (Mobile)
router.get("/product-category/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { sort } = req.query;
    let query = Product.find({ type });
    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    const products = await query.populate("type").lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lọc sản phẩm", error: err.message });
  }
});

// API: Best seller
router.get("/best-seller", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ sold_count: -1 })
      .limit(10)
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi best seller", error: err.message });
  }
});

// API: Sản phẩm mới nhất
router.get("/product-new", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi sản phẩm mới", error: err.message });
  }
});

// API: Chi tiết sản phẩm cho app mobile
router.get("/api/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  }
  try {
    const product = await Product.findById(id).populate("type").lean();
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    res.json({ success: true, data: product });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: err.message });
  }
});

// API: Tìm kiếm
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Thiếu hoặc sai định dạng tên sản phẩm" });
    }
    const normalized = removeVietnameseTones(name);
    const keywords = normalized.split(" ").filter(Boolean);
    const regexConditions = keywords.map((word) => ({
      normalized_name: { $regex: word, $options: "i" },
    }));
    const products = await Product.find({
      is_activiti: true,
      $and: regexConditions,
    });
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi tìm kiếm sản phẩm", error: err.message });
  }
});

// View: Danh sách sản phẩm (Web)
// Route: Hiển thị danh sách sản phẩm
router.get("/view", async (req, res) => {
  try {
    const { search, type, page = 1 } = req.query;
    const limit = 10; // Số sản phẩm mỗi trang
    const skip = (page - 1) * limit;

    // Tạo query tìm kiếm
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (type && type !== "all") {
      query.type = mongoose.Types.ObjectId.isValid(type) ? type : null;
    }

    // Lấy tổng số sản phẩm
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Đếm số sản phẩm đang hoạt động và đã ngừng bán để debug
    const activeProducts = await Product.countDocuments({
      ...query,
      is_activiti: true,
    });
    const inactiveProducts = await Product.countDocuments({
      ...query,
      is_activiti: false,
    });
    console.log("Debug phân trang:", {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalPages,
      currentPage: page,
      skip,
      limit,
    });

    // Lấy danh sách sản phẩm, sắp xếp theo is_activiti và createdAt
    const products = await Product.find(query)
      .populate("type")
      .sort({ is_activiti: -1, createdAt: -1 }) // is_activiti: true trước, sau đó theo createdAt
      .skip(skip)
      .limit(limit);

    // Log danh sách sản phẩm để kiểm tra
    console.log(
      "Sản phẩm ở trang hiện tại:",
      products.map((p) => ({
        _id: p._id,
        name: p.name,
        is_activiti: p.is_activiti,
      }))
    );

    // Lấy danh sách ProductType cho bộ lọc
    const types = await ProductType.find();

    res.render("products", {
      products,
      types,
      search: search || "",
      selectedType: type || "all",
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).send(`Lỗi server: ${err.message}`);
  }
});

// Form thêm sản phẩm
router.get("/add", async (req, res) => {
  try {
    const types = await ProductType.find();
    res.render("product_add", { types });
  } catch (err) {
    res.status(500).send("Lỗi khi tải form thêm sản phẩm");
  }
});

// View: Xử lý thêm sản phẩm
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
      return res.status(400).send("Thiếu thông tin hoặc biến thể không hợp lệ");
    }
    const product = new Product({
      name,
      type,
      description,
      price: Number(price),
      variants: variants.map((v) => ({ ...v, quantity: Number(v.quantity) })),
      rating_avg: 5,
      rating_count: 0,
      sold_count: 0,
    });
    await product.save();
    res.redirect("/products/view");
  } catch (err) {
    res.status(500).send("Lỗi server khi thêm sản phẩm");
  }
});

// Route: Ngừng bán sản phẩm (thay thế GET /edit/:id)
router.get("/edit/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Kiểm tra productId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `productId không hợp lệ: ${productId}`,
        });
    }

    // Tìm sản phẩm
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({
          success: false,
          message: `Không tìm thấy sản phẩm với ID: ${productId}`,
        });
    }

    // Kiểm tra trường is_activiti
    if (typeof product.is_activiti !== "boolean") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Trường is_activiti không hợp lệ trong sản phẩm",
        });
    }

    // Cập nhật is_activiti thành false
    product.is_activiti = false;
    await product.save();

    // Redirect về trang danh sách sản phẩm
    res.redirect("/products/view");
  } catch (err) {
    console.error("Lỗi khi ngừng bán sản phẩm:", {
      error: err.message,
      stack: err.stack,
      productId: req.params.id,
    });
    res
      .status(500)
      .json({ success: false, message: `Lỗi server: ${err.message}` });
  }
});

// Route hiện có (từ trước)
router.patch("/deactivate/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Kiểm tra productId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `productId không hợp lệ: ${productId}`,
        });
    }

    // Tìm sản phẩm
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({
          success: false,
          message: `Không tìm thấy sản phẩm với ID: ${productId}`,
        });
    }

    // Kiểm tra trường is_activiti
    if (typeof product.is_activiti !== "boolean") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Trường is_activiti không hợp lệ trong sản phẩm",
        });
    }

    // Cập nhật is_activiti thành false
    product.is_activiti = false;
    await product.save();

    res
      .status(200)
      .json({ success: true, message: "Ngừng bán sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi khi ngừng bán sản phẩm:", {
      error: error.message,
      stack: error.stack,
      productId: req.params.productId,
    });
    res
      .status(500)
      .json({ success: false, message: `Lỗi server: ${error.message}` });
  }
});
// View: Chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("ID sản phẩm không hợp lệ");
    }
    const product = await Product.findById(req.params.id)
      .populate("type")
      .lean();
    if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
    res.render("product_detail", { product });
  } catch (err) {
    console.error("Error in product detail:", err);
    res.status(500).send("Lỗi khi lấy chi tiết sản phẩm");
  }
});

// Kiểm tra sản phẩm có trong giỏ hàng không
router.get("/check-edit/:id", async (req, res) => {
  try {
    const users = await User.find({ "cart.productId": req.params.id });
    const isInCart = users.some((u) =>
      u.cart.some((i) => i.productId.toString() === req.params.id)
    );
    if (isInCart) {
      return res
        .status(400)
        .send("❌ Sản phẩm đang có trong giỏ hàng của người dùng.");
    }
    res.redirect(`/products/edit/${req.params.id}`);
  } catch (err) {
    res.status(500).send("Lỗi máy chủ khi kiểm tra giỏ hàng");
  }
});
router.post('/product-types/toggle-activity/:id', async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thể loại.' });
    }

    const newActivityStatus = !productType.is_activity;

    // If attempting to hide the category (is_activity: false), check products
    if (!newActivityStatus) {
      const activeProducts = await Product.countDocuments({
        type: productType._id,
        is_activiti: true
      });
      if (activeProducts > 0) {
        return res.status(400).json({
          success: false,
          message: 'Không thể ẩn thể loại vì vẫn còn sản phẩm đang hoạt động.'
        });
      }
    }

    productType.is_activity = newActivityStatus;
    await productType.save();

    res.json({ success: true, is_activity: productType.is_activity });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thể loại:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
});

module.exports = router;
