const PurchaseOrder = require("../models/purchaseModel");
const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newPurchaseOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const purchaseOrder = await PurchaseOrder.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    purchaseOrder,
  });
});

// get Single Order
exports.getSinglePurchaseOrder = catchAsyncErrors(async (req, res, next) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!purchaseOrder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    purchaseOrder,
  });
});

// get logged in user  Orders
exports.myPurchaseOrders = catchAsyncErrors(async (req, res, next) => {
  const userDetails = req.user._id;
  const purchaseOrders = await PurchaseOrder.find({ user: userDetails });

  res.status(200).json({
    success: true,
    purchaseOrders,
  });
});

// get all Orders -- Admin
exports.getAllPurchaseOrders = catchAsyncErrors(async (req, res, next) => {
  const purchaseOrders = await PurchaseOrder.find();

  let totalAmount = 0;

  purchaseOrders.forEach((purchaseOrder) => {
    totalAmount += purchaseOrder.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    purchaseOrders,
  });
});

// update Order Status -- Admin
exports.updatePurchaseOrder = catchAsyncErrors(async (req, res, next) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);

  if (!purchaseOrder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (purchaseOrder.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    purchaseOrder.orderItems.forEach(async (o) => {
      await updateStock(o.inventory, o.quantity);
    });
  }
  purchaseOrder.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    purchaseOrder.deliveredAt = Date.now();
  }

  await purchaseOrder.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const inventory = await Inventory.findById(id);

  inventory.Stock -= quantity;

  await inventory.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deletePurchaseOrder = catchAsyncErrors(async (req, res, next) => {
  const purchaseOrder = await PurchaseOrder.findById(req.params.id);

  if (!purchaseOrder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await purchaseOrder.remove();

  res.status(200).json({
    success: true,
  });
});
