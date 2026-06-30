// backend/controllers/review.js
const Review = require("../models/Review");
const ServiceRequest = require("../models/ServiceRequest");
const Offer = require("../models/Offer");
const User = require("../models/User");

// @desc    Hizmet Verene Yorum Yap
// @route   POST /api/v1/reviews
// @access  Private (Müşteri)
exports.createReview = async (req, res, next) => {
  try {
    const { requestId, rating, text, title } = req.body;

    // 1. İlanı bul
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, error: "İlan bulunamadı" });
    }

    // 2. Yetki: İlanın sahibi sen misin?
    if (request.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Sadece ilan sahibi yorum yapabilir." });
    }

    // 3. İlan durumu kontrolü: İş en azından "in_progress" veya "completed" olmalı
    if (request.status !== "in_progress" && request.status !== "completed") {
      return res.status(400).json({
        success: false,
        error:
          "Henüz başlanmamış veya onaylanmamış bir işe yorum yapamazsınız.",
      });
    }

    // 4. Kabul edilen teklifi bul (Hizmet vereni bulmak için)
  let acceptedOffer = null;

if (request.acceptedOffer) {
  acceptedOffer = await Offer.findById(request.acceptedOffer);
}

if (!acceptedOffer) {
  acceptedOffer = await Offer.findOne({
    request: requestId,
    status: "accepted",
  });
}

    // 5. Yorumu Oluştur
    const review = await Review.create({
      title,
      text,
      rating,
      serviceRequest: requestId,
      user: req.user.id, // Yazan: Müşteri
      provider: acceptedOffer.provider, // Hedef: Freelancer
    });

    // 6. İlanı 'completed' (Tamamlandı) olarak işaretle (Review yapıldıysa iş bitmiştir)
request.status = "completed";
request.completedAt = new Date();
await request.save();

    res.status(201).json({
      success: true,
      data: review,
      message: "Yorumunuz eklendi ve iş tamamlandı olarak işaretlendi.",
    });
  } catch (error) {
    // Mükerrer kayıt hatası
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Bu iş için zaten yorum yaptınız." });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Bir Hizmet Verenin Yorumlarını Getir
// @route   GET /api/v1/reviews/provider/:providerId
// @access  Public
exports.getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("user", "name") // Yorum yapanın ismini göster
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
