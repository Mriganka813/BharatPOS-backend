const ErrorHandler = require("../utils/errorhandler");
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


exports.getAllParty = catchAsyncErrors(async (req, res, next) => {
  const allParty = await Party.find();

  res.status(200).json({
    success: true,
    allParty,
  });
});

exports.getSingleParty = catchAsyncErrors(async (req, res, next) => {
  const party = await Party.findById(req.params.id);

  if (!party) {
    return next(new ErrorHandler("party not found", 404));
  }

  res.status(200).json({
    success: true,
    party,
  });
});

exports.updateParty = catchAsyncErrors(async (req, res, next) => {
  let party = await Party.findById(req.params.id);

  if (!party) {
    return next(new ErrorHandler("party not found", 404));
  }

  party = await Party.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    party,
  });
});

exports.deleteParty= catchAsyncErrors(async (req, res, next) => {
  const party = await Party.findById(req.params.id);

  if (!party) {
    return next(new ErrorHandler("party not found", 404));
  }

  await party.remove();

  res.status(200).json({
    success: true,
    message: "party Deleted Successfully",
  });
});
