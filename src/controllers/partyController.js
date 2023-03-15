const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Party = require("../models/party");
const SalesModel = require("../models/sale");
const PurchaseModel = require("../models/purchase");
// const sendToken = require("../utils/jwtToken");
const mongoose = require("mongoose");
const isEmpty = require("lodash").isEmpty;
// create new party
export const registerParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, type, phoneNumber } = req.body;
    const party = await Party.create({
      name,
      address,
      phoneNumber,
      type,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      party,
    });
  }
);

export const searchParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchQuery, type, limit } = req.query;
    const user = req.user._id;
    const allParty = await Party.find({
      name: {
        $regex: searchQuery,
        $options: "i",
      },
      user: user,
      type: type,
    }).limit(limit);
    res.status(200).json({
      success: true,
      allParty,
    });
  }
);

export const getAllParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const allParty = await Party.find();
    res.status(200).json({
      success: true,
      allParty,
    });
  }
);

export const getMyParties = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const allParty = await Party.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      allParty,
    });
  }
);

export const getSingleParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const party = await Party.findById(req.params.id);

    if (!party) {
      return next(new ErrorHandler("party not found", 404));
    }

    res.status(200).json({
      success: true,
      party,
    });
  }
);

export const updateParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let party = await Party.findById(req.params.id);

    if (!party) {
      return next(new ErrorHandler("party not found", 404));
    }

    party = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      party,
    });
  }
);

export const deleteParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const party = await Party.findById(req.params.id);

    if (!party) {
      return next(new ErrorHandler("party not found", 404));
    }

    await party.remove();

    res.status(200).json({
      success: true,
      message: "party Deleted Successfully",
    });
  }
);

/**
 * Get party credit orders
 */

/**
 * Get the sum of all the party's total credit amount
 * Returns only parties whose amounts are greater than zero
 */
export const getCreditSaleParties = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const data = await Party.aggregate([
      {
        $match: { user: user, type: "customer" },
      },
    ]);
    if (!data) {
      return next(new ErrorHandler("Orders not found", 404));
    }
    const parties = await Promise.all(
      data.map(async (e) => {
        e.totalCreditAmount =
          (await partyCreditSaleHistoryTotal(e._id, "Credit")) ?? 0;
        e.totalSettleAmount =
          (await partyCreditSaleHistoryTotal(e._id, "Settle")) ?? 0;
        e.balance = e.totalCreditAmount - e.totalSettleAmount;
        return e;
      })
    );

    res.status(200).json({
      success: true,
      data: parties,
    });
  }
);
export const getCreditPurchaseParties = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const data = await Party.aggregate([
      {
        $match: { user: user, type: "supplier" },
      },
    ]);
    if (!data) {
      return next(new ErrorHandler("Orders not found", 404));
    }
    const parties = await Promise.all(
      data.map(async (e) => {
        e.totalCreditAmount =
          (await partyCreditPurchaseHistoryTotal(e._id, "Credit")) ?? 0;
        e.totalSettleAmount =
          (await partyCreditPurchaseHistoryTotal(e._id, "Settle")) ?? 0;
        e.balance = e.totalCreditAmount - e.totalSettleAmount;
        return e;
      })
    );

    res.status(200).json({
      success: true,
      data: parties,
    });
  }
);
export const getCreditPurchaseParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const partyId = req.params.id;
    const id = mongoose.Types.ObjectId(partyId);
    const parties = await Party.aggregate([
      {
        $match: { user, _id: id },
      },
      { $limit: 1 },
      {
        $lookup: {
          from: "purchasemodels",
          localField: "_id",
          foreignField: "party",
          as: "purchase",
        },
      },
      {
        $addFields: {
          totalCreditAmount: { $sum: "$purchase.total" },
        },
      },
      {
        $unset: ["purchase"],
      },
    ]);
    const party = parties[0];
    const totalCreditAmount = await partyCreditPurchaseHistoryTotal(
      partyId,
      "Credit"
    );
    const totalSettleAmount = await partyCreditPurchaseHistoryTotal(
      partyId,
      "Settle"
    );

    const data = {
      ...party,
      totalCreditAmount,
      totalSettleAmount,
      balance: totalCreditAmount - totalSettleAmount,
    };
    if (!data) {
      return next(new ErrorHandler("Orders not found", 404));
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  }
);

export const getCreditSaleParty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const partyId = req.params.id;
    const id = mongoose.Types.ObjectId(partyId);
    const parties = await Party.aggregate([
      {
        $match: { user, _id: id },
      },
      { $limit: 1 },
      {
        $lookup: {
          from: SalesModel.collection.name,
          localField: "_id",
          foreignField: "party",
          as: "sale",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$modeOfPayment", ["Settle", "Credit"]],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalCreditAmount: { $sum: "$sale.total" },
        },
      },
      {
        $unset: ["sale"],
      },
    ]);
    const party = parties[0];
    const totalCreditAmount = await partyCreditSaleHistoryTotal(
      partyId,
      "Credit"
    );
    const totalSettledAmount = await partyCreditSaleHistoryTotal(
      partyId,
      "Settle"
    );
    const data = {
      ...party,
      totalCreditAmount,
      totalSettledAmount,
      balance: totalCreditAmount - totalSettledAmount,
    };
    if (!data) {
      return next(new ErrorHandler("Orders not found", 404));
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  }
);
/**
 *
 * @param {Number} partyId
 * @param {Number} modeOfPayment
 * @returns {Promise<{total: Number, totalCredit: Number, totalSettled: Number}>}
 */
const partyCreditSaleHistoryTotal = async (partyId, modeOfPayment) => {
  const data = await SalesModel.aggregate([
    {
      $match: {
        modeOfPayment: { $in: [modeOfPayment] },
        party: mongoose.Types.ObjectId(partyId),
      },
    },

    {
      $group: {
        _id: "$itemNumber",
        total: {
          $sum: "$total",
        },
      },
    },
  ]);
  let total = 0;
  if (!isEmpty(data)) {
    total = data[0].total ?? 0;
  }
  return total;
};
/**
 *
 * @param {Number} partyId
 * @param {Number} modeOfPayment
 * @returns {Promise<{total: Number, totalCredit: Number, totalSettled: Number}>}
 */
const partyCreditPurchaseHistoryTotal = async (partyId, modeOfPayment) => {
  const data = await PurchaseModel.aggregate([
    {
      $match: {
        modeOfPayment: { $in: [modeOfPayment] },
        party: mongoose.Types.ObjectId(partyId),
      },
    },

    {
      $group: {
        _id: "$itemNumber",
        total: {
          $sum: "$total",
        },
      },
    },
  ]);
  let total = 0;
  if (!isEmpty(data)) {
    total = data[0].total ?? 0;
  }
  return total;
};
