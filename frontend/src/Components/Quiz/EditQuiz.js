import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiGlobe, FiLock, FiTrash2, FiCheck, FiPlus } from 'react-icons/fi';
import { LuClock, LuFileText, LuLightbulb } from 'react-icons/lu';
import RingLoader from 'react-spinners/RingLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../Context/AuthContext';
import CategoryTagSelector from './CategoryTagSelector';
import { toastOptions } from '../../constants/toastConfig';
import { PRESET_TIMES, OPTION_LABELS, DIFFICULTIES, DIFFICULTY_HINT } from '../../constants/quizConstants';
import PageLoader from '../ui/PageLoader';

const fieldCls =
  'w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 dark:text-white rounded-lg text-sm font-nine focus:outline-none focus:ring-2 focus:ring-blue-500';

const SectionLabel = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-1.5 text-xs font-nine font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
    {Icon && <Icon className="size-3.5" />}
    {children}
  </p>
);

// ── Question card ─────────────────────────────────────────────────────────────
const QuestionCard = ({ q, index, total, onChange, onDelete, disabled }) => {
  const isPreset = PRESET_TIMES.includes(Number(q.timeLimit));
  const [customTime, setCustomTime] = useState(!isPreset && Number(q.timeLimit) > 0);

  const patch = (changes) => onChange(index, changes);

  const handleOptionChange = (optIdx, value) => {
    const newOptions = [...q.options];
    const wasAnswer = q.answer !== '' && q.answer === newOptions[optIdx];
    newOptions[optIdx] = value;
    patch({ options: newOptions, ...(wasAnswer ? { answer: value } : {}) });
  };

  const markCorrect = (optIdx) => {
    const val = q.options[optIdx];
    if (!val.trim()) return;
    patch({ answer: val });
  };

  const selectPreset = (t) => {
    setCustomTime(false);
    patch({ timeLimit: t });
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-ten shrink-0">
            {index + 1}
          </span>
          <span className="font-nine font-semibold text-slate-600 dark:text-slate-300 text-sm">
            Question {index + 1}
            <span className="text-slate-400 dark:text-slate-500 font-normal"> of {total}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(index)}
          disabled={disabled || total <= 1}
          title={total <= 1 ? 'Cannot delete the only question' : 'Delete question'}
          className="flex items-center gap-1.5 px-3 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-xs font-nine font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FiTrash2 className="size-3.5" />
          Delete
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5 text-left">

        {/* Question text */}
        <div>
          <SectionLabel icon={LuFileText}>Question</SectionLabel>
          <textarea
            value={q.question}
            onChange={(e) => patch({ question: e.target.value })}
            placeholder="What's the question?"
            required
            rows={2}
            disabled={disabled}
            className={`${fieldCls} resize-none`}
          />
        </div>

        {/* Options */}
        <div>
          <SectionLabel>
            Options &mdash; click the circle to mark the correct answer
          </SectionLabel>
          <div className="space-y-2">
            {q.options.map((opt, optIdx) => {
              const isCorrect = opt.trim() !== '' && q.answer === opt;
              return (
                <div
                  key={optIdx}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition duration-200 ${
                    isCorrect
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                      : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => markCorrect(optIdx)}
                    disabled={disabled}
                    title={opt.trim() ? 'Mark as correct answer' : 'Type an option first'}
                    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition duration-200 disabled:cursor-not-allowed ${
                      isCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-slate-300 dark:border-slate-500 text-slate-400 hover:border-blue-400 hover:text-blue-500'
                    }`}
                  >
                    {isCorrect ? <FiCheck className="size-3.5" /> : OPTION_LABELS[optIdx]}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                    placeholder={`Option ${OPTION_LABELS[optIdx]}`}
                    required
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-nine dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-500 disabled:opacity-60"
                  />
                </div>
              );
            })}
          </div>
          {!q.answer && (
            <p className="mt-2 text-xs text-amber-500 dark:text-amber-400 font-nine">
              ⚠ Click a letter circle to mark the correct answer
            </p>
          )}
          {q.answer && (
            <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-nine">
              ✓ Correct answer set
            </p>
          )}
        </div>

        {/* Time limit */}
        <div>
          <SectionLabel icon={LuClock}>Time Limit</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {PRESET_TIMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => selectPreset(t)}
                disabled={disabled}
                className={`px-3.5 py-1.5 rounded-full text-xs font-nine font-semibold border transition duration-200 disabled:opacity-50 ${
                  !customTime && Number(q.timeLimit) === t
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {t}s
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setCustomTime(true); patch({ timeLimit: '' }); }}
              disabled={disabled}
              className={`px-3.5 py-1.5 rounded-full text-xs font-nine font-semibold border transition duration-200 disabled:opacity-50 ${
                customTime
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              Custom
            </button>
            {customTime && (
              <input
                type="number"
                min={1}
                max={300}
                value={q.timeLimit}
                onChange={(e) =>
                  patch({ timeLimit: e.target.value === '' ? '' : Number(e.target.value) })
                }
                disabled={disabled}
                placeholder="sec"
                className="w-20 text-center px-2 py-1.5 rounded-full text-xs font-nine border border-orange-400 bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            )}
          </div>
        </div>

        {/* Explanation */}
        <div>
          <SectionLabel icon={LuLightbulb}>
            Explanation{' '}
            <span className="normal-case font-normal text-gray-400">(optional)</span>
          </SectionLabel>
          <textarea
            value={q.explanation}
            onChange={(e) => patch({ explanation: e.target.value })}
            placeholder="Why is this the correct answer? Shown in the analysis after the quiz."
            rows={2}
            maxLength={500}
            disabled={disabled}
            className={`${fieldCls} resize-none`}
          />
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [quizTitle, setQuizTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('General Knowledge');
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || 'Quiz not found', toastOptions);
          navigate('/myquizzes');
          return;
        }

        const ownerId = typeof data.createdBy === 'object' ? data.createdBy._id : data.createdBy;
        if (ownerId !== user?._id) {
          toast.error('You are not authorized to edit this quiz', toastOptions);
          navigate('/myquizzes');
          return;
        }

        setQuizTitle(data.title);
        setDescription(data.description || '');
        setVisibility(data.visibility === 'private' ? 'private' : 'public');
        setDifficulty(data.difficulty || 'Medium');
        setCategory(data.category || 'General Knowledge');
        setCustomCategory(data.customCategory || '');
        setTags(Array.isArray(data.tags) ? data.tags : []);
        setQuestions(data.questions.map((q) => ({ ...q, explanation: q.explanation || '' })));
      } catch {
        toast.error('Failed to load quiz', toastOptions);
        navigate('/myquizzes');
      } finally {
        setFetching(false);
      }
    };
    fetchQuiz();
  }, [id, user, navigate, token]);

  const handleAddQuestion = () =>
    setQuestions((prev) => [...prev, { question: '', options: ['', '', '', ''], answer: '', timeLimit: 30, explanation: '' }]);

  const handleDeleteQuestion = (index) => {
    if (questions.length === 1) {
      toast.warning('A quiz must have at least one question', toastOptions);
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, changes) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...changes };
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (category === 'Other' && !customCategory.trim()) {
      toast.warning('Please specify your custom category.', toastOptions);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.answer) {
        toast.warning(`Question ${i + 1}: please mark the correct answer.`, toastOptions);
        return;
      }
      if (q.timeLimit === '' || isNaN(q.timeLimit) || Number(q.timeLimit) <= 0) {
        toast.warning(`Question ${i + 1}: time limit must be a positive number.`, toastOptions);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/quiz/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: quizTitle, description, questions, visibility, difficulty, category, customCategory, tags }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to update quiz', toastOptions);
        return;
      }

      toast.success('Quiz updated successfully!', { ...toastOptions, autoClose: 2000 });
      setTimeout(() => navigate('/myquizzes'), 1800);
    } catch {
      toast.error('Server error. Please try again.', toastOptions);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (fetching) return <PageLoader message="Loading quiz…" />;

  return (
    <>
      <ToastContainer />
      <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
              Edit Quiz
            </h1>
            <p className="font-nine text-gray-500 dark:text-gray-400 mt-2">
              Update your quiz details and questions below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/myquizzes')}
            className="shrink-0 text-sm font-nine text-gray-500 dark:text-gray-400 hover:text-blue-500 transition duration-200 mt-2"
          >
            ← My Quizzes
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* ── Section 1: Quiz Details ── */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-ten">1</span>
              <h2 className="font-ten font-bold text-slate-800 dark:text-white text-base">Quiz Details</h2>
            </div>

            <div className="p-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Give your quiz a catchy title"
                    required
                    disabled={saving}
                    className={fieldCls}
                  />
                </div>

                {/* Description — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Description{' '}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what this quiz is about"
                    rows={3}
                    maxLength={500}
                    disabled={saving}
                    className={`${fieldCls} resize-none`}
                  />
                  <p className="text-xs text-gray-400 font-nine mt-1 text-right">{description.length}/500</p>
                </div>

                {/* Category + Tags — full width */}
                <div className="md:col-span-2">
                  <CategoryTagSelector
                    category={category}
                    customCategory={customCategory}
                    tags={tags}
                    onCategoryChange={setCategory}
                    onCustomCategoryChange={setCustomCategory}
                    onTagsChange={setTags}
                    disabled={saving}
                  />
                </div>

                {/* Visibility — left col */}
                <div>
                  <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-3">
                    Visibility
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'public',  Icon: FiGlobe, label: 'Public'  },
                      { value: 'private', Icon: FiLock,  label: 'Private' },
                    ].map(({ value, Icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setVisibility(value)}
                        disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-nine font-semibold text-sm transition duration-200 disabled:opacity-50 ${
                          visibility === value
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900'
                            : 'bg-transparent border-slate-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <Icon className="size-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400 font-nine">
                    {visibility === 'public'
                      ? 'Anyone can discover and take this quiz.'
                      : 'Only you can see and take this quiz.'}
                  </p>
                </div>

                {/* Difficulty — right col */}
                <div>
                  <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-3">
                    Difficulty
                  </label>
                  <div className="flex gap-3">
                    {DIFFICULTIES.map(({ value, cls }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDifficulty(value)}
                        disabled={saving}
                        className={`px-5 py-2.5 rounded-lg border font-nine font-semibold text-sm transition duration-200 disabled:opacity-50 ${
                          difficulty === value
                            ? cls
                            : 'bg-transparent border-slate-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400 font-nine">{DIFFICULTY_HINT[difficulty]}</p>
                </div>

              </div>
            </div>
          </div>

          {/* ── Section 2: Questions ── */}
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold font-ten">2</span>
                <h2 className="font-ten font-bold text-slate-800 dark:text-white text-base">Questions</h2>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-nine font-semibold rounded-full">
                  {questions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-nine font-semibold text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition duration-200 disabled:opacity-50"
              >
                <FiPlus className="size-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  q={q}
                  index={i}
                  total={questions.length}
                  onChange={handleQuestionChange}
                  onDelete={handleDeleteQuestion}
                  disabled={saving}
                />
              ))}
            </div>

            {/* Bottom add button */}
            <button
              type="button"
              onClick={handleAddQuestion}
              disabled={saving}
              className="mt-4 w-full py-5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 rounded-xl hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition duration-200 font-nine font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus className="size-4" />
              Add Another Question
            </button>
          </div>

          {/* ── Submit ── */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400 font-nine">
              {questions.length} question{questions.length !== 1 ? 's' : ''} · {visibility}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-nine font-semibold rounded-lg border border-orange-400 hover:shadow-lg hover:shadow-orange-300 dark:hover:shadow-orange-900 hover:-translate-y-0.5 transition duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            >
              {saving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

          {saving && (
            <div className="flex justify-center mt-6">
              <RingLoader size={80} color="#f97316" />
            </div>
          )}

        </form>
      </div>
    </>
  );
};

export default EditQuiz;
