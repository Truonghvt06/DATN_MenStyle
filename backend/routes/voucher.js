const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const voucherControllerApp = require("../controllers/voucherControllerApp");
const authMiddleware = require("../middleware/authMiddleware");

// Hiển thị danh sách voucher

router.get("/view", voucherController.viewVouchers);

// Hiển thị form thêm voucher
router.get("/add", voucherController.addVoucherForm);

// Hiển thị form sửa voucher
router.get("/edit/:id", voucherController.editVoucherForm);

// Xử lý thêm voucher
router.post("/add", voucherController.addVoucher);

// Xử lý sửa voucher
router.post("/edit/:id", voucherController.editVoucher);

// Xử lý xoá voucher
router.post("/delete/:id", voucherController.deleteVoucher);

// Toggle trạng thái voucher
router.post("/toggle-status/:id", voucherController.toggleVoucherStatus);

// API trả về danh sách voucher cho mobile app
router.get("/api/vouchers", voucherController.apiGetVouchers);

//
//
//API APP
router.get("/", voucherControllerApp.getActiveVouchers);
router.get(
  "/available-voucher",
  authMiddleware,
  voucherControllerApp.getAvailableVouchers
);
router.post(
  "/update/:voucherId",
  authMiddleware,
  voucherControllerApp.useVoucher
);

module.exports = router;
