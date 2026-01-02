const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    wardNumber: { type: String, required: true, unique: true },
    wardName: { type: String, required: true },
    zoneName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ward', wardSchema);
