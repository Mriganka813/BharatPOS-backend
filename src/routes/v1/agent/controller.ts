import { NextFunction, Request, Response } from "express";
import { Agent } from "src/models/agent";
import { SubscribedUser } from "src/models/subscribed_user";
import { User } from "src/models/user";
import { ErrorHandler } from "src/utils/errorhandler";
import { sendToken } from "src/utils/jwtToken";
import bcryptjs from "bcryptjs";

export const registerAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  sendToken(agent, 201, res);
};

// consumer login
export const loginAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide all the details", 400));
  }
  const agent = await Agent.findOne({ email }).select("+password");
  if (!agent) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  const isMatch = await bcryptjs.compare(agent.password, password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  sendToken(agent, 200, res);
};

// consumer logout
export const logoutAgent = async (
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

// get number of users referred by the agent and their details
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let users = await User.find({
    referredBy: req.user.email,
  }).select("email phoneNumber");

  let temp = [];
  for (let i = 0; i < users.length; i++) {
    const isSubbed = await SubscribedUser.findOne({
      phoneNumber: users[i].phoneNumber,
    });
    if (isSubbed) {
      temp.push({
        phoneNumber: users[i].phoneNumber,
        email: users[i].email,
        isActive: true,
      });
    } else {
      temp.push({
        phoneNumber: users[i].phoneNumber,
        email: users[i].email,
        isActive: false,
      });
    }
  }
  if (!temp) {
    return next(new ErrorHandler("No users Referred yet", 404));
  }
  res.status(200).json({
    success: true,
    data: temp,
  });
};
