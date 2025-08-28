// controllers/zaloPayController.js
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const config = require("../zalopay/zalopay.config");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

exports.createZaloPayOrder = async (req, res) => {
  try {
    const { amount, order_id, order_code, description } = req.body;
    const user_id = req.user.id; // 👈 Lấy từ token đã decode

    if (!amount || !order_id) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
    }

    const app_trans_id = moment().format("YYMMDD") + "_" + order_id;

    const embed_data = {
      preferred_payment_method: ["zalopay_wallet"],
      //   redirecturl: "yourapp://payment-success", // deep link app
    };

    const items = [];

    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: user_id,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description,
      bank_code: "",
      callback_url: "https://dca01737df71.ngrok-free.app/zalo/callback",
    };

    // console.log("OD: ", order);
    // console.log("OD_ID: ", order_id);

    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("ZaloPay error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng ZaloPay" });
  }
};



exports.zaloCallback = async (req, res) => {
  let result = {};

  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tính lại MAC để kiểm tra
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "MAC không hợp lệ";
      return res.json(result);
    }

    // Parse data từ ZaloPay
    const dataJson = JSON.parse(dataStr, config.key2);

    console.log("DATA: ", dataJson);

    const app_trans_id = dataJson["app_trans_id"];
    const zp_trans_id = dataJson["zp_trans_id"];
    const server_time = dataJson["server_time"];

    
    const order_code = app_trans_id.split("_")[1];
    console.log("Mã đơn hàng:", order_code);

    // Tìm đơn hàng
    const order = await Order.findOne({ _id: order_code });
    if (!order) {
      result.return_code = -1;
      result.return_message = "Không tìm thấy đơn hàng";
      return res.json(result);
    }

    // Kiểm tra đã có payment record chưa (tránh tạo trùng)
    const existedPayment = await Payment.findOne({
      transaction_id: zp_trans_id,
    });
    if (!existedPayment) {
      // Tạo bản ghi thanh toán
      const newPayment = new Payment({
        order_id: order._id,
        transaction_id: zp_trans_id,
        payment_status: "success",
        paid_at: new Date(server_time),
      });

      await newPayment.save();

      // Cập nhật trạng thái thanh toán của đơn hàng
      order.payment_status = "paid";
      order.transaction_id = zp_trans_id;
      await order.save();
    } else {
      console.log("Giao dịch đã xử lý trước đó:", zp_trans_id);
    }

    result.return_code = 1;
    result.return_message = "Xử lý thành công";
  } catch (ex) {
    console.error("Lỗi callback:", ex);
    result.return_code = 0; // ZaloPay sẽ callback lại
    result.return_message = ex.message;
  }

  // Trả kết quả cho ZaloPay server
  res.json(result);
};
