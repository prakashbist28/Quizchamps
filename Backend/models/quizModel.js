const mongoose = require('mongoose');


const areArrayElementsUnique = (arr) => {
  return new Set(arr).size === arr.length;
};

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (value) {
        return areArrayElementsUnique(value);
      },
      message: 'Options must be unique',
    },
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
});

const Quiz = mongoose.model('Quiz', quizSchema, 'quiz');

module.exports = Quiz;
