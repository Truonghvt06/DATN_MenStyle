// middleware/adminAuth.js
module.exports = function (req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};
