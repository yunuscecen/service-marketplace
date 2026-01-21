// backend/routes/serviceRequest.js
const express = require("express");
const {
  createRequest,
  getMyRequests,
} = require("../controllers/serviceRequest");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Tüm rotalar korumalı (Giriş şart)
router.use(protect);

router.post("/", createRequest);
router.get("/my-requests", getMyRequests);

module.exports = router;
