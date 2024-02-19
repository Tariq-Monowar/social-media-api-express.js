require("dotenv").config();
const User = require("../models/users.models");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const imgbbUploader = require("imgbb-uploader");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const createUser = async (req, res) => {
  let { userName, email, password, conformPassword } = req.body;
  try {
    if (!(userName && email && password && conformPassword)) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    userName = userName.replace(/\s+/g, " ").trim();

    //Email...
    const exuser = await User.findOne({ email });

    if (exuser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (email === userName) {
      return res.status(400).json({
        message: "Email cannot be the same as your username",
      });
    }

    //password...
    if (password !== conformPassword) {
      return res.status(400).json({
        message: "Password does not match confirm password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be longer than 6 characters",
      });
    }

    if (password === userName || password === email) {
      return res.status(400).json({
        message: "Password cannot be the same as your username or email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConformPassword = await bcrypt.hash(conformPassword, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      conformPassword: hashedConformPassword,
    });

    if (req.files && req.files.image) {
      const base64string = req.files.image.data.toString("base64");
      const img = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string,
      });
      newUser.image = img.url;
    }

    if (req.files && req.files.backgroundImage) {
      const base64string = req.files.backgroundImage.data.toString("base64");
      const img = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string,
      });
      newUser.backgroundImage = img.url;
    }

    const token = sign(
      { userEmail: newUser.email, userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    await newUser.save();
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const updateUserProfile = async (req, res) => {
  try {
    let { userName, email, password, location, facebook, linkedin, github, twitter } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        message: `User not found`,
      });
    }

    if (userName) {
      user.userName = userName.replace(/\s+/g, " ").trim();
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      const exUsers = await User.findOne({ email });
      if (exUsers && exUsers._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      if (email === userName && email === password) {
        return res.status(400).json({
          message: "Email cannot be the same as your username or password",
        });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be longer than 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      user.conformPassword = hashedPassword;
    }

    if(location){
      user.location = location;
    }

    if(facebook){
      user.facebook = facebook;
    }

    if(linkedin){
      user.linkedin = linkedin;
    }

    if(github){
      user.github = github;
    }

    if(twitter){
      user.twitter = twitter;
    }
    
    if (req.files && req.files.image) {
      const base64string = req.files.image.data.toString("base64");
      const img = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string,
      });
      user.image = img.url;
    }
    // backgroundImage
    if (req.files && req.files.backgroundImage) {
      const base64string = req.files.backgroundImage.data.toString("base64");
      const img = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string,
      });
      user.backgroundImage = img.url;
    }

    const updatedUser = await user.save();
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: `users not found!`,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = sign(
      { userEmail: user.email, userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const findUser = await User.findById(userId).select(
      "-conformPassword -password"
    );

    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(findUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    res.status(201).json({
      message: "Successfully deleted user....",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports = {
  getAllUsers,
  createUser,
  updateUserProfile,
  loginUser,
  getUserProfile,
  deleteUserAccount,
};
