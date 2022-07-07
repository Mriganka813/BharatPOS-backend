const express = require("express");
const {
  getAllInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryDetails,
  getAllInventoriesAndSearch,
  getInventoryForUser,
  findInventoryByBarcode,
} = require("../controllers/inventoryController");
const { isAuthenticatedUser, isSubscribed } = require("../middleware/auth");

const router = express.Router();

router
  .route("/inventory/barcode/:code")
  .get(isAuthenticatedUser,isSubscribed, findInventoryByBarcode);

router
  .route("/inventories")
  .get(isAuthenticatedUser,isSubscribed, getAllInventoriesAndSearch);

router.route("/inventories/all").get(isAuthenticatedUser,isSubscribed, getAllInventories);

router.route("/inventory/new").post(isAuthenticatedUser, isSubscribed ,createInventory);

router.route("/inventory/me").get(isAuthenticatedUser,isSubscribed, getInventoryForUser);

router.route("/update/inventory/:id").put(isAuthenticatedUser,isSubscribed, updateInventory);

router.route("/del/inventory/:id").delete(isAuthenticatedUser,isSubscribed, deleteInventory);

router.route("/inventory/:id").get(isAuthenticatedUser,isSubscribed, getInventoryDetails);

module.exports = router;
