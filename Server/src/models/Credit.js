const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        ref: 'User'
    },
    week: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    credit: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
        default: 0
    },
    assignedBy: {
        type: String, // Employee ID of the inspector who assigned
        required: true
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to ensure one credit per employee per week
creditSchema.index({ employeeId: 1, week: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Credit', creditSchema);

