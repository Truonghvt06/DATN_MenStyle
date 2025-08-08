require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const Banner = require("./models/Banner");
const productRouter = require("./routes/product");
const accountRouter = require("./routes/account");
const bannerRoute = require("./routes/banner");
const settingRoute = require("./routes/setting");
const addressRouter = require("./routes/address");
const notificationRouter = require("./routes/notification");
const reviewRouter = require("./routes/review");
const orderRouter = require("./routes/order");
const paymentMethodRouter = require("./routes/paymentMethod");
const voucherRouter = require("./routes/voucher");
const dashboardRouter = require("./routes/dashboard");
const cartRouter = require("./routes/cart");
const paymentRouter = require("./routes/payment");
const zaloRouter = require("./routes/zalo");

const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình EJS
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());

// Static + body parser
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/avatars", express.static(path.join(__dirname, "assets", "avatars")));
app.use("/banners", express.static(path.join(__dirname, "assets", "banners")));

// Các router khác
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

// Hàm tự động ẩn item order sau 7 ngày
// const cron = require("node-cron");
// const { hideExpiredNotReviewed } = require("./utils/cronJobs");

// cron.schedule("0 0 * * *", async () => {
//   console.log("📆 Đang chạy cron job ẩn sản phẩm quá hạn...");
//   await hideExpiredNotReviewed();
// });

// Kết nối MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ Kết nối MongoDB thành công!");

//     app.get("/", async (req, res) => {
//       try {
//         const userCount = await User.countDocuments();
//         const banners = await Banner.find().sort({ createdAt: -1 });
//         res.render("home", { banners, userCount });
//       } catch (err) {
//         res.status(500).send("Lỗi khi tải trang chính: " + err.message);
//       }
//     });

//     app.listen(port, () => {
//       console.log(`Server chạy ở http://localhost:${port}`);
//       console.log(`Server chạy ở http://192.168.55.103:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("❌ Kết nối MongoDB thất bại:", error);
//   });

// Home route
app.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.render("home", { banners, userCount });
  } catch (err) {
    res.status(500).send("Lỗi khi tải trang chính: " + err.message);
  }
});

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((error) => console.error("❌ Kết nối MongoDB thất bại:", error));

// Nếu chạy local thì start server
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server chạy ở http://localhost:${port}`);
  });
}

// Export app cho Vercel
module.exports = app;
