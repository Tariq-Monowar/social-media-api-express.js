const Post = require("../models/posts.models");
const Notification = require("../models/notification.models")
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "post not found",
      });
    }
    if (content === "") {
      return res.status(400).json({
        message: "commont is null",
      });
    }
    const newComment = {
      content,
      user: userId,
    };
    post.comments.push(newComment);
    await post.save();

    //notification funsonality
    const commentNotification = new Notification({
      notificationSender: userId,
      notificationRecever: post.user._id,
      message: `mentioned you in a comment`,//content.sentence.split(" ").slice(0, 5).join(" ")+"...."
    });
    await commentNotification.save();
    console.log(commentNotification)

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateComment = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "Post not found!",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized to update this comment",
      });
    }

    comment.content = content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "Post not found!",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized to delete this comment",
      });
    }

    // await post.updateOne({ $pull: { comments: { _id: commentId } } });

    post.comments.pull(commentId);
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { createComment, updateComment, deleteComment };
