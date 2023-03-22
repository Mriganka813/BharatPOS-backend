import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../../../utils/errorhandler";
import IncomeModel from "../../../models/income";
// const ErrorHandler = require("../utils/errorhandler");

export const addIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const income=req.body;
  const userDetails = req.user._id;
  req.body.user = userDetails;

  const income = await IncomeModel.create(req.body);

  res.status(201).json({
    success: true,
    message: "Income added successfully",
    income,
  });
};

export const getAllIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allIncome = await IncomeModel.find();

  res.status(200).json({
    success: true,
    allIncome,
  });
};

export const getSingleIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const income = await IncomeModel.findById(req.params.id);

  if (!income) {
    return next(new ErrorHandler("Income not found", 404));
  }

  res.status(200).json({
    success: true,
    income,
  });
};

export const updateIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let income = await IncomeModel.findById(req.params.id);

  if (!income) {
    return next(new ErrorHandler("Income not found", 404));
  }

  income = await IncomeModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    income,
  });
};

export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const income = await IncomeModel.findById(req.params.id);

  if (!income) {
    return next(new ErrorHandler("Income not found", 404));
  }

  await income.remove();

  res.status(200).json({
    success: true,
    message: "Income Deleted Successfully",
  });
};
