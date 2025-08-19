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

/* ========= HOME (hiển thị banner + 4 ô thống kê) ========== */
function getTodayRangeVN() {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnNow = new Date(utcNow + 7 * 60 * 60000);
  const y = vnNow.getUTCFullYear();
  const m = vnNow.getUTCMonth();
  const d = vnNow.getUTCDate();
  const start = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
  const nextStart = new Date(Date.UTC(y, m, d + 1, 0, 0, 0, 0));
  return { start, nextStart };
}

app.get("/", async (req, res, next) => {
  try {
    const { start, nextStart } = getTodayRangeVN();

    // Đơn hôm nay
    const todayOrdersFilter = { createdAt: { $gte: start, $lt: nextStart } };
    const todayOrderCount = await Order.countDocuments(todayOrdersFilter);

    // Doanh thu hôm nay (đơn đã thanh toán)
    const revAgg = await Order.aggregate([
      { $match: { ...todayOrdersFilter, payment_status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    const todayRevenue = revAgg.length ? revAgg[0].total : 0;

    // Đơn hàng chờ xử lý
    const pendingOrderCount = await Order.countDocuments({ order_status: "pending" });

    // Tổng người dùng
    const userCount = await User.countDocuments({});

    // Banners (fallback nếu không có field `active`)
    let banners = [];
    try {
      banners = await Banner.find({ active: true }).lean();
      if (!banners.length) banners = await Banner.find({}).lean();
    } catch (_) {
      banners = [];
    }
    console.log("banners:", banners.length);

    res.render("home", {
      banners,
      todayRevenue,
      todayOrderCount,
      pendingOrderCount,
      userCount,
    });
  } catch (err) {
    next(err);
  }
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
