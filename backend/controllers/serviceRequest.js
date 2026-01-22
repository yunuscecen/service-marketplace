const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");
const Offer = require("../models/Offer");

// @desc    Yeni Hizmet Talebi (İlan) Oluştur
exports.createRequest = async (req, res, next) => {
  try {
    const service = await Service.findById(req.body.serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, error: "Hizmet bulunamadı" });
    }

    const request = await ServiceRequest.create({
      user: req.user.id,
      service: req.body.serviceId,
      answers: req.body.answers,
      city: req.body.city,
      district: req.body.district,
      description: req.body.description,
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcının Kendi Taleplerini Getir (Teklif Sayısı Dahil)
exports.getMyRequests = async (req, res, next) => {
  try {
    let requests = await ServiceRequest.find({ user: req.user.id })
      .populate("service", "name slug")
      .sort("-createdAt")
      .lean();

    const requestsWithCounts = await Promise.all(
      requests.map(async (request) => {
        const offerCount = await Offer.countDocuments({ request: request._id });
        return { ...request, offerCount };
      }),
    );

    res.status(200).json({
      success: true,
      count: requestsWithCounts.length,
      data: requestsWithCounts,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Tek Bir Talebi Getir (Detay - Telefon Numarası Dahil)
exports.getRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("service", "name slug")
      .populate("user", "name phone"); // Telefon numarasını populate ediyoruz

    if (!request) {
      return res
        .status(404)
        .json({ success: false, error: "Talep bulunamadı" });
    }

    // Yetki Kontrolü
    const isOwner = request.user._id.toString() === req.user.id;
    const isProvider = req.user.role === "provider";

    if (!isOwner && !isProvider) {
      return res.status(401).json({ success: false, error: "Yetkisiz erişim" });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, error: "Talep getirilemedi" });
  }
};

// @desc    Hizmet Verenler İçin Açık Talepleri Listele (Feed + Teklif Sayısı)
exports.getOpenRequests = async (req, res, next) => {
  try {
    const myOffers = await Offer.find({ provider: req.user.id }).select(
      "request",
    );
    const offeredRequestIds = myOffers.map((offer) => offer.request);

    const requests = await ServiceRequest.find({
      status: "active",
      user: { $ne: req.user.id },
      _id: { $nin: offeredRequestIds },
    })
      .populate("service", "name slug")
      .populate("user", "name")
      .sort("-createdAt")
      .lean();

    // Her ilan için teklif sayısını ekliyoruz
    const requestsWithCounts = await Promise.all(
      requests.map(async (request) => {
        const offerCount = await Offer.countDocuments({ request: request._id });
        return { ...request, offerCount };
      }),
    );

    res.status(200).json({
      success: true,
      count: requestsWithCounts.length,
      data: requestsWithCounts,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    İşi Tamamlandı Olarak İşaretle
exports.completeRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, error: "İlan bulunamadı" });

    if (request.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Bu işlem için yetkiniz yok." });
    }

    request.status = "completed";
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
      message: "İş başarıyla tamamlandı.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
