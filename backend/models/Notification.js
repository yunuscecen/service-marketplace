const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: [
      "request_approved",
      "request_rejected",
      "new_offer",
      "offer_accepted",
      "request_canceled",
      "system",
    ],
    default: "system",
  },

  relatedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
  },

  relatedOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);