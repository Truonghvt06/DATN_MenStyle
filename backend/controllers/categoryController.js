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
exports.getAddProductTypeForm = (req, res) => {
  res.render("productType_add", { message: null });
};

exports.addProductType = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.render("productType_add", {
        message: { type: "error", text: "Tên thể loại là bắt buộc!" },
      });
    }

    
    const existingType = await Category.findOne({ name });
    if (existingType) {
      return res.render("productType_add", {
        message: { type: "error", text: "Tên thể loại đã tồn tại!" },
      });
    }

    const productType = new Category({
      name,
      description: description || "",
      image: image || "",
    });

    await productType.save();
    res.render("productType_add", {
      message: { type: "success", text: "Thêm thể loại thành công!" },
    });
  } catch (error) {
    res.render("productType_add", {
      message: { type: "error", text: "Lỗi server: " + error.message },
    });
  }
};

exports.getAllProductTypesView = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("productType_list", { categories });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách thể loại");
  }
};

