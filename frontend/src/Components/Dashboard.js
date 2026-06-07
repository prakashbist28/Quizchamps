import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  FiBookOpen, FiEdit3, FiTrendingUp, FiAward,
  FiClock, FiChevronRight, FiPlusCircle,
} from 'react-icons/fi';
import { MdOutlineQuiz } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../constants/toastConfig';
import { formatDate } from '../utils/formatDate';
import { percentageColor, percentageBadge } from '../utils/scoreColors';
import StatCard from './ui/StatCard';
import PageLoader from './ui/PageLoader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } catch {
        toast.error('Failed to load dashboard', toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <PageLoader message="Loading dashboard..." />;

  const neverPlayed = !stats || stats.totalTaken === 0;

  return (
    <>
      <ToastContainer />
      <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
            Dashboard
          </h1>
          <p className="font-nine text-gray-500 dark:text-gray-400 mt-2 text-base">
            Welcome back, <span className="font-semibold text-blue-500">{user?.name}</span>
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={FiBookOpen}
            label="Quizzes Taken"
            value={stats?.totalTaken ?? 0}
            accent="bg-blue-500"
          />
          <StatCard
            icon={FiEdit3}
            label="Quizzes Created"
            value={stats?.totalCreated ?? 0}
            accent="bg-orange-500"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Average Score"
            value={neverPlayed ? '—' : `${stats.avgPercentage}%`}
            sub={neverPlayed ? 'No attempts yet' : 'across all attempts'}
            accent="bg-cyan-500"
          />
          <StatCard
            icon={FiAward}
            label="Best Score"
            value={neverPlayed ? '—' : `${stats.bestPercentage}%`}
            sub={neverPlayed ? 'No attempts yet' : 'personal best'}
            accent="bg-green-500"
          />
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <h2 className="font-ten font-bold text-lg dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/takequiz')}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-nine font-semibold rounded-lg border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300 text-sm"
            >
              <MdOutlineQuiz className="size-4" />
              Take a Quiz
            </button>
            <button
              onClick={() => navigate('/createquiz')}
              className="flex items-center gap-2 px-5 py-2.5 font-nine font-semibold rounded-lg border border-blue-300 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-300 text-sm"
            >
              <FiPlusCircle className="size-4" />
              Create Quiz
            </button>
            <button
              onClick={() => navigate('/myquizzes')}
              className="flex items-center gap-2 px-5 py-2.5 font-nine font-semibold rounded-lg border border-blue-300 dark:border-blue-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-300 text-sm"
            >
              <FiEdit3 className="size-4" />
              My Quizzes
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-ten font-bold text-lg dark:text-white">Recent Activity</h2>
            {!neverPlayed && (
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-1 text-sm font-nine text-blue-500 hover:text-blue-400 transition duration-200"
              >
                View all <FiChevronRight className="size-4" />
              </button>
            )}
          </div>

          {neverPlayed ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl">
              <MdOutlineQuiz className="text-blue-300 size-16 opacity-40" />
              <p className="font-ten text-gray-500 dark:text-gray-400">
                No quiz attempts yet. Take your first quiz!
              </p>
              <button
                onClick={() => navigate('/takequiz')}
                className="px-5 py-2.5 bg-orange-500 text-white font-nine font-semibold rounded-lg border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300 text-sm"
              >
                Browse Quizzes
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recentActivity.map((attempt) => (
                <div
                  key={attempt._id}
                  onClick={() => navigate(`/attempts/${attempt._id}`)}
                  className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-4 lg:grid lg:grid-cols-[3rem_1fr_auto_auto_auto_auto] lg:gap-x-6 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm dark:hover:shadow-blue-500/20 transition duration-300 group"
                >
                  {/* 1. Score circle */}
                  <div className="shrink-0 w-12 h-12 rounded-full border-2 border-blue-200 dark:border-blue-700 flex flex-col items-center justify-center">
                    <span className={`font-ten font-bold text-xs leading-none ${percentageColor(attempt.percentage)}`}>
                      {attempt.percentage}
                    </span>
                    <span className="text-[9px] text-gray-400 leading-none">%</span>
                  </div>

                  {/* 2. Title + sub-info (sub-info hidden on lg, lives in its own columns instead) */}
                  <div className="flex-1 min-w-0">
                    <p className="font-ten text-left font-semibold text-gray-800 dark:text-white text-sm truncate">
                      {attempt.quizId?.title ?? 'Unknown Quiz'}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 lg:hidden">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-nine">
                        {attempt.score}/{attempt.totalQuestions} correct
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-nine">
                        <FiClock className="size-3" />
                        {formatDate(attempt.completedAt)}
                      </span>
                    </div>
                  </div>

                  {/* 3. Score – own column on lg */}
                  <span className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 font-nine whitespace-nowrap">
                    {attempt.score}/{attempt.totalQuestions} correct
                  </span>

                  {/* 4. Date – own column on lg */}
                  <span className="hidden lg:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-nine whitespace-nowrap">
                    <FiClock className="size-3" />
                    {formatDate(attempt.completedAt)}
                  </span>

                  {/* 5. Badge */}
                  <span className={`shrink-0 hidden sm:block px-2.5 py-1 rounded-full text-xs font-nine font-semibold ${percentageBadge(attempt.percentage)}`}>
                    {attempt.percentage >= 75 ? 'Great' : attempt.percentage >= 50 ? 'Good' : 'Needs Work'}
                  </span>

                  {/* 6. Chevron */}
                  <FiChevronRight className="shrink-0 size-4 text-gray-400 group-hover:text-blue-500 transition duration-200" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
