const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const User = require('../models/User');

/**
 * GET /credit/employees/:ward
 * Get all employees assigned to a specific ward
 */
router.get('/employees/:ward', async (req, res) => {
    try {
        const { ward } = req.params;
        const wardNum = parseInt(ward);

        console.log(`[Credit API] Fetching employees for ward: ${wardNum}`);

        // First, try to find employees with exact ward match and Worker/Staff roles
        let employees = await User.find({
            Ward: wardNum,
            role: { $in: ['Worker', 'Staff'] }
        }).select('employeeId name role department email Ward Zone').sort({ name: 1 });

        console.log(`[Credit API] Found ${employees.length} employees with Worker/Staff roles for ward ${wardNum}`);

        // If no employees found, try without role filter (in case roles are different)
        if (employees.length === 0) {
            employees = await User.find({
                Ward: wardNum
            }).select('employeeId name role department email Ward Zone').sort({ name: 1 });
            console.log(`[Credit API] Found ${employees.length} employees (all roles) for ward ${wardNum}`);
        }

        // Debug: Log sample of employees found
        if (employees.length > 0) {
            console.log(`[Credit API] Sample employee:`, {
                employeeId: employees[0].employeeId,
                name: employees[0].name,
                role: employees[0].role,
                ward: employees[0].Ward
            });
        } else {
            // Check if there are any employees in the database at all
            const totalEmployees = await User.countDocuments();
            console.log(`[Credit API] Total employees in database: ${totalEmployees}`);
            
            // Check if there are employees with different ward numbers
            const sampleWards = await User.distinct('Ward');
            console.log(`[Credit API] Available ward numbers in database:`, sampleWards);
        }

        return res.status(200).json({
            success: true,
            employees: employees,
            count: employees.length,
            ward: wardNum
        });
    } catch (error) {
        console.error('[Credit API] Error fetching employees:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

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
            const total = credit.getTotalCredits();
            creditMap[credit.employeeId] = {
                totalCredits: total,
                weeks: [
                    { week: 1, credit: credit.week1 || 0 },
                    { week: 2, credit: credit.week2 || 0 },
                    { week: 3, credit: credit.week3 || 0 },
                    { week: 4, credit: credit.week4 || 0 }
                ]
            };
        });

        // Combine with employee info and sort by total credits
        const performers = wardEmployees.map(emp => {
            const creditData = creditMap[emp.employeeId] || { totalCredits: 0, weeks: [] };
            const weeksWithCredits = creditData.weeks.filter(w => w.credit > 0);
            const total = creditData.totalCredits;
            return {
                employeeId: emp.employeeId,
                name: emp.name,
                role: emp.role,
                department: emp.department,
                totalCredits: total,
                weeks: creditData.weeks,
                averageCredit: weeksWithCredits.length > 0 
                    ? (total / weeksWithCredits.length).toFixed(1)
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
 * GET /credit/employee/:employeeId
 * Get credit record for an employee for current month
 */
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { month, year } = req.query;

        const now = new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const credit = await Credit.findOne({
            employeeId,
            month: targetMonth,
            year: targetYear
        });

        if (!credit) {
            return res.status(200).json({
                success: true,
                credit: null,
                message: 'No credit record found for this month'
            });
        }

        return res.status(200).json({
            success: true,
            credit: {
                employeeId: credit.employeeId,
                wardNumber: credit.wardNumber,
                month: credit.month,
                year: credit.year,
                week1: credit.week1 || 0,
                week2: credit.week2 || 0,
                week3: credit.week3 || 0,
                week4: credit.week4 || 0,
                totalCredits: credit.getTotalCredits(),
                averageCredit: credit.getAverageCredit(),
                assignedBy: credit.assignedBy,
                remarks: credit.remarks
            }
        });
    } catch (error) {
        console.error('Error fetching employee credit:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /credit/ward/:ward
 * Get all credits for employees in a ward for current month
 */
router.get('/ward/:ward', async (req, res) => {
    try {
        const { ward } = req.params;
        const { month, year } = req.query;

        const now = new Date();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
        const targetYear = year ? parseInt(year) : now.getFullYear();

        const credits = await Credit.find({
            wardNumber: parseInt(ward),
            month: targetMonth,
            year: targetYear
        });

        // Get employee details
        const employeeIds = credits.map(c => c.employeeId);
        const employees = await User.find({ employeeId: { $in: employeeIds } })
            .select('employeeId name role department');
        
        const employeeMap = {};
        employees.forEach(emp => {
            employeeMap[emp.employeeId] = emp;
        });

        return res.status(200).json({
            success: true,
            credits: credits.map(c => {
                const emp = employeeMap[c.employeeId] || {};
                return {
                    employeeId: c.employeeId,
                    name: emp.name || 'Unknown',
                    role: emp.role || 'Unknown',
                    wardNumber: c.wardNumber,
                    week1: c.week1 || 0,
                    week2: c.week2 || 0,
                    week3: c.week3 || 0,
                    week4: c.week4 || 0,
                    totalCredits: c.getTotalCredits(),
                    averageCredit: c.getAverageCredit()
                };
            }),
            month: targetMonth,
            year: targetYear,
            ward: parseInt(ward)
        });
    } catch (error) {
        console.error('Error fetching ward credits:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * POST /credit/assign
 * Assign credit to an employee for a specific week
 */
router.post('/assign', async (req, res) => {
    try {
        const { employeeId, wardNumber, week, month, year, credit, assignedBy, remarks } = req.body;

        if (!employeeId || !wardNumber || !week || !month || !year || credit === undefined || !assignedBy) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID, ward number, week, month, year, credit, and assignedBy are required'
            });
        }

        if (credit < 0 || credit > 10) {
            return res.status(400).json({
                success: false,
                message: 'Credit must be between 0 and 10'
            });
        }

        if (week < 1 || week > 4) {
            return res.status(400).json({
                success: false,
                message: 'Week must be between 1 and 4'
            });
        }

        // Check if credit record exists for this month
        let creditRecord = await Credit.findOne({
            employeeId,
            month: parseInt(month),
            year: parseInt(year)
        });

        if (creditRecord) {
            // Update existing credit for the specific week
            creditRecord[`week${week}`] = credit;
            creditRecord.assignedBy = assignedBy;
            if (remarks) creditRecord.remarks = remarks;
            await creditRecord.save();

            return res.status(200).json({
                success: true,
                message: `Credit updated successfully for week ${week}`,
                credit: creditRecord
            });
        }

        // Create new credit record
        const newCredit = new Credit({
            employeeId,
            wardNumber: parseInt(wardNumber),
            month: parseInt(month),
            year: parseInt(year),
            [`week${week}`]: credit,
            assignedBy,
            remarks
        });

        await newCredit.save();

        return res.status(201).json({
            success: true,
            message: `Credit assigned successfully for week ${week}`,
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

/**
 * POST /credit/bulk-assign
 * Assign credits to all remaining employees in a ward
 */
router.post('/bulk-assign', async (req, res) => {
    try {
        const { wardNumber, week, month, year, credit, assignedBy } = req.body;

        if (!wardNumber || !week || !month || !year || credit === undefined || !assignedBy) {
            return res.status(400).json({
                success: false,
                message: 'Ward number, week, month, year, credit, and assignedBy are required'
            });
        }

        if (credit < 0 || credit > 10) {
            return res.status(400).json({
                success: false,
                message: 'Credit must be between 0 and 10'
            });
        }

        // Get all employees in the ward
        const employees = await User.find({
            Ward: parseInt(wardNumber),
            role: { $in: ['Worker', 'Staff'] }
        }).select('employeeId');

        if (!employees || employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No employees found in this ward'
            });
        }

        // Get employees who already have credit for this week
        const existingCredits = await Credit.find({
            wardNumber: parseInt(wardNumber),
            month: parseInt(month),
            year: parseInt(year),
            [`week${week}`]: { $gt: 0 }
        }).select('employeeId');

        const assignedEmployeeIds = new Set(existingCredits.map(c => c.employeeId.toString()));
        const unassignedEmployees = employees.filter(emp => !assignedEmployeeIds.has(emp.employeeId));

        // Assign credit to all unassigned employees
        const results = [];
        for (const emp of unassignedEmployees) {
            let creditRecord = await Credit.findOne({
                employeeId: emp.employeeId,
                month: parseInt(month),
                year: parseInt(year)
            });

            if (creditRecord) {
                creditRecord[`week${week}`] = credit;
                creditRecord.assignedBy = assignedBy;
                await creditRecord.save();
            } else {
                creditRecord = new Credit({
                    employeeId: emp.employeeId,
                    wardNumber: parseInt(wardNumber),
                    month: parseInt(month),
                    year: parseInt(year),
                    [`week${week}`]: credit,
                    assignedBy
                });
                await creditRecord.save();
            }
            results.push(emp.employeeId);
        }

        return res.status(200).json({
            success: true,
            message: `Credits assigned to ${results.length} employees`,
            assignedCount: results.length,
            employeeIds: results
        });
    } catch (error) {
        console.error('Error bulk assigning credits:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;


