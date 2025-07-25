const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  password: { type: String, required: true } // đã hash
});

module.exports = mongoose.model('Admin', adminSchema);
