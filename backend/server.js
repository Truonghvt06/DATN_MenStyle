require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const productRouter = require("./routes/product");
const accountRouter = require("./routes/account");
const bannerRoute = require('./routes/banner');
const settingRoute = require('./routes/setting');

const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Static + body parser
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/avatars", express.static(path.join(__dirname, "assets/avatars")));
 // Các router khác
 app.use("/products", productRouter);
 app.use("/accounts", accountRouter);
 app.use('/banner', bannerRoute);
 app.use('/setting', settingRoute);


// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");

    app.get("/", async (req, res) => {
      try {
        const userCount = await User.countDocuments();
        res.render("home", { userCount });
      } catch (err) {
        res.status(500).send("Lỗi khi tải trang chính: " + err.message);
      }
    });

    app.listen(port, () => {
      console.log(`Server chạy ở http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Kết nối MongoDB thất bại:", error);
  });
