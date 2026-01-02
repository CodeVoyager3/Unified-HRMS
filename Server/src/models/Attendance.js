const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'leave', 'weekend'],
        default: 'absent'
    },
    isLocationVerified: {
        type: Boolean,
        default: false
    },
    assignedWard: {
        type: Number
    },
    assignedZone: {
        type: String
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

