import { Schema, Types, model } from "mongoose";

/// commit
const purchaseSchema = new Schema({
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
        type: Types.ObjectId,
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
    type: Types.ObjectId,
    ref: "Party",
    required: false,
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
export const Purchase = model("PurchaseModel", purchaseSchema);
