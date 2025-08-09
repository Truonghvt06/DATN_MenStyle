const Order = require("../models/Order");

const generateOrderCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Tránh O, 0, I, 1
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month bắt đầu từ 0
  const year = String(now.getFullYear()).slice(-2); // 2 số cuối của năm

  const prefix = `ODR${day}${month}${year}`;
  return `${prefix}${random}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { total_amount, shipping_address_id, payment_method_id, items } =
      req.body;
    const user_id = req.user?.id || req.body.user_id;

    // Kiểm tra dữ liệu đầu vào
    if (
      !user_id ||
      !shipping_address_id ||
      !payment_method_id ||
      !items?.length
    ) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    // Sinh mã đơn hàng và đảm bảo không trùng
    let orderCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      orderCode = generateOrderCode();
      const existingOrder = await Order.findOne({ code: orderCode });
      if (!existingOrder) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res
        .status(500)
        .json({ message: "Không thể tạo mã đơn hàng, vui lòng thử lại" });
    }

    const newOrder = new Order({
      user_id,
      total_amount,
      shipping_address_id,
      payment_method_id,
      items,
      code: orderCode,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
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
      .populate("payment_method_id")
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
    const { order_status } = req.body;


    const updated = await Order.findByIdAndUpdate(orderId, { order_status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }


    res.json({ message: 'Cập nhật trạng thái thành công', order_status: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
exports.updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { payment_status } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId, { payment_status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ message: 'Cập nhật trạng thái thanh toán thành công', payment_status: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};





