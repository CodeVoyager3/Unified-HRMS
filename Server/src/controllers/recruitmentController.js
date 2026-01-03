const Recruitment = require('../models/Recruitment');
const Candidate = require('../models/Candidate');

// Dummy Data Configuration
const DUMMY_EXAMS = [
    { examId: "EX-01", examName: "Clerk", year: "2025", requiredDocuments: ["12th Certificate", "Adhaar Card", "Typing Certificate"] },
    { examId: "EX-02", examName: "Police", year: "2025", requiredDocuments: ["12th Certificate", "Physical Fitness Report", "Adhaar Card"] },
    { examId: "EX-03", examName: "Engineer", year: "2025", requiredDocuments: ["B.Tech Degree", "Gate Score Card", "Adhaar Card"] },
    { examId: "EX-04", examName: "Teacher", year: "2025", requiredDocuments: ["B.Ed Degree", "12th Certificate", "Adhaar Card"] }
];

const DUMMY_CANDIDATES = [
    {
        fullName: "Rahul Sharma",
        phone: "9876543210",
        email: "rahul.sharma@example.com",
        enrollmentNumber: "EN12345",
        dob: "2000-05-15",
        examId: "EX-01"
    },
    {
        fullName: "Priya Singh",
        phone: "9876543211",
        email: "priya.singh@example.com",
        enrollmentNumber: "EN67890",
        dob: "1999-08-20",
        examId: "EX-04"
    },
    // User Requested Dummy Data - PERMANENTLY ADDED
    {
        fullName: "Amritesh Kumar Rai",
        phone: "9876543212",
        email: "amriteshkumarrai14@gmail.com",
        enrollmentNumber: "EN99999",
        dob: "2006-10-30", // YYYY-MM-DD
        examId: "EX-04"
    }
];

// Reusable Seed Function
const seedDatabase = async () => {
    try {
        const existingCandidates = await Candidate.countDocuments();
        if (existingCandidates > 0) {
            console.log("Database already has data. Skipping re-seed to preserve changes.");
            return { success: true, message: "Skipped seeding" };
        }

        await Recruitment.deleteMany({});
        await Candidate.deleteMany({});

        await Recruitment.insertMany(DUMMY_EXAMS);
        await Candidate.insertMany(DUMMY_CANDIDATES);

        console.log("Database Seeded with Permanent Data (Amritesh)");
        return { success: true, exams: DUMMY_EXAMS, candidates: DUMMY_CANDIDATES };
    } catch (error) {
        console.error("Auto-Seed Error:", error);
        return { success: false, error: error.message };
    }
};

exports.seedDatabase = seedDatabase; // Export for server.js

exports.seedDummyData = async (req, res) => {
    const result = await seedDatabase();
    if (result.success) {
        res.status(200).json({ message: "Dummy Data Seeded Successfully", ...result });
    } else {
        res.status(500).json({ message: "Error seeding dummy data", error: result.error });
    }
};

