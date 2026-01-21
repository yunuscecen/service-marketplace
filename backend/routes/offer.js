// backend/routes/offer.js
const express = require("express");
const {
  createOffer,
  getOffersForRequest,
  acceptOffer,
} = require("../controllers/offer");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use(protect); // Herkes giriş yapmalı

// Teklif verme: Sadece 'provider' veya 'admin'
router.post("/", authorize("provider", "admin"), createOffer);

// Teklifleri görme: İlan sahibi görecek (Controller'da kontrol edilebilir ama şimdilik açık bırakalım)
router.get("/request/:requestId", getOffersForRequest);
router.put("/:id/accept", acceptOffer);

module.exports = router;
