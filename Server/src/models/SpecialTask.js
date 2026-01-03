const mongoose = require('mongoose');

const specialTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: String, required: true }, // Employee ID
    assignedBy: { type: String, required: true }, // Inspector ID
    ward: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Verified', 'Fined'],
        default: 'Pending'
    },
    proofImage: { type: String },
    completionDescription: { type: String }, // Notes from employee upon completion
    fineAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model('SpecialTask', specialTaskSchema);
