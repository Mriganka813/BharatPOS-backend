const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const SalesOrder = require("../models/sale");
const PurchaseModel = require("../models/purchase");
const ExpenseModel = require("../models/expense");
const SalesModel = require("../models/sale");
const InventoryModel = require("../models/inventory");
const PartyModel = require("../models/party");
const User = require("../models/user");
// to get report of user sales , purchase and expense between starting date and end date
export const getReportofUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { start_date, end_date, type } = req.query;
    const user = req.user._id;
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
        { path: "user", select: "taxFile" },
      ]);
      res.status(200).json({
        success: true,
        sales,
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
        { path: "user", select: "taxFile" },
      ]);

      res.status(200).json({
        success: true,
        purchase,
      });
    }

    if (type === "expense") {
      const expense = await ExpenseModel.find({
        createdAt: { $gte: start_date, $lte: end_date },
        user: user,
      }).populate({ path: "user", select: "taxFile" });
      res.status(200).json({
        success: true,
        expense,
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
      });
    }
  }
);
