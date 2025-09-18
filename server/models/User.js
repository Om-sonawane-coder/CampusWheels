// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Har user ka email alag hona chahiye
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Yeh createdAt aur updatedAt fields add kar dega

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;