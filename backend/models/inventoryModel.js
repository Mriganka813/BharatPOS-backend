const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
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
  purchasingPrice: {
    type: Number,
    // required: [true, "Please Enter purchasing price of inventory"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  sellingPrice: {
    type: Number,
    // required: [true, "Please Enter selling price of inventory"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  barCode: {
    type: String,
    // required: true,
    unique: true,
  },
  img: {
    // type:String,
    data: Buffer,
    contentType: String,
    // required:true,
    // default:
    //   "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  images: {
    public_id: {
      type: String,
      // required: true,
      // default:"",
    },
    url: {
      type: String,
      // required: true,
      // default:"https://res.cloudinary.com/dpzjsgt4s/image/upload/v1649381378/Inventories/download_pfzdir.jpg",
    },
  },

  category: {
    type: String,
    // required: [true, "Please Enter inventory Category"],
  },
  quantity: {
    type: Number,
    required: [true, "Please Enter quantity of inventory"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("inventory", inventorySchema);
