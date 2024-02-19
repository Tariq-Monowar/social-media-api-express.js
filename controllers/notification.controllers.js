const Notification = require("../models/notification.models");

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({
        notificationRecever: userId,
    })
    .populate('notificationSender', 'userName image')
    .sort({ createdAt: -1 })

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    await Notification.updateMany(
      { notificationRecever: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: `notifications marked as read.`,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    res.status(201).json({
      message: "Notification delete successfully....",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports = { getNotifications, markAsRead, deleteNotification };
