const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

//UPDATE PRODUCT
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

//TẠO DON HANG
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

//LAY TAT CA DON HANG
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

//LAY DƠN HÀNG THEO ID
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

//HUY DON HANG
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Vui lòng chọn lý do huỷ" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (["delivered", "cancelled"].includes(order.order_status)) {
      return res
        .status(400)
        .json({ message: "Không thể huỷ đơn hàng ở trạng thái hiện tại" });
    }

    order.order_status = "cancelled";
    order.reason = reason;
    await order.save();

    res.json({
      message: "Huỷ đơn hàng thành công",
      order,
    });
  } catch (err) {
    console.error("Lỗi huỷ đơn hàng:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

//MUA LẠI DƠN HÀNG
exports.buyAgain = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id } = req.body;

    // 1. Validate order_id
    if (!order_id || !mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(400).json({ message: "order_id không hợp lệ" });
    }

    // 2. Tìm đơn hàng
    const order = await Order.findById(order_id).populate("items.product_id");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // 3. Check quyền sở hữu
    if (order.user_id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // 4. Chỉ cho phép mua lại nếu đã giao hoặc hủy
    if (!["delivered", "cancelled"].includes(order.order_status)) {
      return res
        .status(400)
        .json({ message: "Chỉ có thể mua lại đơn hàng đã giao hoặc đã hủy" });
    }

    // 5. Lấy thông tin user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // 6. Lặp qua từng item và validate tồn kho
    for (const item of order.items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({
          message: `Sản phẩm ${item.product_id} không còn tồn tại`,
        });
      }

      // Tìm biến thể
      const variant = product.variants.find(
        (v) => v._id.toString() === item.product_variant_id.toString()
      );
      if (!variant) {
        return res.status(400).json({
          message: `Biến thể không tồn tại cho sản phẩm ${product.name}`,
        });
      }

      if (variant.quantity < 1) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} (${variant.size}/${variant.color}) đã hết hàng`,
        });
      }

      // 7. Thêm vào giỏ hàng hoặc cộng dồn số lượng
      const cartIndex = user.cart.findIndex(
        (c) =>
          c.productId.toString() === product._id.toString() &&
          c.variant_id?.toString() === variant._id.toString()
      );

      if (cartIndex > -1) {
        user.cart[cartIndex].quantity += item.quantity;
      } else {
        user.cart.push({
          productId: product._id,
          variant_id: variant._id,
          variantIndex: product.variants.indexOf(variant),
          quantity: item.quantity,
        });
      }
    }

    // 8. Lưu lại user
    await user.save();

    return res.status(200).json({
      message: "Đã thêm sản phẩm từ đơn cũ vào giỏ hàng",
      cart: user.cart,
    });
  } catch (error) {
    console.error("reorder error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

////WEBSITE
exports.updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order_status } = req.body;

    const updateData = { order_status };

    // Nếu là trạng thái delivered thì lưu thời gian giao hàng
    if (order_status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    const updated = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).populate("items.product_id");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu giao hàng thành công → cập nhật tồn kho và sold_count
    if (order_status === "delivered") {
      for (const item of updated.items) {
        const product = await Product.findById(item.product_id);

        if (product) {
          // Cập nhật sold_count
          product.sold_count += item.quantity;

          // Cập nhật tồn kho của variant
          const variant = product.variants.id(item.product_variant_id);
          if (variant) {
            variant.quantity = Math.max(0, variant.quantity - item.quantity);
          }

          await product.save();
        }
      }
    }

    res.json({
      message: "Cập nhật trạng thái thành công",
      order: updated,
    });
  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { payment_status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { payment_status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({
      message: "Cập nhật trạng thái thanh toán thành công",
      payment_status: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getOrderDetaill = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user_id")
      .populate("items.product_id")
      .populate("shipping_address_id")
      .populate("payment_method_id");

    if (!order) return res.status(404).send("Không tìm thấy đơn hàng");

    res.render("order_detail", { order });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
