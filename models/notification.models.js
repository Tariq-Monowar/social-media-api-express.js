const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notificationRecever: { //যার কাছে পাঠানো হবে
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notificationSender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

  module.exports = mongoose.model("Notification", notificationSchema);
  