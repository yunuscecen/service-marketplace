const Chat = require("../models/Chat");
const Message = require("../models/Message");

// @desc    Sohbet odası oluştur veya var olanı getir
exports.createChat = async (req, res) => {
  try {
    const { receiverId, requestId } = req.body;

    // Daha önce bu iş için bu iki kişi arasında oda açılmış mı?
    let chat = await Chat.findOne({
      request: requestId,
      participants: { $all: [req.user.id, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, receiverId],
        request: requestId,
      });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Bir sohbetin mesajlarını getir
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort("createdAt")
      .populate("sender", "name");
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kullanıcının tüm sohbetlerini getir (Mesajlar listesi sayfası için)
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "name email")
      .populate("request", "description")
      .sort("-updatedAt");
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      chat: req.body.chatId,
      sender: req.user.id,
      text: req.body.text,
    });

    // Sohbetin son mesajını güncelle
    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastMessage: req.body.text,
      updatedAt: Date.now(),
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
