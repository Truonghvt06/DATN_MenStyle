const Category = require("../models/Category");

// GET categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách danh mục." });
  }
};

// POST /categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
    }

    const newCategory = new Category({
      name,
      description,
      image,
    });

    await newCategory.save();

    res
      .status(201)
      .json({ message: "Thêm danh mục thành công.", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi thêm danh mục." });
  }
};

// PUT categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    if (name) category.name = name;
    if (description) category.description = description;
    if (image) category.image = image;

    await category.save();

    res.json({ message: "Cập nhật danh mục thành công.", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật danh mục." });
  }
};

// DELETE categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    await category.deleteOne();

    res.json({ message: "Xoá danh mục thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xoá danh mục." });
  }
};
