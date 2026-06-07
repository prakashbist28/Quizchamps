const Attempt = require('../models/attemptModel');
const Quiz = require('../models/quizModel');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [attemptAgg, totalCreated, recentActivity] = await Promise.all([
      Attempt.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalTaken: { $sum: 1 },
            avgPercentage: { $avg: '$percentage' },
            bestPercentage: { $max: '$percentage' },
          },
        },
      ]),

      Quiz.countDocuments({ createdBy: userId }),

      Attempt.find({ userId })
        .populate('quizId', 'title')
        .sort({ completedAt: -1 })
        .limit(5)
        .select('quizId score totalQuestions percentage completedAt'),
    ]);

    const agg = attemptAgg[0] ?? { totalTaken: 0, avgPercentage: 0, bestPercentage: 0 };

    res.json({
      totalTaken: agg.totalTaken,
      totalCreated,
      avgPercentage: Math.round(agg.avgPercentage ?? 0),
      bestPercentage: agg.bestPercentage ?? 0,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
