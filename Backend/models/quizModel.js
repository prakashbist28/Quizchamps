const mongoose = require('mongoose');

const areArrayElementsUnique = (arr) => new Set(arr).size === arr.length;

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: areArrayElementsUnique,
      message: 'Options must be unique',
    },
  },
  answer: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  explanation: { type: String, default: '' },
});

const VALID_CATEGORIES = [
  'Coding', 'Science', 'History', 'Geography', 'Nature',
  'Sports', 'Entertainment', 'Business & Finance',
  'Language & Literature', 'General Knowledge', 'Other',
];

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '', trim: true },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    category: {
      type: String,
      enum: VALID_CATEGORIES,
      default: 'General Knowledge',
    },
    customCategory: { type: String, default: '', trim: true },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Maximum 10 tags per quiz',
      },
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

quizSchema.index({ visibility: 1, category: 1, createdAt: -1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ createdBy: 1, createdAt: -1 });
quizSchema.index({ difficulty: 1 });

const Quiz = mongoose.model('Quiz', quizSchema, 'quiz');

module.exports = Quiz;
module.exports.VALID_CATEGORIES = VALID_CATEGORIES;
