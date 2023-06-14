const mongoose = require("mongoose");

const orderedItemSchema = mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      productImage: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      status:{
        type: String,
        enum: ['pending', 'confirmed','dispatched','delivered','rejected','cancelled','refunded'],
        default: 'pending'
        
      },
      sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      sellerName:{
        type: String,
      }
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("orderedItem", orderedItemSchema);
