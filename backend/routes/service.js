// backend/routes/service.js
const express = require("express");
const { getServices, createService } = require("../controllers/service");

// Middleware'leri çağır
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// '/' rotası (yani /api/v1/services)
router
  .route("/")
  .get(getServices) // GET isteği herkese açık
  .post(protect, authorize("admin"), createService);
// POST isteği için önce giriş yapmalı (protect), SONRA rolü 'admin' olmalı

module.exports = router;
