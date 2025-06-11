require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/product');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công!');

    // Trang chủ hiển thị menu quản lý chung (home.ejs)
    app.get('/', (req, res) => {
      res.render('home');  // hiển thị trang home với menu MenStyle
    });

    // Router quản lý sản phẩm
    app.use('/products', productRouter);

    // Có thể thêm router khác như /coupons, /accounts

    app.listen(port, () => {
      console.log(`Server chạy ở http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ Kết nối MongoDB thất bại:', error);
  });
