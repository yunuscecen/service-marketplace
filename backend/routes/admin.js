const express = require("express");
const {
  getAllUsers,
  toggleSuspendUser,
  getAllRequests,
  deleteRequest,
} = require("../controllers/admin");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

// Kullanıcı Yönetimi
router.get("/users", getAllUsers);
router.put("/users/:id/suspend", toggleSuspendUser);

// İlan Yönetimi
router.get("/requests", getAllRequests);
router.delete("/requests/:id", deleteRequest);

module.exports = router;
