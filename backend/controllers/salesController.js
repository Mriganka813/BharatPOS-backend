const SalesOrder = require("../models/salesModel");
const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const inventoryController = require("./inventoryController");
// Create new sales Order
exports.newSalesOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderItems, modeOfPayment, party } = req.body;
  for (const item of orderItems) {
    inventoryController.decrementQuantity(item.product, item.quantity);
  }
  try {
  } catch (err) {
    return next(new ErrorHandler("Could not create order", 401));
  }
  const total = calcTotalAmount(orderItems);
  const salesOrder = await SalesOrder.create({
    orderItems,
    party,
    modeOfPayment,
    total,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    salesOrder,
  });
});

const calcTotalAmount = (orderItems) => {
  let total = 0;
  for (const item of orderItems) {
    total += item.price * item.quantity;
  }
  return total;
};

// get Single sales Order
exports.getSingleSalesOrder = catchAsyncErrors(async (req, res, next) => {
  const salesOrder = await SalesOrder.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!salesOrder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    salesOrder,
  });
});

// get logged in user  Orders
exports.mySalesOrders = catchAsyncErrors(async (req, res, next) => {
  const pageSize = 10;
  const page = req.query.page || 1;

  const offset = page * pageSize;
  const salesOrders = await SalesOrder.find({ user: req.user._id })
    .limit(10)
    .skip(offset)
    .sort({ createdAt: -1 })
    .populate("party");

  const meta = {
    currentPage: Number(page),
    nextPage: salesOrders.length === 10 ? Number(page) + 1 : null,
    count: salesOrders.length,
  };

  res.status(200).json({
    success: true,
    salesOrders,
    meta,
  });
});

// get all Orders
exports.getAllSalesOrders = catchAsyncErrors(async (req, res, next) => {
  const salesOrders = await SalesOrder.find();

  let totalAmount = 0;

  salesOrders.forEach((salesOrder) => {
    totalAmount += salesOrder.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    salesOrders,
  });
});

async function updateStock(id, quantity) {
  const inventory = await Inventory.findById(id);

  inventory.Stock -= quantity;

  await inventory.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteSalesOrder = catchAsyncErrors(async (req, res, next) => {
  const salesOrder = await SalesOrder.findById(req.params.id);

  if (!salesOrder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await salesOrder.remove();

  res.status(200).json({
    success: true,
  });
});
exports.getCreditSaleOrders = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const data = await SalesOrder.aggregate([
    {
      $match: { user: user, modeOfPayment: "Credit" },
    },
  ]);
  if (!data) {
    return next(new ErrorHandler("Orders not found", 404));
  }
  res.status(200).json({
    success: true,
    data,
  });
});
