const routes = require('express').Router()

const { sendRequest, rejectFriendRequest, acceptFriendRequest, unfriend, friendList, getFriendRequests } = require('../controllers/friendship.controllers')
const verifyUser = require('../controllers/verifyUser')


routes.post("/send-request",verifyUser, sendRequest)
routes.post("/reject-request", verifyUser, rejectFriendRequest)
routes.post("/accept-request", verifyUser, acceptFriendRequest)
routes.post("/unfriend", verifyUser, unfriend)
routes.get("/friends-list", verifyUser, friendList)
routes.get("/friend-requests", verifyUser, getFriendRequests)



module.exports = routes