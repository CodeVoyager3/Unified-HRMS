const express = require('express');
const router = express.Router();
const Challan = require('../models/Challan');

// POST: Issue a new Challan
router.post('/issue', async (req, res) => {
    try {
        const {
            violatorName, mobileNumber, violationType, amount,
            location, image, issuedBy, ward
        } = req.body;

        if (!violatorName || !violationType || !amount || !issuedBy || !ward) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: Name, Violation Type, Amount, Inspector ID, Ward'
            });
        }

        const newChallan = new Challan({
            violatorName,
            mobileNumber,
            violationType,
            amount: Number(amount),
            location,
            image: image || null,
            issuedBy,
            ward: Number(ward)
        });

        await newChallan.save();

        return res.status(201).json({
            success: true,
            message: 'Challan issued successfully',
            challan: newChallan
        });
    } catch (error) {
        console.error('Error issuing challan:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET: Get all challans for a specific Ward
router.get('/ward/:ward', async (req, res) => {
    try {
        const { ward } = req.params;
        const challans = await Challan.find({ ward: Number(ward) }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            challans
        });
    } catch (error) {
        console.error('Error fetching ward challans:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// GET: Get stats for a Ward (Total Revenue, Count, Recent 5)
router.get('/stats/:ward', async (req, res) => {
    try {
        const { ward } = req.params;

        const challans = await Challan.find({ ward: Number(ward) });

        const totalAmount = challans.reduce((sum, c) => sum + c.amount, 0);
        const count = challans.length;
        const recentChallans = challans.sort((a, b) => b.date - a.date).slice(0, 5);

        // Group by violation type
        const byType = {};
        challans.forEach(c => {
            byType[c.violationType] = (byType[c.violationType] || 0) + 1;
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalRevenue: totalAmount,
                totalChallans: count,
                byType
            },
            recent: recentChallans
        });
    } catch (error) {
        console.error('Error fetching challan stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
