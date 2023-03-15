const SalesOrder = require("../models/sale");
const Inventory = require("../models/inventory");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const inventoryController = require("./inventoryController");
// Create new sales Order
export const newSalesOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderItems, modeOfPayment, party } = req.body;
    for (const item of orderItems) {
      inventoryController.decrementQuantity(item.product, item.quantity);
    }
    try {
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
    } catch (err) {
      return next(new ErrorHandler("Could not create order", 403));
    }
  }
);

const calcTotalAmount = (orderItems) => {
  let total = 0;
  for (const item of orderItems) {
    total += item.price * item.quantity;
  }
  return total;
};

// get Single sales Order
export const getSingleSalesOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// get logged in user  Orders
export const mySalesOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// get all Orders
export const getAllSalesOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

async function updateStock(id, quantity) {
  const inventory = await Inventory.findById(id);

  inventory.Stock -= quantity;

  await inventory.save({ validateBeforeSave: false });
}

// delete Order -- Admin
export const deleteSalesOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const salesOrder = await SalesOrder.findById(req.params.id);

    if (!salesOrder) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await salesOrder.remove();

    res.status(200).json({
      success: true,
    });
  }
);
export const getCreditSaleOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);
export const addCreditSettleTransaction = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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

export const partyCreditHistory = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export const UpdateSalesOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);
