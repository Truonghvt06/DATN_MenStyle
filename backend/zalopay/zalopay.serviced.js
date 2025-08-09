const config = require("./zalopay.config");
const axios = require("axios");
const CryptoJS = require("crypto-js");

exports.checkZaloPayOrderStatus = async (app_trans_id) => {
  try {
    const data = {
      app_id: config.app_id,
      app_trans_id,
    };

    const dataStr = `${data.app_id}|${data.app_trans_id}|${config.key1}`;
    data.mac = CryptoJS.HmacSHA256(dataStr, config.key1).toString();

    const res = await axios.post(config.endpoint, null, {
      params: data,
    });

    console.log("AA: ", res.data);

    return res.data; // Sẽ chứa return_code, return_message, và status (1 là thành công)
  } catch (err) {
    console.error("Lỗi check status từ ZaloPay:", err.message);
    return null;
  }
};
