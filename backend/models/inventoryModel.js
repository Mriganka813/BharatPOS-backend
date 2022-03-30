const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter inventory Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter inventory Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter inventory Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  barCode:{
    type:String,
    required:true,
  },
  images: [
    {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter inventory Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter inventory Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      rating: {
        type: Number,
        // required: true,
      },
      comment: {
        type: String,
        // required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("inventory", inventorySchema);
