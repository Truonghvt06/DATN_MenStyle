const Category = require("../models/ProductType");
const removeVietnameseTones = require("../utils/removeVietnameseTones");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục" });
  }
};

//Search
exports.searchCategory = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Thiếu hoặc sai định dạng tên loại sản phẩm" });
    }

    const normalized = removeVietnameseTones(name);
    const keywords = normalized.split(" ").filter(Boolean);

    const regexConditions = keywords.map((word) => ({
      normalized_name: { $regex: word, $options: "i" },
    }));

    // console.log("Input:", name);
    // console.log("Normalized:", normalized);
    // console.log("Conditions:", regexConditions);

    const types = await Category.find({
      $and: regexConditions,
    });

    res.json(types);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi tìm kiếm loại sản phẩm", error: err.message });
  }
};
