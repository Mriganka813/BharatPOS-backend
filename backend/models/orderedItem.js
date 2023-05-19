const mongoose = require("mongoose");

const orderedItemSchema = mongoose.Schema({
 userId:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
 },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("orderedItem", orderedItemSchema);
