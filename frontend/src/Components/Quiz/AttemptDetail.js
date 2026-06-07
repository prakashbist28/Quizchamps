import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../constants/toastConfig';
import { formatDateTime as formatDate } from '../../utils/formatDate';
import PageLoader from '../ui/PageLoader';

const formatDuration = (startedAt, completedAt) => {
  const secs = Math.round((new Date(completedAt) - new Date(startedAt)) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
};

const AttemptDetail = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/attempts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setAttempt(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load attempt', toastOptions);
        navigate('/history');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [id, token, navigate]);

  if (loading) return <PageLoader message="Loading attempt..." />;

  if (!attempt) return null;

  const winPercentage = attempt.percentage;

  return (
    <>
      <ToastContainer />
      <div className="p-6 w-full md:w-10/12 lg:w-2/3 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">
        {/* Back link */}
        <button
          onClick={() => navigate('/history')}
          className="text-sm font-nine text-gray-500 dark:text-gray-400 hover:text-blue-500 transition duration-200 mb-6 flex items-center gap-1"
        >
          ← Attempt History
        </button>

        {/* Title */}
        <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl pb-4">
          {attempt.quizId?.title ?? 'Quiz'}
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <p className="font-ten text-2xl font-bold text-blue-500">
              {attempt.score}/{attempt.totalQuestions}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-nine mt-1">Score</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <p className="font-ten text-2xl font-bold text-blue-500">{winPercentage}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-nine mt-1">Percentage</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <p className="font-ten text-2xl font-bold text-blue-500">
              {formatDuration(attempt.startedAt, attempt.completedAt)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-nine mt-1">Duration</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <p className="font-ten text-sm font-bold text-blue-500 leading-tight">
              {formatDate(attempt.completedAt)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-nine mt-1">Completed</p>
          </div>
        </div>

        {/* Question-by-question breakdown */}
        <h2 className="font-ten font-bold text-xl dark:text-white mb-4">Answer Breakdown</h2>
        <div className="flex flex-col gap-4">
          {attempt.answers.map((ans, index) => {
            const matchedQuestion = attempt.quizId?.questions?.find(
              (q) => q._id.toString() === ans.questionId?.toString()
            );
            const questionText = matchedQuestion?.question ?? `Question ${index + 1}`;
            const explanation = ans.explanation || matchedQuestion?.explanation || '';

            const statusColor = ans.isCorrect
              ? 'border-green-400 dark:border-green-600'
              : ans.userAnswer === null
              ? 'border-yellow-400 dark:border-yellow-600'
              : 'border-red-400 dark:border-red-600';

            const statusBadge = ans.isCorrect
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : ans.userAnswer === null
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';

            const statusLabel = ans.isCorrect
              ? 'Correct +1'
              : ans.userAnswer === null
              ? 'No Answer'
              : 'Wrong 0';

            return (
              <div
                key={index}
                className={`bg-white dark:bg-slate-800 border-l-4 ${statusColor} border border-gray-200 dark:border-gray-800 rounded-xl p-5`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="font-ten font-semibold text-gray-800 dark:text-white text-sm md:text-base">
                    <span className="text-blue-400 mr-2">Q{index + 1}.</span>
                    {questionText}
                  </p>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-nine font-semibold ${statusBadge}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-nine">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 shrink-0">Your answer:</span>
                    <span
                      className={
                        ans.userAnswer === null
                          ? 'text-yellow-600 dark:text-yellow-400 italic'
                          : ans.isCorrect
                          ? 'text-green-600 dark:text-green-400 font-semibold'
                          : 'text-red-500 dark:text-red-400'
                      }
                    >
                      {ans.userAnswer ?? 'No answer selected'}
                    </span>
                  </div>
                  {!ans.isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 shrink-0">Correct answer:</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {ans.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>

                {explanation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg">
                    <p className="text-xs font-nine font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wide mb-1">
                      Explanation
                    </p>
                    <p className="text-sm font-nine text-gray-700 dark:text-gray-300">
                      {explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-10">
          <button
            onClick={() => navigate('/takequiz')}
            className="px-6 py-3 bg-orange-500 text-white font-nine font-semibold rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300"
          >
            Try Another Quiz
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 font-nine font-semibold rounded-md border border-blue-300 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-300"
          >
            All Attempts
          </button>
        </div>
      </div>
    </>
  );
};

export default AttemptDetail;
