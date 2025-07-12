const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bannerController = require("../controllers/bannerController");

router.get("/", bannerController.getBanner);

// Trang quản lý banner
router.get("/view/options", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.render("banner", { banners });
  } catch (err) {
    console.error("Lỗi hiển thị banner:", err);
    res.status(500).send("Lỗi máy chủ");
  }
});

/* ─────── CẤU HÌNH MULTER ─────── */
// Tạo thư mục nếu chưa tồn tại
const bannerDir = path.join(__dirname, "..", "assets", "banners");
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "assets", "banners"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `banner-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Chỉ chấp nhận ảnh JPG, PNG, WEBP"));
};

const upload = multer({ storage, fileFilter });

/* ─────── ROUTES ─────── */

// GET: Lấy danh sách banner
router.get("/view", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách banner", error: err.message });
  }
});
// GET: Hiển thị form thêm banner
router.get("/add", (req, res) => {
  res.render("banner_add"); // file banner_add.ejs trong thư mục views
});

// POST: Thêm banner
router.post("/add", async (req, res) => {
  try {
    const { title, image } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).send("Tiêu đề không được để trống");
    }

    if (!image || image.trim() === "") {
      return res.status(400).send("Vui lòng nhập link ảnh");
    }

    const banner = new Banner({
      title: title.trim(),
      image: image.trim(), // link ảnh được nhập
    });

    await banner.save();
    res.redirect("/banner/view/options");
  } catch (err) {
    console.error("Lỗi thêm banner:", err);
    res.status(500).send("Đã có lỗi xảy ra khi thêm banner");
  }
});

// GET: Hiển thị form sửa banner
router.get("/edit/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).send("Không tìm thấy banner");
    res.render("banner_edit", { banner });
  } catch (err) {
    console.error("Lỗi hiển thị form sửa banner:", err);
    res.status(500).send("Lỗi server");
  }
});
// POST: Cập nhật banner
router.post("/edit/:id", async (req, res) => {
  try {
    const { title, image } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).send("Không tìm thấy banner");

    banner.title = title.trim();
    banner.image = image.trim();

    await banner.save();
    res.redirect("/banner/view/options");
  } catch (err) {
    console.error("Lỗi cập nhật banner:", err);
    res.status(500).send("Lỗi server");
  }
});

// DELETE: Xoá banner
// POST: Xoá banner (thay vì DELETE vì form HTML không hỗ trợ DELETE)
router.post("/delete/:id", async (req, res) => {
  console.log("Nhận xoá banner:", req.params.id);
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).send("Không tìm thấy banner");

    // Nếu là link ngoài thì không cần xoá file local
    if (banner.image.startsWith(req.protocol)) {
      const filename = banner.image.split("/").pop();
      const filePath = path.join(
        __dirname,
        "..",
        "assets",
        "banners",
        filename
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await banner.deleteOne();
    res.redirect("/banner/view/options");
  } catch (err) {
    console.error("Lỗi xoá banner:", err);
    res.status(500).send("Lỗi xoá banner");
  }
});

module.exports = router;
