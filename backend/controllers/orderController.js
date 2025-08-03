const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { total_amount, shipping_address_id, payment_method_id, items } =
      req.body;

    const user_id = req.user?._id || req.body.user_id; // dùng token hoặc fallback

    // Kiểm tra dữ liệu đầu vào
    if (
      !user_id ||
      !shipping_address_id ||
      !payment_method_id ||
      !items?.length
    ) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    const newOrder = new Order({
      user_id,
      total_amount,
      shipping_address_id,
      payment_method_id,
      items,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const user_id = req.user?.id || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id" });
    }

    const orders = await Order.find({ user_id })
      .populate("items.product_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("items.product_id")
      .populate("shipping_address_id")
      .populate("payment_method_id");

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công', order: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};



