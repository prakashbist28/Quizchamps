import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { MdOutlineQuiz } from 'react-icons/md';
import { FiEye, FiEdit2, FiTrash2, FiGlobe, FiLock } from 'react-icons/fi';
import { LuSearch, LuX } from 'react-icons/lu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CATEGORIES, TAGS_BY_CATEGORY, displayCategory } from '../../constants/quizCategories';
import { toastOptions } from '../../constants/toastConfig';
import { formatDate } from '../../utils/formatDate';
import PageLoader from '../ui/PageLoader';

const LIMIT = 12;

const MyQuizzes = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const [page, setPage] = useState(1);

  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  const tagsKey = selectedTags.join(',');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch quizzes
  useEffect(() => {
    const fetchMyQuizzes = async () => {
      setFetching(true);
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category) params.set('category', category);
        if (tagsKey) params.set('tags', tagsKey);
        if (visibilityFilter) params.set('visibility', visibilityFilter);

        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/myquizzes?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (!res.ok) {
          setQuizzes([]);
          setPagination(null);
        } else {
          setQuizzes(data.quizzes || []);
          setPagination(data.pagination || null);
        }
      } catch {
        toast.error('Failed to load your quizzes', toastOptions);
        setQuizzes([]);
      } finally {
        setFetching(false);
        setFirstLoad(false);
      }
    };
    fetchMyQuizzes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, debouncedSearch, category, tagsKey, visibilityFilter]);

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
    setVisibilityFilter('');
    setPage(1);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      toast.success('Quiz deleted', toastOptions);
    } catch (err) {
      toast.error(err.message || 'Failed to delete quiz', toastOptions);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const hasFilters = search || category || selectedTags.length > 0 || visibilityFilter;
  const availableTags = category
    ? (TAGS_BY_CATEGORY[category] || []).filter((t) => t !== 'Other')
    : [];

  if (firstLoad && fetching) return <PageLoader message="Loading your quizzes..." />;

  return (
    <>
      <ToastContainer />
      <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">

        {/* ── Page header ── */}
        <div className="flex items-end justify-between mb-8">
          <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
            My Quizzes
          </h1>
          <button
            onClick={() => navigate('/createquiz')}
            className="px-4 py-2 bg-orange-500 text-white font-nine font-semibold rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300 text-sm md:text-base whitespace-nowrap"
          >
            + New Quiz
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-4">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or tag..."
            className="w-full pl-10 pr-10 p-3 bg-transparent rounded-md dark:placeholder:text-gray-500 dark:text-white outline-none border border-blue-300 dark:border-blue-600 focus:border-blue-500 font-nine text-sm"
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

          {/* Visibility */}
          <div className="flex rounded-md border border-blue-300 dark:border-blue-600 overflow-hidden">
            {[['', 'All'], ['public', 'Public'], ['private', 'Private']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setVisibilityFilter(val); setPage(1); }}
                className={`px-3 py-2 text-xs font-nine font-semibold transition ${
                  visibilityFilter === val
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tag chips */}
          {category && availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

          {/* Clear filters */}
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

        {/* ── Active tag chips ── */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map((t) => (
              <span
                key={t}
                onClick={() => toggleTag(t)}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-xs font-nine rounded-full cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition"
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

        {/* ── Results count ── */}
        {!fetching && pagination && (
          <p className="text-xs text-gray-400 font-nine mb-4">
            {pagination.total} quiz{pagination.total !== 1 ? 'zes' : ''}
            {hasFilters ? ' match your filters' : ' total'}
          </p>
        )}

        {/* ── Empty state ── */}
        {!fetching && quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <MdOutlineQuiz className="text-blue-300 size-24 opacity-40" />
            <p className="font-ten text-xl text-gray-500 dark:text-gray-400">
              {hasFilters
                ? 'No quizzes match your search or filters.'
                : "You haven't created any quizzes yet."}
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
                className="px-6 py-3 bg-orange-500 text-white font-nine font-semibold rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-1 transition duration-300"
              >
                {hasFilters ? 'Create a Quiz' : 'Create Your First Quiz'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white dark:bg-slate-800 border border-blue-300 rounded-xl shadow-md dark:shadow-blue-500/10 p-6 flex flex-col gap-3 hover:shadow-lg dark:hover:shadow-blue-500/30 transition duration-300"
                >
                  {/* ── Card header ── */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-ten font-semibold text-lg md:text-xl text-gray-800 dark:text-white leading-tight">
                      {quiz.title}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      {quiz.visibility === 'private' ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-nine font-semibold rounded-full">
                          <FiLock className="size-3" />
                          Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-nine font-semibold rounded-full">
                          <FiGlobe className="size-3" />
                          Public
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-nine font-semibold rounded-full">
                        {quiz.questions?.length ?? 0} Q
                      </span>
                    </div>
                  </div>

                  {/* ── Category + Tags ── */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-nine font-semibold rounded-full">
                      {displayCategory(quiz)}
                    </span>
                    {(quiz.tags || []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-nine rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {quiz.tags && quiz.tags.length > 4 && (
                      <span className="text-xs text-gray-400 font-nine">
                        +{quiz.tags.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* ── Description ── */}
                  {quiz.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-nine line-clamp-2">
                      {quiz.description}
                    </p>
                  )}

                  {/* ── Meta ── */}
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-nine">
                    Created {formatDate(quiz.createdAt)}
                    {quiz.updatedAt !== quiz.createdAt && (
                      <span> · Updated {formatDate(quiz.updatedAt)}</span>
                    )}
                  </p>

                  {/* ── Delete confirm overlay ── */}
                  {confirmId === quiz._id ? (
                    <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                      <p className="font-nine text-sm text-red-700 dark:text-red-400 font-semibold mb-3">
                        Delete "{quiz.title}"? This cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setConfirmId(null)}
                          disabled={deletingId === quiz._id}
                          className="flex-1 py-2 text-sm font-nine font-semibold border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          disabled={deletingId === quiz._id}
                          className="flex-1 py-2 text-sm font-nine font-semibold bg-red-500 text-white border border-red-400 rounded-md hover:bg-red-600 transition duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {deletingId === quiz._id ? (
                            <>
                              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Yes, Delete'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 mt-auto pt-2">
                      <button
                        onClick={() => navigate(`/takequiz/${quiz._id}`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-nine font-semibold text-blue-600 dark:text-blue-300 border border-blue-300 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-200"
                      >
                        <FiEye className="size-4" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/editquiz/${quiz._id}`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-nine font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                      >
                        <FiEdit2 className="size-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmId(quiz._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-nine font-semibold text-red-500 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-200 ml-auto"
                      >
                        <FiTrash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyQuizzes;
