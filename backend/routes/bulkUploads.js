const express = require("express");
const router = express.Router();
const xlsx = require('xlsx');
const { bulkUpload} = require("../controllers/bulkController");
const { isAuthenticatedAgent } = require("../middleware/auth");

router.route('/upload1').post(bulkUpload)

module.exports = router;