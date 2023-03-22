const express = require("express");
const {
  newPurchaseOrder,
  getSinglePurchaseOrder,
  myPurchaseOrders,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getCreditPurchaseOrders,
  updatePurchaseOrders,
} = require("../controllers/purchaseController");
const router = express.Router();

const {
  isAuthenticatedUser,
  authorizeRoles,
  isAuthenticatedAdmin,
  isSubscribed,
} = require("../middleware/auth");
const cntlr = require("../controllers/purchaseController");

router.route("/purchaseOrder/new").post(isAuthenticatedUser,isSubscribed, newPurchaseOrder);

router
  .route("/purchaseOrder/:id")
  .get(isAuthenticatedUser,  isSubscribed,getSinglePurchaseOrder);

router
  .route("/purchase/credit-history/:id")
  .get(isAuthenticatedUser, isSubscribed, cntlr.partyCreditHistory)
  .post(isAuthenticatedUser, isSubscribed, cntlr.addCreditHistoryTransaction);

router.route("/purchaseOrders/me").get(isAuthenticatedUser, isSubscribed, myPurchaseOrders);
router
  .route("/purchaseOrders/me/credit")
  .get(isAuthenticatedUser,  isSubscribed,getCreditPurchaseOrders);

router
  .route("/admin/purchaseOrders")
  .get(isAuthenticatedAdmin, authorizeRoles("admin"), getAllPurchaseOrders);

router
  .route("/purchaseOrder/:id")
  .delete(isAuthenticatedUser, isSubscribed, deletePurchaseOrder);

router
  .route("/upd/purchaseOrder/:id")
  .put(isAuthenticatedUser,  isSubscribed,updatePurchaseOrders);

router
  .route("/admin/purchaseOrder/:id")
  .put(isAuthenticatedAdmin, authorizeRoles("admin"), updatePurchaseOrder)
  .delete(isAuthenticatedAdmin, authorizeRoles("admin"), deletePurchaseOrder);

module.exports = router;
