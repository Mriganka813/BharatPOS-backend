import { Schema, model } from "mongoose";

const otpSchema = new Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: 300,
      },
    },
  },
  { timestamps: true }
);

export const Otp = model("otpModel", otpSchema);
