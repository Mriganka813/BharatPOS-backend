const SalesOrder = require("../models/salesModel");
const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new sales Order
exports.newSalesOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderItems } = req.body;

  const salesOrder = await SalesOrder.create({
    orderItems,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    salesOrder,
  });
});

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
  const salesOrders = await SalesOrder.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    salesOrders,
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

// update Order Status -- Admin
// exports.updateSalesOrder = catchAsyncErrors(async (req, res, next) => {
//   const salesOrder = await SalesOrder.findById(req.params.id);

//   if (!salesOrder) {
//     return next(new ErrorHandler("Order not found with this Id", 404));
//   }

//   // if (salesOrder.orderStatus === "Delivered") {
//   //   return next(new ErrorHandler("You have already delivered this order", 400));
//   // }

//   // if (req.body.status === "Shipped") {
//   //   salesOrder.orderItems.forEach(async (o) => {
//   //     await updateStock(o.inventory, o.quantity);
//   //   });
//   // }
//   // salesOrder.orderStatus = req.body.status;

//   // if (req.body.status === "Delivered") {
//   //   salesOrder.deliveredAt = Date.now();
//   // }

//   await salesOrder.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//   });
// });

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
