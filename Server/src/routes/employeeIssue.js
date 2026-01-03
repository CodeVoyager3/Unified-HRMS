const express = require('express');
const router = express.Router();
const EmployeeIssue = require('../models/EmployeeIssue');
const Users = require('../models/User');

// POST: Report a new issue
router.post('/', async (req, res) => {
    try {
        const { employeeId, title, description, category } = req.body;
        if (!employeeId || !title || !description) {
            return res.status(400).json({ message: 'Employee ID and issue are required' });
        }

        // Fetch user to get ward
        const user = await Users.findOne({ employeeId });

        const employeeIssue = new EmployeeIssue({
            Eid: employeeId,
            Title: title,
            Description: description,
            Status: 'Pending',
            Date: new Date(),
            ward: user ? user.Ward : null,
            category: category || 'General'
        });

        await employeeIssue.save();

        return res.status(201).json({ message: 'Issue reported successfully', success: true });
    } catch (error) {
        console.error('Error reporting issue:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// GET: All issues for a specific Ward (Inspector View)
router.get('/ward/:wardId', async (req, res) => {
    try {
        const { wardId } = req.params;
        console.log(`[EmployeeIssue] Fetching issues for ward: ${wardId}`);

        // Handle potential string vs number type mismatch in DB
        let query = { ward: wardId };
        if (!isNaN(wardId)) {
            query = { ward: Number(wardId) };
        }

        const issues = await EmployeeIssue.find(query).sort({ Date: -1 });
        console.log(`[EmployeeIssue] Found ${issues.length} issues for ward ${wardId}`);

        res.json({ success: true, issues });
    } catch (error) {
        console.error('Error fetching ward issues:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT: Resolve an issue
router.put('/resolve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { resolvedBy, resolutionImage } = req.body;

        const issue = await EmployeeIssue.findByIdAndUpdate(id, {
            Status: 'Resolved',
            resolvedBy: resolvedBy || 'Inspector',
            resolvedAt: new Date(),
            resolutionImage: resolutionImage
        }, { new: true });

        res.json({ success: true, issue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT: Forward an issue
router.put('/forward/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { department } = req.body;

        const issue = await EmployeeIssue.findByIdAndUpdate(id, {
            Status: 'Forwarded',
            department: department,
            forwardedTo: department,
            resolvedAt: new Date() // Tracking when it was moved
        }, { new: true });

        res.json({ success: true, issue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/employee/:employeeId', async (req, res) => {
    try {
        const employeeIssues = await EmployeeIssue.find({ Eid: req.params.employeeId });
        res.json(employeeIssues);
    } catch (error) {
        console.error('Error fetching employee issues:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/count/:employeeId', async (req, res) => {
    try {
        const employeeIssues = await EmployeeIssue.find({ Eid: req.params.employeeId });
        res.json({ issueCount: employeeIssues.length, success: true });
    } catch (error) {
        console.error('Error fetching employee issues:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

module.exports = router;
