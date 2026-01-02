const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    wardNumber: { type: String, required: true, unique: true },
    wardName: { type: String, required: true },
    zoneName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    boundary: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: false
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers
            required: false
        }
    }
}, { timestamps: true });

wardSchema.index({ boundary: '2dsphere' });
wardSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Ward', wardSchema);
