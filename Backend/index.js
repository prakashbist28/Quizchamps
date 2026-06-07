const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json({ limit: '4mb' }));

// Db
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', quizRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
