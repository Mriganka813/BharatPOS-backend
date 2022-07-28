const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const SalesOrder = require("../models/salesModel");
const PurchaseModel = require("../models/purchaseModel");
const ExpenseModel = require("../models/expenseModel");
const SalesModel = require("../models/salesModel");
const InventoryModel = require("../models/inventoryModel");
const PartyModel = require("../models/partyModel");
const User = require("../models/userModel");
// to get report of user sales , purchase and expense between starting date and end date
exports.getReportofUser = catchAsyncErrors(async (req, res, next) => {
  const { start_date, end_date, type } = req.query;
  const user = req.user._id;
  const userdetail = await User.findById(user).select("businessType");
  if (!type) {
    res.status(404).json({
      success: false,
      message: "Please provide type of report",
    });
  }

  if (type === "sale") {
    const sales = await SalesModel.find({
      createdAt: { $gte: start_date, $lte: end_date },
      user: user,
    }).populate([
      {
        path: "orderItems",
        populate: { path: "product", model: InventoryModel },
      },
      "party",
    ]);
    res.status(200).json({
      success: true,
      sales,
      userdetail
    });
  }

  if (type === "purchase") {
    const purchase = await PurchaseModel.find({
      createdAt: { $gte: start_date, $lte: end_date },
      user: user,
    }).populate([
      {
        path: "orderItems",
        populate: { path: "product", model: InventoryModel },
      },
      "party",
    ]);

    res.status(200).json({
      success: true,
      purchase,
      userdetail
    });
  }

  if (type === "expense") {
    const expense = await ExpenseModel.find({
      createdAt: { $gte: start_date, $lte: end_date },
      user: user,
    });
    res.status(200).json({
      success: true,
      expense,
      userdetail
    });
  }
  if (type === "report") {
    // return item names , stock quantity and stock value
    const inventories = await InventoryModel.find({
      user: user,
    });

    res.status(200).json({
      success: true,
      inventories,
      userdetail
    });
  }
});
