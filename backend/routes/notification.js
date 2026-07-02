const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notification");

const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/read-all", markAllNotificationsAsRead);
router.put("/:id/read", markNotificationAsRead);

module.exports = router;