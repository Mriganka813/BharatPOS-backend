const express = require("express");
const { registerParty } = require("../controllers/partyController");


const router = express.Router();

router.route("/party/new").post(registerParty);

module.exports=router;