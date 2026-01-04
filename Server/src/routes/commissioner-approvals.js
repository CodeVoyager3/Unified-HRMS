const express = require('express');
const router = express.Router();
const CommissionerApproval = require('../models/CommissionerApproval');
const User = require('../models/User');

// GET /commissioner/approvals/pending - All pending approvals
router.get('/approvals/pending', async (req, res) => {
    try {
        const approvals = await CommissionerApproval.find({ status: 'pending' })
            .populate('requestedBy', 'name email role')
            .sort({ priority: -1, requestDate: -1 });

        res.json({
            success: true,
            count: approvals.length,
            approvals
        });
    } catch (error) {
        console.error('Error fetching pending approvals:', error);
        res.status(500).json({ success: false, message: 'Error fetching approvals', error: error.message });
    }
});

// GET /commissioner/approvals/recruitment - Recruitment approvals
router.get('/approvals/recruitment', async (req, res) => {
    try {
        const approvals = await CommissionerApproval.find({
            approvalType: 'recruitment',
            status: 'pending'
        })
            .populate('requestedBy', 'name email Zone')
            .sort({ priority: -1, requestDate: -1 });

        res.json({
            success: true,
            count: approvals.length,
            approvals
        });
    } catch (error) {
        console.error('Error fetching recruitment approvals:', error);
        res.status(500).json({ success: false, message: 'Error fetching recruitment approvals', error: error.message });
    }
});

// POST /commissioner/approvals/recruitment/:id/approve
router.post('/approvals/recruitment/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, commissionerId } = req.body;

        const approval = await CommissionerApproval.findByIdAndUpdate(
            id,
            {
                status: 'approved',
                commissionerComments: comments,
                processedBy: commissionerId,
                approvedDate: new Date()
            },
            { new: true }
        );

        if (!approval) {
            return res.status(404).json({ success: false, message: 'Approval not found' });
        }

        res.json({
            success: true,
            message: 'Recruitment approved successfully',
            approval
        });
    } catch (error) {
        console.error('Error approving recruitment:', error);
        res.status(500).json({ success: false, message: 'Error approving recruitment', error: error.message });
    }
});

// POST /commissioner/approvals/recruitment/:id/reject
router.post('/approvals/recruitment/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, commissionerId } = req.body;

        const approval = await CommissionerApproval.findByIdAndUpdate(
            id,
            {
                status: 'rejected',
                commissionerComments: comments,
                processedBy: commissionerId,
                rejectedDate: new Date()
            },
            { new: true }
        );

        if (!approval) {
            return res.status(404).json({ success: false, message: 'Approval not found' });
        }

        res.json({
            success: true,
            message: 'Recruitment rejected',
            approval
        });
    } catch (error) {
        console.error('Error rejecting recruitment:', error);
        res.status(500).json({ success: false, message: 'Error rejecting recruitment', error: error.message });
    }
});

// GET /commissioner/approvals/transfers - Transfer approvals
router.get('/approvals/transfers', async (req, res) => {
    try {
        const approvals = await CommissionerApproval.find({
            approvalType: 'transfer',
            status: 'pending'
        })
            .populate('requestedBy', 'name email Zone')
            .sort({ priority: -1, requestDate: -1 });

        res.json({
            success: true,
            count: approvals.length,
            approvals
        });
    } catch (error) {
        console.error('Error fetching transfer approvals:', error);
        res.status(500).json({ success: false, message: 'Error fetching transfer approvals', error: error.message });
    }
});

// POST /commissioner/approvals/transfers/:id/approve
router.post('/approvals/transfers/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, commissionerId } = req.body;

        const approval = await CommissionerApproval.findByIdAndUpdate(
            id,
            {
                status: 'approved',
                commissionerComments: comments,
                processedBy: commissionerId,
                approvedDate: new Date()
            },
            { new: true }
        );

        if (!approval) {
            return res.status(404).json({ success: false, message: 'Approval not found' });
        }

        res.json({
            success: true,
            message: 'Transfer approved successfully',
            approval
        });
    } catch (error) {
        console.error('Error approving transfer:', error);
        res.status(500).json({ success: false, message: 'Error approving transfer', error: error.message });
    }
});

// GET /commissioner/approvals/budget - Budget approvals
router.get('/approvals/budget', async (req, res) => {
    try {
        const approvals = await CommissionerApproval.find({
            approvalType: 'budget',
            status: 'pending'
        })
            .populate('requestedBy', 'name email Zone')
            .sort({ priority: -1, requestDate: -1 });

        res.json({
            success: true,
            count: approvals.length,
            approvals
        });
    } catch (error) {
        console.error('Error fetching budget approvals:', error);
        res.status(500).json({ success: false, message: 'Error fetching budget approvals', error: error.message });
    }
});

// POST /commissioner/approvals/budget/:id/approve
router.post('/approvals/budget/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, commissionerId, approvedAmount } = req.body;

        const approval = await CommissionerApproval.findByIdAndUpdate(
            id,
            {
                status: 'approved',
                commissionerComments: comments,
                processedBy: commissionerId,
                approvedDate: new Date(),
                'metadata.approvedAmount': approvedAmount
            },
            { new: true }
        );

        if (!approval) {
            return res.status(404).json({ success: false, message: 'Approval not found' });
        }

        res.json({
            success: true,
            message: 'Budget approved successfully',
            approval
        });
    } catch (error) {
        console.error('Error approving budget:', error);
        res.status(500).json({ success: false, message: 'Error approving budget', error: error.message });
    }
});

// GET /commissioner/approvals/disciplinary - Disciplinary approvals
router.get('/approvals/disciplinary', async (req, res) => {
    try {
        const approvals = await CommissionerApproval.find({
            approvalType: 'disciplinary',
            status: 'pending'
        })
            .populate('requestedBy', 'name email Zone')
            .sort({ priority: -1, requestDate: -1 });

        res.json({
            success: true,
            count: approvals.length,
            approvals
        });
    } catch (error) {
        console.error('Error fetching disciplinary approvals:', error);
        res.status(500).json({ success: false, message: 'Error fetching disciplinary approvals', error: error.message });
    }
});

// POST /commissioner/approvals/disciplinary/:id/approve
router.post('/approvals/disciplinary/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, commissionerId, action } = req.body;

        const approval = await CommissionerApproval.findByIdAndUpdate(
            id,
            {
                status: 'approved',
                commissionerComments: comments,
                processedBy: commissionerId,
                approvedDate: new Date(),
                'metadata.finalAction': action
            },
            { new: true }
        );

        if (!approval) {
            return res.status(404).json({ success: false, message: 'Approval not found' });
        }

        res.json({
            success: true,
            message: 'Disciplinary action approved',
            approval
        });
    } catch (error) {
        console.error('Error approving disciplinary action:', error);
        res.status(500).json({ success: false, message: 'Error approving disciplinary action', error: error.message });
    }
});

// GET /commissioner/approvals/stats - Approval statistics
router.get('/approvals/stats', async (req, res) => {
    try {
        const stats = await CommissionerApproval.aggregate([
            {
                $group: {
                    _id: '$approvalType',
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching approval stats:', error);
        res.status(500).json({ success: false, message: 'Error fetching approval statistics', error: error.message });
    }
});

module.exports = router;
