const Quiz = require('../models/quizModel');

const VALID_CATEGORIES = [
  'Coding', 'Science', 'History', 'Geography', 'Nature',
  'Sports', 'Entertainment', 'Business & Finance',
  'Language & Literature', 'General Knowledge', 'Other',
];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeTags = (raw) => {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const result = [];
  for (const t of raw) {
    const trimmed = String(t).trim();
    if (!trimmed || trimmed.toLowerCase() === 'other') continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key) && result.length < 10) {
      seen.add(key);
      result.push(trimmed);
    }
  }
  return result;
};


exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (quiz.visibility === 'private') {
      const requesterId = req.user?._id?.toString();
      const ownerId = quiz.createdBy?._id?.toString() ?? quiz.createdBy?.toString();
      if (!requesterId || requesterId !== ownerId) {
        return res.status(403).json({ message: 'This quiz is private' });
      }
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllQuizzes = async (req, res) => {
  try {
    const { search, category, tags, difficulty, page = 1, limit = 12 } = req.query;

    const filter = { visibility: { $ne: 'private' } };

    if (category) filter.category = category;
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) filter.difficulty = difficulty;

    if (tags) {
      const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagArr.length) filter.tags = { $in: tagArr };
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { customCategory: regex },
        { tags: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [quizzes, total] = await Promise.all([
      Quiz.find(filter)
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Quiz.countDocuments(filter),
    ]);

    res.json({
      quizzes,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getMyQuizzes = async (req, res) => {
  try {
    const { search, category, tags, visibility, difficulty, page = 1, limit = 12 } = req.query;

    const filter = { createdBy: req.user._id };

    if (category) filter.category = category;
    if (visibility === 'public' || visibility === 'private') filter.visibility = visibility;
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) filter.difficulty = difficulty;

    if (tags) {
      const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagArr.length) filter.tags = { $in: tagArr };
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { customCategory: regex },
        { tags: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [quizzes, total] = await Promise.all([
      Quiz.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Quiz.countDocuments(filter),
    ]);

    res.json({
      quizzes,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createQuiz = async (req, res) => {
  try {
    const { title, questions, visibility, category, customCategory, tags, description, difficulty } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const safeVisibility = visibility === 'private' ? 'private' : 'public';
    const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'General Knowledge';
    const safeCustomCategory =
      safeCategory === 'Other' && typeof customCategory === 'string'
        ? customCategory.trim().slice(0, 60)
        : '';
    const safeTags = normalizeTags(tags);
    const safeDescription = typeof description === 'string' ? description.trim().slice(0, 500) : '';
    const safeDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';

    const newQuiz = new Quiz({
      title,
      questions,
      createdBy: req.user._id,
      visibility: safeVisibility,
      category: safeCategory,
      customCategory: safeCustomCategory,
      tags: safeTags,
      description: safeDescription,
      difficulty: safeDifficulty,
    });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz Added Successfully' });
  } catch (error) {
    console.error('createQuiz error:', error.name, error.message);
    if (error.name === 'ValidationError') {
      const first = Object.values(error.errors)[0];
      return res.status(400).json({ message: first?.message || 'Validation failed' });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid value for field: ${error.path}` });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};


exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this quiz' });
    }

    const { title, questions, visibility, category, customCategory, tags, description, difficulty } = req.body;
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    quiz.title = title;
    quiz.questions = questions;

    if (visibility === 'public' || visibility === 'private') quiz.visibility = visibility;

    if (VALID_CATEGORIES.includes(category)) {
      quiz.category = category;
      quiz.customCategory =
        category === 'Other' && typeof customCategory === 'string'
          ? customCategory.trim().slice(0, 60)
          : '';
    }

    quiz.tags = normalizeTags(tags);
    if (typeof description === 'string') quiz.description = description.trim().slice(0, 500);
    if (['Easy', 'Medium', 'Hard'].includes(difficulty)) quiz.difficulty = difficulty;

    await quiz.save();
    res.json({ message: 'Quiz updated successfully' });
  } catch (error) {
    console.error('updateQuiz error:', error.name, error.message);
    if (error.name === 'ValidationError') {
      const first = Object.values(error.errors)[0];
      return res.status(400).json({ message: first?.message || 'Validation failed' });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid value for field: ${error.path}` });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};


exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
