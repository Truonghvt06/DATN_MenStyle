const Address = require("../models/Address");
const User = require("../models/User");

// ========================= API CHO APP =========================

// Lấy danh sách địa chỉ của user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.user.id });

    // Sắp xếp: mặc định lên đầu, sau đó theo thời gian tạo mới nhất
    const sortAddress = addresses.sort((a, b) => {
      // Ưu tiên is_default = true
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;

      // Nếu cùng is_default, so sánh createdAt giảm dần
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({ addresses: sortAddress });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy địa chỉ" });
  }
};

// // Thêm địa chỉ mới
// exports.addAddress = async (req, res) => {
//   try {
//     const {
//       recipient_name,
//       phone,
//       address_line,
//       province,
//       district,
//       ward,
//       is_default,
//     } = req.body;

//     // Nếu is_default = true thì cập nhật tất cả is_default khác về false
//     if (is_default) {
//       await Address.updateMany(
//         { user_id: req.user.id },
//         { $set: { is_default: false } }
//       );
//     }

//     const newAddress = new Address({
//       user_id: req.user.id,
//       recipient_name,
//       phone,
//       address_line,
//       province,
//       district,
//       ward,
//       is_default: !!is_default,
//     });

//     await newAddress.save();
//     res
//       .status(201)
//       .json({ message: "Thêm địa chỉ thành công", address: newAddress });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server khi thêm địa chỉ" });
//   }
// };r

// Thêm địa chỉ mới check lenght = 0
exports.addAddress = async (req, res) => {
  try {
    const {
      recipient_name,
      phone,
      address_line,
      province,
      district,
      ward,
      is_default,
    } = req.body;

    // Lấy danh sách địa chỉ của user
    const existingAddresses = await Address.find({ user_id: req.user.id });

    let isDefaultFinal = false;

    if (existingAddresses.length === 0) {
      // Nếu chưa có địa chỉ nào → đặt mặc định luôn
      isDefaultFinal = true;
    } else if (is_default) {
      // Nếu người dùng chọn làm mặc định
      await Address.updateMany(
        { user_id: req.user.id },
        { $set: { is_default: false } }
      );
      isDefaultFinal = true;
    }

    const newAddress = new Address({
      user_id: req.user.id,
      recipient_name,
      phone,
      address_line,
      province,
      district,
      ward,
      is_default: isDefaultFinal,
    });

    await newAddress.save();

    res.status(201).json({
      message: "Thêm địa chỉ thành công",
      address: newAddress,
    });
  } catch (error) {
    console.error("Lỗi thêm địa chỉ:", error);
    res.status(500).json({ message: "Lỗi server khi thêm địa chỉ" });
  }
};

// Cập nhật địa chỉ
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      recipient_name,
      phone,
      address_line,
      province,
      district,
      ward,
      is_default,
    } = req.body;

    const address = await Address.findById(id);

    if (!address || address.user_id.toString() !== req.user.id) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" });
    }

    //  Không cho hủy mặc định tại đây
    if (address.is_default && is_default === false) {
      return res.status(400).json({
        message:
          "Không thể huỷ mặc định tại đây. Vui lòng đặt một địa chỉ khác làm mặc định.",
      });
    }

    //  Nếu người dùng chuyển sang mặc định một địa chỉ KHÁC (không phải đang mặc định)
    if (is_default && !address.is_default) {
      await Address.updateMany(
        { user_id: req.user.id },
        { $set: { is_default: false } }
      );
      address.is_default = true;
    }

    // Cho sửa tất cả các trường
    address.recipient_name = recipient_name;
    address.phone = phone;
    address.address_line = address_line;
    address.province = province;
    address.district = district;
    address.ward = ward;

    await address.save();
    res.status(200).json({ message: "Cập nhật địa chỉ thành công", address });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật địa chỉ" });
  }
};

// Xoá địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address || address.user_id.toString() !== req.user.id) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" });
    }

    if (address.is_default) {
      return res
        .status(400)
        .json({ message: "Không thể xoá địa chỉ mặc định" });
    }

    await Address.findByIdAndDelete(id);
    res.status(200).json({ message: "Xoá địa chỉ thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xoá địa chỉ" });
  }
};

// ========================= API CHO WEB =========================

// Hiển thị form thêm địa chỉ (dùng trong EJS)
exports.showAddAddressForm = async (req, res) => {
  try {
    const userId = req.query.userId;
    const returnTo = req.query.return || `/accounts/${userId}/cart/checkout`;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("Không tìm thấy người dùng");

    res.render("address_add", {
      returnTo,
      userId,
      user,
    });
  } catch (err) {
    console.error("Lỗi khi hiển thị form địa chỉ:", err);
    res.status(500).send("Lỗi khi tải form thêm địa chỉ");
  }
};

// Xử lý thêm địa chỉ từ form HTML
exports.handleAddAddress = async (req, res) => {
  try {
    const {
      userId,
      recipient_name,
      phone,
      address_line,
      province,
      district,
      ward,
    } = req.body;

    await Address.create({
      user_id: userId,
      recipient_name,
      phone,
      address_line,
      province,
      district,
      ward,
      is_default: false,
    });

    const returnTo = req.body.returnTo || `/accounts/${userId}/cart/checkout`;
    res.redirect(returnTo);
  } catch (err) {
    console.error("Lỗi thêm địa chỉ:", err);
    res.status(500).send("Không thể thêm địa chỉ");
  }
};
