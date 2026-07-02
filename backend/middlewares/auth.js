// backend/middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Giriş yapılmış mı kontrolü (Protect)
exports.protect = async (req, res, next) => {
  let token;

  // Header'da "Authorization: Bearer <token>" var mı kontrol et
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // "Bearer " kısmını at, sadece token'ı al
    token = req.headers.authorization.split(" ")[1];
  }

  // Token yoksa hata ver
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Bu işlem için giriş yapmalısınız." });
  }

  try {
    // Token'ı çöz (Verify)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token içindeki ID'den kullanıcıyı bul ve req.user'a ata
    // Böylece sonraki aşamalarda "req.user.id" diyerek kimin işlem yaptığını bileceğiz.
    req.user = await User.findById(decoded.id);

if (!req.user) {
  return res.status(401).json({
    success: false,
    error: "Kullanıcı bulunamadı.",
  });
}

if (req.user.isSuspended) {
  return res.status(403).json({
    success: false,
    error: "Hesabınız askıya alınmıştır. Lütfen destekle iletişime geçin.",
  });
}

next();
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Token geçersiz, yetkilendirme başarısız.",
      });
  }
};

// 2. Rol Kontrolü (Authorize) - Örn: sadece 'admin' girebilsin
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Kullanıcı rolü (${req.user.role}) bu işlem için yetkili değil.`,
      });
    }
    next();
  };
};
