// backend/routes/service.js
const express = require("express");
const {
  getServices,
  createService,
  getService,
  updateService, // <-- Eklendi
  deleteService, // <-- Eklendi
} = require("../controllers/service");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Herkes okuyabilir, sadece Admin ekleyebilir
router
  .route("/")
  .get(getServices)
  .post(protect, authorize("admin"), createService);

// ID işlemleri
router
  .route("/:id")
  .get(getService)
  .put(protect, authorize("admin"), updateService) // <-- Güncelleme Rotası
  .delete(protect, authorize("admin"), deleteService); // <-- Silme Rotası

module.exports = router;
