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

// HÀM CALLBACK
// controllers/zaloPayController.js
// exports.zaloCallback = async (req, res) => {
//   try {
//     const { data, mac } = req.body;

//     // ✅ Verify MAC
//     const genMac = CryptoJS.HmacSHA256(data, config.key2).toString();
//     if (mac !== genMac) {
//       return res.status(400).json({
//         return_code: -1,
//         return_message: "MAC không hợp lệ",
//       });
//     }

//     const parsedData = JSON.parse(data);
//     const { app_trans_id, zp_trans_id, amount, server_time, status } =
//       parsedData;

//     console.log("ZaloPay callback data: ", parsedData);

//     // ✅ Lấy order_id từ app_trans_id (VD: "250807_64d49a7b61e1ef001e798123")
//     const order_id = app_trans_id.split("_")[1];

//     // console.log("OID: ", order_id);

//     // ✅ Tìm đơn hàng theo _id
//     const order = await Order.findById(order_id);
//     if (!order) {
//       return res.status(404).json({
//         return_code: -1,
//         return_message: "Không tìm thấy đơn hàng",
//       });
//     }

//     // ✅ Nếu đã tồn tại Payment với transaction_id thì bỏ qua
//     const existing = await Payment.findOne({ transaction_id: zp_trans_id });
//     if (existing) {
//       return res.status(200).json({ return_code: 1, return_message: "OK" });
//     }

//     // ✅ Tạo bản ghi lịch sử thanh toán bằng new + save, có try-catch riêng
//     try {
//       const newPayment = new Payment({
//         order_id: order._id,
//         transaction_id: zp_trans_id,
//         payment_status: status === 1 ? "success" : "failed",
//         paid_at: status === 1 ? new Date(server_time) : null,
//       });

//       await newPayment.save();
//     } catch (err) {
//       console.error("Lỗi khi lưu Payment:", err.message);
//       return res.status(500).json({
//         return_code: -1,
//         return_message: "Lỗi khi lưu lịch sử thanh toán",
//       });
//     }

//     // ✅ Cập nhật trạng thái thanh toán ở Order nếu thanh toán thành công
//     if (status === 1) {
//       order.payment_status = "paid";
//       await order.save();
//     }

//     return res.status(200).json({ return_code: 1, return_message: "OK" });
//   } catch (err) {
//     console.error("Zalo callback error:", err.message);
//     return res.status(500).json({
//       return_code: -1,
//       return_message: "Lỗi server",
//     });
//   }
// };

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

    // Lấy mã đơn hàng từ app_trans_id
    // Ví dụ app_trans_id = 250808_ABC123 → order_code = ABC123
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
