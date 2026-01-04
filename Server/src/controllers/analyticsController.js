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
    if (!zone) return [];
    const variations = [
        zone,
        zone.replace(/ Zone$/i, ''),
        zone.includes('Zone') ? zone : `${zone} Zone`,
        zone === 'City S.P. Zone' ? 'City S.P.Zone' : null,
        zone === 'City S.P.Zone' ? 'City S.P. Zone' : null
    ].filter(Boolean);
    return [...new Set(variations)];
}


// --- City Wide Analytics ---

exports.getCityStats = async (req, res) => {
    try {
        const Challan = require('../models/Challan');
        const EmployeeIssue = require('../models/EmployeeIssue');

        // 1. Revenue Collection (Total Challan Amount)
        // Aggregate sum of 'amount' from all Challans
        const revenueAgg = await Challan.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
        // Format to Crores for display relevance if huge, or just raw. 
        // Frontend expects string like "₹845 Cr". Let's send raw and formatted.
        const revenueCr = (totalRevenue / 10000000).toFixed(2); // Convert to Crores

        // 2. Total Zones (Count distinct zones in Wards)
        const zonesList = await Ward.distinct('zoneName');
        const totalZones = zonesList.length;

        // 3. Average Performance (Aggregated from all zones)
        // We can approximate this by averaging the completion rate of all issues city-wide
        const totalIssues = await EmployeeIssue.countDocuments({});
        const resolvedIssues = await EmployeeIssue.countDocuments({ Status: 'Resolved' });
        const averagePerformance = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 100;

        // 4. Pending Approvals (Global)
        const pendingApprovals = await EmployeeIssue.countDocuments({ Status: { $ne: 'Resolved' } });

        res.json({
            success: true,
            stats: {
                revenueCollection: `₹${revenueCr} Cr`,
                totalZones,
                averagePerformance,
                pendingApprovals
            }
        });

    } catch (error) {
        console.error("Get City Stats Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getZoneComparison = async (req, res) => {
    try {
        // We need data for the map/comparison table.
        // List all zones, then for each, get basic stats.
        // This might be heavy if done iteratively. Ideally use aggregation.

        // Strategy: Get all Wards, group by Zone.
        const zonesAgg = await Ward.aggregate([
            {
                $group: {
                    _id: "$zoneName",
                    wardCount: { $sum: 1 }
                }
            }
        ]);

        const EmployeeIssue = require('../models/EmployeeIssue');
        const Attendance = require('../models/Attendance');

        const zonesData = await Promise.all(zonesAgg.map(async (z) => {
            const zoneName = z._id;
            const vars = getZoneVariations(zoneName);

            // Active Issues
            // Issues are linked to Users (Eid). We need Users in this zone first? 
            // Or if EmployeeIssue stored zone? It stores 'ward'. 
            // We can map Ward -> Zone.
            // EmployeeIssue schema: { Eid, ward, ... }
            // Let's find Wards in this zone first (we have them implicitly).
            const wardsInZone = await Ward.find({ zoneName: { $in: vars } }).select('wardNumber');
            const wardNums = wardsInZone.map(w => w.wardNumber);

            const pendingIssues = await EmployeeIssue.countDocuments({
                ward: { $in: wardNums },
                Status: { $ne: 'Resolved' }
            });

            // Active Staff
            const staffCount = await User.countDocuments({ Zone: { $in: vars } });

            // Attendance (Today)
            const now = new Date();
            const startOfToday = new Date(now.setHours(0, 0, 0, 0));
            const endOfToday = new Date(now.setHours(23, 59, 59, 999));

            const presentToday = await Attendance.countDocuments({
                assignedZone: { $in: vars },
                date: { $gte: startOfToday, $lte: endOfToday },
                status: 'present'
            });

            const attendanceRate = staffCount > 0 ? Math.round((presentToday / staffCount) * 100) : 0;

            return {
                name: zoneName,
                wards: z.wardCount,
                staff: staffCount,
                issues: pendingIssues,
                attendance: attendanceRate,
                status: attendanceRate > 80 ? 'Optimal' : attendanceRate > 50 ? 'Average' : 'Critical'
            };
        }));

        res.json({ success: true, zones: zonesData });

    } catch (error) {
        console.error("Get Zone Comparison Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        // Generate proactive alerts based on data thresholds
        const alerts = [];
        const EmployeeIssue = require('../models/EmployeeIssue');

        // 1. High Pending Issues in a Zone
        // Quick check: grouped by ward?
        // Let's checks for any high-urgency pending issues
        const criticalIssues = await EmployeeIssue.find({
            Priority: 'High',
            Status: 'Pending'
        }).limit(5).populate('Eid', 'name Zone'); // Assuming Eid ref User

        criticalIssues.forEach(issue => {
            // Because Eid is a String in current schema (not ref), populate might not work directly unless schema changed.
            // Assuming it might fail, let's use data we have.
            alerts.push({
                title: `Critical Grievance in Ward ${issue.ward}`,
                message: `${issue.type}: ${issue.description.substring(0, 50)}...`,
                priority: 'critical'
            });
        });

        // 2. Low Inventory (Mocked for now as InventoryRequest is new)
        const InventoryRequest = require('../models/InventoryRequest');
        if (InventoryRequest) {
            const urgentStock = await InventoryRequest.find({ urgency: 'Critical', status: 'Pending' }).limit(3);
            urgentStock.forEach(req => {
                alerts.push({
                    title: `Urgent Stock Request: ${req.itemName}`,
                    message: `Ward ${req.ward} needs ${req.quantity} units immediately.`,
                    priority: 'high'
                });
            });
        }

        // Fallback if empty to show system operational
        if (alerts.length === 0) {
            alerts.push({
                title: 'System Operational',
                message: 'All zones functioning within normal parameters.',
                priority: 'low'
            });
        }

        res.json({ success: true, alerts });

    } catch (error) {
        console.error("Get Alerts Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getCityTrends = async (req, res) => {
    try {
        const EmployeeIssue = require('../models/EmployeeIssue');
        // const Attendance = require('../models/Attendance');

        const months = 6;
        const trends = [];

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });

            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            // Sanitation (Garbage, Cleaning)
            const sanitationTotal = await EmployeeIssue.countDocuments({
                type: { $in: ['Garbage', 'Cleaning', 'Sweeping'], $ne: null },
                Date: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const sanitationResolved = await EmployeeIssue.countDocuments({
                type: { $in: ['Garbage', 'Cleaning', 'Sweeping'], $ne: null },
                Status: 'Resolved',
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const sanitationEff = sanitationTotal > 0 ? Math.round((sanitationResolved / sanitationTotal) * 100) : 100;

            // Health (Mosquito, Dead Animal?)
            // If types aren't rigorous, we mock slightly based on sanitation to show variance or use generic 'Other'
            const healthTotal = await EmployeeIssue.countDocuments({
                type: { $in: ['Mosquito', 'Dead Animal', 'Animal'], $ne: null },
                Date: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const healthResolved = await EmployeeIssue.countDocuments({
                type: { $in: ['Mosquito', 'Dead Animal', 'Animal'], $ne: null },
                Status: 'Resolved',
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const healthEff = healthTotal > 0 ? Math.round((healthResolved / healthTotal) * 100) : 95;

            // Engineering (Roads, Lights)
            const engTotal = await EmployeeIssue.countDocuments({
                type: { $in: ['Road', 'Street Light', 'Construction'], $ne: null },
                Date: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const engResolved = await EmployeeIssue.countDocuments({
                type: { $in: ['Road', 'Street Light', 'Construction'], $ne: null },
                Status: 'Resolved',
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
            });
            const engEff = engTotal > 0 ? Math.round((engResolved / engTotal) * 100) : 90;

            trends.push({
                month: monthName,
                Sanitation: sanitationEff,
                Health: healthEff,
                Engineering: engEff
            });
        }

        res.json({ success: true, trends });

    } catch (error) {
        console.error("Get City Trends Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
