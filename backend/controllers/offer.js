const Offer = require("../models/Offer");
const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");

// --- KRİTİK EKSİK BURASIYDI: Modelleri ekledik ---
const Chat = require("../models/Chat");
const Message = require("../models/Message");
// ------------------------------------------------

// @desc    İlana Teklif Ver
exports.createOffer = async (req, res, next) => {
  try {
    const { requestId, price, deliveryTime, message } = req.body;

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

    providerUser.offerLimit -= 1;
    await providerUser.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getOffersForRequest = async (req, res, next) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.requestId);
    if (!serviceRequest) {
      return res.status(404).json({ success: false, error: "İlan bulunamadı" });
    }

    let filter = { request: req.params.requestId };

    if (serviceRequest.user.toString() !== req.user.id) {
      filter.provider = req.user.id;
    }

    const offers = await Offer.find(filter)
      .populate("provider", "name email phone") // Telefonu da ekledik
      .sort("-createdAt");

    // --- KRİTİK EKLEME: MÜŞTERİ İÇİN OKUNMAMIŞLARI SAY ---
    // ... offer.js içindeki getMyOffers fonksiyonu
    const offersWithUnread = await Promise.all(
      offers.map(async (offer) => {
        const chat = await Chat.findOne({
          request: offer.request?._id,
          participants: req.user.id,
        });

        let unreadCount = 0;
        let chatId = null; // Sohbet ID'sini ekliyoruz

        if (chat) {
          chatId = chat._id; // ID'yi aldık
          unreadCount = await Message.countDocuments({
            chat: chat._id,
            sender: { $ne: req.user.id },
            read: false,
          });
        }

        return {
          ...offer.toObject(),
          unreadCount,
          chatId, // Bunu frontend'e gönderiyoruz
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: offersWithUnread.length,
      data: offersWithUnread, // Frontend artık sayıları alacak
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Teklifi Kabul Et
exports.acceptOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, error: "Teklif bulunamadı" });
    }

    const request = await ServiceRequest.findById(offer.request);

    if (request.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error:
          "Bu işlem için yetkiniz yok. Sadece ilan sahibi teklifi kabul edebilir.",
      });
    }

    if (request.status === "completed" || request.status === "in_progress") {
      return res.status(400).json({
        success: false,
        error: "Bu iş için zaten bir anlaşma yapılmış.",
      });
    }

    offer.status = "accepted";
    await offer.save();

    await Offer.updateMany(
      { request: request._id, _id: { $ne: offer._id } },
      { status: "rejected" },
    );

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

// @desc    Hizmet Verenin Kendi Verdiği Teklifleri Getir
exports.getMyOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ provider: req.user.id })
      .populate({
        path: "request",
        select: "status city district createdAt",
        populate: {
          path: "service",
          select: "name",
        },
      })
      .sort("-createdAt");

    const offersWithUnread = await Promise.all(
      offers.map(async (offer) => {
        // Chat modelini artık yukarıda import ettiğimiz için hata vermeyecek
        const chat = await Chat.findOne({
          request: offer.request?._id,
          participants: req.user.id,
        });

        let unreadCount = 0;
        if (chat) {
          unreadCount = await Message.countDocuments({
            chat: chat._id,
            sender: { $ne: req.user.id },
            read: false,
          });
        }

        return {
          ...offer.toObject(),
          unreadCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: offersWithUnread.length,
      data: offersWithUnread,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
