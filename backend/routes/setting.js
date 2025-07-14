const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
  res.render('setting'); // sẽ render file views/setting.ejs
});

module.exports = router;
