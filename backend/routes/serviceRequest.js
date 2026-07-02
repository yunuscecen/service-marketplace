const express = require("express");
// getOpenRequests'i import listesine eklemeyi UNUTMA!
const {
  createRequest,
  getMyRequests,
  getRequest,
  getOpenRequests,
  completeRequest,
  cancelRequest,
} = require("../controllers/serviceRequest");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.post("/", createRequest);
router.get("/my-requests", getMyRequests);

// --- YENİ EKLENEN KISIM ---
// ÖNEMLİ: Bu satırı '/:id' satırından ÖNCE yazmalısın!
// Yoksa sistem 'feed' kelimesini bir ID zanneder.
router.get("/feed", getOpenRequests);
// --------------------------

router.get("/:id", getRequest);
router.put("/:id/complete", completeRequest);
router.put("/:id/cancel", cancelRequest);

module.exports = router;
