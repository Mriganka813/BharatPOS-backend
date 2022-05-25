const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const SalesOrder = require("../models/salesModel");
const PurchaseModel = require("../models/purchaseModel");
const ExpenseModel = require("../models/expenseModel");
const salesModel = require("../models/salesModel");
// to get report of user sales , purchase and expense between starting date and end date
exports.getReportofUser = catchAsyncErrors(async (req, res, next) => {
  const { id, startDate, endDate, types } = req.query;
  newStartDate = startDate + "T00:00:00.000Z";
  newEndDate = endDate + "T23:59:59.000Z";
  if(types === undefined || types.length === 0 ){
    res.status(404).json({
      success: false,
      message: "Please provide type of report"
    })
  }

  const arr = types.split(",");
  let responseObj = {}
  for(let i=0;i<arr.length;i++){
    if(arr[i]==="sales"){
      const sales = await SalesOrder.find(
        { _id: id,
          createdAt: { $gte: newStartDate, $lte: newEndDate }
        } ,(err, data) => {
          if (err) {
            return next(new ErrorHandler("Could not get sales", 401));
          }else{
            responseObj.sales = data;
          }
      }).clone();
    }


    if(arr[i]==="purchase"){
      const purchase = await PurchaseModel.find(
        { _id: id,
          createdAt: { $gte: newStartDate, $lte: newEndDate }
        } ,(err, data) => {
        if (err) {
           return next(new ErrorHandler("Could not get purchase", 401));
        }else{
                responseObj.purchase = data;
         }
      }).clone();
    }

    
    if(arr[i]==="expense"){
       const expense = await ExpenseModel.find(
            { _id: id,
                  createdAt: { $gte: newStartDate, $lte: newEndDate }
            } ,(err, data) => {
            if (err) {
                    return next(new ErrorHandler("Could not get expense", 401));
                  }else{
                    responseObj.expense = data;
                 }
           }).clone();
       }
      }

      res.status(200).json({
        success: true,
        responseObj,
      });

    });
  
 