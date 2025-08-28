const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// const JWT_SECRET = "secret_key"; // đổi thành biến môi trường
const JWT_EXPIRES_IN = "1d"; //Thời gian tồi tại jwt

// dang nhap
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // So sánh password (sử dụng method đã định nghĩa trong schema)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Trả về token và user info (ẩn password)
    res.json({
      message: "Đăng nhập thành công",
      token,
      user,
    });
  } catch (err) {
    console.error("Lỗi login:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// dang ky
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      phone,
      password, // sẽ được mã hoá trong pre-save hook
    });

    await newUser.save(); // save vào DB

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Đăng ký lỗi:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// profile
exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

//update-profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware cần gán req.user
    const { name, email, phone, gender, date_of_birth } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    // Nếu email thay đổi → kiểm tra trùng
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
      user.email = email;
    }

    // Cập nhật các trường nếu được gửi
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;

    await user.save();
    return res.json({ message: "Cập nhật thông tin thành công", user });
  } catch (error) {
    console.error("Lỗi update profile:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

//update-avatar
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file)
      return res.status(400).json({ message: "Vui lòng tải lên ảnh" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    /* ──────────────── TÍNH ĐƯỜNG DẪN ẢNH CŨ ──────────────── */
    let oldAvatarPath = null;
    if (user.avatar) {
      const filename = user.avatar.split("/").pop(); // men_style‑123.jpg
      oldAvatarPath = path.join(__dirname, "..", "assets", "avatars", filename);
    }

    /* ──────────────── LƯU ẢNH MỚI ──────────────── */
    const newUrl = `${req.protocol}://${req.get("host")}/avatars/${
      req.file.filename
    }`;
    user.avatar = newUrl;
    await user.save();

    /* ──────────────── XOÁ ẢNH CŨ ──────────────── */
    if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
    res.json({ message: "Cập nhật avatar thành công", user });
  } catch (error) {
    console.error("Lỗi update avatar:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.forgotPass = async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra user trước khi vào try
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 chữ số
    const expiresIn = 60 * 1000; // 1 phút
    const otpExpires = Date.now() + expiresIn;

    user.resetOTP = otp;
    user.resetOTPExpires = otpExpires;
    await user.save();

    
    await sendEmail(email, "Mã OTP lấy lại mật khẩu", `Mã của bạn là: ${otp}`);

    res.json({
      message: "OTP đã được gửi đến email của bạn",
      expiresIn: expiresIn / 1000, // Trả về giây
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gửi OTP", error });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.resetOTPExpires) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }
    
    user.otpVerified = true;
    await user.save();

    res.json({ message: "Xác minh OTP thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xác minh OTP", error });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.otpVerified) {
      return res.status(400).json({ message: "OTP chưa được xác minh" });
    }
    user.password = newPassword; // Hash nếu cần
    user.resetOTP = "";
    user.resetOTPExpires = null;
    user.otpVerified = false;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đặt lại mật khẩu", error });
  }
};

// update token FCM
exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fcmToken = fcmToken;
    await user.save();

    res.json({ message: "FCM token updated successfully" });
  } catch (error) {
    console.error("Error updating FCM token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /auth/verify-password
exports.verifyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword } = req.body;

    if (!oldPassword) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu cũ" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không chính xác" });
    }

    res.json({ message: "Mật khẩu cũ chính xác" });
  } catch (error) {
    console.error("Lỗi xác thực mật khẩu cũ:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// PATCH /auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    user.password = newPassword; // sẽ được hash trong schema
    await user.save();

    res.json({ message: "Cập nhật mật khẩu mới thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật mật khẩu:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
