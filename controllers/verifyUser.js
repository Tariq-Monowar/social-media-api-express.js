const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({
      message: "Unauthorized user",
    });
  }

  try {
    const decodedToken = await verify(token, process.env.SECRET_KEY);
    const { userEmail, userId } = decodedToken;
    req.userEmail = userEmail;
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = verifyUser;
