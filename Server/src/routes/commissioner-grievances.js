const express = require('express');
const router = express.Router();
const EmployeeIssue = require('../models/EmployeeIssue');

// GET /commissioner/grievances/overview - City-wide grievance statistics
router.get('/grievances/overview', async (req, res) => {
    try {
        // Total grievances
        const totalGrievances = await EmployeeIssue.countDocuments();

        // Grievances by status
        const byStatus = await EmployeeIssue.aggregate([
            {
                $group: {
                    _id: '$Status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Grievances by category
        const byPriority = await EmployeeIssue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Grievances by ward (approximate zone)
        const byZone = await EmployeeIssue.aggregate([
            {
                $group: {
                    _id: '$ward',
                    total: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$Status', 'Resolved'] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $ne: ['$Status', 'Resolved'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    zone: { $concat: ['Ward ', { $toString: '$_id' }] },
                    total: 1,
                    resolved: 1,
                    pending: 1,
                    resolutionRate: {
                        $multiply: [
                            { $divide: ['$resolved', '$total'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { resolutionRate: -1 } },
            { $limit: 10 }
        ]);

        // Average resolution time
        const resolvedIssues = await EmployeeIssue.find({
            Status: 'Resolved',
            resolvedAt: { $exists: true }
        });

        let avgResolutionTime = 0;
        if (resolvedIssues.length > 0) {
            const totalTime = resolvedIssues.reduce((sum, issue) => {
                const created = new Date(issue.Date);
                const resolved = new Date(issue.resolvedAt);
                const days = (resolved - created) / (1000 * 60 * 60 * 24);
                return sum + (days > 0 ? days : 0);
            }, 0);
            avgResolutionTime = (totalTime / resolvedIssues.length).toFixed(1);
        }

        // Recent critical grievances (using Pending status as critical)
        const criticalGrievances = await EmployeeIssue.find({
            Status: 'Pending'
        })
            .sort({ Date: -1 })
            .limit(10);

        res.json({
            success: true,
            overview: {
                total: totalGrievances,
                byStatus,
                byPriority,
                byZone,
                avgResolutionTime: parseFloat(avgResolutionTime),
                criticalGrievances
            }
        });
    } catch (error) {
        console.error('Error fetching grievance overview:', error);
        res.status(500).json({ success: false, message: 'Error fetching grievance overview', error: error.message });
    }
});

// GET /commissioner/grievances/escalated - Escalated grievances
router.get('/grievances/escalated', async (req, res) => {
    try {
        const escalatedGrievances = await EmployeeIssue.find({
            escalatedToCommissioner: true,
            Status: { $ne: 'Resolved' }
        })
            .sort({ Date: -1 });

        res.json({
            success: true,
            count: escalatedGrievances.length,
            grievances: escalatedGrievances
        });
    } catch (error) {
        console.error('Error fetching escalated grievances:', error);
        res.status(500).json({ success: false, message: 'Error fetching escalated grievances', error: error.message });
    }
});

// GET /commissioner/grievances/analytics - Resolution analytics
router.get('/grievances/analytics', async (req, res) => {
    try {
        // Monthly trend
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await EmployeeIssue.aggregate([
            {
                $match: {
                    Date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$Date' },
                        month: { $month: '$Date' }
                    },
                    total: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$Status', 'Resolved'] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Category breakdown
        const byCategory = await EmployeeIssue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$Status', 'Resolved'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    resolved: 1,
                    resolutionRate: {
                        $multiply: [
                            { $divide: ['$resolved', '$count'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            analytics: {
                monthlyTrend,
                byCategory
            }
        });
    } catch (error) {
        console.error('Error fetching grievance analytics:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
    }
});

// GET /commissioner/grievances/trends - Trend analysis
router.get('/grievances/trends', async (req, res) => {
    try {
        const months = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleString('en', { month: 'short' });
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const total = await EmployeeIssue.countDocuments({
                Date: { $gte: startDate, $lte: endDate }
            });

            const resolved = await EmployeeIssue.countDocuments({
                Date: { $gte: startDate, $lte: endDate },
                Status: 'Resolved'
            });

            months.push({
                month: monthName,
                total,
                resolved,
                pending: total - resolved,
                resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0
            });
        }

        res.json({
            success: true,
            trends: months
        });
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ success: false, message: 'Error fetching trends', error: error.message });
    }
});

// POST /commissioner/grievances/:id/escalate-note - Add commissioner note
router.post('/grievances/:id/escalate-note', async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        const issue = await EmployeeIssue.findByIdAndUpdate(
            id,
            {
                commissionerNotes: note,
                escalatedToCommissioner: true,
                escalationDate: new Date()
            },
            { new: true }
        );

        if (!issue) {
            return res.status(404).json({ success: false, message: 'Grievance not found' });
        }

        res.json({
            success: true,
            message: 'Note added successfully',
            issue
        });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ success: false, message: 'Error adding note', error: error.message });
    }
});

module.exports = router;
