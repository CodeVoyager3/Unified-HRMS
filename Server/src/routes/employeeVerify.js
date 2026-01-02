const express = require('express');
const router = express.Router();
const Users = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const { employeeId, email } = req.body;
        if (!employeeId || !email) {
            return res.status(400).json({ message: 'Employee ID and email are required' });
        }

        const user = await Users.findOne({
            employeeId: employeeId,
            email: email
        });
        if (!user) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        
        return res.status(200).json({ message: 'Employee verified successfully', user,success: true });
    } catch (error) {
        console.error('Error verifying employee:', error);
        return res.status(500).json({ message: 'Internal server error',success: false });
    }
});

// GET employee by email
router.get('/by-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

module.exports = router; 