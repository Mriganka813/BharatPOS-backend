const express = require("express");
const { isAuthenticatedUser, isSubscribed } = require("../middleware/auth");

const {
  registerParty,
  getAllParty,
  getSingleParty,
  updateParty,
  deleteParty,
  getMyParties,
  searchParty,
  getCreditSaleParties,
  getCreditPurchaseParties,
} = require("../controllers/partyController");
const cntlr = require("../controllers/partyController");
const router = express.Router();

router
  .route("/party/sale/credit")
  .get(isAuthenticatedUser,isSubscribed, getCreditSaleParties);
router
  .route("/party/purchase/credit")
  .get(isAuthenticatedUser,isSubscribed, getCreditPurchaseParties);
router
  .route("/party/purchase/credit/:id")
  .get(isAuthenticatedUser,isSubscribed, cntlr.getCreditPurchaseParty);
router
  .route("/party/sale/credit/:id")
  .get(isAuthenticatedUser,isSubscribed, cntlr.getCreditSaleParty);
router.route("/party/new").post(isAuthenticatedUser,isSubscribed, registerParty);
router.route("/party/search").get(isAuthenticatedUser,isSubscribed, searchParty);

router.route("/party/all").get(getAllParty);
router.route("/party/me").get(isAuthenticatedUser, isSubscribed,getMyParties);

router.route("/party/:id").get(isAuthenticatedUser,isSubscribed,getSingleParty);

router.route("/update/party/:id").put(isAuthenticatedUser,isSubscribed,updateParty);

router.route("/del/party/:id").delete(isAuthenticatedUser,isSubscribed,deleteParty);

module.exports = router;
