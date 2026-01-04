const mongoose = require("mongoose");

const EmployeeIssueSchema = mongoose.Schema({
    Eid: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Forwarded"],
        default: "Pending"
    },
    resolutionImage: {
        type: String
    },
    resolvedBy: {
        type: String
    },
    resolvedAt: {
        type: Date
    },
    ward: {
        type: Number
    },
    department: {
        type: String,
        default: 'Sanitation',
        enum: ['Sanitation', 'Engineering', 'Health', 'Electrical', 'Horticulture']
    },
    forwardedTo: {
        type: String
    },
    category: {
        type: String,
        enum: ['General', 'Vector Control', 'Drainage', 'Garbage'],
        default: 'General'
    },
    // Commissioner Escalation
    escalatedToCommissioner: {
        type: Boolean,
        default: false
    },
    commissionerNotes: {
        type: String
    },
    escalationDate: {
        type: Date
    }
})

module.exports = mongoose.model("EmployeeIssue", EmployeeIssueSchema);