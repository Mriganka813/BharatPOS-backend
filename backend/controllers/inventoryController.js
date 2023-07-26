const Inventory = require("../models/inventoryModel");
var XLSX = require("xlsx");
const path = require("path");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const lodash = require("lodash");
const upload = require("../services/upload");
const ApiFeatures = require("../utils/apiFeatures");
const { uploadImage } = require("../services/upload");
const User = require("../models/userModel");
exports.findInventoryByBarcode = catchAsyncErrors(async (req, res, next) => {
  const barcode = req.params.code;
  const inventory = await Inventory.findOne({ barCode: barcode });
  res.status(200).json({
    success: true,
    inventory,
  });
});

// Create Inventory
exports.createInventory = catchAsyncErrors(async (req, res, next) => {
  const { barCode } = req.body;
  const userDetail = req.user._id;

  const seller = await User.findById(userDetail);

  console.log(seller.businessName);

  if (
    req.body.quantity == undefined ||
    req.body.quantity === null ||
    req.body.quantity == ""
  ) {
    console.log("undefine qty");
    req.body.quantity = 99999;
  }
  /// if has image, then create and save on cloudinary

  // console.log(req.files)
  if (req.files?.image) {
    console.log("image");
    const result = await uploadImage(req.files.image);
    req.body.image = result.url;
    console.log(req.body.image);
  }
  req.body.user = userDetail;
  /// Check if barcode is unique to that particular user
  if (req.body.barCode !== undefined || req.body.barCode !== "") {
    const existingInventory = await Inventory.findOne({
      barCode: barCode,
      user: req.user._id,
    });
    if (!lodash.isEmpty(existingInventory)) {
      return next(
        new ErrorHandler("Product with this barcode already exists ", 400)
      );
    }
  }
  const inventory = await Inventory.create({
    ...req.body,
    sellerName: seller.businessName,
  });

  res.status(201).json({
    success: true,
    inventory,
  });
});

// Get All Inventory count and search
exports.getAllInventoriesAndSearch1 = catchAsyncErrors(
  async (req, res, next) => {
    const { keyword } = req.query;
    const findInventories = await Inventory.find({ ...keyword });

    console.log(findInventories);
  }
);
exports.getAllInventoriesAndSearch = catchAsyncErrors(
  async (req, res, next) => {
    const resultPerPage = 8;
    const inventoriesCount = await Inventory.countDocuments();
    const key = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const InventoriesRes = await Inventory.find({ ...key });

    const queryCopy = { ...req.query };

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    let filteredInventories = await Inventory.find(JSON.parse(queryStr));

    let filteredInventoriesCount = InventoriesRes.length;
    const currentPage = Number(req.query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    let InventoriesPage = await Inventory.find()
      .limit(resultPerPage)
      .skip(skip);

    res.status(200).json({
      success: true,
      InventoriesRes,
      inventoriesCount,
      resultPerPage,
      filteredInventoriesCount,
      filteredInventories,
      InventoriesPage,
    });
  }
);

// get all inventries and search
exports.getAllInventorieswithSearch = catchAsyncErrors(
  async (req, res, next) => {
    const ApiFeature = new ApiFeatures(
      Inventory.find().populate("user", [
        "phoneNumber",
        "email",
        "address",
        "businessName",
      ]),
      req.query
    )
      .pagination(10)
      .search();
    const inventories = await ApiFeature.query;
    res.status(200).json({
      success: true,
      inventories,
    });
  }
);

// Get All Inventory
exports.getAllInventories = catchAsyncErrors(async (req, res, next) => {
  const Inventories = await Inventory.find();
  res.status(200).json({
    success: true,
    Inventories,
  });
});

exports.getInventoryForUser = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 20; // Number of results per page

  const startIndex = (page - 1) * limit;

  const query = Inventory.find({ user: req.user._id });

  // Apply search filters if required
  const ApiFeature = new ApiFeatures(query, req.query).search();

  // Apply pagination
  ApiFeature.query = ApiFeature.query.skip(startIndex).limit(limit);

  const inventories = await ApiFeature.query;

  res.status(200).json({
    success: true,
    page,
    count: inventories.length,
    inventories,
  });
});

