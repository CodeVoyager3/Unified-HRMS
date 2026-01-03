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
        // Optional: Check if data exists before wiping? 
        // For "permanent feed" request, we force fresh state to ensure it's always correct.
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
