const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .populate("relatedRequest", "status city district")
      .populate("relatedOffer", "price status")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Bildirimler getirilemedi.",
    });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Bildirim bulunamadı.",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
      message: "Bildirim okundu olarak işaretlendi.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Bildirim güncellenemedi.",
    });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Tüm bildirimler okundu olarak işaretlendi.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Bildirimler güncellenemedi.",
    });
  }
};