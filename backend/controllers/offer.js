// backend/controllers/offer.js
const Offer = require("../models/Offer");
const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");
// @desc    İlana Teklif Ver
// @route   POST /api/v1/offers
// @access  Private (Sadece Provider)
exports.createOffer = async (req, res, next) => {
  try {
    const { requestId, price, deliveryTime, message } = req.body;

    // --- YENİ: TEKLİF HAKKI KONTROLÜ ---
    const providerUser = await User.findById(req.user.id);
    if (providerUser.offerLimit <= 0) {
      return res.status(403).json({
        success: false,
        error: "Teklif hakkınız kalmamıştır. Lütfen paket satın alın.",
      });
    }

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, error: "İlan bulunamadı" });
    }

    if (request.user.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Kendi ilanınıza teklif veremezsiniz.",
      });
    }

    const existingOffer = await Offer.findOne({
      provider: req.user.id,
      request: requestId,
    });
    if (existingOffer) {
      return res
        .status(400)
        .json({ success: false, error: "Bu ilana zaten teklif verdiniz." });
    }

    const offer = await Offer.create({
      provider: req.user.id,
      request: requestId,
      price,
      deliveryTime,
      message,
    });

    // --- YENİ: HAKKI 1 AZALT ---
    providerUser.offerLimit -= 1;
    await providerUser.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getOffersForRequest = async (req, res, next) => {
  try {
    // 1. Önce ilanı bulup sahibini kontrol edelim
    const serviceRequest = await ServiceRequest.findById(req.params.requestId);
    if (!serviceRequest) {
      return res.status(404).json({ success: false, error: "İlan bulunamadı" });
    }

    // 2. Filtre Hazırla
    let filter = { request: req.params.requestId };

    // --- KRİTİK MANTIK ---
    // Eğer isteği atan kişi, ilanın sahibi DEĞİLSE (yani bir Hizmet Veren ise),
    // sadece KENDİ verdiği teklifi görebilsin. Başkalarının teklifini görmesin.
    if (serviceRequest.user.toString() !== req.user.id) {
      filter.provider = req.user.id;
    }

    const offers = await Offer.find(filter)
      .populate("provider", "name email") // Teklif verenin adını getir
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ... (Önceki kodların altına ekle)

// @desc    Teklifi Kabul Et (İlan Sahibi Yapar)
// @route   PUT /api/v1/offers/:id/accept
// @access  Private (Sadece İlan Sahibi)
exports.acceptOffer = async (req, res, next) => {
  try {
    // 1. Kabul edilecek teklifi bul
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res
        .status(404)
        .json({ success: false, error: "Teklif bulunamadı" });
    }

    // 2. İlanı bul
    const request = await ServiceRequest.findById(offer.request);

    // 3. Yetki Kontrolü: Bu ilanın sahibi sen misin?
    if (request.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error:
          "Bu işlem için yetkiniz yok. Sadece ilan sahibi teklifi kabul edebilir.",
      });
    }

    // 4. İlan zaten kapandıysa işlem yapma
    if (request.status === "completed" || request.status === "in_progress") {
      return res.status(400).json({
        success: false,
        error: "Bu iş için zaten bir anlaşma yapılmış.",
      });
    }

    // --- KRİTİK İŞLEMLER ---

    // A. Seçilen teklifi 'accepted' yap
    offer.status = "accepted";
    await offer.save();

    // B. Bu ilana ait DİĞER tüm teklifleri 'rejected' yap (Bulk Update)
    await Offer.updateMany(
      { request: request._id, _id: { $ne: offer._id } }, // Bu ilan ID'si OLAN ama bu teklif ID'si OLMAYANLAR
      { status: "rejected" },
    );

    // C. İlanın durumunu 'in_progress' (İş başladı) yap
    request.status = "in_progress";
    await request.save();

    res.status(200).json({
      success: true,
      data: offer,
      message:
        "Teklif kabul edildi, diğer teklifler reddedildi ve iş süreci başladı.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// backend/controllers/offer.js EN ALTA EKLE:

// @desc    Hizmet Verenin Kendi Verdiği Teklifleri Getir
// @route   GET /api/v1/offers/my-offers
// @access  Private (Provider)
exports.getMyOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ provider: req.user.id })
      .populate({
        path: "request", // Hangi işe teklif verilmiş?
        select: "status city district createdAt",
        populate: {
          path: "service", // O işin hizmet adı ne?
          select: "name",
        },
      })
      .sort("-createdAt"); // En yeni en üstte

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
