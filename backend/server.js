require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

// Models (dùng nếu cần ở route '/')
const User = require("./models/User");
const Banner = require("./models/Banner");

// Routers
const adminRoute = require("./routes/admin");
const productRouter = require("./routes/product");
const accountRouter = require("./routes/account");
const bannerRoute = require("./routes/banner");
const settingRoute = require("./routes/setting");
const addressRouter = require("./routes/address");

// App config
const app = express();
const port = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/avatars", express.static(path.join(__dirname, "assets", "avatars")));
app.use(express.static("public"));

// Session config
app.use(
  session({
    secret: "admin-secret-key",
    resave: false,
    saveUninitialized: false,
    rooling: true,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, 
    },
  })
);

// Mount routers
app.use('/', settingRoute);
app.use("/admin", adminRoute);
app.use("/products", productRouter);
app.use("/accounts", accountRouter);
app.use("/banner", bannerRoute);
app.use("/setting", settingRoute);
app.use("/address", addressRouter);

// Route trang chủ (dashboard tổng quát)
app.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.render("home", { banners, userCount });
  } catch (err) {
    res.status(500).send("Lỗi khi tải trang chính: " + err.message);
  }
});

// Kết nối MongoDB và khởi động server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");
    app.listen(port, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    console.error("❌ Kết nối MongoDB thất bại:", error);
  });
