const express = require("express");
const { registerParty, getAllParty, getSingleParty, updateParty, deleteParty } = require("../controllers/partyController");

const router = express.Router();

router.route("/party/new").post(registerParty);


router.route("/party/all").get(getAllParty);

router.route("/party/:id").get(getSingleParty);

router.route("/update/party/:id").put(updateParty);

router.route("/del/party/:id").delete( deleteParty);

module.exports = router;
