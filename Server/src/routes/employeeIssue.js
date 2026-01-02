const express = require('express');
const router = express.Router();
const EmployeeIssue = require('../models/EmployeeIssue');

router.post('/', async (req, res) => {
    try {
        const { employeeId, title, description } = req.body;
        if (!employeeId || !title || !description) {
            return res.status(400).json({ message: 'Employee ID and issue are required' });
        }

        const employeeIssue = new EmployeeIssue({
            Eid: employeeId,
            Title: title,
            Description: description,
            Status: 'Pending',
            Date: new Date()
        });

        await employeeIssue.save();

        return res.status(201).json({ message: 'Issue reported successfully', success: true });
    } catch (error) {
        console.error('Error reporting issue:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

module.exports = router;
