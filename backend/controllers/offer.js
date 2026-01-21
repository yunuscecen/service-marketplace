// backend/controllers/offer.js
const Offer = require("../models/Offer");
const ServiceRequest = require("../models/ServiceRequest");

// @desc    İlana Teklif Ver
// @route   POST /api/v1/offers
// @access  Private (Sadece Provider)
exports.createOffer = async (req, res, next) => {
  try {
    const { requestId, price, deliveryTime, message } = req.body;

    // 1. İlan var mı kontrol et
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, error: "İlan bulunamadı" });
    }

    // 2. Kendi ilanına teklif veremezsin
    if (request.user.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Kendi ilanınıza teklif veremezsiniz.",
      });
    }

    // 3. Daha önce teklif vermiş mi? (Modeldeki index de korur ama burada da bakalım)
    const existingOffer = await Offer.findOne({
      provider: req.user.id,
      request: requestId,
    });

    if (existingOffer) {
      return res
        .status(400)
        .json({ success: false, error: "Bu ilana zaten teklif verdiniz." });
    }

    // 4. Teklifi Oluştur
    const offer = await Offer.create({
      provider: req.user.id,
      request: requestId,
      price,
      deliveryTime,
      message,
    });

    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Bir İlana Gelen Teklifleri Getir (Müşteri İçin)
// @route   GET /api/v1/offers/request/:requestId
// @access  Private (İlan Sahibi Görebilir)
exports.getOffersForRequest = async (req, res, next) => {
  try {
    const offers = await Offer.find({ request: req.params.requestId })
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
