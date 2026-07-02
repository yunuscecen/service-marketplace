// backend/models/Offer.js
const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  provider: {
    // Teklifi veren freelancer
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  request: {
    // Hangi ilana teklif veriliyor?
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Lütfen bir fiyat teklifi giriniz"],
  },
  deliveryTime: {
    // Kaç günde teslim edecek?
    type: String, // Örn: "3 Gün", "1 Hafta"
    required: [true, "Teslimat süresini belirtiniz"],
  },
  message: {
    // "Merhaba, bu işi yapabilirim..."
    type: String,
    required: [true, "Lütfen bir ön yazı yazınız"],
    maxlength: [500, "Mesaj 500 karakteri geçemez"],
  },
 status: {
  type: String,
  enum: ["pending", "accepted", "rejected", "withdrawn"],
  default: "pending",
},

withdrawnAt: {
  type: Date,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Bir freelancer aynı işe birden fazla teklif veremesin (Unique Compound Index)
OfferSchema.index({ provider: 1, request: 1 }, { unique: true });

module.exports = mongoose.model("Offer", OfferSchema);
