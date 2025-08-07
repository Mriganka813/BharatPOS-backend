const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ExpenseModel = require("../models/expenseModel");

exports.addExpense = catchAsyncErrors(async (req, res, next) => {
  // const income=req.body;
  const userDetails = req.user._id;
  req.body.user = userDetails;

  const expense = await ExpenseModel.create(req.body);

  res.status(201).json({
    success: true,
    message: "Expense added successfully",
    expense,
  });
});

exports.getAllExpense = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const allExpense = await ExpenseModel.find({ user: user }).sort("-createdAt");
  res.status(200).json({
    success: true,
    allExpense,
  });
});

//route for getting expenses with pagination and search functionality
exports.getAllExpenseAndSearch = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of results per page
  const startIndex = (page - 1) * limit;
  console.log(req.query);
  // Use a regular expression for a flexible search
  const keywordRegex = new RegExp(req.query.keyword, 'i');
  const expenses = await ExpenseModel.find({ user: req.user._id, header: keywordRegex})
    .sort("-createdAt")
    .skip(startIndex)
    .limit(limit);
  // Total count of expenses without pagination
  const totalCount = await ExpenseModel.countDocuments({ user: req.user._id, header: keywordRegex });
  res.status(200).json({
    success: true,
    page,
    count: expenses.length,
    totalCount,
    expenses,
  });
})

exports.getSingleExpense = catchAsyncErrors(async (req, res, next) => {
  const expense = await ExpenseModel.findById(req.params.id);

  if (!expense) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  res.status(200).json({
    success: true,
    expense,
  });
});

exports.updateExpense = catchAsyncErrors(async (req, res, next) => {
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
});

exports.deleteExpense = catchAsyncErrors(async (req, res, next) => {
  const expense = await ExpenseModel.findById(req.params.id);

  if (!expense) {
    return next(new ErrorHandler("Expense not found", 404));
  }

  await expense.remove();
  res.status(200).json({
    success: true,
    message: "Expense Deleted Successfully",
  });
});
