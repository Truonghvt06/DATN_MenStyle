const PaymentMethod = require("../models/PaymentMethod");

// Thêm phương thức thanh toán
exports.createPaymentMethod = async (req, res) => {
  try {
    const { code, name, description, image } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "Thiếu code hoặc name" });
    }

    const newMethod = new PaymentMethod({ code, name, description, image });

    await newMethod.save();

    return res.status(201).json(newMethod);
  } catch (error) {
    console.error("createPaymentMethod error:", error);
    return res.status(500).json({ message: "Lỗi server khi thêm phương thức" });
  }
};

// Lấy danh sách phương thức thanh toán
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find();

    return res.status(200).json(methods);
  } catch (error) {
    console.error("getAllPaymentMethods error:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy phương thức" });
  }
};

// Sửa phương thức thanh toán
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      { code, name, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy phương thức" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updatePaymentMethod error:", error);
    return res.status(500).json({ message: "Lỗi server khi sửa phương thức" });
  }
};

// Xoá phương thức thanh toán
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentMethod.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy phương thức" });
    }

    return res.status(200).json({ message: "Xoá thành công" });
  } catch (error) {
    console.error("deletePaymentMethod error:", error);
    return res.status(500).json({ message: "Lỗi server khi xoá phương thức" });
  }
};
