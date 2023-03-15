const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ExpenseModel = require("../models/expense");

export const addExpense = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // const income=req.body;
    const userDetails = req.user._id;
    req.body.user = userDetails;

    const expense = await ExpenseModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  }
);

export const getAllExpense = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const allExpense = await ExpenseModel.find({ user: user }).sort(
      "-createdAt"
    );
    res.status(200).json({
      success: true,
      allExpense,
    });
  }
);

export const getSingleExpense = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return next(new ErrorHandler("Expense not found", 404));
    }

    res.status(200).json({
      success: true,
      expense,
    });
  }
);

export const updateExpense = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return next(new ErrorHandler("Income not found", 404));
    }

    expense = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      expense,
    });
  }
);

export const deleteExpense = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return next(new ErrorHandler("Expense not found", 404));
    }

    await expense.remove();
    res.status(200).json({
      success: true,
      message: "Expense Deleted Successfully",
    });
  }
);
