const mongoose = require("mongoose");

const ratingItemSchema = mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
    },
    rating: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingItemSchema);
module.exports = Rating;
