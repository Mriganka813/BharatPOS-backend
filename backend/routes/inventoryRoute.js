const express = require("express");
const {
  getAllInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryDetails,
  getAllInventoriesAndSearch,
  addImage,
  createProductWithImage,
  getInventoryForUser,
  findInventoryByBarcode,
} = require("../controllers/inventoryController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router
  .route("/inventory/barcode/:code")
  .get(isAuthenticatedUser, findInventoryByBarcode);

router.route("/inventories").get(getAllInventoriesAndSearch);
router.route("/inventories/all").get(getAllInventories);

router.route("/inventory/new").post(isAuthenticatedUser, createInventory);

router.route("/inventory/me").get(isAuthenticatedUser, getInventoryForUser);

router.route("/update/inventory/:id").put(isAuthenticatedUser, updateInventory);

router.route("/del/inventory/:id").delete(isAuthenticatedUser, deleteInventory);

router.route("/inventory/:id").get(getInventoryDetails);

module.exports = router;
