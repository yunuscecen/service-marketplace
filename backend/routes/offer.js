// backend/routes/offer.js

const express = require("express");
// getMyOffers'ı import etmeyi UNUTMA!
const {
  createOffer,
  getOffersForRequest,
  acceptOffer,
  getMyOffers,
} = require("../controllers/offer");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("provider", "admin"), createOffer);

// --- YENİ EKLENEN KISIM ---
// (DİKKAT: :id parametrelerinden önce gelmeli)
router.get("/my-offers", authorize("provider"), getMyOffers);
// --------------------------

router.get("/request/:requestId", getOffersForRequest);
router.put("/:id/accept", acceptOffer);

module.exports = router;
