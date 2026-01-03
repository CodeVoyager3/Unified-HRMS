const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const User = require('../models/User');

console.log("--> Payroll Route Loaded"); // Debug check

/**
 * POST /calculate
 */
const { calculateExpectedSalary } = require('../services/payrollService');
const Attendance = require('../models/Attendance');

console.log("--> Payroll Route Loaded"); // Debug check

/**
 * POST /calculate
 * Calculate payroll for all employees
 */

// Helper: count weekdays (Mon-Fri) between two dates (inclusive start, inclusive end)
function countWeekdays(startDate, endDate) {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    let count = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) count++;
    }
    return count;
}

// Calculate payroll for an employee for a given month/year
// POST /payroll/calculate
// body: { employeeId, month (1-12), year, baseSalary?, overtimeHours? }
router.post('/calculate', async (req, res) => {
    try {
        const { employeeId, month, year, baseSalary: baseSalaryInput, overtimeHours: overtimeInput } = req.body;

        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'employeeId is required' });
        }

        const user = await User.findOne({ employeeId });
        if (!user) return res.status(404).json({ success: false, message: 'Employee not found' });

        const now = new Date();
        const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1; // 1-12
        const targetYear = year ? parseInt(year, 10) : now.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0); // last day of month

        // Query attendance for that employee in month
        const attendanceRecords = await Attendance.find({
            employeeId: user.employeeId,
            date: { $gte: startDate, $lte: endDate }
        });

        // Count paid days: present or leave or has checkInTime
        const paidDays = attendanceRecords.filter(r => r.status === 'present' || r.status === 'leave' || !!r.checkInTime).length;

        // Determine working days in month (weekdays)
        // Determine working days in month (weekdays)
        const workingDays = countWeekdays(startDate, endDate);

        // Base salary fallback
        const baseSalary = baseSalaryInput ? Number(baseSalaryInput) : (user.baseSalary ? user.baseSalary : 45000);

        // Fetch employment status for rules
        const isPermanent = user.employmentStatus === 'Permanent';

        // Allowances Calculation
        let da = 0;
        let hra = 0;
        let ta = 0;

        if (isPermanent) {
            da = 0.50 * baseSalary;     // 50% of basic
            hra = 0.27 * baseSalary;    // 27% of basic
            ta = 2400;                  // Fixed
        }

        const allowances = {
            da,
            hra,
            ta,
            medical: 0
        };

        // Gross Salary (Base + Allowances)
        const grossOfAllowances = baseSalary + da + hra + ta;

        // Payable Gross Calculation
        // Rule: Total gross salary (Base + Allowances) must be divided by 30 and multiplied by daysPresent
        // The Prompt said: "The total gross salary (Base + Allowances) must be divided by 30 and multiplied by daysPresent"
        const payableGross = (grossOfAllowances / 30) * paidDays;

        // Overtime Hours
        const overtimeHours = overtimeInput ? Number(overtimeInput) : 0;
        // Rule: overtimeHours * 150
        const overtimePay = overtimeHours * 150;

        // Deductions
        let pfDeductions = 0;
        if (isPermanent) {
            // Rule: 12% of (Basic + DA)
            pfDeductions = 0.12 * (baseSalary + da);
        }

        const taxDeductions = 200; // Fixed for everyone
        const totalDeductions = pfDeductions + taxDeductions;

        // Net Amount
        const netAmount = Math.round(payableGross + overtimePay - totalDeductions);

        // Upsert payroll record for employee/month/year
        const monthLabel = startDate.toLocaleString('en-US', { month: 'long' }) + ' ' + targetYear;

        let payroll = await Payroll.findOne({ userId: user._id, monthIndex: targetMonth, year: targetYear });

        const payrollData = {
            userId: user._id,
            month: monthLabel,
            monthIndex: targetMonth,
            year: targetYear,
            baseSalary,
            daysPresent: paidDays,
            overtimeHours,
            taxDeductions,
            pfDeductions,
            netAmount,
            status: 'Pending',
            allowances
        };

        if (payroll) {
            Object.assign(payroll, payrollData);
            await payroll.save();
        } else {
            payroll = new Payroll(payrollData);
            await payroll.save();
        }

        return res.status(200).json({ success: true, payroll });

    } catch (error) {
        console.error('Error calculating payroll:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Get payroll history for an employee
// GET /payroll/employee/:employeeId?year=&month=
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { year, month } = req.query;

        if (!employeeId) return res.status(400).json({ success: false, message: 'employeeId required' });

        const user = await User.findOne({ employeeId });
        if (!user) return res.status(404).json({ success: false, message: 'Employee not found' });

        const query = { userId: user._id };
        if (year) query.year = Number(year);
        if (month) query.monthIndex = Number(month);

        const payrolls = await Payroll.find(query).sort({ year: -1, monthIndex: -1 });
        return res.status(200).json({ success: true, payrolls });
    } catch (error) {
        console.error('Error fetching payroll history:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Get single payroll slip
// GET /payroll/slip/:payrollId
router.get('/slip/:payrollId', async (req, res) => {
    try {
        const { payrollId } = req.params;
        const payroll = await Payroll.findById(payrollId).populate('userId', 'name employeeId email');
        if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found' });
        return res.status(200).json({ success: true, payroll });
    } catch (error) {
        console.error('Error fetching payroll slip:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});



// Get employee salary structure/projection
// GET /payroll/structure/:employeeId
router.get('/structure/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const user = await User.findOne({ employeeId });
        if (!user) return res.status(404).json({ success: false, message: 'Employee not found' });

        // 1. Fetch Current Month Attendance Stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endOfToday.setHours(23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: { $gte: startOfMonth, $lte: endOfToday }
        });

        const daysElapsed = now.getDate(); // e.g., 3rd day
        const presentDays = attendanceRecords.filter(r => r.status === 'present' || r.checkInTime).length;

        // TODO: Fetch approved leaves from a Leave model if/when implemented
        const approvedLeaves = 0;
        const absentDays = Math.max(0, daysElapsed - presentDays - approvedLeaves);

        const salaryStructure = calculateExpectedSalary(user, presentDays, daysElapsed, approvedLeaves);

        let warningMessage = null;
        if (salaryStructure.isEstimate) {
            warningMessage = "This is your projected monthly salary. It is subject to change and may deduce based on your attendance and geo-fencing logs throughout the month.";
        }

        return res.status(200).json({
            success: true,
            structure: {
                ...salaryStructure,
                attendanceArgs: { daysElapsed, presentDays, absentDays, approvedLeaves },
                message: warningMessage
            }
        });

    } catch (error) {
        console.error('Error fetching salary structure:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /payroll/ward/:wardId
// Get payroll summary for all employees in a ward
router.get('/ward/:wardId', async (req, res) => {
    try {
        const { wardId } = req.params;
        const wardNum = parseInt(wardId);
        const users = await User.find({ Ward: wardNum, role: { $in: ['Worker', 'Staff'] } });

        const summary = await Promise.all(users.map(async (user) => {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endOfToday.setHours(23, 59, 59, 999);

            const attendanceRecords = await Attendance.find({
                employeeId: user.employeeId,
                date: { $gte: startOfMonth, $lte: endOfToday }
            });

            const daysElapsed = now.getDate();
            const presentDays = attendanceRecords.filter(r => r.status === 'present' || r.checkInTime).length;
            const attendancePerm = daysElapsed > 0 ? Math.round((presentDays / daysElapsed) * 100) : 0;

            const salaryStructure = calculateExpectedSalary(user, presentDays, daysElapsed, 0);

            return {
                id: user.employeeId,
                name: user.firstName + ' ' + user.lastName,
                role: user.designation || 'Worker',
                performance: attendancePerm,
                salary: salaryStructure.projectedNet.toLocaleString(),
                overtime: '0 hrs',
                attendance: attendancePerm + '%',
                phone: user.phoneNumber,
                baseSalary: (user.baseSalary || 15000).toLocaleString()
            };
        }));

        res.json({ success: true, employees: summary });
    } catch (error) {
        console.error('Error fetching ward payroll:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;

