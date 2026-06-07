const Attempt = require('../models/attemptModel');
const Quiz = require('../models/quizModel');


exports.submitAttempt = async (req, res) => {
  const { quizId, answers, startedAt } = req.body;

  if (!quizId || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'quizId and answers array are required' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Build lookup map: questionId string → question document
    const questionMap = new Map(
      quiz.questions.map((q) => [q._id.toString(), q])
    );

    // Server-side score calculation — never trust the frontend score
    let score = 0;
    const detailedAnswers = answers
      .map(({ questionId, userAnswer }) => {
        const question = questionMap.get(questionId?.toString());
        if (!question) return null;

        const answered = userAnswer !== null && userAnswer !== undefined && userAnswer !== '';
        const isCorrect = answered && userAnswer === question.answer;
        if (isCorrect) score++;

        return {
          questionId: question._id,
          userAnswer: answered ? userAnswer : null,
          correctAnswer: question.answer,
          isCorrect,
          explanation: question.explanation || '',
        };
      })
      .filter(Boolean);

    const totalQuestions = quiz.questions.length;
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const attempt = await Attempt.create({
      userId: req.user._id,
      quizId,
      score,
      totalQuestions,
      percentage,
      answers: detailedAnswers,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      completedAt: new Date(),
    });

    res.status(201).json({
      _id: attempt._id,
      score,
      totalQuestions,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getMyAttempts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    const [total, attempts] = await Promise.all([
      Attempt.countDocuments(filter),
      Attempt.find(filter)
        .populate('quizId', 'title')
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-answers'),
    ]);

    res.json({
      attempts,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAttemptsByQuiz = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.user._id,
      quizId: req.params.quizId,
    })
      .populate('quizId', 'title')
      .sort({ completedAt: -1 })
      .select('-answers');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quizId', 'title questions');

    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    // Users may only access their own attempts
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
