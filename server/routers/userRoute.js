const express = require("express");
const {
  registerUser,
  checkEmail,
  checkPassword,
  userDetail,
  logout,
  updateUser,
  searchUser,
  uploadMessageMedia,
} = require("../controller/userController");
const { isUserAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/email").post(checkEmail);
router.route("/password").post(checkPassword);
router.route("/user-detail").get(isUserAuthenticated, userDetail);
router.route("/update-user").put(isUserAuthenticated, updateUser);
router.route("/logout").get(isUserAuthenticated, logout);
router.route("/search-user").post(searchUser);
router.route("/chat-media").post(uploadMessageMedia);
module.exports = router;
