// backend/controllers/auth.js
const User = require("../models/User");

// @desc    Kullanıcı Kaydı (Register)
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Kullanıcıyı oluştur
    const user = await User.create({
      name,
      email,
      password,
      role, // Normalde role dışarıdan alınmaz, güvenlik açığıdır ama şimdilik test için açıyoruz.
    });

    // Token oluştur ve gönder
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcı Girişi (Login)
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Email ve şifre girildi mi kontrol et
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Lütfen email ve şifre giriniz" });
    }

    // Kullanıcıyı bul (Şifreyi de getir - çünkü modelde select:false yapmıştık)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Geçersiz kimlik bilgileri" });
    }

    // Şifre eşleşiyor mu kontrol et
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

// Yardımcı Fonksiyon: Token oluşturup response dönme
const sendTokenResponse = (user, statusCode, res) => {
  // Modeldeki metodu kullan
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
};
