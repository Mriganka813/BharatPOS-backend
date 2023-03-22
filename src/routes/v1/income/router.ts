import { isAuthenticatedUser, isSubscribed } from "src/middleware/auth";

import express from "express";

import * as cntlr from "./controller";

export const IncomeRouter = express
  .Router()
  .post("/add/income", isAuthenticatedUser, isSubscribed, cntlr.addIncome)
  .get("/income/all", isAuthenticatedUser, isSubscribed, cntlr.getAllIncome)
  .get("/income/:id", isAuthenticatedUser, isSubscribed, cntlr.getSingleIncome)
  .put(
    "/update/income/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.updateIncome
  )
  .delete(
    "/del/income/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.deleteIncome
  );
