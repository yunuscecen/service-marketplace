const express = require("express");
const router = express.Router();
const {
  createChat,
  getMessages,
  getMyChats,
  sendMessage,
} = require("../controllers/chat");

// DOĞRU YOL: 'middleware' değil 'middlewares' olmalıydı.
const { protect } = require("../middlewares/auth");

router.post("/", protect, createChat);
router.get("/", protect, getMyChats);
router.get("/:chatId/messages", protect, getMessages);
router.post("/message", protect, sendMessage);

module.exports = router;
