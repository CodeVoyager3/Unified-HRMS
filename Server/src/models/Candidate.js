const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }, // Primary Identity
    enrollmentNumber: { type: String, required: true },
    dob: { type: String, required: true }, // Format: YYYY-MM-DD or DD-MM-YYYY
    examId: { type: String, required: true, ref: 'Recruitment' },

    // Verification Status
    verificationStatus: {
        type: String,
        enum: ['Unverified', 'Verified', 'Submitted', 'Approved', 'Rejected'],
        default: 'Unverified'
    },
    rejectionReason: { type: String }, // New field for feedback

    // Uploaded Documents
    reportCard: { type: String }, // Path/Link to uploaded report card
    documentDriveLink: { type: String }, // User provided Google Drive folder link
    submittedDocuments: { type: Object }, // Structure: { "Category": { "DocName": "Link" } }

    // AI Verification Metadata
    aiVerificationData: {
        extractedEmail: String,
        extractedEnrollment: String,
        extractedExamId: String,
        extractedDob: String,
        matchConfidence: Number,
        isVerified: { type: Boolean, default: false }
    },

    // Authority Review
    reviewCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReviewCase' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
