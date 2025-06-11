const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


// API lấy danh sách sản phẩm JSON
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
  }
});

// Giao diện danh sách sản phẩm
router.get('/view', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    res.status(500).send('Lỗi khi lấy sản phẩm');
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

    // Kiểm tra từng biến thể có đủ các trường cần thiết (không cần price)
    for (const v of variants) {
      if (!v.size || !v.color || !v.quantity) {
        return res.status(400).send('Thiếu trường trong biến thể');
      }
      v.quantity = Number(v.quantity);
      if (isNaN(v.quantity)) {
        return res.status(400).send('Số lượng phải là số');
      }
    }

    const product = new Product({ name, type, description, price: productPrice, variants });
    await product.save();
    res.redirect('/products/view');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
});

  

  router.get('/edit/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send('Không tìm thấy sản phẩm');
      res.render('product_edit', { product });
    } catch (error) {
      res.status(500).send('Lỗi server');
    }
  });
  router.post('/edit/:id', async (req, res) => {
    try {
      const { name, variants } = req.body;
      if (!name || !variants || !Array.isArray(variants)) {
        return res.status(400).send('Thiếu thông tin hoặc variants không đúng định dạng');
      }
  
      for (const v of variants) {
        if (!v.size || !v.color || !v.price || !v.quantity) {
          return res.status(400).send('Thiếu trường trong biến thể');
        }
        v.price = Number(v.price);
        v.quantity = Number(v.quantity);
        if (isNaN(v.price) || isNaN(v.quantity)) {
          return res.status(400).send('Giá và số lượng phải là số');
        }
      }
  
      await Product.findByIdAndUpdate(req.params.id, { name, variants });
      res.redirect('/products/view');
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi server khi cập nhật');
    }
  });
  router.get('/delete/:id', async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect('/products/view');
    } catch (error) {
      res.status(500).send('Lỗi khi xóa sản phẩm');
    }
  });
      

module.exports = router;
