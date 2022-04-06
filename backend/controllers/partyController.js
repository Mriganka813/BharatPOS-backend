// const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Party = require("../models/partyModel");
// const sendToken = require("../utils/jwtToken");

// create new party
exports.registerParty = catchAsyncErrors(async (req, res, next) => {
  const { name, address, phoneNumber } = req.body;

  const party = await Party.create({
    name,
    address,
    phoneNumber,
  });

  const token = party.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(201).cookie("token", token, options).json({
    success: true,
    party,
    token,
  });

  // sendToken(party, 201, res);
});
