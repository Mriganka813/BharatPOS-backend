const express = require("express");
const {
  addExpense,
  getAllExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { isAuthenticatedUser, isSubscribed } = require("../middleware/auth");

const router = express.Router();

router.route("/add/expense").post(isAuthenticatedUser, isSubscribed, addExpense);

router.route("/expense/all").get(isAuthenticatedUser, isSubscribed, getAllExpense);

router.route("/expense/:id").get(isAuthenticatedUser,  isSubscribed,getSingleExpense);

router.route("/update/expense/:id").put(isAuthenticatedUser,  isSubscribed,updateExpense);

router.route("/del/expense/:id").delete(isAuthenticatedUser,  isSubscribed,deleteExpense);

module.exports = router;
