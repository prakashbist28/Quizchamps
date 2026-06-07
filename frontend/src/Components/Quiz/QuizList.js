import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LuSearch, LuX, LuUser } from 'react-icons/lu';
import { FiLock, FiGlobe } from 'react-icons/fi';
import { CATEGORIES, TAGS_BY_CATEGORY, displayCategory } from '../../constants/quizCategories';
import { getCategoryTheme } from '../../constants/categoryThemes';
import { useAuth } from '../../Context/AuthContext';
import { difficultyBadge } from '../../utils/scoreColors';
import PageLoader from '../ui/PageLoader';

const LIMIT = 12;

// ── Themed quiz card ───────────────────────────────────────────────────────────
const QuizCard = ({ quiz }) => {
  const theme = getCategoryTheme(quiz.category);
  const catLabel = displayCategory(quiz);
  const questionCount = quiz.questions?.length ?? 0;

  return (
    <Link to={`/takequiz/${quiz._id}`}>
      <div
        className={`group relative h-56 md:h-64 rounded-2xl overflow-hidden cursor-pointer
          border border-gray-200 dark:border-white/15
          shadow-md shadow-gray-200 dark:shadow-lg dark:shadow-black/20
          hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl ${theme.cardHover}
          transition-all duration-300 ease-out`}
      >
        {/* Light mode: subtle category-tinted background */}
        <div className={`absolute inset-0 dark:hidden bg-gradient-to-br ${theme.lightGradient}`} />
        {/* Light mode: colored left accent bar */}
        <div className={`absolute left-0 inset-y-0 w-1 dark:hidden ${theme.accentBar} rounded-l-2xl`} />

        {/* Dark mode: gradient background */}
        <div className={`absolute inset-0 hidden dark:block bg-gradient-to-br ${theme.gradient}`} />
        {/* SVG illustration — category accent color in both modes */}
        <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 origin-bottom-right ${theme.illustrationColor} ${theme.darkIllustrationColor}`}>
          <theme.Icon />
        </div>
        {/* Dark mode: bottom overlay — slightly lighter so card feels brighter */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 hidden dark:block bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content layer */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-5">
          {/* Top row: category badge + difficulty + question count */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`${theme.badge} shrink-0 px-2.5 py-0.5 text-xs font-nine font-semibold rounded-full`}>
                {catLabel}
              </span>
              {quiz.difficulty && (
                <span className={`shrink-0 px-2 py-0.5 text-xs font-nine font-semibold rounded-full ${difficultyBadge(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              )}
            </div>
            <span className="shrink-0 px-2.5 py-0.5 bg-black/5 dark:bg-black/25 text-gray-600 dark:text-white/85 text-xs font-nine font-medium rounded-full border border-black/10 dark:border-white/15">
              {questionCount} {questionCount === 1 ? 'Q' : 'Qs'}
            </span>
          </div>

          {/* Bottom: title + description + meta */}
          <div>
            <h2 className="text-gray-900 dark:text-white font-ten font-bold text-base md:text-lg leading-tight line-clamp-2 mb-1">
              {quiz.title}
            </h2>

            {quiz.description && (
              <p className="text-gray-500 dark:text-white/70 font-nine text-xs line-clamp-1 mb-2">
                {quiz.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-2">
              {quiz.createdBy?.name && (
                <span className="flex items-center gap-1 text-gray-400 dark:text-white/55 font-nine text-[11px] min-w-0">
                  <LuUser className="size-3 shrink-0" />
                  <span className="truncate">{quiz.createdBy.name}</span>
                </span>
              )}
              {quiz.tags?.length > 0 && (
                <div className="flex gap-1 flex-shrink-0">
                  {quiz.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-black/5 dark:bg-white/[0.12] text-gray-500 dark:text-white/65 text-[10px] font-nine rounded-full border border-black/10 dark:border-white/15"
                    >
                      {tag}
                    </span>
                  ))}
                  {quiz.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-black/5 dark:bg-white/[0.12] text-gray-500 dark:text-white/65 text-[10px] font-nine rounded-full border border-black/10 dark:border-white/15">
                      +{quiz.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const QuizList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [viewMode, setViewMode] = useState('public'); // 'public' | 'private'
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);

  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [fetching, setFetching] = useState(false);

  const tagsKey = selectedTags.join(',');

  // Debounce search → reset page when it fires
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 when viewMode changes
  useEffect(() => {
    setPage(1);
  }, [viewMode]);

  // Fetch whenever any filter/page/viewMode changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setFetching(true);
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category) params.set('category', category);
        if (tagsKey) params.set('tags', tagsKey);
        if (difficulty) params.set('difficulty', difficulty);

        let url;
        const headers = {};

        if (viewMode === 'private' && user) {
          params.set('visibility', 'private');
          url = `${process.env.REACT_APP_BACKEND_URL}/api/myquizzes?${params}`;
          if (token) headers['Authorization'] = `Bearer ${token}`;
        } else {
          url = `${process.env.REACT_APP_BACKEND_URL}/api/quiz?${params}`;
        }

        const res = await fetch(url, { headers });
        const data = await res.json();

        if (!res.ok) {
          setQuizzes([]);
          setPagination(null);
        } else {
          setQuizzes(data.quizzes || []);
          setPagination(data.pagination || null);
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setQuizzes([]);
      } finally {
        setFetching(false);
        setFirstLoad(false);
      }
    };
    fetchQuizzes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, category, tagsKey, difficulty, viewMode]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSelectedTags([]);
    setPage(1);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('');
    setSelectedTags([]);
    setDifficulty('');
    setPage(1);
  };

  const switchView = (mode) => {
    setViewMode(mode);
    clearFilters();
  };

  const hasFilters = search || category || selectedTags.length > 0 || difficulty;
  const availableTags = category ? (TAGS_BY_CATEGORY[category] || []).filter((t) => t !== 'Other') : [];

  if (firstLoad && fetching) return <PageLoader message="Please wait..." submessage="Note: There is a time limit for each question" />;

  return (
    <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">
      <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl pb-6">
        {viewMode === 'private' ? 'My Private Quizzes' : 'Select a Quiz'}
      </h1>

      {/* ── Public / Private tabs (logged-in users only) ── */}
      {user && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => switchView('public')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-nine font-semibold rounded-lg border transition duration-200 ${
              viewMode === 'public'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
            }`}
          >
            <FiGlobe className="size-3.5" />
            Public Quizzes
          </button>
          <button
            onClick={() => switchView('private')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-nine font-semibold rounded-lg border transition duration-200 ${
              viewMode === 'private'
                ? 'bg-slate-700 border-slate-600 text-white dark:bg-slate-600'
                : 'border-slate-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-slate-400'
            }`}
          >
            <FiLock className="size-3.5" />
            My Private Quizzes
          </button>
        </div>
      )}

      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category, or tag..."
          className="w-full pl-10 pr-10 p-3 bg-transparent rounded-md dark:placeholder:text-blue-200 dark:text-white outline-none border-2 border-black dark:border-blue-400 focus:border-blue-600 font-nine text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <LuX className="size-4" />
          </button>
        )}
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-wrap items-start gap-3 mb-4">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 bg-transparent dark:bg-slate-800 border border-blue-300 dark:border-blue-600 dark:text-white rounded-md text-sm font-nine focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Difficulty chips */}
        <div className="flex items-center gap-2">
          {[
            { label: 'Easy',   active: 'bg-green-500 border-green-500 text-white', inactive: 'border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 hover:border-green-400' },
            { label: 'Medium', active: 'bg-amber-500 border-amber-500 text-white',  inactive: 'border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:border-amber-400' },
            { label: 'Hard',   active: 'bg-red-500 border-red-500 text-white',      inactive: 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:border-red-400' },
          ].map(({ label, active, inactive }) => (
            <button
              key={label}
              onClick={() => { setDifficulty(difficulty === label ? '' : label); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-nine font-semibold border transition duration-200 ${
                difficulty === label ? active : `bg-transparent ${inactive}`
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-nine font-semibold text-red-500 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition ml-auto"
          >
            <LuX className="size-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Tag chips (only when category selected) */}
      {category && availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-nine font-semibold border transition duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-transparent border-blue-200 dark:border-blue-700 text-gray-600 dark:text-gray-300 hover:border-blue-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Active filter summary ── */}
      {(category || selectedTags.length > 0 || difficulty) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-nine text-gray-500 dark:text-gray-400">
          {category && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
              {category}
            </span>
          )}
          {difficulty && (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer transition hover:opacity-70"
              style={{ background: 'transparent' }}
              onClick={() => { setDifficulty(''); setPage(1); }}
            >
              <span className={`px-2 py-0.5 rounded-full font-semibold ${difficultyBadge(difficulty)}`}>
                {difficulty} <LuX className="inline size-2.5 ml-0.5" />
              </span>
            </span>
          )}
          {selectedTags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition"
              onClick={() => toggleTag(t)}
            >
              {t} <LuX className="size-3" />
            </span>
          ))}
        </div>
      )}

      {/* ── Subtle fetching indicator ── */}
      {fetching && !firstLoad && (
        <div className="flex justify-center mb-6">
          <span className="inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Results ── */}
      {!fetching && quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <p className="font-ten text-xl text-gray-500 dark:text-gray-400">
            {viewMode === 'private'
              ? hasFilters
                ? 'No private quizzes match your filters.'
                : "You haven't created any private quizzes yet."
              : hasFilters
              ? 'No quizzes match your search or filters.'
              : 'No quizzes available yet.'}
          </p>
          <div className="flex gap-3">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-blue-400 text-blue-500 font-nine font-semibold rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm"
              >
                Clear filters
              </button>
            )}
            <button
              onClick={() => navigate('/createquiz')}
              className="px-4 py-2 bg-orange-500 text-white font-nine font-semibold rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition text-sm"
            >
              Create a Quiz
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Card grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* ── Pagination ── */}
          {pagination && pagination.pages > 1 && (
            <div className="flex flex-col items-center gap-3 mt-12">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-nine font-semibold border border-blue-300 dark:border-blue-700 rounded-md text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Prev
                </button>
                <span className="font-nine text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 text-sm font-nine font-semibold border border-blue-300 dark:border-blue-700 rounded-md text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
              <p className="text-xs text-gray-400 font-nine">
                {pagination.total} quiz{pagination.total !== 1 ? 'zes' : ''} found
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;
