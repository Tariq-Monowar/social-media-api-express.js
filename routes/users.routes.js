const {
  getAllUsers,
  createUser,
  updateUserProfile,
  loginUser,
  getUserProfile,
  deleteUserAccount,
} = require("../controllers/users.controllers");
const verifyUser = require("../controllers/verifyUser");

const routes = require("express").Router();

routes.get("/", getAllUsers);
routes.get("/profile", verifyUser, getUserProfile);
routes.post("/", createUser);
routes.post("/login", loginUser);
routes.patch("/", verifyUser, updateUserProfile);
routes.delete("/", verifyUser, deleteUserAccount);

module.exports = routes;
