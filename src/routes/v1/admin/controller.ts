import { Admin } from "src/models/admin";
import { Request, Response, NextFunction } from "express";
import { User } from "src/models/user";
import { ErrorHandler } from "src/utils/errorhandler";
import { sendToken } from "src/utils/jwtToken";
import { Sale } from "src/models/sale";
import { Inventory } from "src/models/inventory";
import { Purchase } from "src/models/purchase";
import { Expense } from "src/models/expense";
import bcryptjs from "bcryptjs";
// creating admin
export const createAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  sendToken(admin, 201, res);
};

// admin login
export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await bcryptjs.compare(admin.password, password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(admin, 200, res);
};

// admin logout
export const logout = async (_req: Request, res: Response) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// get all user details
export const getAllUserDetailsAdmin = async (_req: Request, res: Response) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
};

// for consumer
export const getAllUserDetails = async (_req: Request, res: Response) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
};

// get single user details
export const getSingleUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
};

// update User Role -- Admin
export const updateUserRole = async (req: Request, res: Response) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
};

// / Delete User
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { securityKey } = req.query;
  if (!securityKey) {
    return next(new ErrorHandler("Please enter security key", 400));
  }
  if (securityKey !== process.env.SECURITY_KEY) {
    return next(new ErrorHandler("Invalid security key", 400));
  }
  if (securityKey === process.env.SECURITY_KEY) {
    const user = await User.find({
      email: req.query.email,
    });
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
    await user[0].remove();
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  }
};

// get report of users
export const getReportofUserAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type } = req.query;
  if (!type) {
    return next(new ErrorHandler("Please enter type", 400));
  }
  const user1 = await User.find({ email: req.query.email });
  if (!user1) {
    return next(
      new ErrorHandler(
        "User does not exist with email: " + req.query.email,
        400
      )
    );
  }
  const user = user1[0]._id;
  if (type == "sale") {
    const sales = await Sale.find({
      user: user,
    }).populate([
      {
        path: "orderItems",
        populate: { path: "product", model: Inventory },
      },
    ]);
    res.status(200).json({
      success: true,
      sales,
    });
  }
  if (type == "purchase") {
    const purchase = await Purchase.find({
      user: user,
    }).populate({
      path: "orderItems",
      populate: { path: "product", model: Inventory },
    });
    res.status(200).json({
      success: true,

      purchase,
    });
  }

  if (type == "expense") {
    const expense = await Expense.find({
      user: user,
    });
    res.status(200).json({
      success: true,
      expense,
    });
  }
};
