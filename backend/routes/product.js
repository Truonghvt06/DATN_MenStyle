const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductType = require("../models/ProductType");
const User = require("../models/User");

// ✅ API thêm sản phẩm (Mobile)
router.post("/add-product", async (req, res) => {
  try {
    const { name, type, description, price, variants } = req.body;

    if (!name || !type || !description || !price || !Array.isArray(variants)) {
      return res.status(400).json({ message: "Thiếu thông tin hoặc biến thể không hợp lệ" });
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
    res.status(500).json({ message: "Lỗi thêm sản phẩm", error: error.message });
  }
});

// ✅ API lấy tất cả sản phẩm (Mobile)
router.get("/product-all", async (req, res) => {
  try {
    const products = await Product.find().populate("type").lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm", error: err.message });
  }
});

// ✅ API lọc sản phẩm theo loại + sắp xếp (Mobile)
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

// ✅ API best seller
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

// ✅ API sản phẩm mới nhất
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

// ✅ API chi tiết sản phẩm cho app mobile
router.get("/api/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  }

  try {
    const product = await Product.findById(id).populate("type").lean();
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
});

// ✅ API tìm kiếm
router.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Thiếu hoặc sai định dạng tên" });
  }

  try {
    const regex = new RegExp(name, "i");
    const products = await Product.find({ name: regex }).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tìm kiếm", error: err.message });
  }
});

// ✅ View: Danh sách sản phẩm (Web)
router.get("/view", async (req, res) => {
  try {
    const typeFilter = req.query.type || "all";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const types = await ProductType.find();
    const query = typeFilter === "all" ? {} : { type: typeFilter };

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .populate("type")
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("products", { products, types, selectedType: typeFilter, currentPage: page, totalPages });
  } catch (err) {
    res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
  }
});

// ✅ View: Form thêm sản phẩm
router.get("/add", async (req, res) => {
  try {
    const types = await ProductType.find();
    res.render("product_add", { types });
  } catch (err) {
    res.status(500).send("Lỗi khi tải form thêm sản phẩm");
  }
});

// ✅ View: Xử lý thêm sản phẩm
router.post("/add", async (req, res) => {
  try {
    const { name, type, description, price, variants } = req.body;

    if (!name || !type || !description || !price || !variants || !Array.isArray(variants)) {
      return res.status(400).send("Thiếu thông tin hoặc biến thể không hợp lệ");
    }

    const product = new Product({
      name,
      type,
      description,
      price: Number(price),
      variants: variants.map(v => ({ ...v, quantity: Number(v.quantity) })),
      rating_avg: 0,
      rating_count: 0,
      sold_count: 0,
    });

    await product.save();
    res.redirect("/products/view");
  } catch (err) {
    res.status(500).send("Lỗi server khi thêm sản phẩm");
  }
});

// ✅ View: Form chỉnh sửa sản phẩm
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const types = await ProductType.find();
    if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
    res.render("product_edit", { product, types });
  } catch (err) {
    res.status(500).send("Lỗi khi lấy sản phẩm để chỉnh sửa");
  }
});

// ✅ View: Xử lý chỉnh sửa sản phẩm
router.post("/edit/:id", async (req, res) => {
  try {
    const { name, type, variants } = req.body;

    const updatedVariants = Object.values(variants).map(v => ({
      size: v.size,
      color: v.color,
      quantity: Number(v.quantity),
      image: v.image,
    }));

    await Product.findByIdAndUpdate(
      req.params.id,
      { name, type, variants: updatedVariants },
      { new: true }
    );

    res.redirect("/products/view");
  } catch (err) {
    res.status(500).send("Lỗi khi cập nhật sản phẩm");
  }
});

// ✅ View: Chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("type").lean();
    if (!product) return res.status(404).send("Không tìm thấy sản phẩm");
    res.render("product_detail", { product });
  } catch (err) {
    res.status(500).send("Lỗi khi lấy chi tiết sản phẩm");
  }
});

// ✅ Kiểm tra sản phẩm có đang nằm trong giỏ hàng không
router.get("/check-edit/:id", async (req, res) => {
  try {
    const users = await User.find({ "cart.productId": req.params.id });
    const isInCart = users.some(u => u.cart.some(i => i.productId.toString() === req.params.id));

    if (isInCart) {
      return res.status(400).send("❌ Sản phẩm đang có trong giỏ hàng của người dùng.");
    }

    res.redirect(`/products/edit/${req.params.id}`);
  } catch (err) {
    res.status(500).send("Lỗi máy chủ khi kiểm tra giỏ hàng");
  }
});

module.exports = router;
