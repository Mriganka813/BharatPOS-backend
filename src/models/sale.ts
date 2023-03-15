import { Schema, Types, model } from "mongoose";

const salesSchema = new Schema({
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
        type: Types.ObjectId,
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
    type: Types.ObjectId,
    ref: "Party",
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Sale = model("salesModel", salesSchema);
