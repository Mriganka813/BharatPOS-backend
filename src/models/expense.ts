import { Schema, model, Types } from "mongoose";

const ExpenseSchema = new Schema({
  header: {
    type: String,
    required: [true, "Please Enter income header"],
    trim: true,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, "Please Enter expense amount"],
    minLength: [1, "Price should atleast be 1 character"],
  },
  modeOfPayment: {
    type: String,
    required: [true, "Please choose your mode of payment"],
    $in: ["cash", "bank_transfer"],
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

export const Expense = model("expenseModel", ExpenseSchema);
