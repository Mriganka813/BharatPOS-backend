const Inventory = require("../models/inventoryModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const ApiFeatures = require("../utils/apiFeatures");
// const cloudinary = require("cloudinary");

// Create Inventory -- Admin
exports.createInventory = catchAsyncErrors(async (req, res, next) => {
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // const imagesLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: "Inventories",
  //   });

  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }

  // req.body.images = imagesLinks;
  // req.body.user = req.user.id;

  const inventory = await Inventory.create(req.body);

  res.status(201).json({
    success: true,
    inventory,
  });
});

// Get All Inventory
exports.getAllInventories = catchAsyncErrors(async (req, res, next) => {
  // const resultPerPage = 8;
  // const inventoriesCount = await Inventory.countDocuments();

  // const apiFeature = new ApiFeatures(Inventory.find(), req.query)
  //   .search()
  //   .filter();

  // let inventories = await apiFeature.query;

  // let filteredInventoriesCount = inventories.length;

  // apiFeature.pagination(resultPerPage);

  // inventories = await apiFeature.query;

  const inventories= await Inventory.find();

  res.status(200).json({
    success: true,
    inventories
  });
});

// Get All Inventory (Admin)
exports.getAdminInventories = catchAsyncErrors(async (req, res, next) => {
  const Inventories = await Inventory.find();

  res.status(200).json({
    success: true,
    Inventories,
  });
});

// Get Inventory Details
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

// Update Inventory -- Admin

exports.updateInventory = catchAsyncErrors(async (req, res, next) => {
  let inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  // Images Start Here
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // if (images !== undefined) {
  //   // Deleting Images From Cloudinary
  //   for (let i = 0; i < Inventory.images.length; i++) {
  //     await cloudinary.v2.uploader.destroy(Inventory.images[i].public_id);
  //   }

  //   const imagesLinks = [];

  //   for (let i = 0; i < images.length; i++) {
  //     const result = await cloudinary.v2.uploader.upload(images[i], {
  //       folder: "Inventories",
  //     });

  //     imagesLinks.push({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   }

  //   req.body.images = imagesLinks;
  // }

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
  // for (let i = 0; i < inventory.images.length; i++) {
  //   await cloudinary.v2.uploader.destroy(Inventory.images[i].public_id);
  // }

  await inventory.remove();

  res.status(200).json({
    success: true,
    message: "Inventory Delete Successfully",
  });
});


exports.deleteBarcode = catchAsyncErrors(async (req, res, next) => {

  const barCode=await Inventory.deleteOne({
    "barCode":req.params.id
  })
  // const inventory = await Inventory.findById(req.params.id);

  if (!barCode) {
    return next(new ErrorHandler("Inventory with barcode not found", 404));
  }

  // Deleting Images From Cloudinary
  // for (let i = 0; i < inventory.images.length; i++) {
  //   await cloudinary.v2.uploader.destroy(Inventory.images[i].public_id);
  // }

  await barCode.remove();

  res.status(200).json({
    success: true,
    message: "Inventory with barcode Deleted Successfully",
  });
});

// Create New Review or Update the review
// exports.createInventoryReview = catchAsyncErrors(async (req, res, next) => {
//   const { rating, comment, InventoryId } = req.body;

//   const review = {
//     user: req.user._id,
//     name: req.user.name,
//     rating: Number(rating),
//     comment,
//   };

//   const inventory = await Inventory.findById(InventoryId);

//   const isReviewed = inventory.reviews.find(
//     (rev) => rev.user.toString() === req.user._id.toString()
//   );

//   if (isReviewed) {
//     inventory.reviews.forEach((rev) => {
//       if (rev.user.toString() === req.user._id.toString())
//         (rev.rating = rating), (rev.comment = comment);
//     });
//   } else {
//     inventory.reviews.push(review);
//     inventory.numOfReviews = inventory.reviews.length;
//   }

//   let avg = 0;

//   inventory.reviews.forEach((rev) => {
//     avg += rev.rating;
//   });

//   inventory.ratings = avg / inventory.reviews.length;

//   await inventory.save({ validateBeforeSave: false });

//   res.status(200).json({
//     success: true,
//   });
// });

// // Get All Reviews of a Inventory
// exports.getInventoryReviews = catchAsyncErrors(async (req, res, next) => {
//   const Inventory = await Inventory.findById(req.query.id);

//   if (!Inventory) {
//     return next(new ErrorHandler("Inventory not found", 404));
//   }

//   res.status(200).json({
//     success: true,
//     reviews: Inventory.reviews,
//   });
// });

// // Delete Review
// exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
//   const Inventory = await Inventory.findById(req.query.InventoryId);

//   if (!Inventory) {
//     return next(new ErrorHandler("Inventory not found", 404));
//   }

//   const reviews = Inventory.reviews.filter(
//     (rev) => rev._id.toString() !== req.query.id.toString()
//   );

//   let avg = 0;

//   reviews.forEach((rev) => {
//     avg += rev.rating;
//   });

//   let ratings = 0;

//   if (reviews.length === 0) {
//     ratings = 0;
//   } else {
//     ratings = avg / reviews.length;
//   }

//   const numOfReviews = reviews.length;

//   await Inventory.findByIdAndUpdate(
//     req.query.InventoryId,
//     {
//       reviews,
//       ratings,
//       numOfReviews,
//     },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );

//   res.status(200).json({
//     success: true,
//   });
// });
