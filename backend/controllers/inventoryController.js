const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
// const User = require("../models/userModel");



// Create Inventory 
exports.createInventory = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "Inventories",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  const userDetail = req.user._id;

  req.body.images = imagesLinks;
  req.body.user = userDetail;

  const inventory = await Inventory.create(req.body);

  res.status(201).json({
    success: true,
    inventory,
  });
});

// Get All Inventory count and search
exports.getAllInventoriesAndSearch = catchAsyncErrors(async (req, res, next) => {
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
  let InventoriesPage = await Inventory.find().limit(resultPerPage).skip(skip);

  res.status(200).json({
    success: true,
    InventoriesRes,
    inventoriesCount,
    resultPerPage,
    filteredInventoriesCount,
    filteredInventories,
    InventoriesPage,
  });
});

// Get All Inventory 
exports.getAllInventories = catchAsyncErrors(async (req, res, next) => {
  const Inventories = await Inventory.find();

  res.status(200).json({
    success: true,
    Inventories,
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

// Update Inventory 
exports.updateInventory = catchAsyncErrors(async (req, res, next) => {
  let inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < Inventory.images.length; i++) {
      await cloudinary.v2.uploader.destroy(Inventory.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "Inventories",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

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

  // Deleting Images From Cloudinary
  for (let i = 0; i < inventory.images.length; i++) {
    await cloudinary.v2.uploader.destroy(Inventory.images[i].public_id);
  }

  await inventory.remove();

  res.status(200).json({
    success: true,
    message: "Inventory Delete Successfully",
  });
});
