
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',   
  auth: {
    user: process.env.USERNAME_GOOGLE,
    pass: process.env.PASSWORD_GOOGLE,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    const otp = generateOTP();
    const otpExpires = Date.now() + parseInt(process.env.OTP_EXPIRES_IN);

    user = new User({ email, password, otp, otpExpires });
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    res.json({ message: 'User registered. Please verify OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.password !== password) return res.status(400).json({ message: 'Incorrect password' });
    if (!user.isVerified) return res.status(400).json({ message: 'User not verified' });

    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
