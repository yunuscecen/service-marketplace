// backend/routes/review.js
const express = require("express");
const { createReview, getProviderReviews } = require("../controllers/review");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Yorum yapmak için giriş şart
router.post("/", protect, createReview);

// Yorumları okumak herkese açık
router.get("/provider/:providerId", getProviderReviews);

module.exports = router;
