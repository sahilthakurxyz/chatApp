const handleAsyncError = require("./handleAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userSchema");
const isUserAuthenticated = handleAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // const decodedExpTime = decodedData.exp * 1000; // Convert exp time to milliseconds
    // const currentTime = Date.now(); // Get the current timestamp in milliseconds

    // // Calculate the difference in milliseconds
    // const timeDifferenceInMillis = decodedExpTime - currentTime;

    // // Convert the difference from milliseconds to days
    // const differenceInDays = timeDifferenceInMillis / (1000 * 60 * 60 * 24);

    // // Round the result to get the number of full days left
    // const daysLeft = Math.floor(differenceInDays);

    if (Date.now() >= decodedData.exp * 1000) {
      return next(
        new ErrorHandler("Your session has expired. Please login again.", 401)
      );
    }

    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    return next(
      new ErrorHandler("Invalid Authentication. Please login again.", 401)
    );
  }
});

module.exports = { isUserAuthenticated };
