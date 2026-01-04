const Ward = require('../models/Ward');
const User = require('../models/User');
const EmployeeIssue = require('../models/EmployeeIssue');

exports.getZoneStats = async (req, res) => {
    try {
        const { zone } = req.params;
        console.log("Fetching stats for zone:", zone);

        const uniqueVariations = getZoneVariations(zone);
        console.log("Querying with zone variations:", uniqueVariations);

        // 1. Total Wards
        const totalWards = await Ward.countDocuments({ zoneName: { $in: uniqueVariations } });

        // 2. Active Staff
        const activeStaff = await User.countDocuments({ Zone: { $in: uniqueVariations } });

        // 3. Pending Approvals (SIs in this zone)
        const sanitaryInspectors = await User.find({
            Zone: { $in: uniqueVariations },
            role: 'Sanitary Inspector'
        }).select('employeeId');
        const siEmployeeIds = sanitaryInspectors.map(si => si.employeeId);

        const pendingApprovals = await EmployeeIssue.countDocuments({
            Eid: { $in: siEmployeeIds },
            Status: { $ne: 'Resolved' }
        });

        // 4. Zone Performance Calculation
        // A. Compliance: Attendance Rate (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const totalPresent = await require('../models/Attendance').countDocuments({
            assignedZone: { $in: uniqueVariations },
            status: 'present',
            date: { $gte: thirtyDaysAgo }
        });

        // Approx working days = 24. Compliance = Present / (Staff * 24)
        const complianceScore = activeStaff > 0 ? Math.min(100, Math.round((totalPresent / (activeStaff * 24)) * 100)) : 0;

        // B. Grievance Resolution Rate (All time)
        const totalIssues = await EmployeeIssue.countDocuments({ Eid: { $in: siEmployeeIds } });
        const resolvedIssues = await EmployeeIssue.countDocuments({ Eid: { $in: siEmployeeIds }, Status: 'Resolved' });
        const grievanceScore = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;

        // C. Recruitment (New Joinees Last 90 Days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const newJoinees = await User.countDocuments({
            Zone: { $in: uniqueVariations },
            joiningDate: { $gte: ninetyDaysAgo }
        });
        const recruitmentScore = Math.min(100, newJoinees * 10); // 10 points per recruit, max 100

        // Weighted Average: 40% Compliance, 40% Grievance, 20% Recruitment
        const zonePerformance = Math.round((complianceScore * 0.4) + (grievanceScore * 0.4) + (recruitmentScore * 0.2));

        // D. Specific Counts for Dashboard "Quick Access"
        const pendingRecruitment = await User.countDocuments({
            Zone: { $in: uniqueVariations },
            employmentStatus: 'Interview Pending' // Or whatever status is "Pending Review"
        });

        // E. Unresolved Grievances (Total - Resolved)
        const unresolvedGrievances = totalIssues - resolvedIssues;

        res.status(200).json({
            success: true,
            stats: {
                totalWards,
                activeStaff,
                pendingApprovals: pendingApprovals, // This was generic pending, now specific
                zonePerformance,
                pendingRecruitment,
                unresolvedGrievances
            }
        });
    } catch (error) {
        console.error("Get Zone Stats Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getZoneTrends = async (req, res) => {
    try {
        const { zone } = req.params;
        const uniqueVariations = getZoneVariations(zone);
        const months = 6;
        const trends = [];
        const Attendance = require('../models/Attendance');

        // Fetch SIs for issue mapping
        const sanitaryInspectors = await User.find({
            Zone: { $in: uniqueVariations },
            role: 'Sanitary Inspector'
        }).select('employeeId');
        const siEmployeeIds = sanitaryInspectors.map(si => si.employeeId);

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });

            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            // 1. Compliance (Avg Attendance % for this month)
            const presentCount = await Attendance.countDocuments({
                assignedZone: { $in: uniqueVariations },
                status: 'present',
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });
            // Normalize: (Present / (Active Staff * 24)) * 100. Using 300 as approx max staff*days base if staff is 0 to avoid Infinity
            const activeStaff = await User.countDocuments({ Zone: { $in: uniqueVariations }, joiningDate: { $lte: endOfMonth } });
            const compliance = activeStaff > 0 ? Math.min(100, Math.round((presentCount / (activeStaff * 24)) * 100)) : 0;

            // 2. Grievances (Active/Created this month)
            const grievances = await EmployeeIssue.countDocuments({
                Eid: { $in: siEmployeeIds },
                Date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            // 3. Recruitment (Joined this month)
            const recruitment = await User.countDocuments({
                Zone: { $in: uniqueVariations },
                joiningDate: { $gte: startOfMonth, $lte: endOfMonth }
            });

            trends.push({
                name: monthName,
                compliance,
                grievances,
                recruitment
            });
        }

        res.status(200).json({
            success: true,
            trends
        });

    } catch (error) {
        console.error("Get Zone Trends Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Helper to normalize zone names
function getZoneVariations(zone) {
    const variations = [
        zone,
        zone.replace(/ Zone$/i, ''),
        zone.includes('Zone') ? zone : `${zone} Zone`,
        // zone.includes('Shahdara South') ? 'Sh South Zone' : null, // REMOVED: Caused incorrect merging of distinct zones
        zone === 'City S.P. Zone' ? 'City S.P.Zone' : null,
        zone === 'City S.P.Zone' ? 'City S.P. Zone' : null
    ].filter(Boolean);
    return [...new Set(variations)];
}