// Get Single Inventory Details
exports.getInventoryDetails = catchAsyncErrors(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  res.status(200).json({
    success: true,
    inventory,
  });
});

exports.decrementQuantity = catchAsyncErrors(async (id, quantity) => {
  if (quantity == null) {
    return;
  }
  const inventory = await Inventory.findById(id);
  const newQty = inventory.quantity - quantity;
  if (newQty < 0) {
    throw new ErrorHandler("Cannot purchase more than existing quantity", 400);
  }
  inventory.quantity -= quantity;
  await inventory.save();
});

exports.incrementQuantity = catchAsyncErrors(async (id, quantity) => {
  if (quantity == null) {
    return;
  }
  const inventory = await Inventory.findById(id);
  inventory.quantity += quantity;
  await inventory.save();
});

// Update Inventory
exports.updateInventory = catchAsyncErrors(async (req, res, next) => {
  let inventory = await Inventory.findById(req.params.id);
  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }
  if (req.files?.image) {
    const result = await upload(req.files.image);
    req.body.image = result.url;
  }
  // if (req.body.barCode !== undefined) {
  //   const existingInventory = await Inventory.findOne({
  //     barCode: req.body.barCode,
  //     user: req.user._id,
  //   });
  //   if (!lodash.isEmpty(existingInventory)) {
  //     return next(
  //       new ErrorHandler("Product with this barcode already exists ", 400)
  //     );
  //   }
  // }

  console.log("ppp");
  console.log(req.body.expiryDate);
  inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    inventory,
  });
});

// Delete Inventory
exports.deleteInventory = catchAsyncErrors(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }
  await inventory.remove();
  res.status(200).json({
    success: true,
    message: "Inventory Delete Successfully",
  });
});

exports.bulkUpload = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file found" });
    }
    const filePath = req.file.path;

    // Get field names from the first row of the sheet

    // Read the uploaded Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const fieldNames = Object.keys(jsonData[0]);
    // Create an array of user documents
    const inventoryData = jsonData.map((data) => {
      const user = {};
      fieldNames.forEach((fieldName) => {
        if (data[fieldName] !== undefined) {
          user[fieldName] = data[fieldName];
        }
      });
      return user;
    });

    await Inventory.insertMany(users, { timeout: 30000 });

    // Delete the file
    fs.unlinkSync(filePath);

    // Send a response
    res.status(200).json({
      success: true,
      inventory,
      message: "Data uploaded successfully",
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update existing inventories
exports.updateExistingInventories = catchAsyncErrors(async (req, res, next) => {
  const inventoriesToUpdate = await Inventory.find({ quantity: 1 });

  for (const inventory of inventoriesToUpdate) {
    inventory.quantity = null;
    await inventory.save();
  }

  res.status(200).json({
    success: true,
    message: "Existing inventories updated successfully",
  });
});

exports.availablility = catchAsyncErrors(async (req, res, next) => {
  const { status, productId } = req.params;
  console.log(productId);
  const product = await Inventory.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  if (status === "active") {
    if (product.available === true) {
      return res.send({
        status: "Already Active",
      });
    }

    product.available = true;
    await product.save();
  } else if (status === "disable") {
    if (product.available === false) {
      return res.send({
        status: "Already disable",
      });
    }
    product.available = false;
    await product.save();
  }

  res.send({
    status: "success",
    data: product,
  });
});

// exports.bulkUpload = catchAsyncErrors(async (req, res, next) => {
//   try {

//     const filePath = req.file.path;
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file found' });
//     }

//     // Read the uploaded Excel file
//     const workbook = XLSX.readFile(req.file.path);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//     // Extract data from the sheet
//     const data = XLSX.utils.sheet_to_json(worksheet);

//     // Process the data and save it to the MongoDB database
//     const inventory = await Inventory.insertMany(data);

//     // Send a response
//     res.status(200).json({ success: true, inventory, message: 'Data uploaded successfully' });
//   } catch (err) {
//     // Handle errors
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });
