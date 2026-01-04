const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');

router.post('/status', developerController.checkTemporaryUserStatus);
router.post('/create', developerController.createTemporaryUser);
router.post('/delete', developerController.deleteTemporaryUser);
router.get('/cleanup', developerController.cleanupTemporaryUsers);

module.exports = router;
