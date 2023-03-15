import { Types, Schema, model } from "mongoose";

const inventorySchema = new Schema({
  name: {
    type: String,
    // required: [true, "Please Enter inventory Name"],
    trim: true,
    // unique: true,
  },
  description: {
    type: String,
    // required: [true, "Please Enter inventory Description"],
  },
  purchasePrice: {
    type: Number,
    // required: true,
    // required: [true, "Please Enter purchasing price of inventory"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  sellingPrice: {
    type: Number,
    required: true,
    // required: [true, "Please Enter selling price of inventory"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  barCode: {
    type: String,
    // required: true,
  },
  img: {
    // type:String,
    data: Buffer,
    contentType: String,
    // required:true,
    // default:
    //   "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  image: {
    type: String,
    // required: true,
    // default:"https://res.cloudinary.com/dpzjsgt4s/image/upload/v1649381378/Inventories/download_pfzdir.jpg",
  },

  category: {
    type: String,
    // required: [true, "Please Enter inventory Category"],
  },
  quantity: {
    type: Number,
    required: false,
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  GSTRate: {
    type: Number,
    maxLength: [5, "GST Rate cannot exceed 5 characters"],
  },
  saleSGST: {
    type: Number,
    maxLength: [10, "SGST Rate cannot exceed 5 characters"],
  },
  saleCGST: {
    type: Number,
    maxLength: [10, "CGST Rate cannot exceed 5 characters"],
  },
  saleIGST: {
    type: Number,
  },
  baseSellingPrice: {
    type: Number,
  },
  purchaseSGST: {
    type: Number,
    maxLength: [10, "SGST Rate cannot exceed 5 characters"],
  },
  purchaseCGST: {
    type: Number,
    maxLength: [10, "CGST Rate cannot exceed 5 characters"],
  },
  purchaseIGST: {
    type: Number,
  },
  basePurchasePrice: {
    type: Number,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Inventory = model("inventory", inventorySchema);
