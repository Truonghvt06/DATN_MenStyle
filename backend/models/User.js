
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantIndex: { type: Number, required: true }, // chỉ số trong mảng variants
    quantity: { type: Number, required: true, default: 1 }
  });
  
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true },
    gender: { type: String, require: false },
    avatar: { type: String, require: false },
    date_of_birth: { type: Date, require: false },
    password: { type: String, required: true },

    cart: [cartItemSchema], 
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // danh sách yêu thích
});

module.exports = mongoose.model('User', userSchema);
