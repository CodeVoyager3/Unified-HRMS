const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

router.post("/", ClerkExpressWithAuth(), async (req, res) => {
    if (!req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { clerkId, email, name, role } = req.body;

    if (!clerkId || !email || !name || !role) {
        return res.status(400).json({ message: "Bad Request" });
    }

    if (req.auth.userId !== clerkId) {
        return res.status(401).json({ message: "Forbidden: You can only sync your own data" });
    }

    try {
        // UPSERT: Create if not exists, Update if exists
        const user = await User.findOneAndUpdate(
            { clerkId },
            { clerkId, email, name, role },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: "User synced successfully", user });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "User sync failed" });
    }
})

module.exports = router;
