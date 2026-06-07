import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  FiBarChart2, FiUsers, FiTrendingUp, FiAward,
  FiGlobe, FiLock, FiEdit3, FiArrowUp, FiArrowDown,
  FiPlusCircle, FiMinus,
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { displayCategory } from '../constants/quizCategories';
import { toastOptions } from '../constants/toastConfig';
import StatCard from './ui/StatCard';
import PageLoader from './ui/PageLoader';

// ── Small helpers ────────────────────────────────────────────────────────────

const fmt = (val, suffix = '%') =>
  val === null || val === undefined ? '—' : `${val}${suffix}`;

const scoreColor = (pct) => {
  if (pct === null) return 'text-gray-400 dark:text-gray-600';
  if (pct >= 75) return 'text-green-600 dark:text-green-400';
  if (pct >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-500 dark:text-red-400';
};

// ── Sortable column header ────────────────────────────────────────────────────

const SortTh = ({ label, sortKey, active, dir, onSort, className = '' }) => (
  <th
    onClick={() => onSort(sortKey)}
    className={`px-4 py-3 text-left text-xs font-nine font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-blue-500 transition duration-200 ${className}`}
  >
    <span className="flex items-center gap-1">
      {label}
      {active ? (
        dir === 'desc' ? (
          <FiArrowDown className="size-3 text-blue-500" />
        ) : (
          <FiArrowUp className="size-3 text-blue-500" />
        )
      ) : (
        <FiMinus className="size-3 opacity-30" />
      )}
    </span>
  </th>
);

// ── Main component ────────────────────────────────────────────────────────────

const CreatorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'totalAttempts', dir: 'desc' });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/analytics/creator`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setData(json);
      } catch (err) {
        toast.error(err.message || 'Failed to load analytics', toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: 'desc' }
    );
  };

  const sorted = useMemo(() => {
    if (!data?.quizzes) return [];
    return [...data.quizzes].sort((a, b) => {
      const { key, dir } = sortConfig;
      const mul = dir === 'desc' ? -1 : 1;

      if (key === 'title') {
        return mul * a.title.localeCompare(b.title);
      }
      if (key === 'completionRate') {
        const ar = a.totalAttempts > 0 ? a.completionCount / a.totalAttempts : -1;
        const br = b.totalAttempts > 0 ? b.completionCount / b.totalAttempts : -1;
        return mul * (ar - br);
      }
      const av = a[key] ?? -Infinity;
      const bv = b[key] ?? -Infinity;
      return mul * (av - bv);
    });
  }, [data, sortConfig]);

  if (loading) return <PageLoader message="Loading analytics..." />;

  const { summary } = data ?? {};
  const noQuizzes = !summary || summary.totalQuizzes === 0;

  return (
    <>
      <ToastContainer />
      <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
              Creator Analytics
            </h1>
            <p className="font-nine text-gray-500 dark:text-gray-400 mt-2 text-base">
              Performance overview for all your quizzes
            </p>
          </div>
          <button
            onClick={() => navigate('/myquizzes')}
            className="hidden md:flex items-center gap-2 text-sm font-nine text-gray-500 dark:text-gray-400 hover:text-blue-500 transition duration-200 mt-4"
          >
            ← My Quizzes
          </button>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={FiBarChart2}
            label="Total Quizzes"
            value={summary?.totalQuizzes ?? 0}
            accent="bg-blue-500"
          />
          <StatCard
            icon={FiUsers}
            label="Total Attempts"
            value={summary?.totalAttempts ?? 0}
            sub="across all your quizzes"
            accent="bg-orange-500"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Overall Avg Score"
            value={fmt(summary?.overallAvgScore)}
            sub={summary?.overallAvgScore !== null ? 'attempt-weighted' : 'no attempts yet'}
            accent="bg-cyan-500"
          />
          <StatCard
            icon={FiAward}
            label="Most Attempted"
            value={summary?.mostAttempted ? `${summary.mostAttempted.totalAttempts}` : '—'}
            sub={summary?.mostAttempted?.title ?? 'no attempts yet'}
            accent="bg-amber-500"
          />
        </div>

        {/* ── No quizzes empty state ── */}
        {noQuizzes ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl">
            <FiBarChart2 className="size-16 text-blue-300 opacity-40" />
            <p className="font-ten text-gray-500 dark:text-gray-400 text-lg">
              No quizzes yet. Create your first quiz to see analytics.
            </p>
            <button
              onClick={() => navigate('/createquiz')}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-nine font-semibold rounded-lg border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300 text-sm"
            >
              <FiPlusCircle className="size-4" />
              Create Quiz
            </button>
          </div>
        ) : (
          <>
            {/* ── Per-quiz breakdown table ── */}
            <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-blue-100 dark:border-blue-800 flex items-center justify-between">
                <h2 className="font-ten font-bold text-lg dark:text-white">
                  Per-Quiz Breakdown
                </h2>
                <p className="text-xs font-nine text-gray-400">
                  Click a column header to sort
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 dark:bg-blue-950/30">
                    <tr>
                      <SortTh
                        label="Quiz"
                        sortKey="title"
                        active={sortConfig.key === 'title'}
                        dir={sortConfig.dir}
                        onSort={handleSort}
                        className="min-w-[200px]"
                      />
                      <SortTh
                        label="Attempts"
                        sortKey="totalAttempts"
                        active={sortConfig.key === 'totalAttempts'}
                        dir={sortConfig.dir}
                        onSort={handleSort}
                      />
                      <SortTh
                        label="Avg Score"
                        sortKey="avgScore"
                        active={sortConfig.key === 'avgScore'}
                        dir={sortConfig.dir}
                        onSort={handleSort}
                      />
                      <SortTh
                        label="Highest"
                        sortKey="highScore"
                        active={sortConfig.key === 'highScore'}
                        dir={sortConfig.dir}
                        onSort={handleSort}
                      />
                      <SortTh
                        label="Lowest"
                        sortKey="lowScore"
                        active={sortConfig.key === 'lowScore'}
                        dir={sortConfig.dir}
                        onSort={handleSort}
                      />
                      <SortTh
                        label="Completion"
                        sortKey="completionRate"
                        active={sortConfig.key === 'completionRate'}
                        dir={sortConfig.dir}
                        onSort={handleSort}
                      />
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {sorted.map((quiz) => {
                      const completionRate =
                        quiz.totalAttempts > 0
                          ? Math.round((quiz.completionCount / quiz.totalAttempts) * 100)
                          : null;

                      return (
                        <tr
                          key={quiz._id}
                          className="hover:bg-blue-50/40 text-left dark:hover:bg-blue-950/20 transition duration-150"
                        >
                          {/* Quiz name + meta */}
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-ten text-left font-semibold text-gray-800 dark:text-white text-sm leading-tight">
                                {quiz.title}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-nine text-gray-400 dark:text-gray-500">
                                  {displayCategory(quiz)}
                                </span>
                                {quiz.visibility === 'private' ? (
                                  <span className="flex items-center gap-0.5 text-xs font-nine text-gray-400">
                                    <FiLock className="size-3" /> Private
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-0.5 text-xs font-nine text-gray-400">
                                    <FiGlobe className="size-3" /> Public
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Total attempts */}
                          <td className="px-4 py-4">
                            <span className="font-ten font-bold text-gray-800 dark:text-white">
                              {quiz.totalAttempts}
                            </span>
                          </td>

                          {/* Avg score */}
                          <td className="px-4 py-4">
                            <span className={`font-ten font-semibold ${scoreColor(quiz.avgScore)}`}>
                              {fmt(quiz.avgScore)}
                            </span>
                          </td>

                          {/* High score */}
                          <td className="px-4 py-4">
                            <span className={`font-nine ${scoreColor(quiz.highScore)}`}>
                              {fmt(quiz.highScore)}
                            </span>
                          </td>

                          {/* Low score */}
                          <td className="px-4 py-4">
                            <span className={`font-nine ${scoreColor(quiz.lowScore)}`}>
                              {fmt(quiz.lowScore)}
                            </span>
                          </td>

                          {/* Completion */}
                          <td className="px-4 py-4">
                            {quiz.totalAttempts === 0 ? (
                              <span className="text-gray-400 font-nine">—</span>
                            ) : (
                              <div className="flex flex-col gap-0.5">
                                <span className={`font-nine font-semibold ${scoreColor(completionRate)}`}>
                                  {completionRate}%
                                </span>
                                <span className="text-xs text-gray-400 font-nine">
                                  {quiz.completionCount} / {quiz.totalAttempts}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <button
                              onClick={() => navigate(`/editquiz/${quiz._id}`)}
                              className="p-1.5 text-gray-400 hover:text-blue-500 transition duration-200"
                              title="Edit quiz"
                            >
                              <FiEdit3 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="px-5 py-3 border-t border-blue-100 dark:border-blue-800 text-xs font-nine text-gray-400 dark:text-gray-500">
                All scores shown as percentage (0–100%). Completion = attempts where every question was answered.
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreatorAnalytics;
