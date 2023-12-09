const SalesOrder = require("../models/salesModel");
const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const inventoryController = require("./inventoryController");
const moment = require('moment-timezone');

// Create new sales Order
exports.newSalesOrder = catchAsyncErrors(async (req, res, next) => {
  console.log('new Sales');
  const { orderItems,discount, modeOfPayment, party,invoiceNum,reciverName,gst,businessName, } = req.body;
  
  const indiaTime = moment.tz('Asia/Kolkata');

   
  // console.log(orderItems);

// Get the current date and time in the India timezone
const currentDateTimeInIndia = indiaTime.format('YYYY-MM-DD HH:mm:ss');
 
  for (const item of orderItems) {
      const product = await Inventory.findById(item.product);
      // console.log(product);
      product.quantity = product.quantity-item.quantity
      await product.save()
      
    }
  try {
    const total = calcTotalAmount(orderItems);

    const salesOrder = await SalesOrder.create({
      orderItems,
      party,
      modeOfPayment,
      total,
      user: req.user._id,
      createdAt:currentDateTimeInIndia,
      invoiceNum,
      reciverName,
      businessName,
      gst

    });

    console.log(salesOrder);
    res.status(201).json({
      success: true,
      salesOrder,
    });
  } catch (err) {
    return next(new ErrorHandler("Could not create order", 403));
  }
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
  console.log();
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

  if (inventory.Stock !== null) {
      inventory.Stock -= quantity;
  }

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
exports.addCreditSettleTransaction = catchAsyncErrors(
  async (req, res, next) => {
    const partyId = req.params.id;
    const { amount, modeOfPayment } = req.body;
    const order = {
      party: partyId,
      total: amount,
      user: req.user._id,
      modeOfPayment: modeOfPayment,
      orderItems: [],
    };
    const data = await SalesOrder.create(order);
    res.status(201).json({
      success: true,
      data,
    });
  }
);

exports.partyCreditHistory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const data = await SalesOrder.find({
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

exports.UpdateSalesOrder = catchAsyncErrors(async (req, res, next) => {
  const data = await SalesOrder.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  )
    .clone()
    .then(() => {
      SalesOrder.findById(req.params.id).then((data) => {
        res.status(200).json({
          success: true,
          data,
        });
      });
    })
    .catch((err) => {
      ErrorHandler(err);
    });
});
const SalesReturn = require("../models/SalesReturnModel"); // Import the SalesReturn model

exports.salesReturn = catchAsyncErrors(async (req, res, next) => {
  console.log('Sales Return');
  const { orderItems, modeOfPayment, party, invoiceNum, reciverName, gst, businessName } = req.body;
  
  const indiaTime = moment.tz('Asia/Kolkata');
  const currentDateTimeInIndia = indiaTime.format('YYYY-MM-DD HH:mm:ss');
 
  for (const item of orderItems) {
    const product = await Inventory.findById(item.product);
    product.quantity = product.quantity + item.quantity; // Increase the quantity for returned items
    await product.save();
  }
  
  try {
    const total = calcTotalAmount(orderItems);

    const salesReturn = await SalesReturn.create({ // Use the SalesReturn model here
      orderItems,
      party,
      modeOfPayment,
      total,
      user: req.user._id,
      createdAt: currentDateTimeInIndia,
      invoiceNum,
      reciverName,
      businessName,
      gst
    });

    console.log(salesReturn);
    res.status(201).json({
      success: true,
      salesReturn,
    });
  } catch (err) {
    return next(new ErrorHandler("Could not process return", 403));
  }
});
