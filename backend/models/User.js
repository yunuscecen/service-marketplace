// backend/models/User.js - TAM VE DOĞRU HALİ
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- METODLAR BURAYA (module.exports'tan ÖNCE) ---

// 1. Şifreyi Hash'leme (Kaydetmeden hemen önce çalışır)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. JWT Token Üretme (HATA ALDIĞIN KISIM BURASIYDI)
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// 3. Şifre Kontrolü
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- EN SONRA EXPORT EDİYORUZ ---
module.exports = mongoose.model("User", UserSchema);
