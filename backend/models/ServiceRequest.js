// backend/models/ServiceRequest.js
const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  // Kullanıcının sorulara verdiği cevaplar
  answers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  city: {
    type: String,
    required: [true, "Lütfen şehir seçiniz"],
  },
  district: {
    type: String,
    required: [true, "Lütfen ilçe giriniz"],
  },
  description: {
    // Ekstra notlar
    type: String,
    maxlength: [1000, "Açıklama çok uzun"],
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending", // pending: Onay bekliyor, active: Tekliflere açık
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
