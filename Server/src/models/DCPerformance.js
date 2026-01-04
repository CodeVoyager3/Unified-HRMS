const mongoose = require('mongoose');

const dcPerformanceSchema = new mongoose.Schema({
    dcId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    dcName: String,
    month: {
        type: String,
        required: true // Format: "YYYY-MM"
    },
    zone: {
        type: String,
        required: true
    },
    // Performance Metrics
    performanceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    grievancesResolved: {
        type: Number,
        default: 0
    },
    grievancesTotal: {
        type: Number,
        default: 0
    },
    staffManagement: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    budgetCompliance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    wardsManaged: {
        type: Number,
        default: 0
    },
    averageWardScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    // Evaluation
    evaluatedBy: String, // Commissioner ID
    evaluationDate: Date,
    comments: String,
    strengths: [String],
    improvements: [String],
    // Additional metrics
    metrics: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index for unique month-DC combination
dcPerformanceSchema.index({ dcId: 1, month: 1 }, { unique: true });
dcPerformanceSchema.index({ zone: 1, month: 1 });

module.exports = mongoose.model('DCPerformance', dcPerformanceSchema);
