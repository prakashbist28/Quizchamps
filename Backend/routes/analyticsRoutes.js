const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

router.get('/creator', protect, analyticsController.getCreatorAnalytics);

module.exports = router;
