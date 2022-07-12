const Agent = require("../models/agentModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Consumer = require("../models/consumerModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

exports.registerAgent = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return next(new ErrorHandler("Please provide all the details", 400));
    }
    const agent = await Agent.create({
      name,
      email,
      password,
      phoneNumber,
    });
    const token = consumer.getJWTToken();
    sendToken(agent, 201, res);
  });
  
  // consumer login
  exports.loginAgent = catchAsyncErrors(async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return next(new ErrorHandler("Please provide all the details", 400));
    }
    const consumer = await Consumer.findOne({ phoneNumber }).select("+password");
    if (!consumer) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }
    const isMatch = await consumer.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }
    sendToken(consumer, 200, res);
  });
  
  // consumer logout
  exports.logoutAgent = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });