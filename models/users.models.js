const { default: mongoose } = require("mongoose");

const userScham = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  conformPassword: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  facebook: {
    type: String,
  },
  linkedin:{
    type: String,
  },
  github:{
    type: String,
  },
  twitter:{
    type: String,
  },
  image: {
    // data: Buffer,
    // contentType: String,
    type: String,
  },
  backgroundImage: {
    type: String,
  },
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdOn:{
    type: Date,
    default: Date.now(),
  }
});


module.exports = mongoose.model("User", userScham)