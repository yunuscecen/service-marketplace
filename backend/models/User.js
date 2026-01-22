// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen bir isim giriniz"],
    trim: true,
    maxlength: [50, "İsim 50 karakterden uzun olamaz"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Lütfen geçerli bir email adresi giriniz",
    ],
    unique: true,
    required: [true, "Lütfen bir email giriniz"],
  },
  role: {
    type: String,
    enum: ["user", "provider", "admin", "support", "marketing"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Lütfen bir şifre giriniz"],
    minlength: 6,
    select: false,
  },
  // Puanlama Sistemi
  averageRating: {
    type: Number,
    min: [0, "Puan en az 0 olabilir"],
    max: [5, "Puan en fazla 5 olabilir"],
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  offerLimit: {
    type: Number,
    default: 0, // Başlangıçta 0 teklif hakkı
  },
  phone: {
    type: String,
    required: [true, "Lütfen bir telefon numarası giriniz"],
    unique: true, // Aynı numarayla birden fazla kayıt olmasın
    trim: true,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  // Tarih Bilgisi
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// --- METODLAR ---

// 1. Şifre Hashleme
UserSchema.pre("save", async function () {
  // Eğer şifre değişmemişse fonksiyondan çık
  if (!this.isModified("password")) {
    return; // next() yerine direkt return diyoruz
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. JWT Token Üretme
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// 3. Şifre Doğrulama
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
