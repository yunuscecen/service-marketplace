const express = require("express");

const {
  getAllUsers,
  toggleSuspendUser,
  getAllRequests,
  approveRequest,
  rejectRequest,
  deleteRequest,
} = require("../controllers/admin");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

// Kullanıcı yönetimi
router.get("/users", getAllUsers);
router.put("/users/:id/suspend", toggleSuspendUser);

// İlan yönetimi
router.get("/requests", getAllRequests);
router.put("/requests/:id/approve", approveRequest);
router.put("/requests/:id/reject", rejectRequest);
router.delete("/requests/:id", deleteRequest);

module.exports = router;