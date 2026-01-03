const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const EmployeeIssue = require('../models/EmployeeIssue');

// GET /inspector/stats/:wardId
// Returns aggregated stats for the dashboard overview
router.get('/stats/:wardId', async (req, res) => {
    try {
        const { wardId } = req.params;
        const wardNum = parseInt(wardId);

        if (isNaN(wardNum)) {
            return res.status(400).json({ success: false, message: 'Invalid Ward ID' });
        }

        // 1. Total Ward Employees (Worker & Staff)
        const totalEmployees = await User.countDocuments({
            Ward: wardNum,
            role: { $in: ['Worker', 'Staff'] }
        });

        // 2. Present Today
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endOfToday.setHours(23, 59, 59, 999);

        // Find employees in this ward to check their attendance
        const wardUsers = await User.find({ Ward: wardNum, role: { $in: ['Worker', 'Staff'] } }).select('employeeId');
        const wardUserIds = wardUsers.map(u => u.employeeId);

        let presentCount = 0;
        if (wardUserIds.length > 0) {
            presentCount = await Attendance.countDocuments({
                employeeId: { $in: wardUserIds },
                date: { $gte: startOfToday, $lte: endOfToday },
                $or: [{ status: 'present' }, { checkInTime: { $exists: true } }]
            });
        }

        // 3. Pending Issues
        const pendingIssues = await EmployeeIssue.countDocuments({
            ward: wardNum,
            Status: 'Pending'
        });

        // 4. Completion Rate (Resolved / Total)
        const totalIssues = await EmployeeIssue.countDocuments({ ward: wardNum });
        const resolvedIssues = await EmployeeIssue.countDocuments({ ward: wardNum, Status: 'Resolved' });
        const completionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;

        res.json({
            success: true,
            stats: {
                totalEmployees,
                presentToday: presentCount,
                pendingIssues,
                completionRate
            }
        });

    } catch (error) {
        console.error('Error fetching inspector stats:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
