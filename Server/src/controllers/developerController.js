const User = require('../models/User');

// Check if user already has a temporary profile
exports.checkTemporaryUserStatus = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });

        if (user && user.isTemporary) {
            return res.status(200).json({
                hasActiveProfile: true,
                user: {
                    name: user.name,
                    role: user.role,
                    department: user.department,
                    zone: user.Zone,
                    ward: user.Ward,
                    expiresAt: user.temporaryExpiresAt
                }
            });
        }

        res.status(200).json({ hasActiveProfile: false });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new temporary user
exports.createTemporaryUser = async (req, res) => {
    try {
        const { name, email, role, department, zone, ward } = req.body;

        // Check if user already exists (permanent or temporary)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.isTemporary) {
                return res.status(400).json({ message: "This email is linked to a permanent account and cannot be used for Developer Mode." });
            }
            // If temporary, we allow overwrite/delete first - but frontend should ideally call delete first.
            // For safety, let's just update the existing one if it exists? 
            // Better: Require explicit delete first.
            return res.status(400).json({ message: "Active temporary profile already exists. Please delete it first." });
        }

        // Generate a random Employee ID
        const eid = `DEV${Math.floor(10000 + Math.random() * 90000)}`;

        const newUser = new User({
            name,
            email,
            employeeId: eid,
            role, // "Commissioner", "Deputy Commissioner", "Sanitary Inspector", "Worker", "Staff"
            department: department || 'Head Office', // Default
            isTemporary: true,
            temporaryExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
            employmentStatus: 'Contractual'
        });

        // Role-based logic
        if (role === 'Commissioner') {
            newUser.Zone = null;
            newUser.Ward = null;
            newUser.department = 'Head Office';
        } else if (role === 'Deputy Commissioner') {
            newUser.Zone = zone;
            newUser.Ward = null;
            newUser.department = 'Head Office'; // Or specific dept
        } else if (role === 'Sanitary Inspector') {
            newUser.Zone = zone;
            newUser.Ward = ward;
            newUser.department = 'Sanitation';
        } else {
            // Employee / Worker / Staff
            newUser.Zone = zone;
            newUser.Ward = ward;
            newUser.department = department || 'Sanitation'; // Default if not provided
        }

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Temporary User Created",
            user: newUser
        });

    } catch (error) {
        console.error("Create Temp User Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete temporary user (Manual user action)
exports.deleteTemporaryUser = async (req, res) => {
    try {
        const { email } = req.body;

        const deletedUser = await User.findOneAndDelete({ email, isTemporary: true });

        if (!deletedUser) {
            return res.status(404).json({ message: "No active temporary profile found to delete." });
        }

        res.status(200).json({ success: true, message: "Temporary profile deleted successfully." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cleanup expired users (System action)
exports.cleanupTemporaryUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({
            isTemporary: true,
            temporaryExpiresAt: { $lt: new Date() }
        });

        res.status(200).json({
            success: true,
            message: `Cleanup complete. Deleted ${result.deletedCount} expired users.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
