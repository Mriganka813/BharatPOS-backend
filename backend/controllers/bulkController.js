const Inventory = require("../models/inventoryModel");
var XLSX = require('xlsx');
const path = require('path');
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const lodash = require("lodash");
// const upload = require("../services/upload");
const ApiFeatures = require("../utils/apiFeatures");

const fs = require('fs');
const multer = require('multer')


const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      if (!file.originalname.endsWith('.xlsx')) {
        cb(new Error('Only .xlsx files are allowed'));
      } else {
        cb(null, file);
      }
    }
  });


module.exports.bulkUpload = async (req, res) => {
    try {

        const filePaths = req.files?.excelFile
  
      if (!filePaths) {
        return res.status(400).json({ error: 'No file found' });
      }
      const filePath = req.files?.excelFile.path;
  
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
  
      // Get field names from the first row of the sheet
      const fieldNames = Object.keys(jsonData[0]);
  
      console.log(fieldNames);
  
      // Create an array of user documents
      const users = jsonData.map((data) => {
        const user = {};
        fieldNames.forEach((fieldName) => {
          if (data[fieldName] !== undefined) {
            user[fieldName] = data[fieldName];
          }
        });
        return user;
      });
  
      // Insert multiple users into the database with an increased timeout value
      await User.insertMany(users, { timeout: 30000 }); // Increase timeout to 30 seconds
  
      // Delete the file
      fs.unlinkSync(filePath);
  
      console.log('Data uploaded successfully');
      res.status(200).send('Data uploaded successfully');
    } catch (error) {
      console.error('Error uploading data:', error);
      res.status(500).send('An error occurred during data upload');
    }
  };
  

module.exports.bulkUpload3=async(req,res)=>{
    const file = req.files?.excelFile
    console.log(file);
    console.log("check");
}