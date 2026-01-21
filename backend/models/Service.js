// backend/models/Service.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen hizmet adını giriniz"],
    unique: true,
    trim: true,
    maxlength: [50, "Hizmet adı 50 karakterden uzun olamaz"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Lütfen bir açıklama giriniz"],
    maxlength: [500, "Açıklama 500 karakterden uzun olamaz"],
  },
  icon: {
    type: String,
    default: "default-icon.png",
  },
  // --- YENİ EKLENEN KISIM: SORULAR ---
  questions: [
    {
      questionText: { type: String, required: true }, // Örn: "Proje Tipi Nedir?"
      inputType: { type: String, default: "select" }, // Örn: "select" (seçmeli), "text" (yazı), "radio"
      options: [String], // Eğer seçmeliyse seçenekler: ["Kurumsal", "E-ticaret", "Blog"]
    },
  ],
  // ------------------------------------
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Service", ServiceSchema);
