// backend/models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Lütfen yorum başlığı giriniz"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Lütfen yorumunuzu yazınız"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Lütfen 1-5 arası bir puan veriniz"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // İlişkiler
  serviceRequest: {
    // Hangi iş için?
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  user: {
    // Yorumu yazan (Müşteri)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    // Yorum yapılan (Hizmet Veren)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Bir müşteri, aynı işe sadece 1 yorum yapabilsin
ReviewSchema.index({ serviceRequest: 1, user: 1 }, { unique: true });

// --- ORTALAMA PUAN HESAPLAMA (Statik Metod) ---
ReviewSchema.statics.getAverageRating = async function (providerId) {
  const obj = await this.aggregate([
    {
      $match: { provider: providerId },
    },
    {
      $group: {
        _id: "$provider",
        averageRating: { $avg: "$rating" },
        ratingCount: { $sum: 1 }, // Toplam yorum sayısını bul
      },
    },
  ]);

  try {
    // User modelini güncelle
    await mongoose.model("User").findByIdAndUpdate(providerId, {
      averageRating: obj[0] ? obj[0].averageRating.toFixed(1) : 0, // Örn: 4.5
      ratingCount: obj[0] ? obj[0].ratingCount : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Yorum EKLENDİKTEN sonra ortalamayı güncelle
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.provider);
});

// Yorum SİLİNDİKTEN/GÜNCELLENDİKTEN sonra (İleride lazım olursa)
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.provider);
});

module.exports = mongoose.model("Review", ReviewSchema);
