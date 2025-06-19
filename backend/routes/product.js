const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// API lấy danh sách sản phẩm JSON
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    if (products.length > 0) {
      console.log('First product:', products[0]);
    } else {
      console.log('No products found');
    }
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: error.message });
  }
});

// Giao diện danh sách sản phẩm
router.get('/view', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    console.error('Error fetching products for view:', error);
    res.status(500).send('Lỗi khi lấy danh sách sản phẩm');
  }
});

// Form thêm sản phẩm
router.get('/add', (req, res) => {
  res.render('product_add');
});

router.post('/add', async (req, res) => {
  try {
    const { name, type, description, price, variants } = req.body;

    if (!name || !type || !description || !price || !variants || !Array.isArray(variants)) {
      return res.status(400).send('Thiếu thông tin bắt buộc hoặc variants không đúng định dạng');
    }

    const productPrice = Number(price);
    if (isNaN(productPrice)) {
      return res.status(400).send('Giá sản phẩm phải là số');
    }

    // Kiểm tra từng biến thể
    for (const v of variants) {
      if (!v.size || !v.color || !v.quantity) {
        return res.status(400).send('Thiếu trường trong biến thể');
      }
      v.quantity = Number(v.quantity);
      if (isNaN(v.quantity)) {
        return res.status(400).send('Số lượng phải là số');
      }
    }

    // 👇 Thêm các trường mặc định vào đây
    const product = new Product({
      name,
      type,
      description,
      price: productPrice,
      variants,
      rating_avg: 0,
      rating_count: 0,
      sold_count: 0
    });

    await product.save();
    console.log('Product added:', product._id);
    res.redirect('/products/view');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Lỗi server khi thêm sản phẩm');
  }
});


// Form chỉnh sửa sản phẩm
router.get('/edit/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid ObjectId:', req.params.id);
      return res.status(400).send('ID sản phẩm không hợp lệ');
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('Product not found for ID:', req.params.id);
      return res.status(404).send('Không tìm thấy sản phẩm');
    }
    res.render('product_edit', { product });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    res.status(500).send('Lỗi server khi lấy sản phẩm để chỉnh sửa');
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('ID sản phẩm không hợp lệ');
    }
    const { name, type, description, price, variants } = req.body;
    if (!name || !type || !description || !price || !variants || !Array.isArray(variants)) {
      return res.status(400).send('Thiếu thông tin hoặc variants không đúng định dạng');
    }

    const productPrice = Number(price);
    if (isNaN(productPrice)) {
      return res.status(400).send('Giá sản phẩm phải là số');
    }

    for (const v of variants) {
      if (!v.size || !v.color || !v.quantity) {
        return res.status(400).send('Thiếu trường trong biến thể');
      }
      v.quantity = Number(v.quantity);
      if (isNaN(v.quantity)) {
        return res.status(400).send('Số lượng phải là số');
      }
    }

    await Product.findByIdAndUpdate(req.params.id, { name, type, description, price: productPrice, variants });
    console.log('Product updated:', req.params.id);
    res.redirect('/products/view');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Lỗi server khi cập nhật sản phẩm');
  }
});

// Xóa sản phẩm
router.get('/delete/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('ID sản phẩm không hợp lệ');
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send('Không tìm thấy sản phẩm để xóa');
    }
    console.log('Product deleted:', req.params.id);
    res.redirect('/products/view');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Lỗi khi xóa sản phẩm');
  }
});

// Chi tiết sản phẩm
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid ObjectId:', req.params.id);
      return res.status(400).send('ID sản phẩm không hợp lệ');
    }
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      console.log('Product not found for ID:', req.params.id);
      return res.status(404).send('Không tìm thấy sản phẩm');
    }
    console.log('Product found:', product);
    res.render('product_detail', { product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send('Lỗi server khi lấy chi tiết sản phẩm');
  }
});

module.exports = router;