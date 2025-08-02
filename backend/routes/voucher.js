const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const voucherControllerApp = require("../controllers/voucherControllerApp");

// Hiển thị danh sách voucher
router.get("/coupons/view", voucherController.viewVouchers);

// Hiển thị form thêm voucher
router.get("/coupons/add", voucherController.addVoucherForm);

// Hiển thị form sửa voucher
router.get("/coupons/edit/:id", voucherController.editVoucherForm);

// Xử lý thêm voucher
router.post("/coupons/add", voucherController.addVoucher);

// Xử lý sửa voucher
router.post("/coupons/edit/:id", voucherController.editVoucher);

// Xử lý xoá voucher
router.post("/coupons/delete/:id", voucherController.deleteVoucher);

// Toggle trạng thái voucher
router.post(
  "/coupons/toggle-status/:id",
  voucherController.toggleVoucherStatus
);

// API trả về danh sách voucher cho mobile app
router.get("/api/vouchers", voucherController.apiGetVouchers);

//
//
//API APP
router.get("/", voucherControllerApp.getActiveVouchers);

module.exports = router;
