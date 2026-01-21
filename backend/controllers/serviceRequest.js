// backend/controllers/serviceRequest.js
const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");

// @desc    Yeni Hizmet Talebi (İlan) Oluştur
// @route   POST /api/v1/requests
// @access  Private (Sadece Giriş Yapanlar)
exports.createRequest = async (req, res, next) => {
  try {
    // 1. Service ID geçerli mi kontrol et
    const service = await Service.findById(req.body.serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, error: "Böyle bir hizmet bulunamadı" });
    }

    // 2. Veriyi hazırla
    const requestData = {
      user: req.user.id, // Giriş yapan kullanıcı
      service: req.body.serviceId,
      answers: req.body.answers,
      city: req.body.city,
      district: req.body.district,
      description: req.body.description,
    };

    // 3. Kaydet
    const newRequest = await ServiceRequest.create(requestData);

    res.status(201).json({
      success: true,
      data: newRequest,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcının Kendi Taleplerini Getir
// @route   GET /api/v1/requests/my-requests
// @access  Private
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id })
      .populate("service", "name slug") // Hizmetin sadece adını ve slug'ını getir
      .sort("-createdAt"); // En yeni en üstte

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
