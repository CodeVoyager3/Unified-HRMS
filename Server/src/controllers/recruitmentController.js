const Recruitment = require('../models/Recruitment');
const Candidate = require('../models/Candidate');
const Ward = require('../models/Ward');
const User = require('../models/User');
const DCPerformance = require('../models/DCPerformance');

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
        email: "rahul.sharma.new@example.com",
        enrollmentNumber: "EN12345",
        dob: "2000-05-15",
        examId: "EX-01",
        verificationStatus: 'Submitted'
    },
    {
        fullName: "Priya Singh",
        phone: "9876543211",
        email: "priya.singh.new@example.com",
        enrollmentNumber: "EN67890",
        dob: "1999-08-20",
        examId: "EX-04",
        verificationStatus: 'Submitted'
    },
    {
        fullName: "Amritesh Kumar Rai",
        phone: "9876543212",
        email: "amriteshkumarrai14.new@gmail.com",
        enrollmentNumber: "EN99999",
        dob: "2006-10-30",
        examId: "EX-04",
        verificationStatus: 'Submitted'
    },
    { fullName: "Amit Verma", phone: "9871112222", email: "amit.verma.new@example.com", enrollmentNumber: "EN10001", dob: "1998-01-10", examId: "EX-01", verificationStatus: 'Submitted' },
    { fullName: "Sita Gupta", phone: "9871112233", email: "sita.gupta.new@example.com", enrollmentNumber: "EN10002", dob: "1997-07-22", examId: "EX-02", verificationStatus: 'Submitted' },
    { fullName: "Vikram Malhotra", phone: "9871112244", email: "vikram.m.new@example.com", enrollmentNumber: "EN10003", dob: "1995-12-05", examId: "EX-03", verificationStatus: 'Submitted' },
    { fullName: "Anjali Das", phone: "9871112255", email: "anjali.das.new@example.com", enrollmentNumber: "EN10004", dob: "2001-03-30", examId: "EX-04", verificationStatus: 'Submitted' },
    { fullName: "Rohan Mehra", phone: "9871112266", email: "rohan.mehra.new@example.com", enrollmentNumber: "EN10005", dob: "2000-11-12", examId: "EX-01", verificationStatus: 'Submitted' },
    { fullName: "Kavita Reddy", phone: "9871112277", email: "kavita.reddy.new@example.com", enrollmentNumber: "EN10006", dob: "1999-09-09", examId: "EX-02", verificationStatus: 'Submitted' },
    { fullName: "Arjun Rampal", phone: "9871112288", email: "arjun.r.new@example.com", enrollmentNumber: "EN10007", dob: "1996-06-18", examId: "EX-03", verificationStatus: 'Submitted' },
    { fullName: "Neha Kakkar", phone: "9871112299", email: "neha.k.new@example.com", enrollmentNumber: "EN10008", dob: "1998-04-25", examId: "EX-04", verificationStatus: 'Submitted' },
    { fullName: "Suresh Raina", phone: "9871112300", email: "suresh.r.new@example.com", enrollmentNumber: "EN10009", dob: "1995-02-14", examId: "EX-01", verificationStatus: 'Submitted' },
    { fullName: "Deepika P", phone: "9871112311", email: "deepika.p.new@example.com", enrollmentNumber: "EN10010", dob: "1997-12-31", examId: "EX-02", verificationStatus: 'Submitted' },
    { fullName: "Ranbir K", phone: "9871112322", email: "ranbir.k.new@example.com", enrollmentNumber: "EN10011", dob: "2000-01-01", examId: "EX-03", verificationStatus: 'Submitted' },
    { fullName: "Alia B", phone: "9871112333", email: "alia.b.new@example.com", enrollmentNumber: "EN10012", dob: "2001-08-15", examId: "EX-04", verificationStatus: 'Submitted' }
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

        // --- Seed Deputy Commissioners ---
        const existingDCs = await User.countDocuments({ role: 'Deputy Commissioner' });
        if (existingDCs === 0) {
            console.log("Seeding Deputy Commissioners...");
            const dummyDCs = [
                {
                    name: "Rajesh Kumar",
                    employeeId: "DC-001",
                    email: "rajesh.kumar@mcd.gov.in",
                    role: "Deputy Commissioner",
                    department: "Head Office",
                    Zone: "Narela Zone",
                    employmentStatus: "Permanent",
                    joiningDate: "2015-06-01"
                },
                {
                    name: "Sneha Gupta",
                    employeeId: "DC-002",
                    email: "sneha.gupta@mcd.gov.in",
                    role: "Deputy Commissioner",
                    department: "Head Office",
                    Zone: "Rohini Zone",
                    employmentStatus: "Permanent",
                    joiningDate: "2018-03-15"
                },
                {
                    name: "Vikram Singh",
                    employeeId: "DC-003",
                    email: "vikram.singh@mcd.gov.in",
                    role: "Deputy Commissioner",
                    department: "Head Office",
                    Zone: "South Zone",
                    employmentStatus: "Permanent",
                    joiningDate: "2016-11-20"
                },
                {
                    name: "Anjali Mehta",
                    employeeId: "DC-004",
                    email: "anjali.mehta@mcd.gov.in",
                    role: "Deputy Commissioner",
                    department: "Head Office",
                    Zone: "Karol Bagh Zone",
                    employmentStatus: "Contractual",
                    joiningDate: "2020-01-10"
                }
            ];

            const createdDCs = await User.insertMany(dummyDCs);

            // Seed Performance for current month
            const currentMonth = new Date().toISOString().slice(0, 7);
            const performances = createdDCs.map(dc => ({
                dcId: dc._id,
                dcName: dc.name,
                month: currentMonth,
                zone: dc.Zone,
                performanceScore: Math.floor(70 + Math.random() * 25),
                grievancesResolved: Math.floor(50 + Math.random() * 100),
                grievancesTotal: Math.floor(150 + Math.random() * 50),
                staffManagement: Math.floor(75 + Math.random() * 20),
                budgetCompliance: Math.floor(80 + Math.random() * 20),
                wardsManaged: Math.floor(4 + Math.random() * 4),
                averageWardScore: Math.floor(65 + Math.random() * 25),
                resolutionRate: Math.floor(70 + Math.random() * 20)
            }));

            await DCPerformance.insertMany(performances);
            console.log(`Seeded ${createdDCs.length} Deputy Commissioners and Performance`);
        }

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
                documentDriveLink: candidate.documentDriveLink,
                // Return allocation details if approved
                allocatedWard: candidate.allocatedWard,
                allocatedZone: candidate.allocatedZone,
                generatedEmployeeId: candidate.generatedEmployeeId,
                rejectionReason: candidate.rejectionReason
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
// User model already imported at top

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

