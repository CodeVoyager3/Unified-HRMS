const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        ref: 'User'
    },
    wardNumber: {
        type: Number,
        required: true
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
    week1: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    week2: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    week3: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    week4: {
        type: Number,
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

// Compound index to ensure one credit record per employee per month
creditSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

// Method to calculate total credits
creditSchema.methods.getTotalCredits = function() {
    return (this.week1 || 0) + (this.week2 || 0) + (this.week3 || 0) + (this.week4 || 0);
};

// Method to calculate average credits
creditSchema.methods.getAverageCredit = function() {
    const weeks = [this.week1, this.week2, this.week3, this.week4].filter(w => w > 0);
    return weeks.length > 0 ? (weeks.reduce((a, b) => a + b, 0) / weeks.length).toFixed(1) : '0.0';
};

module.exports = mongoose.model('Credit', creditSchema);


