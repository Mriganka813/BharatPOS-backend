const Inventory = require("../models/inventoryModel");
var XLSX = require('xlsx');
const path = require('path');
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const lodash = require("lodash");
const upload = require("../services/upload");
const ApiFeatures = require("../utils/apiFeatures");


module.exports.bulkUpload=async(req,res)=>{
    const file = req.files?.excelFile
    console.log(file);
    console.log("check");
}