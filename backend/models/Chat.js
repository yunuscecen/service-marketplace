const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest" },
  lastMessage: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
