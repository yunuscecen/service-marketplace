const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Okunma durumu: Varsayılan olarak false (okunmadı)
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Okunmamış mesajları sayarken performansı artırmak için index ekleyelim
MessageSchema.index({ chat: 1, read: 1 });

module.exports = mongoose.model("Message", MessageSchema);
