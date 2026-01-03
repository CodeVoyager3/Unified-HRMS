const mongoose = require('mongoose');

const reviewCaseSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    assignedAuthority: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // SI or DC

    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Re-upload Requested'],
        default: 'Pending'
    },

    comments: { type: String },
    reviewedAt: { type: Date },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReviewCase', reviewCaseSchema);
