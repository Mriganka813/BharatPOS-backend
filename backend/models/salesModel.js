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
    },
  ],
  modeOfPayment: {
    type: String,
    enum: ["Cash", "Credit", "Bank Transfer", "Settle"],
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

}
                                       {timestamps:true});

module.exports = mongoose.model("salesModel", salesSchema);
