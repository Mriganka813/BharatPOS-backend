const mongoose = require("mongoose");

const orderedItemSchema = mongoose.Schema({
 consumerId:{
    type: mongoose.Schema.ObjectId,
    ref: "Consumer",
    required: true,
 },
 sellerId:{
  typeof:mongoose.Schema.ObjectId,
  ref: "User",
  required: true,

 },
 productId:{
  typeof:mongoose.Schema.ObjectId,
  ref: "inventory",
  required: true,
 },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("orderedItem", orderedItemSchema);
