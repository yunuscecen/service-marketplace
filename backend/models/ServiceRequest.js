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
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
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
    type: String,
    maxlength: [1000, "Açıklama çok uzun"],
  },

  // İlanın sistemdeki durumu
  status: {
    type: String,
    enum: [
      "pending", // Admin onayı bekliyor
      "active", // Yayında, teklif alınabilir
      "in_progress", // Teklif kabul edildi, iş devam ediyor
      "completed", // İş tamamlandı
      "canceled", // Müşteri/admin iptal etti
      "rejected", // Admin reddetti
    ],
    default: "pending",
  },

  // Admin onay bilgileri
  approvedAt: {
    type: Date,
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // Admin red bilgileri
  rejectedAt: {
    type: Date,
  },

  rejectionReason: {
    type: String,
    default: "",
  },
  // Kabul edilen teklif / anlaşma bilgileri
acceptedOffer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Offer",
},

acceptedProvider: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

agreedPrice: {
  type: Number,
},

agreedDeliveryTime: {
  type: String,
},

acceptedAt: {
  type: Date,
},

completedAt: {
  type: Date,
},

canceledAt: {
  type: Date,
},

  // İleride teklif kabul edildiğinde kullanacağız
  acceptedOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },

  acceptedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  agreedPrice: {
    type: Number,
  },

  agreedDeliveryTime: {
    type: String,
  },

  acceptedAt: {
    type: Date,
  },

  completedAt: {
    type: Date,
  },

  canceledAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);