
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,  
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  docs: [{ 
    filename: String,
    url: String,
    key: String, 
    originalName: String,
    uploadDate: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('User', userSchema);
