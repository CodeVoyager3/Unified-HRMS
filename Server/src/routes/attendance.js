const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { verifyLocationInWard } = require('../utils/locationVerification');

/**
 * POST /attendance/checkin
 * Mark attendance with location verification
 */
router.post('/checkin', async (req, res) => {
    try {
        const { employeeId, latitude, longitude, address } = req.body;

        if (!employeeId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID, latitude, and longitude are required'
            });
        }

        // Check if current time is within allowed check-in window (9 AM to 11 AM)
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const startTimeInMinutes = 9 * 60; // 9:00 AM
        const endTimeInMinutes = 11 * 60; // 11:00 AM

        if (currentTimeInMinutes < startTimeInMinutes || currentTimeInMinutes > endTimeInMinutes) {
            return res.status(403).json({
                success: false,
                message: 'Attendance can only be marked between 9:00 AM and 11:00 AM',
                currentTime: now.toLocaleTimeString(),
                allowedTime: '9:00 AM - 11:00 AM'
            });
        }

        // Get employee details
        const employee = await User.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Verify location
        const locationVerification = verifyLocationInWard(
            latitude,
            longitude,
            employee.Ward,
            employee.Zone,
            1000 // 1km radius allowed
        );

        if (!locationVerification.isValid) {
            return res.status(403).json({
                success: false,
                message: locationVerification.message,
                distance: locationVerification.distance,
                isLocationVerified: false
            });
        }

        // Check if attendance already marked for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setMinutes(0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);

        const existingAttendance = await Attendance.findOne({
            employeeId,
            date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            }
        });

        if (existingAttendance && existingAttendance.checkInTime) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for today'
            });
        }

        // Create or update attendance record
        const attendanceData = {
            employeeId,
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            checkInTime: new Date(),
            location: {
                latitude,
                longitude,
                address: address || 'Address not provided'
            },
            status: 'present',
            isLocationVerified: true,
            assignedWard: employee.Ward,
            assignedZone: employee.Zone
        };

        let attendance;
        if (existingAttendance) {
            attendance = await Attendance.findByIdAndUpdate(
                existingAttendance._id,
                attendanceData,
                { new: true }
            );
        } else {
            attendance = new Attendance(attendanceData);
            await attendance.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            attendance: {
                checkInTime: attendance.checkInTime,
                location: attendance.location,
                isLocationVerified: attendance.isLocationVerified,
                distance: locationVerification.distance
            }
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * POST /attendance/checkout
 * Mark checkout time
 */
router.post('/checkout', async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setMinutes(0, 0, 0);

        const attendance = await Attendance.findOne({
            employeeId,
            date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            }
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'No check-in found for today'
            });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({
                success: false,
                message: 'Check-out already marked for today'
            });
        }

        attendance.checkOutTime = new Date();
        await attendance.save();

        return res.status(200).json({
            success: true,
            message: 'Check-out marked successfully',
            checkOutTime: attendance.checkOutTime
        });
    } catch (error) {
        console.error('Error marking checkout:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /attendance/verify-location
 * Verify if current location is within assigned ward (before check-in)
 */
router.post('/verify-location', async (req, res) => {
    try {
        const { employeeId, latitude, longitude } = req.body;

        if (!employeeId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID, latitude, and longitude are required'
            });
        }

        const employee = await User.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const locationVerification = verifyLocationInWard(
            latitude,
            longitude,
            employee.Ward,
            employee.Zone,
            1000 // 1km radius
        );

        return res.status(200).json({
            success: true,
            isLocationVerified: locationVerification.isValid,
            message: locationVerification.message,
            distance: locationVerification.distance,
            assignedWard: employee.Ward,
            assignedZone: employee.Zone
        });
    } catch (error) {
        console.error('Error verifying location:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /attendance/:employeeId
 * Get attendance records for an employee (for calendar view)
 */
router.get('/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { month, year } = req.query;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }

        // Calculate date range for the month
        const queryDate = month && year 
            ? new Date(year, month - 1, 1)
            : new Date();
        
        const startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        const endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Format for calendar display
        const attendanceMap = {};
        attendanceRecords.forEach(record => {
            const day = record.date.getDate();
            attendanceMap[day] = {
                status: record.status,
                checkInTime: record.checkInTime,
                checkOutTime: record.checkOutTime,
                isLocationVerified: record.isLocationVerified
            };
        });

        return res.status(200).json({
            success: true,
            attendance: attendanceMap,
            records: attendanceRecords
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /attendance/today/:employeeId
 * Get today's attendance status
 */
router.get('/today/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setMinutes(0, 0, 0);

        const attendance = await Attendance.findOne({
            employeeId,
            date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            }
        });

        return res.status(200).json({
            success: true,
            attendance: attendance || null,
            hasCheckedIn: !!attendance?.checkInTime,
            hasCheckedOut: !!attendance?.checkOutTime
        });
    } catch (error) {
        console.error('Error fetching today attendance:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;

