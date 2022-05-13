const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const fast2sms = require("fast-two-sms");
const otpGenerator = require("otp-generator");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcryptjs");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");
// const cloudinary = require("cloudinary");

exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const otpHolder = await otpModel.find({
    phoneNumber: req.body.number,
  });

  console.log("OtpHolder", otpHolder)

  if (otpHolder.length === 0) {
    return res.status(400).send("You are using an expired OTP");
  }

  const rightOtpFind = otpHolder[otpHolder.length - 1];

  console.log("right otp", rightOtpFind);
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  console.log("user ",validUser);

  if (rightOtpFind.phoneNumber === req.body.number && validUser) {
    const user = await User.findOne({ phoneNumber: req.body.number });



    // console.log(user);
    // const user = new User(_.pick(req.body, ["phoneNumber"]));
    console.log(user);
    // sendToken(user, 201, res);
    const token =sendToken(user, 201, res);

    console.log(token);

    const result = await user.save();
    const OTPDelete = await otpModel.deleteMany({
      phoneNumber: rightOtpFind.phoneNumber,
    });

    return res.status(200).send({
      message: "User Registration Successful",
      token: token,
      data: result,
    });
  } else {
    return res.status(400).send("Your otp was wrong");
  }
});

exports.signUpWithPhoneNumber = catchAsyncErrors(async (req, res, next) => {
  const userOtp = await User.findOne({
    phoneNumber: req.body.number,
  });

  if (userOtp) {
    res.status(400).json({
      success: true,
      message: "User already registered",
    });
  }

  const OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const phoneNumber = req.body.number;

  console.log(OTP);

  // const otp={
  //   phoneNumber:phoneNumber,
  //   otp:OTP
  // }

  const salt = await bcrypt.genSalt(10);

  let otp = await bcrypt.hash(OTP, salt);

  const Otp = await otpModel.create({
    phoneNumber: phoneNumber,
    otp: otp,
  });

  const { email, password, businessName, businessType, address } =
    req.body;
  const user=await User.create({
    email,
    password,
    businessName,
    businessType,
    address,
    phoneNumber,
  })

  // const result=await otp.save();

  res.status(200).json({
    success: true,
    message: "Otp send successfully",
    Otp,
    user
  });
  // return res.status(200).json("Otp send successfully",Otp);
});

// register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, businessName, businessType, address, phoneNumber } =
    req.body;

  const user = await User.create({
    email,
    password,
    businessName,
    businessType,
    address,
    phoneNumber,
  });

  sendToken(user, 201, res);
});

// Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// update User Role -- Admin
// exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     role: req.body.role,
//   };

//   await User.findByIdAndUpdate(req.params.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//   });
// });

exports.sendOtp = catchAsyncErrors(async (req, res, next) => {
  const response = await fast2sms.sendMessage({
    authorization: process.env.FAST_TWO_SMS,
    message: req.body.message,
    numbers: [req.body.number],
  });

  res.status(200).json({
    success: true,
    response,
  });
});
