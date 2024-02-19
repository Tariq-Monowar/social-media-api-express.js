require('dotenv').config()
const Post = require("../models/posts.models");
const User = require("../models/users.models");
const Notification = require("../models/notification.models");
const imgbbUploader = require("imgbb-uploader");

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;

    if (content === "") {
      return res.status(400).json({
        message: "content is null",
      });
    }

    const newPost = new Post({
      content,
      user: userId,
    });

    if (req.files && req.files.image) {
      const base64string = req.files.image.data.toString("base64");
      const img = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string,
      });
      newPost.image = img.url;
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// const crtPost = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const userId = req.userId;
//     const newPost = new Post({
//       ...req.body,
//       user: userId,
//     });
//     if (req.files && req.files.image) {
//         newPost.image = {
//           data: req.files.image.data,
//           contentType: req.files.image.mimetype,
//         };
//       }
//     res.status(201).json(newPost);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "userName image");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllFriendsPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const friendsPosts = await Post.find({
      user: { $in: user.friends },
    }).populate("user", "userName image");

    res.status(200).json(friendsPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getMyPostWithAllFriendsPosts = async (req, res) => {
  try {
    const userId = req.userId;
    // Get posts from user's friends, including user's own posts
    const user = await User.findById(userId);

    const friendsPosts = await Post.find({
      user: { $in: [...user.friends, userId] }, // Include user's own ID in the query
    }).populate("user", "userName");

    res.status(200).json(friendsPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const posts = await Post.findById(postId).populate(
      "user",
      "userName image"
    );
    if (!posts) {
      return res.status(400).json({
        message: "Post not found!",
      });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const { content } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized to update Post",
      });
    }

    if (content !== undefined && content === "") {
      return res.status(400).json({
        message: "Content cannot be empty",
      });
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (req.files && req.files.image) {
      const base64string = req.files.image.data.toString("base64");
      const img = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string,
      });
      post.image = img.url;
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized to delete the post",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(400).json({
        message: "Post not found",
      });
    }
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();

      //notification funsonality
      const receiverNotification = new Notification({
        notificationSender: userId,
        notificationRecever: post.user._id,
        message: `Liked your post`,
      });
      await receiverNotification.save();

      console.log(receiverNotification);
    } else {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createPost,
  getAllPost,
  getAllFriendsPosts,
  getMyPostWithAllFriendsPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likeUnlikePost,
};
