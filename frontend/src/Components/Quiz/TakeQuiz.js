import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizFin from "./QuizFin";
import { FiLock } from 'react-icons/fi';
import { SiTicktick } from "react-icons/si";
import ClockLoader from "react-spinners/ClockLoader";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../Context/AuthContext";

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState(null);
  const [quesno, setQuesno] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const startedAtRef = useRef(null);
  const { user, token } = useAuth();

  const toastOptions = {
    position: "top-center",
    autoClose: 2500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition: Bounce,
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/quiz/${id}`,
          { headers }
        );
        const data = await response.json();

        if (response.status === 403) {
          setAccessError(data.message || 'This quiz is private.');
          setLoading(false);
          return;
        }
        if (!response.ok) {
          setAccessError(data.message || 'Quiz not found.');
          setLoading(false);
          return;
        }

        setQuiz(data);
        setTimeLeft(data.questions[0].timeLimit);
        startedAtRef.current = new Date().toISOString();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };
    fetchQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  useEffect(() => {
    if (!quizFinished || !user || !quiz) return;

    const payload = {
      quizId: quiz._id,
      startedAt: startedAtRef.current,
      answers: quiz.questions.map((q, i) => ({
        questionId: q._id,
        userAnswer: selectedAnswers[i] ?? null,
      })),
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished]);

  useEffect(() => {
    if (!quiz) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    if (timeLeft === 0) handleNextQuestion();
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quiz]);

  const handleOptionClick = (option) => setSelectedOption(option);

  const handleNextQuestion = () => {
    setSelectedAnswers((prev) => [...prev, selectedOption]);

    if (selectedOption === quiz.questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
      toast.success('Correct!', toastOptions);
    } else {
      toast.error('Wrong answer', toastOptions);
    }
    setSelectedOption(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(quiz.questions[currentQuestionIndex + 1].timeLimit);
      setQuesno((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setTimeLeft(0);
    }
  };

  const handleFinish = () => {
    if (selectedOption === quiz.questions[currentQuestionIndex].answer) {
      setScore(score);
    }
    setSelectedAnswers((prev) => [...prev, selectedOption]);
    setQuizFinished(true);
    setTimeLeft(0);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full min-h-screen items-center justify-center text-center px-4">
        <ClockLoader size={80} color="#2563eb" />
        <div>
          <p className="font-ten text-lg font-bold text-blue-500">Loading quiz…</p>
          <p className="font-nine text-sm text-slate-500 dark:text-slate-400 mt-1">
            Each question has a time limit — be ready!
          </p>
        </div>
      </div>
    );
  }

  // ── Access error ───────────────────────────────────────────────────────────
  if (accessError) {
    return (
      <div className="flex flex-col gap-6 w-full min-h-screen items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
            <FiLock className="size-7 text-blue-500" />
          </div>
          <h2 className="font-ten text-xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="font-nine text-sm text-slate-500 dark:text-slate-400 mb-6">{accessError}</p>
          <button
            onClick={() => navigate('/takequiz')}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-nine font-semibold rounded-lg border border-orange-400 hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/40 transition duration-300 text-sm"
          >
            Browse Public Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col gap-4 w-full min-h-screen items-center justify-center text-center px-4">
        <p className="font-ten text-lg font-bold text-slate-500 dark:text-slate-400">Quiz not found.</p>
        <button onClick={() => navigate('/takequiz')} className="text-sm font-nine text-blue-500 hover:underline">
          Browse quizzes
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return <QuizFin score={score} quiz={quiz} selectedAnswers={selectedAnswers} />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === quiz.questions.length - 1;
  const isLowTime = timeLeft <= 5;
  const totalTime = currentQuestion.timeLimit;
  const progressPct = Math.round((currentQuestionIndex / quiz.questions.length) * 100);

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <ToastContainer />

      {/* ── Page header ── */}
      <div className="w-full max-w-2xl mb-5">
        <h1 className="font-first font-bold text-slate-900 dark:text-white text-2xl md:text-3xl truncate">
          {quiz.title}
        </h1>
        {/* Question progress bar */}
        <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Quiz card ── */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-black/40 overflow-hidden">

        {/* Card header: question counter + timer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs font-nine font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
              Question
            </p>
            <p className="font-ten font-bold text-slate-800 dark:text-white text-2xl leading-none">
              {quesno}
              <span className="text-slate-400 dark:text-slate-500 text-base font-normal ml-1">
                / {quiz.questions.length}
              </span>
            </p>
          </div>

          {/* Compact circular timer */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-nine font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                Time Left
              </p>
              <p className={`font-ten font-bold text-xl leading-none transition-colors duration-300 ${
                isLowTime ? 'text-red-500' : 'text-orange-500'
              }`}>
                {timeLeft}s
              </p>
            </div>
            <div className="w-14 h-14 shrink-0">
              <CircularProgressbar
                styles={buildStyles({
                  strokeLinecap: 'round',
                  textSize: '0px',
                  pathTransitionDuration: 0.8,
                  trailColor: '#e2e8f0',
                  pathColor: isLowTime ? '#ef4444' : '#2563eb',
                })}
                minValue={0}
                maxValue={totalTime}
                value={timeLeft}
              />
            </div>
          </div>
        </div>

        {/* Question text */}
        <div className="px-6 pt-6 pb-5">
          <h2 className="font-ten font-bold text-slate-900 dark:text-white text-lg md:text-2xl leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-3 text-left">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const label = OPTION_LABELS[idx];
            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/40'
                    : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:border-blue-500'
                }`}
              >
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-ten transition-colors duration-200 ${
                  isSelected
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300'
                }`}>
                  {label}
                </span>
                <span className="flex-1 font-nine text-sm md:text-base">{option}</span>
                {isSelected && <SiTicktick className="size-5 shrink-0 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Footer: Next / Finish */}
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={isLast ? handleFinish : handleNextQuestion}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-nine font-bold rounded-xl border border-orange-400 hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/40 hover:-translate-y-0.5 transition-all duration-300 text-base"
          >
            {isLast ? 'Finish Quiz ✓' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
