const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");
const Offer = require("../models/Offer");

// @desc    Tüm kullanıcıları listele
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort("-createdAt");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcıyı askıya al veya aktif et
exports.toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Kullanıcı bulunamadı" });
    }

    user.isSuspended = !user.isSuspended;
    // Şifre validasyonuna takılmaması için validateBeforeSave: false ekledik
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Tüm İlanları (Talepleri) ve Teklifleri Getir
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("user", "name email")
      .populate("service", "name")
      .sort("-createdAt")
      .lean();

    const requestsWithOffers = await Promise.all(
      requests.map(async (request) => {
        const offers = await Offer.find({ request: request._id })
          .populate("provider", "name email")
          .lean();
        return { ...request, offers, offerCount: offers.length };
      }),
    );

    res.status(200).json({ success: true, data: requestsWithOffers });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    İlanı Sil
exports.deleteRequest = async (req, res) => {
  try {
    await ServiceRequest.findByIdAndDelete(req.params.id);
    await Offer.deleteMany({ request: req.params.id }); // İlana gelen teklifleri de temizle
    res.status(200).json({ success: true, message: "İlan başarıyla silindi." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
