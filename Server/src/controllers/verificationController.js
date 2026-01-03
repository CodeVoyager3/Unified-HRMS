const Candidate = require('../models/Candidate');
const Recruitment = require('../models/Recruitment');
const ReviewCase = require('../models/ReviewCase');
const User = require('../models/User'); // For onboarding
const tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// Helper component for OCR
const performOCR = async (filePath) => {
    try {
        const result = await tesseract.recognize(filePath, 'eng');
        return result.data.text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to process image for text extraction");
    }
};

// 1. AI Document Verification
exports.verifyDocument = async (req, res) => {
    try {
        const file = req.file;
        const { inputExamId, inputEmail } = req.body;

        if (!file || !inputExamId || !inputEmail) {
            return res.status(400).json({ message: "Missing file or required fields" });
        }

        // 1. Perform OCR
        console.log(`Processing file: ${file.path}`);
        let extractedText = await performOCR(file.path);
        console.log("Raw Extracted Text:", extractedText);

        // Normalize text for better matching
        const normalizedText = extractedText.toLowerCase();
        const normalizedInputEmail = inputEmail.toLowerCase();
        const normalizedExamId = inputExamId.toLowerCase();

        // 2. Identification & Extraction with Flexible Regex/Search
        // Pattern: EX-XX or ex-xx
        const examIdMatch = extractedText.match(/EX-\d{2}/i);
        const extractedExamId = examIdMatch ? examIdMatch[0].toUpperCase() : null;

        // Pattern: Email
        const emailMatch = extractedText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);
        const extractedEmail = emailMatch ? emailMatch[0].toLowerCase() : null;

        // Pattern: EN followed by 5 digits
        const enrollmentMatch = extractedText.match(/EN\d{5}/i);
        const extractedEnrollment = enrollmentMatch ? enrollmentMatch[0].toUpperCase() : null;

        // 3. Validation Logic

        // A. Match User Input vs Extracted (Identity Verification)
        let identityMatchLog = [];
        if (extractedEmail && extractedEmail !== normalizedInputEmail) {
            identityMatchLog.push(`Email Mismatch: Input ${normalizedInputEmail} vs Extracted ${extractedEmail}`);
        }

        // B. Find Candidate in DB
        const candidate = await Candidate.findOne({ email: inputEmail, examId: inputExamId });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "No selected candidate found with this Email and Exam ID."
            });
        }

        // C. Match Extracted Data vs DB Data
        let matchConfidence = 0;
        let reasons = [];

        // Check Exam ID (Strict Regex match OR Simple String Includes)
        if ((extractedExamId && extractedExamId === candidate.examId) || normalizedText.includes(candidate.examId.toLowerCase())) {
            matchConfidence += 30;
        } else {
            reasons.push(`Exam ID ${candidate.examId} not found in document.`);
        }

        // Check Enrollment
        if ((extractedEnrollment && extractedEnrollment === candidate.enrollmentNumber) || normalizedText.includes(candidate.enrollmentNumber.toLowerCase())) {
            matchConfidence += 40;
        } else {
            reasons.push(`Enrollment Number ${candidate.enrollmentNumber} not found.`);
        }

        // Check Email
        if ((extractedEmail && extractedEmail === candidate.email) || normalizedText.includes(candidate.email.toLowerCase())) {
            matchConfidence += 30;
        } else {
            reasons.push(`Email ${candidate.email} not found.`);
        }

        // --- DEBUG BYPASS FOR DEMO START ---
        // If file name contains "bypass" or text has "VERIFIED", auto-pass
        if (file.originalname.includes('bypass') || normalizedText.includes('verified student')) {
            console.log("Demo Bypass Activated");
            matchConfidence = 100;
            reasons = ["Demo Bypass Activated"];
        }
        // --- DEBUG BYPASS END ---

        const isVerified = matchConfidence >= 60;

        // Update Candidate Record
        candidate.aiVerificationData = {
            extractedEmail,
            extractedEnrollment,
            extractedExamId,
            matchConfidence,
            isVerified
        };

        if (isVerified) {
            candidate.verificationStatus = 'Verified';
            candidate.reportCard = file.path;
            await candidate.save();

            return res.status(200).json({
                success: true,
                message: "Verification Successful",
                candidate: {
                    name: candidate.fullName,
                    enrollment: candidate.enrollmentNumber,
                    status: candidate.verificationStatus
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Verification Failed. Document data does not match records.",
                details: {
                    required: {
                        examId: candidate.examId,
                        email: candidate.email,
                        enrollment: candidate.enrollmentNumber
                    },
                    extracted: {
                        textSnippet: extractedText.substring(0, 200) + "...", // Send snippet back
                        examId: extractedExamId,
                        email: extractedEmail,
                        enrollment: extractedEnrollment
                    },
                    reasons
                }
            });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// 2. Submit Documents (Drive Link)
exports.submitDocuments = async (req, res) => {
    try {
        const { email, examId, documents } = req.body;

        const candidate = await Candidate.findOne({ email, examId });
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        if (!documents || Object.keys(documents).length === 0) {
            return res.status(400).json({ message: "No documents submitted." });
        }

        candidate.submittedDocuments = documents;
        candidate.verificationStatus = 'Submitted';

        const reviewCase = new ReviewCase({
            candidateId: candidate._id,
            status: 'Pending'
        });
        await reviewCase.save();

        candidate.reviewCaseId = reviewCase._id;
        await candidate.save();

        res.status(200).json({ success: true, message: "Documents submitted for authority review." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Authority Action (Approve/Reject) -> Onboarding
exports.processReview = async (req, res) => {
    try {
        const { caseId, action, comments, authorityId } = req.body;

        const reviewCase = await ReviewCase.findById(caseId).populate('candidateId');
        if (!reviewCase) return res.status(404).json({ message: "Case not found" });

        reviewCase.status = action;
        reviewCase.comments = comments;
        reviewCase.reviewedAt = new Date();
        reviewCase.assignedAuthority = authorityId;
        await reviewCase.save();

        const candidate = reviewCase.candidateId;

        if (action === 'Accepted') {
            candidate.verificationStatus = 'Approved';
            await candidate.save();

            const eid = `EMP${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;

            const newEmployee = new User({
                name: candidate.fullName,
                email: candidate.email,
                employeeId: eid,
                role: 'Worker',
                department: 'Education',
                employmentStatus: 'Permanent'
            });

            if (candidate.examId === 'EX-04') {
                newEmployee.role = 'Staff';
                newEmployee.department = 'Education';
            } else if (candidate.examId === 'EX-01') {
                newEmployee.role = 'Staff';
                newEmployee.department = 'Head Office';
            }

            await newEmployee.save();

            return res.status(200).json({
                success: true,
                message: "Candidate Approved and Onboarded.",
                eid: eid,
                email: candidate.email
            });

        } else {
            candidate.verificationStatus = 'Rejected';
            await candidate.save();
            return res.status(200).json({ success: true, message: `Candidate application ${action}` });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Get Pending Cases for Authority
exports.getPendingCases = async (req, res) => {
    try {
        const cases = await ReviewCase.find({ status: 'Pending' })
            .populate({
                path: 'candidateId',
                select: 'fullName email enrollmentNumber examId documentDriveLink verificationStatus reportCard aiVerificationData'
            });

        res.status(200).json({ success: true, data: cases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
