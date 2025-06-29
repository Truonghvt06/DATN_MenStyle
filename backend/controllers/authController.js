const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Trả về token và user info (ẩn password)
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
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
