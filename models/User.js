// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,  // In production, store a hashed password!
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  docs: [{ // Array of document objects
    filename: String,
    url: String,
    originalName: String,
    uploadDate: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('User', userSchema);
