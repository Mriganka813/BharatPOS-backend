const express = require("express");
const {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  getSingleIncome,
} = require("../controllers/incomeController");
const { isAuthenticatedUser, isSubscribed } = require("../middleware/auth");

const router = express.Router();

router.route("/add/income").post(isAuthenticatedUser, isSubscribed, addIncome);

router.route("/income/all").get(isAuthenticatedUser, isSubscribed, getAllIncome);

router.route("/income/:id").get(isAuthenticatedUser, isSubscribed, getSingleIncome);

router.route("/update/income/:id").put(isAuthenticatedUser, isSubscribed, updateIncome);

router.route("/del/income/:id").delete(isAuthenticatedUser, isSubscribed, deleteIncome);

module.exports = router;
