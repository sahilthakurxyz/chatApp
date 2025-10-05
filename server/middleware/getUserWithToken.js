const User = require("../models/userSchema.js");
const jwt = require("jsonwebtoken");
const getUserWithToken = async (token) => {
  if (!token) {
    return {
      message: "session expire or token missing",
      success: false,
    };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        message: "User not found",
        success: false,
      };
    }
    return {
      user,
      success: true,
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("Token has expired:", err.message);
      return {
        message: "Token Expired",
        success: false,
      };
    } else {
      console.error("Invalid token:", err.message);
      return {
        message: "invalid token",
        success: false,
      };
    }
  }
};
module.exports = { getUserWithToken };
