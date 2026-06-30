// backend/controllers/auth.js
const User = require("../models/User");

// @desc    Kullanıcı Kaydı (Register)
// @route   POST /api/v1/auth/register
// @access  Public
// backend/controllers/auth.js
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body; // phone eklendi

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone, // phone eklendi
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcı Girişi (Login)
// @route   POST /api/v1/auth/login
// @access  Public
// backend/controllers/auth.js

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Lütfen email ve şifre giriniz" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Geçersiz kimlik bilgileri" });
    }

    // --- BURAYI EKLE: Askıya alınmış mı kontrol et ---
    if (user.isSuspended) {
      return res.status(401).json({
        success: false,
        error: "Hesabınız askıya alınmıştır. Lütfen destekle iletişime geçin.",
      });
    }
    // ------------------------------------------------

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Geçersiz kimlik bilgileri" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMe = async (req, res, next) => {
  // req.user, middleware sayesinde buraya dolu geliyor
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};
// Yardımcı Fonksiyon: Token oluşturup response dönme
const sendTokenResponse = (user, statusCode, res) => {
  // Modeldeki metodu kullan
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
  user: {
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  offerLimit: user.offerLimit,
}
  });
};
exports.addCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Mevcut kredisine yenisini ekle
    user.offerLimit += req.body.credits;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
