import express from "express";
import * as cntlr from "./controller";
import { isAuthenticatedUser, isSubscribed } from "src/middleware/auth";

export const InventoryRouter = express
  .Router()
  .get(
    "/inventory/barcode/:code",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.findInventoryByBarcode
  )
  .get(
    "/inventories",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getAllInventoriesAndSearch
  )
  .get(
    "/inventories/all",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getAllInventories
  )
  .post(
    "/inventory/new",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.createInventory
  )
  .get(
    "/inventory/me",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getInventoryForUser
  )
  .put(
    "/update/inventory/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.updateInventory
  )
  .delete(
    "/del/inventory/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.deleteInventory
  )
  .get(
    "/inventory/:id",
    isAuthenticatedUser,
    isSubscribed,
    cntlr.getInventoryDetails
  );
