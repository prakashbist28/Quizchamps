const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/quiz/:id', quizController.getQuizById);
router.get('/quiz', quizController.getAllQuizzes);
router.post('/createquiz', quizController.createQuiz);

module.exports = router;
 