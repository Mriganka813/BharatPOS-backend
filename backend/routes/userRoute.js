const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  updatePassword,
  updateProfile,
  sendOtp,
  verifyOtp,
  signUpWithPhoneNumber,
  resetPassword
} = require("../controllers/userController");
const cntlr = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
//
const router = express.Router();

router.route("/registration").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, isSubscribed, getUserDetails);

router.route("/get-token").get(cntlr.refreshJwtToken);

router.route("/password/update").put(isAuthenticatedUser, isSubscribed, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, isSubscribed, updateProfile);

router.route("/signup/verifyotp").post(verifyOtp);

router.route("/signup/otp").post(signUpWithPhoneNumber);

router.route("/password/reset").put(resetPassword);

module.exports = router;
