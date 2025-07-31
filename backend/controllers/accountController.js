const User = require('../models/User');
const Address = require('../models/Address');
const PaymentMethod = require('../models/PaymentMethod');
const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "name email")
      .populate("shipping_address_id")
      .populate("payment_method_id")
      .sort({ createdAt: -1 });

    res.render("order_admin", { orders });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    res.status(500).send("Không thể lấy danh sách đơn hàng.");
  }
};


exports.showOrderPage = async (req, res) => {
    const userId = req.params.id;
    const { addressId, paymentMethodId } = req.query;
  
    try {
      const user = await User.findById(userId).populate("cart.productId");
      const address = await Address.findById(addressId);
      const payment = await PaymentMethod.findById(paymentMethodId);
  
      if (!user || !address || !payment) return res.status(400).send("Thiếu thông tin");
  
      const items = user.cart.map(item => ({
        product_variant_id: item.productId,
        quantity: item.quantity,
        price: item.productId.price
      }));
  
      const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const userName = address.recipient_name;
      const qrUrl = `https://img.vietqr.io/image/MB-6013511112005-compact.png?amount=${total}&addInfo=MenStyle${userId}&accountName=${encodeURIComponent(userName)}`;
  
      res.render("order", {
        user,
        address,
        payment,
        items,
        total,
        qrUrl
      });
      
    } catch (err) {
      console.error("Lỗi khi hiển thị đơn hàng:", err);
      res.status(500).send("Không thể hiển thị đơn hàng.");
    }
  };
  
  exports.showCheckoutPage = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId).populate("cart.productId");
      const addresses = await Address.find({ user_id: userId });
      const paymentMethods = await PaymentMethod.find();
  
      const total = user.cart.reduce((sum, item) => {
        return sum + (item.productId?.price || 0) * item.quantity;
      }, 0);
  
      res.render("checkout", { user, addresses, paymentMethods, total });
    } catch (err) {
      console.error("Lỗi khi hiển thị trang checkout:", err);
      res.status(500).send("Lỗi khi hiển thị trang thanh toán.");
    }
  };
  

  exports.processCheckout = async (req, res) => {
    const userId = req.params.id;
    const { addressId, paymentMethodId } = req.body;
  
    try {
      const user = await User.findById(userId).populate("cart.productId");
      const address = await Address.findById(addressId);
      const payment = await PaymentMethod.findById(paymentMethodId);
  
      if (!user || user.cart.length === 0) {
        return res.status(400).send("Giỏ hàng trống.");
      }
  
      const items = user.cart.map(item => ({
        product_variant_id: item.productId._id,
        price: item.productId.price,
        quantity: item.quantity,
      }));
  
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      await Order.create({
        user_id: userId,
        total_amount: total,
        shipping_address_id: address._id,
        payment_method_id: payment._id,
        items,
        status: "Pending",
      });
  
      user.cart = [];
      await user.save();
  
      res.redirect(`/accounts/detail/${userId}`);
    } catch (err) {
      console.error("Lỗi khi xử lý thanh toán:", err);
      res.status(500).send("Không thể thanh toán.");
    }
  };
  exports.updateStatus = async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
  
    try {
      await Order.findByIdAndUpdate(orderId, { status });
      res.status(200).send('Trạng thái đã được cập nhật.');
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      res.status(500).send('Không thể cập nhật trạng thái.');
    }
  };
  
  
  
  
  
  
    