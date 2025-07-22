const Banner = require("../models/Banner");

exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.find().sort({ createdAt: -1 });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy banner" });
  }
};
