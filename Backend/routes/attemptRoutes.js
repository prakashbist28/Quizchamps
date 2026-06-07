const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

// All attempt routes require authentication
router.post('/', protect, attemptController.submitAttempt);
router.get('/me', protect, attemptController.getMyAttempts);
router.get('/quiz/:quizId', protect, attemptController.getAttemptsByQuiz);
router.get('/:id', protect, attemptController.getAttemptById);

module.exports = router;
