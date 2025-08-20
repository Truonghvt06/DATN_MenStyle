require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

// ====== Import models ======
const User   = require("./models/User");
const Banner = require("./models/Banner");
const Order  = require("./models/Order");

// ====== Import routes ======
const adminRoute           = require("./routes/admin");
const productRouter        = require("./routes/product");
const accountRouter        = require("./routes/account");
const bannerRoute          = require("./routes/banner");
const settingRoute         = require("./routes/setting");
const addressRouter        = require("./routes/address");
const notificationRouter   = require("./routes/notification");
const reviewRouter         = require("./routes/review");
const orderRouter          = require("./routes/order");
const paymentMethodRouter  = require("./routes/paymentMethod");
const voucherRouter        = require("./routes/voucher");
const dashboardRouter      = require("./routes/dashboard");
const cartRouter           = require("./routes/cart");
const paymentRouter        = require("./routes/payment");
const zaloRouter           = require("./routes/zalo");

const app = express();
const port = process.env.PORT || 3000;

/* =========================
 *  View engine & Middleware
 * ========================= */
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/avatars", express.static(path.join(__dirname, "assets", "avatars")));
app.use("/banners", express.static(path.join(__dirname, "assets", "banners")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "admin-secret-key",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 }, // 2 giờ
  })
);

/* ========= ROUTES ========== */
app.use("/admin", adminRoute);
app.use("/products", productRouter);
app.use("/accounts", accountRouter);
app.use("/banner", bannerRoute);
app.use("/setting", settingRoute);
app.use("/address", addressRouter);
app.use("/notification", notificationRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/payment-method", paymentMethodRouter);
app.use("/voucher", voucherRouter);
app.use("/cart", cartRouter);
app.use("/dashboard", dashboardRouter);
app.use("/payment", paymentRouter);
app.use("/zalo", zaloRouter);

app.get("/", (req, res) => {
  return res.redirect("/admin");
});

/* ========= KẾT NỐI DB & START SERVER ========== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");
    app.listen(port, () => {
      console.log(`Server chạy ở http://localhost:${port}`);
      console.log(`Server chạy ở http://192.168.55.106:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Kết nối MongoDB thất bại:", error);
  });
