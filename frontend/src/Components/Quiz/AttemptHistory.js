import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { FiClock, FiAward, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { MdOutlineHistory } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../constants/toastConfig';
import { formatDateTime as formatDate } from '../../utils/formatDate';
import { percentageColor, percentageBadge } from '../../utils/scoreColors';
import PageLoader from '../ui/PageLoader';

const LIMIT = 10;

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchAttempts = useCallback(async (targetPage) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/attempts/me?page=${targetPage}&limit=${LIMIT}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAttempts(data.attempts ?? []);
      setPagination(data.pagination ?? { total: 0, page: 1, totalPages: 1 });
    } catch {
      toast.error('Failed to load attempt history', toastOptions);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAttempts(page);
  }, [page, fetchAttempts]);

  const goToPage = (next) => {
    const clamped = Math.max(1, Math.min(next, pagination.totalPages));
    setPage(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { total, totalPages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);

  if (loading) return <PageLoader message="Loading history..." />;

  return (
    <>
      <ToastContainer />
      <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">

        {/* Page header */}
        <div className="flex items-end justify-between mb-10">
          <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
            Attempt History
          </h1>
          {total > 0 && (
            <p className="font-nine text-sm text-gray-400 dark:text-gray-500 pb-2">
              {total} attempt{total !== 1 ? 's' : ''} total
            </p>
          )}
        </div>

        {attempts.length === 0 && page === 1 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <MdOutlineHistory className="text-blue-300 size-24 opacity-40" />
            <p className="font-ten text-xl text-gray-500 dark:text-gray-400">
              No attempts yet. Take a quiz to see your history.
            </p>
            <button
              onClick={() => navigate('/takequiz')}
              className="px-6 py-3 bg-orange-500 text-white font-nine font-semibold rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-1 transition duration-300"
            >
              Browse Quizzes
            </button>
          </div>
        ) : (
          <>
            {/* Attempt list */}
            <div className="flex flex-col gap-4 mb-8">
              {attempts.map((attempt) => (
                <div
                  key={attempt._id}
                  onClick={() => navigate(`/attempts/${attempt._id}`)}
                  className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-5 flex items-center gap-4 lg:grid lg:grid-cols-[3.5rem_1fr_auto_auto_auto_auto] lg:gap-x-6 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-blue-500/20 transition duration-300 group"
                >
                  {/* 1. Percentage circle */}
                  <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-blue-300 dark:border-blue-700">
                    <span className={`font-ten font-bold text-sm leading-none ${percentageColor(attempt.percentage)}`}>
                      {attempt.percentage}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-none">%</span>
                  </div>

                  {/* 2. Title + sub-info (sub-info hidden on lg) */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-ten text-left font-semibold text-gray-800 dark:text-white text-base md:text-lg truncate">
                      {attempt.quizId?.title ?? 'Unknown Quiz'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1 lg:hidden">
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-nine">
                        <FiAward className="size-3" />
                        {attempt.score} / {attempt.totalQuestions}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-nine">
                        <FiClock className="size-3" />
                        {formatDate(attempt.completedAt)}
                      </span>
                    </div>
                  </div>

                  {/* 3. Score – own column on lg */}
                  <span className="hidden lg:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-nine whitespace-nowrap">
                    <FiAward className="size-3" />
                    {attempt.score} / {attempt.totalQuestions}
                  </span>

                  {/* 4. Date – own column on lg */}
                  <span className="hidden lg:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-nine whitespace-nowrap">
                    <FiClock className="size-3" />
                    {formatDate(attempt.completedAt)}
                  </span>

                  {/* 5. Badge */}
                  <span className={`shrink-0 hidden sm:block px-3 py-1 rounded-full text-xs font-nine font-semibold ${percentageBadge(attempt.percentage)}`}>
                    {attempt.percentage >= 75 ? 'Great' : attempt.percentage >= 50 ? 'Good' : 'Needs Work'}
                  </span>

                  {/* 6. Chevron */}
                  <FiChevronRight className="shrink-0 size-5 text-gray-400 group-hover:text-blue-500 transition duration-200" />
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-2 px-4 py-2 font-nine text-sm font-semibold border border-blue-300 dark:border-blue-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <FiChevronLeft className="size-4" />
                  Previous
                </button>

                <div className="text-center">
                  <p className="font-nine text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </p>
                  <p className="font-nine text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Showing {from}–{to} of {total}
                  </p>
                </div>

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 px-4 py-2 font-nine text-sm font-semibold border border-blue-300 dark:border-blue-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  Next
                  <FiChevronRight className="size-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AttemptHistory;
