const routes = require('express').Router()

const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require("../controllers/notification.controllers");
const verifyUser = require('../controllers/verifyUser')

routes.get("/", verifyUser, getNotifications);
routes.put("/mark-as-read/",verifyUser, markAsRead);
routes.delete("/delete/:id",verifyUser, deleteNotification);

module.exports = routes;
