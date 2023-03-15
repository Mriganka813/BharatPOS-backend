import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Agent } from "src/models/agent";
import ErrorHandler from "src/utils/errorhandler";
import { Admin } from "src/models/admin";
import { SubscribedUser } from "src/models/subscribed_user";
import { User } from "src/models/user";

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (err) {
    return next(
      new ErrorHandler(
        "Invalid token, please login again or submit old token",
        401
      )
    );
  }
};
// auth for consumer
export const isAuthenticatedConsumer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Consumer.findById(decodedData.id);
    next();
  } catch (err) {
    return next(
      new ErrorHandler(
        "Invalid token, please login again or submit old token",
        401
      )
    );
  }
};

export const isAuthenticatedAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.admin = await Admin.findById(decodedData.id);

  next();
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.admin.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.admin.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};

// for subscribed user checking
export const isSubscribed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    // console.log(req.user.phoneNumber);
    const user = User.findById(decodedData.id);
    if (user === null) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const subbedUser = await SubscribedUser.find({
      phoneNumber: req.user.phoneNumber,
    });
    // console.log(subbedUser);
    if (subbedUser.length === 0) {
      return next(
        new ErrorHandler("Please subscribe to access this resource", 401)
      );
    }
    next();
  } catch (err) {
    return next(
      new ErrorHandler(
        "Invalid token, please login again or submit old token",
        401
      )
    );
  }
};

// auth for agent
export const isAuthenticatedAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Agent.findById(decodedData.id);
    next();
  } catch (err) {
    return next(
      new ErrorHandler(
        "Invalid token, please login again or submit old token",
        401
      )
    );
  }
};
