import express from "express";
import * as cntlr from "./controller";
import { isAuthenticatedUser, isSubscribed } from "src/middleware/auth";

export const PartyRouter = express
  .Router()
  .get(
    "/party/sale/credit",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getCreditSaleParties
  )
  .get(
    "/party/purchase/credit",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getCreditPurchaseParties
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
  .post("/party/new", isAuthenticatedUser, isSubscribed, cntlr.registerParty)
  .get("/party/search", isAuthenticatedUser, isSubscribed, cntlr.searchParty)
  .get("/party/all", cntlr.getAllParty)
  .get("/party/me", isAuthenticatedUser, isSubscribed, cntlr.getMyParties)
  .get("/party/:id", isAuthenticatedUser, isSubscribed, cntlr.getSingleParty)
  .put(
    "/update/party/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.updateParty
  )
  .delete(
    "/del/party/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.deleteParty
  );
