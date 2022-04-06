const express = require("express");
const {
  getAllInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryDetails,
  getAllInventoriesAndSearch,
} = require("../controllers/inventoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/inventories").get(getAllInventoriesAndSearch);
router.route("/inventories/all").get(getAllInventories);

router.route("/inventory/new").post(isAuthenticatedUser, createInventory);

router.route("/update/inventory/:id").put(isAuthenticatedUser, updateInventory);

router.route("/del/inventory/:id").delete(isAuthenticatedUser, deleteInventory);

router.route("/inventory/:id").get(getInventoryDetails);

module.exports = router;
