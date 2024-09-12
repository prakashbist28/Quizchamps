const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const quizRoutes = require('./routes/quizRoutes');

dotenv.config();

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

// Db
connectDB();

// Routes
app.use('/api', quizRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
