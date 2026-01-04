const express = require('express');
const router = express.Router();
const InventoryRequest = require('../models/InventoryRequest');

// GET /commissioner/inventory/overview - City-wide inventory status
router.get('/inventory/overview', async (req, res) => {
    try {
        // Total requests
        const totalRequests = await InventoryRequest.countDocuments();

        // Requests by status
        const byStatus = await InventoryRequest.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Requests by zone
        const byZone = await InventoryRequest.aggregate([
            {
                $group: {
                    _id: '$zone',
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
                    },
                    fulfilled: {
                        $sum: { $cond: [{ $eq: ['$status', 'Fulfilled'] }, 1, 0] }
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort: { pending: -1 } }
        ]);

        // Requests by urgency
        const byUrgency = await InventoryRequest.aggregate([
            {
                $match: { status: 'Pending' }
            },
            {
                $group: {
                    _id: '$urgency',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Most requested items
        const topItems = await InventoryRequest.aggregate([
            {
                $group: {
                    _id: '$itemName',
                    totalQuantity: { $sum: '$quantity' },
                    requestCount: { $sum: 1 }
                }
            },
            { $sort: { requestCount: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            overview: {
                totalRequests,
                byStatus,
                byZone,
                byUrgency,
                topItems
            }
        });
    } catch (error) {
        console.error('Error fetching inventory overview:', error);
        res.status(500).json({ success: false, message: 'Error fetching inventory overview' });
    }
});

// GET /commissioner/inventory/requests - All resource requests
router.get('/inventory/requests', async (req, res) => {
    try {
        const { status, zone, urgency } = req.query;

        const query = {};
        if (status) query.status = status;
        if (zone) query.zone = zone;
        if (urgency) query.urgency = urgency;

        const requests = await InventoryRequest.find(query)
            .populate('requestedBy', 'employeeName email Ward')
            .sort({ urgency: -1, requestedAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Error fetching inventory requests:', error);
        res.status(500).json({ success: false, message: 'Error fetching requests' });
    }
});

// POST /commissioner/inventory/allocate - Allocate resources
router.post('/inventory/allocate', async (req, res) => {
    try {
        const { requestId, approvedQuantity, comments, commissionerId } = req.body;

        const request = await InventoryRequest.findByIdAndUpdate(
            requestId,
            {
                status: 'Approved',
                approvedQuantity: approvedQuantity,
                approvedBy: commissionerId,
                approvedAt: new Date(),
                commissionerComments: comments
            },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({
            success: true,
            message: 'Resource allocated successfully',
            request
        });
    } catch (error) {
        console.error('Error allocating resources:', error);
        res.status(500).json({ success: false, message: 'Error allocating resources' });
    }
});

// POST /commissioner/inventory/reject - Reject request
router.post('/inventory/reject', async (req, res) => {
    try {
        const { requestId, reason, commissionerId } = req.body;

        const request = await InventoryRequest.findByIdAndUpdate(
            requestId,
            {
                status: 'Rejected',
                rejectedBy: commissionerId,
                rejectedAt: new Date(),
                rejectionReason: reason
            },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({
            success: true,
            message: 'Request rejected',
            request
        });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ success: false, message: 'Error rejecting request' });
    }
});

// GET /commissioner/inventory/alerts - Critical inventory alerts
router.get('/inventory/alerts', async (req, res) => {
    try {
        const alerts = [];

        // Critical urgency pending requests
        const criticalRequests = await InventoryRequest.countDocuments({
            status: 'Pending',
            urgency: 'Critical'
        });

        if (criticalRequests > 0) {
            alerts.push({
                type: 'critical',
                title: 'Critical Inventory Requests',
                message: `${criticalRequests} critical requests need immediate approval`,
                count: criticalRequests
            });
        }

        // Old pending requests (> 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const oldRequests = await InventoryRequest.countDocuments({
            status: 'Pending',
            requestedAt: { $lt: sevenDaysAgo }
        });

        if (oldRequests > 0) {
            alerts.push({
                type: 'warning',
                title: 'Pending Requests',
                message: `${oldRequests} requests pending for over 7 days`,
                count: oldRequests
            });
        }

        res.json({
            success: true,
            alerts
        });
    } catch (error) {
        console.error('Error fetching inventory alerts:', error);
        res.status(500).json({ success: false, message: 'Error fetching alerts' });
    }
});

module.exports = router;
