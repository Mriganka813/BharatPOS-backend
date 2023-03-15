const Inventory = require("../models/inventory");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const lodash = require("lodash");
const upload = require("../services/upload");
const ApiFeatures = require("../utils/apiFeatures");
export const findInventoryByBarcode = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const barcode = req.params.code;
    const inventory = await Inventory.findOne({ barCode: barcode });
    res.status(200).json({
      success: true,
      inventory,
    });
  }
);

// Create Inventory
export const createInventory = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { barCode } = req.body;
    const userDetail = req.user._id;
    /// if has image, then create and save on cloudinary
    console.log(req.files);
    if (req.files?.image) {
      const result = await upload(req.files.image);
      req.body.image = result.url;
    }
    req.body.user = userDetail;
    /// Check if barcode is unique to that particular user
    if (req.body.barCode !== undefined) {
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
    const inventory = await Inventory.create({ ...req.body });

    res.status(201).json({
      success: true,
      inventory,
    });
  }
);

// Get All Inventory count and search
export const getAllInventoriesAndSearch = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
export const getAllInventorieswithSearch = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
export const getAllInventories = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const Inventories = await Inventory.find();
    res.status(200).json({
      success: true,
      Inventories,
    });
  }
);

export const getInventoryForUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // const inventories = await Inventory.find({ user: req.user._id });
    const ApiFeature = new ApiFeatures(
      Inventory.find({ user: req.user._id }),
      req.query
    ).search();
    const inventories = await ApiFeature.query;
    res.status(200).json({ success: true, inventories });
  }
);

// Get Single Inventory Details
export const getInventoryDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return next(new ErrorHandler("Inventory not found", 404));
    }

    res.status(200).json({
      success: true,
      inventory,
    });
  }
);

export const decrementQuantity = catchAsyncErrors(async (id, quantity) => {
  const inventory = await Inventory.findById(id);
  const newQty = inventory.quantity - quantity;
  if (newQty < 0) {
    throw new ErrorHandler("Cannot purchase more than existing quantity", 400);
  }
  inventory.quantity -= quantity ?? 1;
  await inventory.save();
});

//
export const incrementQuantity = catchAsyncErrors(async (id, quantity) => {
  const inventory = await Inventory.findById(id);
  inventory.quantity += quantity ?? 1;
  await inventory.save();
});

// Update Inventory
export const updateInventory = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
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
    inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      inventory,
    });
  }
);

// Delete Inventory
export const deleteInventory = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return next(new ErrorHandler("Inventory not found", 404));
    }
    await inventory.remove();
    res.status(200).json({
      success: true,
      message: "Inventory Delete Successfully",
    });
  }
);
