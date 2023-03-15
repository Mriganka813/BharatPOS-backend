import { NextFunction, Request, Response } from "express";
import { Consumer } from "src/models/consumer";
import { Inventory } from "src/models/inventory";
import { User } from "src/models/user";
import ApiFeatures from "src/utils/apiFeatures";
import { ErrorHandler } from "src/utils/errorhandler";
import { sendToken } from "src/utils/jwtToken";
import bcryptjs from "bcryptjs";
// variable for global clicks counter
let allClicksProducts = 0;
let allClicksSeller = 0;
// registering consumer
export const registerConsumer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  //   const token = jwt.sign({ id: consumer.id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRE,
  //   });
  sendToken(consumer, 201, res);
};

// consumer login
export const loginConsumer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return next(new ErrorHandler("Please provide all the details", 400));
  }
  const consumer = await Consumer.findOne({ phoneNumber }).select("+password");
  if (!consumer) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  const isMatch = await bcryptjs.compare(consumer.password, password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  sendToken(consumer, 200, res);
};

// consumer logout
export const consumerLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// get contact number of seller
export const getContactNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user.phoneNumber,
  });
};

// get sellers and search according to location
export const getSellersAndSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// get all sellers from inventory where category is matched
export const getSellers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// get all products from a user
export const getProductsOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// get all sellers and search by name :
export const getSellersByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// get all names of products
export const getProductNamesandSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// tracker
export const addClickProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// clicks for sellers
export const addClickSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

// get top clicked products of specific seller
export const getTopClickedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      .skip(((page as number) - 1) * limit);
    if (product.length > 0) {
      popularProducts.push(product[0]);
    }
  }
  res.status(200).json({
    success: true,
    popularProducts,
  });
};

// get top clicked sellers
export const getTopClickedSellers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sellers = await User.find().sort("-clicks");
  res.status(200).json({
    success: true,
    sellers,
  });
};

// get consumer details from id
export const getConsumerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const consumer = await Consumer.findById(id);
  if (!consumer) {
    return next(new ErrorHandler("Consumer not found", 404));
  }
  res.status(200).json({
    success: true,
    consumer,
  });
};

// update consumer details
export const updateConsumerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
