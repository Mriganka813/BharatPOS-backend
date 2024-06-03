const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const moment = require('moment-timezone');
const Attendance = require("../models/attendanceModel");
const Party = require("../models/partyModel");

//-----Helper functions-----
function currentDate() {
    const indiaTime = moment.tz('Asia/Kolkata');
    const currentDateTimeInIndia = indiaTime.add(0, 'days').format('YYYY-MM-DD');
    return currentDateTimeInIndia;
}

// Mark attendance
exports.markAttendance = catchAsyncErrors(async (req, res, next) => {
    const { party, status } = req.body;
    const userId = req.user._id;

    const partyExists = await Party.findOne({ _id: party, user: userId });
    if (!partyExists) {
        return res.status(404).json({
            success: false,
            message: 'Party not found or does not belong to the current user',
        });
    }

    let attendanceRecord = await Attendance.findOne({ party }).populate('party');

    if (!attendanceRecord) {
        attendanceRecord = await Attendance.create({ party });
    }

    const currentDateStr = currentDate();
    const isDateInArray = (date, array) => array.some(d => moment(d).format('YYYY-MM-DD') === date);

    if (
        isDateInArray(currentDateStr, attendanceRecord.present) ||
        isDateInArray(currentDateStr, attendanceRecord.absent) ||
        isDateInArray(currentDateStr, attendanceRecord.sickLeaves) ||
        isDateInArray(currentDateStr, attendanceRecord.casualLeaves)
    ) {
        return res.status(400).json({
            success: false,
            message: 'The date is already recorded in one of the attendance statuses',
        });
    }

    switch (status) {
        case 'present':
            attendanceRecord.present.push(currentDateStr);
            break;
        case 'absent':
            attendanceRecord.absent.push(currentDateStr);
            break;
        case 'sickLeave':
            attendanceRecord.sickLeaves.push(currentDateStr);
            break;
        case 'casualLeave':
            attendanceRecord.casualLeaves.push(currentDateStr);
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Invalid status provided',
            });
    }

    await attendanceRecord.save();

    res.status(201).json({
        success: true,
        attendanceRecord,
    });
});


//Get attendance details of a party --> Using party id
exports.getAttendance = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params;
    const userId = req.user._id;
    const partyExists = await Party.findOne({ _id: id, user: userId });
    if (!partyExists) {
        return res.status(404).json({
            success: false,
            message: 'Party not found or does not belong to the current user',
        });
    }

    const foundAttendance = await Attendance.findOne({ party: id });

    if (!foundAttendance) {
        return res.status(404).json({
            success: false,
            message: 'Attendance details not found for the party',
        });
    }

    res.status(200).json({
        success: true,
        attendanceDetails: foundAttendance,
        attendanceTotalDetails: {
            totalPresent: foundAttendance.present.length,
            totalAbsent: foundAttendance.absent.length,
            totalCasualLeaves: foundAttendance.casualLeaves.length,
            totalSickLeaves: foundAttendance.sickLeaves.length,
        },
    });
});

//edit attendance
exports.editAttendance = catchAsyncErrors(async (req, res, next) => {
    const { date, status } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    const partyExists = await Party.findOne({ _id: id, user: userId });
    if (!partyExists) {
        return res.status(404).json({
            success: false,
            message: 'Party not found or does not belong to the current user',
        });
    }

    let attendanceRecord = await Attendance.findOne({ party: id }).populate('party');
    if (!attendanceRecord) {
        return res.status(404).json({
            success: false,
            message: 'Attendance record not found',
        });
    }

    // Remove the specified date from all status arrays
    attendanceRecord.present = attendanceRecord.present.filter(d => d !== date);
    attendanceRecord.absent = attendanceRecord.absent.filter(d => d !== date);
    attendanceRecord.sickLeaves = attendanceRecord.sickLeaves.filter(d => d !== date);
    attendanceRecord.casualLeaves = attendanceRecord.casualLeaves.filter(d => d !== date);

    // Append the date to the specified status array
    switch (status) {
        case 'present':
            attendanceRecord.present.push(date);
            break;
        case 'absent':
            attendanceRecord.absent.push(date);
            break;
        case 'sickLeave':
            attendanceRecord.sickLeaves.push(date);
            break;
        case 'casualLeave':
            attendanceRecord.casualLeaves.push(date);
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Invalid status provided',
            });
    }

    // Save the updated attendance record
    await attendanceRecord.save();

    res.status(200).json({
        success: true,
        attendanceRecord,
    });
});
