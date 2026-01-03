const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
    violatorName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String
    },
    violationType: {
        type: String,
        enum: ['Littering', 'Open Burning', 'Construction Waste', 'Illegal Hoarding', 'Mosquito Breeding', 'Other'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    location: {
        address: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    image: {
        type: String // URL or Base64 (simplified for hackathon)
    },
    issuedBy: {
        type: String, // Inspector's Employee ID
        required: true
    },
    ward: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Disputed'],
        default: 'Unpaid'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Challan', challanSchema);
