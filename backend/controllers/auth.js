// backend/controllers/auth.js
const User = require("../models/User");
const CREDIT_PACKAGES = {
  basic: {
    name: "Başlangıç Paketi",
    credits: 4,
  },
  pro: {
    name: "Profesyonel Paket",
    credits: 8,
  },
  premium: {
    name: "Kurumsal Paket",
    credits: 12,
  },
};
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Public register sadece normal kullanıcı ve hizmet veren oluşturabilir.
    // Admin, support, marketing gibi roller API'den gönderilse bile kabul edilmez.
    const allowedPublicRoles = ["user", "provider"];
    const safeRole = allowedPublicRoles.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      phone,
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
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
    // Bu endpoint ödeme entegrasyonu gelene kadar sadece geliştirme/test içindir.
    // Production'da açık kalmasın.
    if (
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_TEST_CREDITS !== "true"
    ) {
      return res.status(403).json({
        success: false,
        error: "Paket yükleme işlemi ödeme sistemi üzerinden yapılmalıdır.",
      });
    }

    if (req.user.role !== "provider") {
      return res.status(403).json({
        success: false,
        error: "Sadece hizmet verenler teklif hakkı satın alabilir.",
      });
    }

    const { packageKey } = req.body;

    const selectedPackage = CREDIT_PACKAGES[packageKey];

    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz paket seçimi.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Kullanıcı bulunamadı.",
      });
    }

    user.offerLimit += selectedPackage.credits;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        package: selectedPackage,
      },
      message: `${selectedPackage.name} yüklendi. ${selectedPackage.credits} teklif hakkı eklendi.`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Teklif hakkı eklenemedi.",
    });
  }
};