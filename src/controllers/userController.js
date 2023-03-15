const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const fast2sms = require("fast-two-sms");
const otpGenerator = require("otp-generator");
const otpModel = require("../models/otp");
const bcrypt = require("bcryptjs");
const subscribedUsersModel = require("../models/subscribed_user");
const upload = require("../services/upload");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");
// const cloudinary = require("cloudinary");

export const verifyOtp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const otpHolder = await otpModel.find({
      phoneNumber: req.body.number,
    });

    console.log("OtpHolder", otpHolder);

    if (otpHolder.length === 0) {
      return res.status(400).send("You are using an expired OTP");
    }

    const rightOtpFind = otpHolder[otpHolder.length - 1];

    console.log("right otp", rightOtpFind);
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    console.log("user ", validUser);

    if (rightOtpFind.phoneNumber === req.body.number && validUser) {
      const user = await User.findOne({ phoneNumber: req.body.number });

      // console.log(user);
      // const user = new User(_.pick(req.body, ["phoneNumber"]));
      console.log(user);
      // sendToken(user, 201, res);
      const token = sendToken(user, 201, res);

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
  }
);

export const signUpWithPhoneNumber = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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

    const { email, password, businessName, businessType, address } = req.body;
    const data = await User.findOne({ phoneNumber: phoneNumber });
    if (data) {
      return next(
        new ErrorHandler(
          "Phone Number already registered , Sign In instead",
          400
        )
      );
    }
    const user = await User.create({
      email,
      password,
      businessName,
      businessType,
      address,
      phoneNumber,
    });

    // const result=await otp.save();

    res.status(200).json({
      success: true,
      message: "Otp send successfully",
      Otp,
      user,
    });
    // return res.status(200).json("Otp send successfully",Otp);
  }
);

// register user
export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.files?.image) {
      const result = await upload(req.files.image);
      req.body.image = result.url;
    }
    console.log(req.body.phoneNumber);
    const data = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (data) {
      return next(
        new ErrorHandler(
          "Phone Number already registered , Sign In instead",
          400
        )
      );
    }

    const user = await User.create({ ...req.body });
    const subbed = await subscribedUsersModel.create({
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    });

    sendToken(user, 201, res);
  }
);

// Login user
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
  }
);

// logout user
export const logout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  }
);

// Get User Detail
export const getUserDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const updatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export const updateProfile = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export const getAllUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  }
);

// update User Role -- Admin
// export const updateUserRole = catchAsyncErrors(async (req:Request, res:Response,next:NextFunction) => {
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

export const sendOtp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await fast2sms.sendMessage({
      authorization: process.env.FAST_TWO_SMS,
      message: req.body.message,
      numbers: [req.body.number],
    });

    res.status(200).json({
      success: true,
      response,
    });
  }
);

export const refreshJwtToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }
    const data = jwt.decode(token);
    const user = await User.findById(data.id);
    sendToken(user, 200, res);
  }
);

export const resetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, confirmPassword, phoneNumber } = req.body;
    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  }
);
