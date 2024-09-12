const Quiz = require('../models/quizModel');


exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllQuizzes = async (req, res) => {
  try {
    const quizList = await Quiz.find();
    if (!quizList.length) return res.status(404).json({ message: 'No Quizzes Available' });
    res.json(quizList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const newQuiz = new Quiz({
      title,
      questions,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz Added Successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Make sure options are unique' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
}
