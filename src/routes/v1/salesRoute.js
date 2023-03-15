const express = require("express");
const {
  newSalesOrder,
  getSingleSalesOrder,
  mySalesOrders,
  getAllSalesOrders,
  deleteSalesOrder,
  getCreditSaleOrders,
  UpdateSalesOrder,
} = require("../../controllers/salesController");
const cntlr = require("../../controllers/salesController");
const router = express.Router();

const cntrl = require("../../controllers/salesController");
const {
  isAuthenticatedUser,
  authorizeRoles,
  isAuthenticatedAdmin,
  isSubscribed,
} = require("../../middleware/auth");

router
  .route("/salesOrder/new")
  .post(isAuthenticatedUser, isSubscribed, newSalesOrder);

router
  .route("/sales/credit-history/:id")
  .get(isAuthenticatedUser, isSubscribed, cntrl.partyCreditHistory)
  .post(isAuthenticatedUser, isSubscribed, cntrl.addCreditSettleTransaction);
router
  .route("/salesOrder/:id")
  .get(isAuthenticatedUser, isSubscribed, getSingleSalesOrder);
router
  .route("/sales/credit")
  .get(isAuthenticatedUser, isSubscribed, getCreditSaleOrders);

router
  .route("/salesOrders/me")
  .get(isAuthenticatedUser, isSubscribed, mySalesOrders);

router
  .route("/admin/salesOrders")
  .get(isAuthenticatedAdmin, authorizeRoles("admin"), getAllSalesOrders);

router
  .route("/salesOrder/:id")
  .delete(isAuthenticatedUser, isSubscribed, deleteSalesOrder);
router
  .route("/admin/salesOrder/:id")
  .delete(isAuthenticatedAdmin, authorizeRoles("admin"), deleteSalesOrder);

router
  .route("/upd/salesOrder/:id")
  .put(isAuthenticatedUser, isSubscribed, UpdateSalesOrder);
module.exports = router;
