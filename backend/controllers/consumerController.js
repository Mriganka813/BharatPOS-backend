const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Consumer = require("../models/consumerModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const ApiFeatures = require("../utils/apiFeatures");

// variable for global clicks counter
let allClicksProducts = 0;
let allClicksSeller = 0;
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
    }).sort("-createdAt"),
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

// tracker
exports.addClickProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const product = await Inventory.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product.clicks = product.clicks + 1;
  allClicksProducts = allClicksProducts + 1;
  await product.save();
  const updProduct = await Inventory.findById(id);
  res.status(200).json({
    success: true,
    message: "Click added",
    data: updProduct,
  });
});

// clicks for sellers
exports.addClickSeller = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const seller = await User.findById(id);
  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }
  seller.clicks = seller.clicks + 1;
  allClicksSeller = allClicksSeller + 1;
  await seller.save();
  const updSeller = await User.findById(id);
  res.status(200).json({
    success: true,
    message: "Click added",
    data: updSeller,
  });
});

// get top clicked products of specific seller
exports.getTopClickedProducts = catchAsyncErrors(async (req, res, next) => {
  const { page = 1 } = req.query;
  const limit = 10;
  let popularProducts = [];
  // check if req.query.keyword is present
  if (!req.query.keyword) {
    return next(new ErrorHandler("Please provide keyword", 400));
  }
  const seller = await User.find({
    address: {
      $regex: req.query.keyword,
      $options: "i",
    },
  });
  if (!seller) {
    return next(new ErrorHandler("Sellers not found", 404));
  }
  for (let i = 0; i < seller.length; i++) {
    const product = await Inventory.find({
      user: seller[i]._id,
    })
      .sort("-clicks")
      .limit(1)
      .populate("user")
      .limit(limit)
      .skip((page - 1) * limit);
    if (product.length > 0) {
      popularProducts.push(product[0]);
    }
  }
  res.status(200).json({
    success: true,
    popularProducts,
  });
});

// get top clicked sellers
exports.getTopClickedSellers = catchAsyncErrors(async (req, res, next) => {
  const sellers = await User.find().sort("-clicks");
  res.status(200).json({
    success: true,
    sellers,
  });
});

// get consumer details from id
exports.getConsumerDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const consumer = await Consumer.findById(id);
  if (!consumer) {
    return next(new ErrorHandler("Consumer not found", 404));
  }
  res.status(200).json({
    success: true,
    consumer,
  });
});

// update consumer details
exports.updateConsumerDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const consumer = await Consumer.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!consumer) {
    return next(new ErrorHandler("consumer not found", 404));
  }
  res.status(200).json({
    success: true,
    consumer,
  });
});


// add to cart

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const qty = req.body.qty;
  console.log(userId);
  console.log(qty);

  const consumer = await Consumer.findById(userId);
  console.log(consumer.cart);
  if (!consumer) {
    console.log("User not found");
  }

  // Create a new cart item
  const newCartItem = {
    productId: productId,
    quantity: qty
  };

  consumer.cart.push(newCartItem);
  const savedConsumer = await consumer.save();

  return res.send(savedConsumer);
});