exports.getRecruitments = async (req, res) => {
    try {
        const exams = await Recruitment.find({ isActive: true });
        res.status(200).json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.checkCandidateStatus = async (req, res) => {
    try {
        const { examId, enrollmentNumber, dob } = req.body;
        console.log("Checking status for:", { examId, enrollmentNumber, dob });

        const candidate = await Candidate.findOne({
            examId: examId,
            enrollmentNumber: enrollmentNumber,
            dob: dob
        });

        if (!candidate) {
            console.log("Candidate Not Found Query Result: null");
            // Debug dump to help trace mismatched formats
            const debugCandidates = await Candidate.find({ examId });
            console.log("Available Candidates for Exam:", debugCandidates.map(c => ({
                en: c.enrollmentNumber, dob: c.dob
            })));

            return res.status(404).json({ success: false, message: "Candidate not found. Check Exam ID, Enrollment Number, and DOB." });
        }

        res.status(200).json({
            success: true,
            candidate: {
                fullName: candidate.fullName,
                email: candidate.email,
                enrollmentNumber: candidate.enrollmentNumber,
                dob: candidate.dob,
                examId: candidate.examId,
                verificationStatus: candidate.verificationStatus,
                reportCard: candidate.reportCard,
                documentDriveLink: candidate.documentDriveLink
            }
        });

    } catch (error) {
        console.error("Check Status Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitDocuments = async (req, res) => {
    try {
        const { enrollmentNumber, driveLink } = req.body;

        if (!enrollmentNumber || !driveLink) {
            return res.status(400).json({ success: false, message: "Enrollment number and Drive Link are required." });
        }

        const candidate = await Candidate.findOneAndUpdate(
            { enrollmentNumber },
            {
                documentDriveLink: driveLink,
                verificationStatus: 'Submitted'
            },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found." });
        }

        res.status(200).json({ success: true, message: "Documents submitted successfully.", candidate });

    } catch (error) {
        console.error("Submit Documents Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.checkApplicationByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) return res.status(400).json({ success: false, message: "Email required" });

        const candidate = await Candidate.findOne({ email: email });

        if (candidate) {
            return res.status(200).json({ success: true, candidate });
        } else {
            return res.status(404).json({ success: false, message: "No application found" });
        }
    } catch (error) {
        console.error("Check App Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
const User = require('../models/User');

// ... existing code ...

// ... existing code ...

exports.rejectCandidate = async (req, res) => {
    try {
        const { candidateId, reason } = req.body;
        console.log("Rejecting candidate:", candidateId, "Reason:", reason);

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        candidate.verificationStatus = 'Rejected';
        candidate.rejectionReason = reason || 'No reason provided';
        await candidate.save();

        res.status(200).json({ success: true, message: "Candidate Rejected" });
    } catch (error) {
        console.error("Reject Candidate Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getZoneCandidates = async (req, res) => {
    try {
        const { zone } = req.params;
        // Fetch candidates who have passed the exam (can filter by examId if needed) or just have status 'Submitted'
        // Ideally, we should have a Zone preference in Candidate model or map Exam -> Zone. 
        // For now, assuming DC sees ALL submitted candidates to assign them manually or auto-assign to their zone.
        // Or better: We fetch all 'Submitted' candidates.

        const candidates = await Candidate.find({ verificationStatus: 'Submitted' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, candidates });
    } catch (error) {
        console.error("Fetch Zone Candidates Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.approveCandidate = async (req, res) => {
    try {
        const { candidateId, zone } = req.body;

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        if (candidate.verificationStatus === 'Approved') {
            return res.status(400).json({ success: false, message: "Candidate already approved" });
        }

        // 1. Load Balancing: Find Ward with minimum employees in the given Zone
        // Hack: We look for users in Wards 1 to 100 (example) filtering by Zone if User schema had Zone properly populated.
        // Since Ward is Number, let's assume Wards 1-10 belong to Rohini Zone, etc.
        // For dynamic load balancing, we query existing Users.

        // Find all users in this zone matching the role 'Worker' (or generic staff)
        const existingStaff = await User.find({ Zone: zone, role: 'Worker' });

        // Group by Ward
        const wardCounts = {};
        // Initialize some wards for the zone (e.g., 1-5) to ensure they exist in map
        // In a real app, we'd fetch Wards from a Zone model.
        // Fallback: If no staff exists, assign to Ward 1.

        existingStaff.forEach(u => {
            wardCounts[u.Ward] = (wardCounts[u.Ward] || 0) + 1;
        });

        // Find key with minimum value. 
        // If map is empty, default to Ward 1.
        let targetWard = 1;
        if (existingStaff.length > 0) {
            // Simple logic: pick ward with min count from observed wards
            // This assumes we only balance between wards that already have at least one employee or just pick one.
            // Let's improve: Pick from a predefined set of Wards for the Zone (Simulated)
            const zoneWards = [1, 2, 3, 4, 5]; // Simulating Rohini Zone Wards

            let minCount = Infinity;
            zoneWards.forEach(w => {
                const count = wardCounts[w] || 0;
                if (count < minCount) {
                    minCount = count;
                    targetWard = w;
                }
            });
        }

        // 2. Generate Employee ID
        const currentYear = new Date().getFullYear();
        const randSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const employeeId = `MCD-${currentYear}-${randSuffix}`;

        // 3. Create User Account
        const newUser = new User({
            name: candidate.fullName,
            employeeId: employeeId,
            email: candidate.email,
            role: 'Worker', // Defaulting to Worker for now
            department: 'Sanitation', // Default
            Zone: zone,
            Ward: targetWard,
            employmentStatus: 'Permanent'
        });

        await newUser.save();

        // 4. Update Candidate Status
        candidate.verificationStatus = 'Approved';
        candidate.aiVerificationData.isVerified = true; // Mark as verified
        // We might want to store the generated ID on the candidate to show them later
        // Using 'reportCard' field temporarily or adding a new field 'generatedEmployeeId' in schema would be better.
        // But schema update might be needed. For now, let's send it back in response.

        await candidate.save();

        res.status(200).json({
            success: true,
            message: "Candidate Approved & Hired",
            employeeId: employeeId,
            assignedWard: targetWard,
            user: newUser
        });

    } catch (error) {
        console.error("Approve Candidate Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
