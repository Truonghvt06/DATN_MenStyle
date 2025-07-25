const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", addressController.getAddresses);
router.post("/add-address", addressController.addAddress);
router.put("/update-address/:id", addressController.updateAddress);
router.delete("/delete-address/:id", addressController.deleteAddress);

//====Route cho web=====
router.get("/add", addressController.showAddAddressForm);
router.post("/add", addressController.handleAddAddress);

module.exports = router;
