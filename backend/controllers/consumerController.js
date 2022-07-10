const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Consumer = require("../models/consumerModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const ApiFeatures = require("../utils/apiFeatures");
// registering consumer
exports.registerConsumer = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!name || !email || !password || !phoneNumber) {
    return next(new ErrorHandler("Please provide all the details", 400));
  }
  const consumer = await Consumer.create({
    name,
    email,
    password,
    phoneNumber,
  });
  const token = consumer.getJWTToken();
  sendToken(consumer, 201, res);
});

// consumer login
exports.loginConsumer = catchAsyncErrors(async (req, res, next) => {
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
exports.consumerLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// get contact number of seller
exports.getContactNumber = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user.phoneNumber,
  });
});

// get sellers and search according to location
exports.getSellersAndSearch = catchAsyncErrors(async (req, res, next) => {
  // const { city, state, country } = req.body;

  const apiFeature = new ApiFeatures(
    User.find({
      address: {
        $regex: req.query.keyword,
        $options: "i",
      },
    }),
    req.query
  ).pagination(50);
  const sellers = await apiFeature.query;
  if (!sellers) {
    return next(new ErrorHandler("No sellers found", 404));
  }
  res.status(200).json({
    success: true,
    data: sellers,
  });
});

// get all sellers from inventory where category is matched
exports.getSellers = catchAsyncErrors(async (req, res, next) => {
  const { category } = req.query;
  if (!category) {
    return next(new ErrorHandler("Please provide category", 400));
  }

  const apiFeature = new ApiFeatures(
    User.find({
      businessType: {
        $regex: category,
        $options: "i",
      },
    }),
    req.query
  ).pagination(10);
  const sellers = await apiFeature.query;
  if (!sellers) {
    return next(new ErrorHandler("No sellers found", 404));
  }
  res.status(200).json({
    success: true,
    data: sellers,
  });
});

// get all products from a user
exports.getProductsOfUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ErrorHandler("Please provide id as query param", 400));
  }
  const seller = await User.findById(id);
  if (!seller) {
    return next(new ErrorHandler("User not found", 404));
  }
  const apiFeature = new ApiFeatures(
    Inventory.find({
      user: id,
    }),
    req.query
  ).pagination(10);
  const products = await apiFeature.query;
  if (!products) {
    return next(new ErrorHandler("No products found", 404));
  }
  res.status(200).json({
    success: true,
    data: products,
  });
});

// get all sellers and search by name :
exports.getSellersByName = catchAsyncErrors(async (req, res, next) => {
  const key = req.query.keyword
    ? {
        businessName: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const apiFeature = new ApiFeatures(User.find(key), req.query).pagination(10);
  const sellers = await apiFeature.query;
  res.status(200).json({
    success: true,
    sellers,
  });
});

// get all names of products
exports.getProductNamesandSearch = catchAsyncErrors(async (req, res, next) => {
  const key = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const products = await Inventory.find(key).select("name");
  res.status(200).json({
    success: true,
    products,
  });
});
