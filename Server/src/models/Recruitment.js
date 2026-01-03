const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema({
    examId: { type: String, required: true, unique: true }, // e.g., EX-01
    examName: { type: String, required: true }, // e.g., Clerk, Police
    year: { type: String, required: true },
    requiredDocuments: [{ type: String }], // List of required doc names e.g. ["10th Certificate", "Adhaar"]
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Recruitment', recruitmentSchema);
