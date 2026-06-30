const Chat = require("../models/Chat");
const Message = require("../models/Message");
const ServiceRequest = require("../models/ServiceRequest");
const Offer = require("../models/Offer");

exports.createChat = async (req, res) => {
  try {
    const { receiverId, requestId } = req.body;

    if (!receiverId || !requestId) {
      return res.status(400).json({
        success: false,
        error: "Alıcı ve ilan bilgisi zorunludur.",
      });
    }

    const request = await ServiceRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "İlan bulunamadı.",
      });
    }

    const isOwner = request.user.toString() === req.user.id;
    const isProvider = req.user.role === "provider";

    if (isOwner) {
      // Müşteri sadece o ilana teklif veren provider ile sohbet açabilir.
      const offer = await Offer.findOne({
        request: requestId,
        provider: receiverId,
      });

      if (!offer) {
        return res.status(403).json({
          success: false,
          error: "Bu hizmet veren bu ilana teklif vermemiş.",
        });
      }
    } else if (isProvider) {
      // Provider sadece teklif verdiği ilanın sahibiyle sohbet edebilir.
      if (request.user.toString() !== receiverId) {
        return res.status(403).json({
          success: false,
          error: "Sadece ilan sahibiyle sohbet edebilirsiniz.",
        });
      }

      const offer = await Offer.findOne({
        request: requestId,
        provider: req.user.id,
      });

      if (!offer) {
        return res.status(403).json({
          success: false,
          error: "Sohbet başlatmak için önce teklif vermelisiniz.",
        });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Sohbet başlatma yetkiniz yok.",
      });
    }

    let chat = await Chat.findOne({
      request: requestId,
      participants: {
        $all: [req.user.id, receiverId],
      },
    }).populate("participants", "name email");

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, receiverId],
        request: requestId,
      });

      chat = await chat.populate("participants", "name email");
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Bir sohbetin mesajlarını getir (OKUNDU İŞLEMİ DAHİL)
exports.getMessages = async (req, res) => {
  try {
    // 1. Önce okundu yapalım
    await Message.updateMany(
      {
        chat: req.params.chatId,
        sender: { $ne: req.user.id },
        read: false,
      },
      { $set: { read: true } },
    );

    // 2. Sonra mesajları getirelim
    const messages = await Message.find({ chat: req.params.chatId })
      .sort("createdAt")
      .populate("sender", "name");

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcının tüm sohbetlerini getir (UNREAD COUNT DAHİL)
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "name email")
      .populate({
        path: "request",
        select: "description",
        populate: { path: "service", select: "name" },
      })
      .sort("-updatedAt")
      .lean();

    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user.id },
          read: false,
        });
        return { ...chat, unreadCount };
      }),
    );

    res.status(200).json({ success: true, data: chatsWithUnread });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Mesaj Gönder
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Mesaj içeriği zorunludur.",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id,
    });

    if (!chat) {
      return res.status(403).json({
        success: false,
        error: "Bu sohbete mesaj gönderme yetkiniz yok.",
      });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text,
      read: false,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text,
      updatedAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Mesaj gönderilemedi",
    });
  }
};
