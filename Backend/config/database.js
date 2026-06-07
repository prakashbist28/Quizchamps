const mongoose = require('mongoose');

const dropRogueIndexes = async () => {
  try {
    const collection = mongoose.connection.collection('quiz');
    const indexes = await collection.indexes();
    const rogue = indexes.find((idx) => idx.name === 'questions.options_1');
    if (rogue) {
      await collection.dropIndex('questions.options_1');
      console.log('Dropped stale index: questions.options_1');
    }
  } catch (err) {
    console.warn('Index cleanup skipped:', err.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected to BQuiz database');
    await dropRogueIndexes();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
