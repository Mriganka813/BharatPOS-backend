const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  orderItems: [
    {
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        // required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      productGst:{
        type: String
      }
    },
  ],
  modeOfPayment: {
    type: String,
    enum: ["Cash", "Credit", "Bank Transfer", "Settle","UPI"],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  party: {
    type: mongoose.Schema.ObjectId,
    ref: "Party",
  },
  date:{type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  invoiceNum:{
    type: String
  },
  createdAt: {
    type: String,
  },
  reciverName:{
    type: String
  },
  businessName:{
    type: String
  },
  businessAddress:{
    type: String
  },
  gst:{
    type: String
  }

});

module.exports = mongoose.model("salesModel", salesSchema);
