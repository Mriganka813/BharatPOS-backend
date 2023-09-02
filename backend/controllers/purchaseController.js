const PurchaseOrder = require("../models/purchaseModel");
const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const inventoryController = require("./inventoryController");
// Create new Order
exports.newPurchaseOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderItems, modeOfPayment, party,invoiceNum } = req.body;
  for (const item of orderItems) {
    if (item.quantity !== null) {
        inventoryController.incrementQuantity(item.product, item.quantity);
    }
}

  const total = await calcTotalAmount(orderItems);
  const purchaseOrder = await PurchaseOrder.create({
    orderItems,
    modeOfPayment,
    party,
    total,
    user: req.user._id,
    invoiceNum,
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
    "name"
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
  const pageSize = 10;
  const page = req.query.page || 1;
  const offset = page * pageSize;
  const userDetails = req.user._id;
  const purchaseOrders = await PurchaseOrder.find({ user: userDetails })
    .skip(offset)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  const meta = {
    currentPage: Number(page),
    nextPage: purchaseOrders.length === 10 ? Number(page) + 1 : null,
    count: purchaseOrders.length,
  };
  res.status(200).json({
    success: true,
    purchaseOrders,
    meta,
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

  if (inventory.Stock !== null) {
      inventory.Stock -= quantity;
  }

  await inventory.save({ validateBeforeSave: false });
}

async function calcTotalAmount(orderItems) {
  let totalAmount = 0;
  orderItems.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });
  return totalAmount;
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

exports.getCreditPurchaseOrders = catchAsyncErrors(async (req, res, next) => {
  const user = req.user._id;
  const data = await PurchaseOrder.aggregate([
    {
      $match: { user: user, modeOfPayment: "Credit" },
    },
  ]);
  if (!data) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    data,
  });
});
/**
 * Adds a transaction to the user's account between user and party
 * where user can either add more credit or settle
 *
 */
exports.addCreditHistoryTransaction = catchAsyncErrors(
  async (req, res, next) => {
    const { amount, modeOfPayment } = req.body;
    const id = req.params.id;
    const order = {
      party: id,
      total: amount,
      user: req.user._id,
      modeOfPayment: modeOfPayment,
      orderItems: [],
    };
    const data = await PurchaseOrder.create(order);
    res.status(201).json({
      success: true,
      data,
    });
  }
);

exports.partyCreditHistory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const data = await PurchaseOrder.find({
    party: id,
    modeOfPayment: { $in: ["Credit", "Settle"] },
  }).sort({ createdAt: -1 });
  if (!data) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    data,
  });
});

exports.updatePurchaseOrders = catchAsyncErrors(async (req, res, next) => {
  const data = await PurchaseOrder.findByIdAndUpdate( {_id : req.params.id} , req.body).clone()
  .then(() => {
    PurchaseOrder.findById(req.params.id).then((data) => {
    res.status(200).json({
      success: true,
      data,
    });
  });
  }).catch(err => {
    ErrorHandler(err);
  });
});
