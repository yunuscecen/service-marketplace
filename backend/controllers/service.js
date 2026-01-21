// backend/controllers/service.js
const Service = require("../models/Service");

// @desc    Tüm Hizmetleri Listele
// @route   GET /api/v1/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Yeni Hizmet Oluştur
// @route   POST /api/v1/services
// @access  Private (Sadece Admin)
exports.createService = async (req, res, next) => {
  try {
    // req.body'den gelen veriyi kaydet
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    // Eğer aynı isimde kayıt varsa (duplicate key error code: 11000)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Bu hizmet zaten mevcut." });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};
