const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");

const {
  registerParty,
  getAllParty,
  getSingleParty,
  updateParty,
  deleteParty,
  getMyParties,
  searchParty,
} = require("../controllers/partyController");

const router = express.Router();

router.route("/party/new").post(isAuthenticatedUser, registerParty);
router.route("/party/search").get(isAuthenticatedUser, searchParty);

router.route("/party/all").get(getAllParty);
router.route("/party/me").get(isAuthenticatedUser, getMyParties);

router.route("/party/:id").get(getSingleParty);

router.route("/update/party/:id").put(updateParty);

router.route("/del/party/:id").delete(deleteParty);

module.exports = router;
