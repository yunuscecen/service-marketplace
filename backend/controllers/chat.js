const Chat = require("../models/Chat");
const Message = require("../models/Message");

// @desc    Sohbet odası oluştur veya var olanı getir
exports.createChat = async (req, res) => {
  try {
    const { receiverId, requestId } = req.body;

    let chat = await Chat.findOne({
      request: requestId,
      participants: { $all: [req.user.id, receiverId] },
    }).populate("participants", "name phone email"); // Bilgileri önceden çekelim

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, receiverId],
        request: requestId,
      });
      // Yeni oluşturulanı da dolduralım
      chat = await chat.populate("participants", "name phone email");
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
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
      .populate("participants", "name email phone")
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
    const message = await Message.create({
      chat: req.body.chatId,
      sender: req.user.id,
      text: req.body.text,
      read: false,
    });

    // Sohbetin son durumunu güncelle (Sıralama için kritik)
    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastMessage: req.body.text,
      updatedAt: Date.now(),
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, error: "Mesaj gönderilemedi" });
  }
};
