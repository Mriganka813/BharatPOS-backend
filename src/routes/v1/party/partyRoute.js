const express = require("express");
const { isAuthenticatedUser, isSubscribed } = require("../middleware/auth");

const {
  registerParty,
  getAllParty,
  getSingleParty,
  updateParty,
  deleteParty,
  getMyParties,
  searchParty,
  getCreditSaleParties,
  getCreditPurchaseParties,
} = require("../controllers/partyController");
const cntlr = require("../controllers/partyController");

import * as cntlr from "./controllers";

export const PartyRouter = express
  .Router()
  .get(
    "/party/sale/credit",
    isAuthenticatedUser,
    isSubscribed,
    getCreditSaleParties
  )
  .get(
    "/party/purchase/credit",
    isAuthenticatedUser,
    isSubscribed,
    getCreditPurchaseParties
  )
  .get(
    "/party/purchase/credit/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getCreditPurchaseParty
  )
  .get(
    "/party/sale/credit/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getCreditSaleParty
  )
  .post("/party/new", isAuthenticatedUser, isSubscribed, registerParty)
  .get("/party/search", isAuthenticatedUser, isSubscribed, searchParty)
  .get("/party/all", getAllParty)
  .get("/party/me", isAuthenticatedUser, isSubscribed, getMyParties)
  .get("/party/:id", isAuthenticatedUser, isSubscribed, getSingleParty)
  .put("/update/party/:id", isAuthenticatedUser, isSubscribed, updateParty)
  .delete("/del/party/:id", isAuthenticatedUser, isSubscribed, deleteParty);
