const {
  createPost,
  getAllPost,
  getAllFriendsPosts,
  getMyPostWithAllFriendsPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likeUnlikePost,
} = require("../controllers/posts.controllers");
const verifyUser = require("../controllers/verifyUser");

const router = require("express").Router();

router.post("/", verifyUser, createPost);
router.get("/", getAllPost);
router.get("/friends", verifyUser, getAllFriendsPosts);
router.get("/friend-me", verifyUser, getMyPostWithAllFriendsPosts);
router.get("/:id", getSinglePost);
router.patch("/:id", verifyUser, updatePost);
router.delete("/:id", verifyUser, deletePost);
router.post("/like/:id", verifyUser, likeUnlikePost)

module.exports = router;
