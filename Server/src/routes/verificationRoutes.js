const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/verify', upload.single('document'), verificationController.verifyDocument);
router.post('/submit', verificationController.submitDocuments);
router.post('/review', verificationController.processReview);
router.get('/cases', verificationController.getPendingCases);

module.exports = router;
