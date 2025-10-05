const handleAsyncError = require("../middleware/handleAsyncError");
const User = require("../models/userSchema.js");
const { v2: cloudinary } = require("cloudinary");
const sendToken = require("../utils/JwtToken.js");
const bcryptjs = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler.js");
const userSchema = require("../models/userSchema.js");
exports.registerUser = handleAsyncError(async (req, res) => {
  const { name, email, password } = req.body;
  let avatarImg = {
    public_id: "public_id",
    url: "default_image_url",
  };

  if (req.files && req.files.avatar) {
    const myCloud = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        folder: "chatApp_avatar",
        width: 150,
        crop: "auto",
      }
    );
    avatarImg = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  await User.create({
    name,
    email,
    password,
    avatar: avatarImg,
  });
  res.status(201).json({
    message: "Register Successfully",
    success: true,
  });
});

exports.checkEmail = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const alreadyExist = await User.findOne({ email }).select("-password");
  if (!alreadyExist) {
    return next(new ErrorHandler("Register Your Account", 404));
  }
  return res.status(200).json({
    message: "Email verified",
    success: true,
    data: alreadyExist,
  });
});

exports.checkPassword = handleAsyncError(async (req, res, next) => {
  const { password, userId } = req.body;
  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new ErrorHandler("Something went Wrong", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Unauthorised password", 401));
  }

  sendToken(user, 200, res);
});

exports.userDetail = handleAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: user,
  });
});

exports.logout = handleAsyncError(async (req, res) => {
  const token = "";
  res.setHeader("Authorization", `Bearer ${token}`);
  res.status(200).json({
    message: "Logout Successfully",
    success: true,
  });
});

exports.updateUser = handleAsyncError(async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ErrorHandler("Name field is Empty", 404));
    }
    const updateUser = {
      name: name,
    };
    const user = await User.findById(req.user._id);
    let avatarImg = {
      public_id: "public_id",
      url: "default_image_url",
    };
    const imageId = await user.avatar.public_id;
    if (imageId && imageId !== "public_id") {
      await cloudinary.uploader.destroy(imageId);
    }
    if (req.files !== null) {
      const myCloud = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        {
          folder: "chatApp_avatar",
          width: 150,
          crop: "auto",
        }
      );
      avatarImg = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    updateUser.avatar = avatarImg;
    await User.findByIdAndUpdate(user._id, updateUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(201).json({
      message: "Update Successfully",
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update", 400));
  }
});

exports.searchUser = handleAsyncError(async (req, res, next) => {
  try {
    const { search } = req.body;
    if (search === "" || search === undefined) {
      return;
    }

    const query = new RegExp(search, "i", "g");
    const user = await userSchema.find({
      $or: [{ name: query }, { email: query }],
    });

    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    next(new ErrorHandler(`Error ${error.message || error}`), 404);
  }
});

exports.uploadMessageMedia = handleAsyncError(async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const file = req?.files?.file;
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE)
      return res.status(400).json({ error: "File must be less then 5MB" });
    if (req.files && req.files.file) {
      const myCloud = await cloudinary.uploader.upload(
        req.files.file.tempFilePath,
        {
          folder: "chat_media",
          resource_type: "auto",
        }
      );
      res.json({ url: myCloud.secure_url });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});
