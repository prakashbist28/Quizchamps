const Quiz = require('../models/quizModel');

exports.getCreatorAnalytics = async (req, res) => {
  try {
    const creatorId = req.user._id;

    // Single aggregation: join only the fields needed from attempts
    // using a pipeline lookup to avoid pulling full answers arrays into memory
    const quizStats = await Quiz.aggregate([
      { $match: { createdBy: creatorId } },

      {
        $lookup: {
          from: 'attempts',
          let: { quizId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$quizId', '$$quizId'] } } },
            {
              $project: {
                _id: 0,
                percentage: 1,
                // true when every answer has a non-null userAnswer
                hasFullCompletion: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: '$answers',
                          as: 'ans',
                          cond: { $eq: ['$$ans.userAnswer', null] },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          ],
          as: 'attempts',
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          category: 1,
          customCategory: 1,
          visibility: 1,
          createdAt: 1,
          totalAttempts: { $size: '$attempts' },
          avgScore: {
            $cond: [
              { $gt: [{ $size: '$attempts' }, 0] },
              { $round: [{ $avg: '$attempts.percentage' }, 1] },
              null,
            ],
          },
          highScore: {
            $cond: [
              { $gt: [{ $size: '$attempts' }, 0] },
              { $max: '$attempts.percentage' },
              null,
            ],
          },
          lowScore: {
            $cond: [
              { $gt: [{ $size: '$attempts' }, 0] },
              { $min: '$attempts.percentage' },
              null,
            ],
          },
          completionCount: {
            $size: {
              $filter: {
                input: '$attempts',
                as: 'a',
                cond: '$$a.hasFullCompletion',
              },
            },
          },
        },
      },

      { $sort: { totalAttempts: -1, createdAt: -1 } },
    ]);

    // Compute summary from per-quiz results (no second round-trip)
    const totalAttempts = quizStats.reduce((s, q) => s + q.totalAttempts, 0);

    // Attempt-weighted average across all quizzes
    const weightedSum = quizStats.reduce(
      (s, q) => s + (q.totalAttempts > 0 ? q.avgScore * q.totalAttempts : 0),
      0
    );
    const overallAvgScore =
      totalAttempts > 0
        ? Math.round((weightedSum / totalAttempts) * 10) / 10
        : null;

    const top = quizStats[0];
    const mostAttempted =
      top && top.totalAttempts > 0
        ? { _id: top._id, title: top.title, totalAttempts: top.totalAttempts }
        : null;

    res.json({
      summary: {
        totalQuizzes: quizStats.length,
        totalAttempts,
        overallAvgScore,
        mostAttempted,
      },
      quizzes: quizStats,
    });
  } catch (error) {
    console.error('getCreatorAnalytics error:', error.name, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
