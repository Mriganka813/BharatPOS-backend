const express = require("express");
const { getAllInventories, createInventory, updateInventory, deleteInventory, getInventoryDetails, createInventoryReview, deleteReview, getInventoryReviews, getAdminInventories, deleteBarcode } = require("../controllers/inventoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/inventories").get(getAllInventories);

router
  .route("/admin/inventories")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminInventories);

router
  .route("/admin/inventory/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createInventory);

router
  .route("/admin/inventory/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateInventory)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteInventory);

router.route("/inventory/:id").get(getInventoryDetails);

router.route("/inventory/barcode/:id").delete(deleteBarcode);

// router.route("/review").put(isAuthenticatedUser, createInventoryReview);

// router
//   .route("/reviews")
//   .get(getInventoryReviews)
//   .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
