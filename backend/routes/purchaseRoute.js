const express = require("express");
const {
  newPurchaseOrder,
  getSinglePurchaseOrder,
  myPurchaseOrders,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require("../controllers/purchaseController");

const router = express.Router();

const {
  isAuthenticatedUser,
  authorizeRoles,
  isAuthenticatedAdmin,
} = require("../middleware/auth");

router.route("/purchaseOrder/new").post(isAuthenticatedUser, newPurchaseOrder);

router
  .route("/purchaseOrder/:id")
  .get(isAuthenticatedUser, getSinglePurchaseOrder);

router.route("/purchaseOrders/me").get(isAuthenticatedUser, myPurchaseOrders);

router
  .route("/admin/purchaseOrders")
  .get(isAuthenticatedAdmin, authorizeRoles("admin"), getAllPurchaseOrders);

router
  .route("/purchaseOrder/:id")
  .delete(isAuthenticatedUser, deletePurchaseOrder);

router
  .route("/admin/purchaseOrder/:id")
  .put(isAuthenticatedAdmin, authorizeRoles("admin"), updatePurchaseOrder)
  .delete(isAuthenticatedAdmin, authorizeRoles("admin"), deletePurchaseOrder);

module.exports = router;
