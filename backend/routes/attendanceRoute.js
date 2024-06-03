const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const { markAttendance, getAttendance, editAttendance } = require('../controllers/attendanceController');

router.post("/mark", isAuthenticatedUser, markAttendance);
router.get("/:id", isAuthenticatedUser, getAttendance);
router.put("/:id", isAuthenticatedUser, editAttendance);

module.exports = router; 