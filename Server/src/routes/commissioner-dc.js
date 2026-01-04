const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DCPerformance = require('../models/DCPerformance');
const Ward = require('../models/Ward');
const EmployeeIssue = require('../models/EmployeeIssue');

// GET /commissioner/deputy-commissioners - List all DCs with performance (OPTIMIZED)
router.get('/deputy-commissioners', async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        // Parallel Fetching
        const [dcs, performances, wardAgg, issueAgg] = await Promise.all([
            // 1. All DCs
            User.find({ role: 'Deputy Commissioner' }).select('name email Zone Ward employeeId employmentStatus').lean(),

            // 2. All Performances for this month
            DCPerformance.find({ month: currentMonth }).lean(),

            // 3. Ward Stats by Zone
            Ward.aggregate([
                {
                    $group: {
                        _id: "$zoneName",
                        avgScore: { $avg: "$score" },
                        count: { $sum: 1 },
                        wards: { $push: "$wardNumber" }
                    }
                }
            ]),

            // 4. Issue Stats by Ward (to match with zones)
            EmployeeIssue.aggregate([
                {
                    $group: {
                        _id: "$ward",
                        total: { $sum: 1 },
                        resolved: { $sum: { $cond: [{ $eq: ["$Status", "Resolved"] }, 1, 0] } }
                    }
                }
            ])
        ]);

        // Create Lookups
        const performanceMap = {};
        performances.forEach(p => performanceMap[p.dcId.toString()] = p);

        const wardMap = {}; // zone -> { avgScore, count, wards[] }
        wardAgg.forEach(w => wardMap[w._id] = w);

        const issueMap = {}; // wardNumber -> { total, resolved }
        issueAgg.forEach(i => issueMap[i._id] = i);

        // Merge Data
        const dcsWithPerformance = dcs.map((dc) => {
            const perf = performanceMap[dc._id.toString()];
            const wardZoneStats = wardMap[dc.Zone];

            const avgWardScore = wardZoneStats?.avgScore || 0;
            const wardsManaged = wardZoneStats?.count || 0;

            // Calculate aggregated issue resolution for this DC's zone
            let totalIssues = 0;
            let resolvedIssues = 0;

            if (wardZoneStats?.wards) {
                wardZoneStats.wards.forEach(wardNum => {
                    const iStat = issueMap[wardNum];
                    if (iStat) {
                        totalIssues += iStat.total;
                        resolvedIssues += iStat.resolved;
                    }
                });
            }

            const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0;

            return {
                _id: dc._id,
                employeeId: dc.employeeId,
                name: dc.name,
                email: dc.email,
                zone: dc.Zone,
                status: dc.employmentStatus,
                performance: {
                    score: perf?.performanceScore || parseFloat(avgWardScore.toFixed(1)),
                    grievancesResolved: perf?.grievancesResolved || resolvedIssues,
                    resolutionRate: parseFloat(resolutionRate),
                    wardsManaged: wardsManaged,
                    avgWardScore: avgWardScore.toFixed(1)
                },
                lastEvaluated: perf?.evaluationDate || null
            };
        });

        res.json({
            success: true,
            count: dcsWithPerformance.length,
            deputyCommissioners: dcsWithPerformance.sort((a, b) =>
                parseFloat(b.performance.score) - parseFloat(a.performance.score)
            )
        });
    } catch (error) {
        console.error('Error fetching DCs:', error);
        res.status(500).json({ success: false, message: 'Error fetching Deputy Commissioners', error: error.message });
    }
});

