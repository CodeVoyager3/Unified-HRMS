const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Zone Statistics
router.get('/zone-stats/:zone', analyticsController.getZoneStats);
router.get('/zone-trends/:zone', analyticsController.getZoneTrends);

// City-Wide Analytics
router.get('/city-stats', analyticsController.getCityStats);
router.get('/zone-comparison', analyticsController.getZoneComparison);
router.get('/alerts', analyticsController.getAlerts);
router.get('/city-trends', analyticsController.getCityTrends);

module.exports = router;
