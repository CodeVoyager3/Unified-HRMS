const express = require('express');
const router = express.Router();
const SpecialTask = require('../models/SpecialTask');
const Payroll = require('../models/Payroll');
const User = require('../models/User');

// POST: Create a new task
router.post('/create', async (req, res) => {
    try {
        const { title, description, assignedTo, assignedBy, ward, deadline } = req.body;

        const newTask = new SpecialTask({
            title,
            description,
            assignedTo,
            assignedBy,
            ward,
            deadline: new Date(deadline)
        });

        await newTask.save();
        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// GET: Fetch tasks by Ward
router.get('/ward/:wardId', async (req, res) => {
    try {
        const { wardId } = req.params;
        const tasks = await SpecialTask.find({ ward: wardId }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching ward tasks:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// GET: Fetch tasks by Employee
router.get('/employee/:empId', async (req, res) => {
    try {
        const { empId } = req.params;
        const tasks = await SpecialTask.find({ assignedTo: empId }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching employee tasks:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT: Mark task as completed (Upload Proof)
router.put('/complete/:id', async (req, res) => {
    try {
        const { proofImage, completionDescription } = req.body;
        const task = await SpecialTask.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Completed',
                proofImage,
                completionDescription,
                completedAt: new Date()
            },
            { new: true }
        );
        res.json({ success: true, task });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT: Verify task (Close it)
router.put('/verify/:id', async (req, res) => {
    try {
        const task = await SpecialTask.findByIdAndUpdate(
            req.params.id,
            { status: 'Verified' },
            { new: true }
        );
        res.json({ success: true, task });
    } catch (error) {
        console.error('Error verifying task:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// POST: Levy Fine (Deduct from Payroll)
router.post('/fine/:id', async (req, res) => {
    try {
        const { amount } = req.body;
        const taskId = req.params.id;

        const task = await SpecialTask.findById(taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        // Update Task status
        task.status = 'Fined';
        task.fineAmount = amount;
        await task.save();

        // Deduct from Payroll
        // 1. Find User by EmployeeID (to get _id)
        const user = await User.findOne({ employeeId: task.assignedTo });
        if (!user) return res.status(404).json({ success: false, message: 'Employee user not found' });

        // 2. Find Current Month Payroll
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        let payroll = await Payroll.findOne({
            userId: user._id,
            monthIndex: currentMonth,
            year: currentYear
        });

        if (payroll) {
            // Update existing payroll
            payroll.fine = (payroll.fine || 0) + Number(amount);
            payroll.netAmount -= Number(amount); // Deduct directly
            await payroll.save();
        } else {
            // Create new payroll record just for the fine (will carry over negatives or base logic)
            // Ideally we should run "Calculate" logic, but as a fallback/simplification:
            // We assume Base Salary default logic fits or we create a placeholder.
            // For now, let's create a minimal record.
            payroll = new Payroll({
                userId: user._id,
                monthIndex: currentMonth,
                year: currentYear,
                month: now.toLocaleString('default', { month: 'long' }) + ' ' + currentYear,
                baseSalary: user.baseSalary || 15000,
                daysPresent: 0,
                fine: Number(amount),
                netAmount: (user.baseSalary || 15000) - Number(amount) // Rough estimate
            });
            await payroll.save();
        }

        res.json({ success: true, message: 'Fine levied and deducted from payroll', task, payroll });

    } catch (error) {
        console.error('Error levying fine:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
