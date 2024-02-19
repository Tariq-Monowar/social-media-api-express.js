const User = require("../models/users.models");
const Notification = require("../models/notification.models");
const sendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    let { receiverId } = req.body;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    if (senderId === receiverId) {
      return res.status(404).json({
        message: "you don't send request in you",
      });
    }

    //chack Friend request already sent or not
    //chack ther are are already Friend or not
    if (
      sender.friendRequests.includes(receiverId) ||
      receiver.friendRequests.includes(senderId)
    ) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }
    if (
      sender.friends.includes(receiverId) ||
      receiver.friends.includes(senderId)
    ) {
      return res.status(400).json({
        message: "you are already Friend",
      });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();

    //Notification send functionality
    const newNotification = new Notification({
      notificationSender: senderId,
      notificationRecever: receiverId,//*
      message: `You have been sent a friend request`,//*
    });
    await newNotification.save();
    console.log(newNotification);

    res.status(200).json({
      message: "Friend request sent",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};




const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    let { friendId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    //check Friend request is exists or not
    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({
        message: "Friend request not found",
      });
    }

    user.friendRequests = user.friendRequests.filter((id) => {
      return id.toString() !== friendId.toString();
    });

    await user.save();
    res.status(200).json({
      message: "Friend request rejected successfully....",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = req.body.friendId;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({
        message: "User or friend not found",
      });
    }

    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({
        message: "Friend request not found",
      });
    }

    // Add friend to both users' friends list
    user.friends.push(friendId);
    friend.friends.push(userId);

    // Remove friend request from the accepting user
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendId.toString()
    );

    await user.save();
    await friend.save();

    //notification funsonality
    const receiverNotification = new Notification({
      notificationSender: userId,
      notificationRecever: friendId,
      message: `Your friend request has been accepted`,
    });
    await receiverNotification.save();

    console.log(receiverNotification)

    res.status(200).json({
      message: "Friend request accepted",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};



const unfriend = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        message: "friend not found!",
      });
    }

    user.friends = user.friends.filter((id) => {
      return id.toString() !== friendId.toString();
    });
    friend.friends = friend.friends.filter((id) => {
      return id.toString() !== userId.toString();
    });

    await user.save();
    await friend.save();

    res.status(200).json({
      message: "Unfriended successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const friendList = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "friends",
      "userName image location"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const getFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "friendRequests",
      "userName image location"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const mutualFriends = async()=>{
  try {
    const userId = req.userId;
    const friendId = req.params.friendId;

    const user = await User.findById(userId).select("friends");
    const friend = await User.findById(friendId).select("friends");

    if (!user || !friend) {
      return res.status(404).json({
        message: "User or friend not found",
      });
    }

    // Find mutual friends
    const mutualFriends = user.friends.filter((id) =>
      friend.friends.includes(id.toString())
    );

    // Populate mutual friends details
    const mutualFriendsDetails = await User.find({
      _id: { $in: mutualFriends },
    }).select("userName image location");

    res.status(200).json(mutualFriendsDetails);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  sendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
  unfriend,
  friendList,
  getFriendRequests,
  mutualFriends
};
