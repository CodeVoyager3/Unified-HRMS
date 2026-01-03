const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');

router.post('/seed', recruitmentController.seedDummyData);
router.get('/', recruitmentController.getRecruitments);
router.post('/check-status', recruitmentController.checkCandidateStatus);

module.exports = router;
