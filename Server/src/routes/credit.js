const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const User = require('../models/User');

/**
 * GET /credit/top-performers/:ward
 * Get top performers of the month based on total credits received
 */
router.get('/top-performers/:ward', async (req, res) => {
    try {
        const { ward } = req.params;
        const { month, year, limit = 5 } = req.query;

        const now = new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
        const targetYear = year ? parseInt(year) : now.getFullYear();

        // Get all employees in the ward
        const wardEmployees = await User.find({
            Ward: parseInt(ward),
            role: { $in: ['Worker', 'Staff'] }
        }).select('employeeId name role department');

        if (!wardEmployees || wardEmployees.length === 0) {
            return res.status(200).json({
                success: true,
                performers: [],
                message: 'No employees found in this ward'
            });
        }

        const employeeIds = wardEmployees.map(emp => emp.employeeId);

        // Get all credits for this month
        const credits = await Credit.find({
            employeeId: { $in: employeeIds },
            month: targetMonth,
            year: targetYear
        });

        // Calculate total credits per employee
        const creditMap = {};
        credits.forEach(credit => {
            if (!creditMap[credit.employeeId]) {
                creditMap[credit.employeeId] = {
                    totalCredits: 0,
                    weeks: []
                };
            }
            creditMap[credit.employeeId].totalCredits += credit.credit;
            creditMap[credit.employeeId].weeks.push({
                week: credit.week,
                credit: credit.credit
            });
        });

        // Combine with employee info and sort by total credits
        const performers = wardEmployees.map(emp => {
            const creditData = creditMap[emp.employeeId] || { totalCredits: 0, weeks: [] };
            return {
                employeeId: emp.employeeId,
                name: emp.name,
                role: emp.role,
                department: emp.department,
                totalCredits: creditData.totalCredits,
                weeks: creditData.weeks,
                averageCredit: creditData.weeks.length > 0 
                    ? (creditData.totalCredits / creditData.weeks.length).toFixed(1)
                    : '0.0'
            };
        });

        // Sort by total credits (descending) and limit
        performers.sort((a, b) => b.totalCredits - a.totalCredits);
        const topPerformers = performers.slice(0, parseInt(limit));

        return res.status(200).json({
            success: true,
            performers: topPerformers,
            month: targetMonth,
            year: targetYear,
            ward: parseInt(ward)
        });
    } catch (error) {
        console.error('Error fetching top performers:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * POST /credit/assign
 * Assign credit to an employee
 */
router.post('/assign', async (req, res) => {
    try {
        const { employeeId, week, month, year, credit, assignedBy, remarks } = req.body;

        if (!employeeId || !week || !month || !year || credit === undefined || !assignedBy) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID, week, month, year, credit, and assignedBy are required'
            });
        }

        if (credit < 0 || credit > 10) {
            return res.status(400).json({
                success: false,
                message: 'Credit must be between 0 and 10'
            });
        }

        // Check if credit already exists for this week
        const existingCredit = await Credit.findOne({
            employeeId,
            week: parseInt(week),
            month: parseInt(month),
            year: parseInt(year)
        });

        if (existingCredit) {
            // Update existing credit
            existingCredit.credit = credit;
            existingCredit.assignedBy = assignedBy;
            if (remarks) existingCredit.remarks = remarks;
            await existingCredit.save();

            return res.status(200).json({
                success: true,
                message: 'Credit updated successfully',
                credit: existingCredit
            });
        }

        // Create new credit
        const newCredit = new Credit({
            employeeId,
            week: parseInt(week),
            month: parseInt(month),
            year: parseInt(year),
            credit,
            assignedBy,
            remarks
        });

        await newCredit.save();

        return res.status(201).json({
            success: true,
            message: 'Credit assigned successfully',
            credit: newCredit
        });
    } catch (error) {
        console.error('Error assigning credit:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;