exports.getPendingCandidates = async (req, res) => {
    try {
        // Fetch ALL candidates with status 'Submitted' regardless of zone
        // This enables the "First Come First Serve" global pool for all DCs
        const candidates = await Candidate.find({ verificationStatus: 'Submitted' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, candidates });
    } catch (error) {
        console.error("Fetch Pending Candidates Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Deprecated: Kept for backward compatibility if needed, but redirects to global pool
exports.getZoneCandidates = exports.getPendingCandidates;

exports.approveCandidate = async (req, res) => {
    try {
        const { candidateId, zone } = req.body;

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        if (candidate.verificationStatus === 'Approved') {
            return res.status(400).json({ success: false, message: "Candidate already approved" });
        }

        // 1. Assign Ward: Randomly select ANY valid ward from the database
        let targetWard = '1';
        let targetZone = zone; // Default to DC's zone, but will be overwritten by the random ward's zone

        try {
            // true global random assignment as requested
            const count = await Ward.countDocuments();
            if (count > 0) {
                const random = Math.floor(Math.random() * count);
                const randomWard = await Ward.findOne().skip(random);

                if (randomWard) {
                    targetWard = randomWard.wardNumber;
                    targetZone = randomWard.zoneName; // User takes the zone of the assigned ward
                    console.log(`[Approve] Global Random Assignment: Ward ${targetWard} (${targetZone})`);
                }
            } else {
                console.warn("[Approve] No wards in DB. Defaulting to Ward 1.");
            }

        } catch (wardError) {
            console.error("Error fetching random ward:", wardError);
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
            Zone: targetZone, // Use the zone corresponding to the allocated ward
            Ward: targetWard,
            employmentStatus: 'Permanent'
        });

        await newUser.save();

        // 4. Update Candidate Status
        candidate.verificationStatus = 'Approved';
        candidate.aiVerificationData.isVerified = true;

        // Save allocation details for the portal
        candidate.allocatedWard = targetWard;
        candidate.allocatedZone = targetZone;
        candidate.generatedEmployeeId = employeeId;

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
