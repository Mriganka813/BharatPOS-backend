const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your party name"],
    unique: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  address: {
    type: String,
    // required: [true, "Please enter your address"],
    maxLength: [200, "Name cannot exceed 30 characters"],
    minLength: [5, "Name should have more than 4 characters"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please enter your phone Number"],
    maxlength: [10, "Phone number cannot exceed more than 10"],
  },
  receivedAmount: {
    type: Number,
  },
  givenAmount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// JWT TOKEN
partySchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("Party", partySchema);
