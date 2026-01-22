// backend/controllers/service.js
const Service = require("../models/Service");

// @desc    Tüm Hizmetleri Getir
// @route   GET /api/v1/services
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res
      .status(200)
      .json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc    Tek Bir Hizmet Getir
// @route   GET /api/v1/services/:id
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res
        .status(404)
        .json({ success: false, error: "Hizmet bulunamadı" });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: "Geçersiz ID" });
  }
};

// @desc    Yeni Hizmet Oluştur
// @route   POST /api/v1/services
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Hizmeti Güncelle ve Soru Ekle
// @route   PUT /api/v1/services/:id
exports.updateService = async (req, res, next) => {
  try {
    // Frontend'den gelen _id'yi güncelleme verisinden çıkarıyoruz (Çakışma olmasın)
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!service)
      return res
        .status(404)
        .json({ success: false, error: "Hizmet bulunamadı" });

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Hizmeti Sil
// @route   DELETE /api/v1/services/:id
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service)
      return res
        .status(404)
        .json({ success: false, error: "Hizmet bulunamadı" });

    res
      .status(200)
      .json({ success: true, message: "Hizmet başarıyla silindi" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
