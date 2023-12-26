const express = require("express");

const { isAuthenticatedUser } = require("../middleware/auth");
const { createEstimate, updateEstimate, convertEstimateToSalesOrder } = require("../controllers/estimateController");

const router = express.Router();

router.route("/estimate/new").post(isAuthenticatedUser, createEstimate);

router.route("/estimate/:id")
.put(isAuthenticatedUser, updateEstimate)
.post(isAuthenticatedUser, convertEstimateToSalesOrder);

module.exports = router;