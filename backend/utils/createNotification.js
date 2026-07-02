const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  title,
  message,
  type = "system",
  relatedRequest,
  relatedOffer,
}) => {
  try {
    if (!user || !title || !message) {
      return null;
    }

    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      relatedRequest,
      relatedOffer,
    });

    return notification;
  } catch (error) {
    console.error("Bildirim oluşturulamadı:", error.message);
    return null;
  }
};

module.exports = createNotification;