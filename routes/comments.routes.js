const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments.controllers");

const verifyUser = require("../controllers/verifyUser");

const routes = require("express").Router();

routes.post("/:id", verifyUser, createComment);
routes.put("/:id/update/:commentId", verifyUser, updateComment);
routes.delete("/:id/delete/:commentId", verifyUser, deleteComment);

module.exports = routes;
