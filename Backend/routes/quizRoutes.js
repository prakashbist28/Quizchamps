const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/quiz', optionalProtect, quizController.getAllQuizzes);
router.get('/quiz/:id', optionalProtect, quizController.getQuizById);
router.get('/myquizzes', protect, quizController.getMyQuizzes);
router.post('/createquiz', protect, quizController.createQuiz);
router.put('/quiz/:id', protect, quizController.updateQuiz);
router.delete('/quiz/:id', protect, quizController.deleteQuiz);

module.exports = router;
