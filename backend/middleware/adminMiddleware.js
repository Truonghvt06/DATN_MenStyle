exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Chỉ quản trị viên mới được thực hiện thao tác này" });
  }
};
