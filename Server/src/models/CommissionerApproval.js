const mongoose = require('mongoose');

const commissionerApprovalSchema = new mongoose.Schema({
    approvalType: {
        type: String,
        enum: ['recruitment', 'transfer', 'budget', 'disciplinary'],
        required: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    requestedByName: String,
    zone: String,
    requestDate: {
        type: Date,
        default: Date.now
    },
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    commissionerComments: String,
    processedBy: String,
    approvedDate: Date,
    rejectedDate: Date,
    // Type-specific metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for faster queries
commissionerApprovalSchema.index({ status: 1, priority: -1 });
commissionerApprovalSchema.index({ approvalType: 1, status: 1 });
commissionerApprovalSchema.index({ requestDate: -1 });

module.exports = mongoose.model('CommissionerApproval', commissionerApprovalSchema);
