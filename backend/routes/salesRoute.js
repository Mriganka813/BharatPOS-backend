const express = require("express");
const {
  newSalesOrder,
  getSingleSalesOrder,
  mySalesOrders,
  getAllSalesOrders,
  updateSalesOrder,
  deleteSalesOrder,
  getCreditSaleOrders,
} = require("../controllers/salesController");
const router = express.Router();

const cntrl = require("../controllers/salesController");
const {
  isAuthenticatedUser,
  authorizeRoles,
  isAuthenticatedAdmin,
} = require("../middleware/auth");

router.route("/salesOrder/new").post(isAuthenticatedUser, newSalesOrder);

router
  .route("/sales/credit-history/:id")
  .get(isAuthenticatedUser, cntrl.partyCreditHistory);
router.route("/salesOrder/:id").get(isAuthenticatedUser, getSingleSalesOrder);
router.route("/sales/credit").get(isAuthenticatedUser, getCreditSaleOrders);

router.route("/salesOrders/me").get(isAuthenticatedUser, mySalesOrders);

router
  .route("/admin/salesOrders")
  .get(isAuthenticatedAdmin, authorizeRoles("admin"), getAllSalesOrders);

router.route("/salesOrder/:id").delete(isAuthenticatedUser, deleteSalesOrder);
router
  .route("/admin/salesOrder/:id")
  .delete(isAuthenticatedAdmin, authorizeRoles("admin"), deleteSalesOrder);

module.exports = router;
