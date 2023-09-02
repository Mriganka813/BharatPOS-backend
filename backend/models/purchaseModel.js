const mongoose = require("mongoose");

/// commit
const purchaseSchema = new mongoose.Schema({
  orderItems: [
    {
      name: {
        type: String,
        // required: true,
      },
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
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  modeOfPayment: {
    type: String,
    enum: ["Cash", "Credit", "Bank Transfer", "Settle"],
    required: true,
  },
  party: {
    type: mongoose.Schema.ObjectId,
    ref: "Party",
    required: false,
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
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PurchaseModel", purchaseSchema);
