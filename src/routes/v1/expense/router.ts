import express from "express";
import * as cntrl from "./controller";
import { isAuthenticatedUser, isSubscribed } from "src/middleware/auth";

const router = express.Router();

router
  .route("/add/expense")
  .post(isAuthenticatedUser, isSubscribed, cntrl.addExpense);

router
  .route("/expense/all")
  .get(isAuthenticatedUser, isSubscribed, cntrl.getAllExpense);

router
  .route("/expense/:id")
  .get(isAuthenticatedUser, isSubscribed, cntrl.getSingleExpense);

router
  .route("/update/expense/:id")
  .put(isAuthenticatedUser, isSubscribed, cntrl.updateExpense);

router
  .route("/del/expense/:id")
  .delete(isAuthenticatedUser, isSubscribed, cntrl.deleteExpense);

module.exports = router;
