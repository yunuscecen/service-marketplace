const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");
const Offer = require("../models/Offer");
const createNotification = require("../utils/createNotification");
// @desc Tüm kullanıcıları listele
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort("-createdAt");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Kullanıcıyı askıya al veya aktif et
exports.toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Kullanıcı bulunamadı",
      });
    }

    user.isSuspended = !user.isSuspended;

    // Şifre validasyonuna takılmaması için validateBeforeSave: false
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Tüm ilanları ve teklifleri getir
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

        return {
          ...request,
          offers,
          offerCount: offers.length,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: requestsWithOffers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Admin ilanı onaylar
exports.approveRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "İlan bulunamadı.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Sadece onay bekleyen ilanlar onaylanabilir.",
      });
    }

    request.status = "active";
    request.approvedAt = new Date();
    request.approvedBy = req.user.id;

    // Daha önce reddedilmişse eski red bilgisini temizliyoruz
    request.rejectedAt = undefined;
    request.rejectionReason = "";

    await request.save();
    await createNotification({
  user: request.user,
  title: "İlanın onaylandı",
  message: "İlanın admin tarafından onaylandı ve teklife açıldı.",
  type: "request_approved",
  relatedRequest: request._id,
});

    res.status(200).json({
      success: true,
      data: request,
      message: "İlan onaylandı ve yayına alındı.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Admin ilanı reddeder
exports.rejectRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "İlan bulunamadı.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Sadece onay bekleyen ilanlar reddedilebilir.",
      });
    }

    request.status = "rejected";
    request.rejectedAt = new Date();
    request.rejectionReason =
      req.body.reason || "İlan admin tarafından reddedildi.";

    await request.save();
await createNotification({
  user: request.user,
  title: "İlanın reddedildi",
  message: request.rejectionReason || "İlanın admin tarafından reddedildi.",
  type: "request_rejected",
  relatedRequest: request._id,
});
    res.status(200).json({
      success: true,
      data: request,
      message: "İlan reddedildi.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc İlanı sil
exports.deleteRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "İlan bulunamadı.",
      });
    }

    await ServiceRequest.findByIdAndDelete(req.params.id);

    // İlana gelen teklifleri de temizliyoruz
    await Offer.deleteMany({
      request: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "İlan başarıyla silindi.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};