// GET /commissioner/deputy-commissioners/:id/activity
router.get('/deputy-commissioners/:id/activity', async (req, res) => {
    try {
        const { id } = req.params;
        const dc = await User.findById(id).lean();
        if (!dc) return res.status(404).json({ success: false, message: 'DC not found' });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Optimize: Use Promise.all
        const [wards, performanceHistory] = await Promise.all([
            Ward.find({ zoneName: dc.Zone }).select('wardNumber').lean(),
            DCPerformance.find({ dcId: id }).sort({ month: -1 }).limit(6).lean()
        ]);

        const wardNumbers = wards.map(w => w.wardNumber);

        const recentGrievances = await EmployeeIssue.find({
            ward: { $in: wardNumbers },
            Status: 'Resolved',
            resolvedAt: { $gte: thirtyDaysAgo }
        })
            .select('Title Status resolvedAt category')
            .sort({ resolvedAt: -1 })
            .limit(10)
            .lean();

        res.json({
            success: true,
            activity: {
                recentGrievances,
                performanceHistory
            }
        });
    } catch (error) {
        console.error('Error fetching DC activity:', error);
        res.status(500).json({ success: false, message: 'Error fetching activity', error: error.message });
    }
});

// GET /commissioner/deputy-commissioners/:id/performance
router.get('/deputy-commissioners/:id/performance', async (req, res) => {
    try {
        const { id } = req.params;
        const { period = 6 } = req.query;

        const performances = await DCPerformance.find({ dcId: id })
            .sort({ month: -1 })
            .limit(parseInt(period))
            .lean();

        res.json({
            success: true,
            performances: performances.reverse()
        });
    } catch (error) {
        console.error('Error fetching DC performance:', error);
        res.status(500).json({ success: false, message: 'Error fetching performance', error: error.message });
    }
});

// POST /commissioner/deputy-commissioners/:id/evaluate
router.post('/deputy-commissioners/:id/evaluate', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            month,
            performanceScore,
            staffManagement,
            budgetCompliance,
            comments,
            strengths,
            improvements,
            commissionerId
        } = req.body;

        const dc = await User.findById(id);
        if (!dc) return res.status(404).json({ success: false, message: 'DC not found' });

        // Parallel queries
        const wards = await Ward.find({ zoneName: dc.Zone }).lean();
        const wardNumbers = wards.map(w => w.wardNumber);

        const [totalIssues, resolvedIssues] = await Promise.all([
            EmployeeIssue.countDocuments({ ward: { $in: wardNumbers } }),
            EmployeeIssue.countDocuments({ ward: { $in: wardNumbers }, Status: 'Resolved' })
        ]);

        const avgWardScore = wards.length > 0
            ? wards.reduce((sum, w) => sum + (w.score || 0), 0) / wards.length
            : 0;

        const performance = await DCPerformance.findOneAndUpdate(
            { dcId: id, month },
            {
                dcId: id,
                dcName: dc.name,
                month,
                zone: dc.Zone,
                performanceScore,
                grievancesResolved: resolvedIssues,
                grievancesTotal: totalIssues,
                staffManagement,
                budgetCompliance,
                wardsManaged: wards.length,
                averageWardScore: parseFloat(avgWardScore.toFixed(1)),
                evaluatedBy: commissionerId,
                evaluationDate: new Date(),
                comments,
                strengths: strengths || [],
                improvements: improvements || []
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'Evaluation saved successfully',
            performance
        });
    } catch (error) {
        console.error('Error evaluating DC:', error);
        res.status(500).json({ success: false, message: 'Error saving evaluation', error: error.message });
    }
});

// GET /commissioner/deputy-commissioners/stats (OPTIMIZED)
router.get('/deputy-commissioners/stats', async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const [dcStats, evaluatedThisMonth] = await Promise.all([
            User.aggregate([
                { $match: { role: 'Deputy Commissioner' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $in: ["$employmentStatus", ["Permanent", "Contractual"]] }, 1, 0] } }
                    }
                }
            ]),
            DCPerformance.countDocuments({ month: currentMonth })
        ]);

        const stats = dcStats[0] || { total: 0, active: 0 };

        res.json({
            success: true,
            stats: {
                total: stats.total,
                active: stats.active,
                evaluatedThisMonth,
                pendingEvaluation: Math.max(0, stats.active - evaluatedThisMonth)
            }
        });
    } catch (error) {
        console.error('Error fetching DC stats:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
    }
});

module.exports = router;
