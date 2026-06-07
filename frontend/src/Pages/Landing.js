import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import {
  LuZap, LuBarChart3, LuClock, LuArrowRight,
  LuBookOpen, LuLayers, LuCheck,
} from 'react-icons/lu';
import { IoCreateOutline } from 'react-icons/io5';
import { GiBrain } from 'react-icons/gi';

// ── Data ─────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  'Create Quiz', 'Beat the Clock', 'Test Others', 'Level Up',
  'Take Quiz', 'Challenge Friends', 'Earn Knowledge', 'Test Yourself',
];

const FEATURES = [
  {
    Icon: LuClock,
    title: 'Timed Questions',
    desc: 'Every question runs its own countdown. Think fast, answer smart — pressure builds champions.',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-500 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800/40',
    card: 'bg-white dark:bg-slate-800/60',
  },
  {
    Icon: LuLayers,
    title: '11 Categories',
    desc: 'Coding, Science, History, Sports, Nature and more — find quizzes that match every curiosity.',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-800/40',
    card: 'bg-white dark:bg-slate-800/60',
  },
  {
    Icon: LuBarChart3,
    title: 'Deep Analytics',
    desc: 'Full explanations for every answer. Track scores, accuracy, and attempt history over time.',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-800/40',
    card: 'bg-white dark:bg-slate-800/60',
  },
];

const STEPS = [
  {
    num: 1,
    Icon: LuBookOpen,
    title: 'Browse or Create',
    desc: 'Explore quizzes across 11 categories or build your own with custom questions, time limits, and explanations.',
  },
  {
    num: 2,
    Icon: LuClock,
    title: 'Answer Fast',
    desc: 'Each question has a countdown. Stay focused, think sharp, and submit before time runs out.',
  },
  {
    num: 3,
    Icon: LuBarChart3,
    title: 'Review & Grow',
    desc: 'Get a detailed breakdown — right answers, explanations for wrong ones, and your full score.',
  },
];

const CATEGORIES = [
  { name: 'Coding',                 cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700/40' },
  { name: 'Science',                cls: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-700/40' },
  { name: 'History',                cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700/40' },
  { name: 'Geography',              cls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-700/40' },
  { name: 'Nature',                 cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700/40' },
  { name: 'Sports',                 cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700/40' },
  { name: 'Entertainment',          cls: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-700/40' },
  { name: 'Business & Finance',     cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/40' },
  { name: 'Language & Literature',  cls: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-700/40' },
  { name: 'General Knowledge',      cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40' },
  { name: 'Other',                  cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border-slate-200 dark:border-slate-600/40' },
];

// ── Quiz card mockup (hero right-side decoration) ─────────────────────────────

const MockQuizCard = () => (
  <div className="relative hidden lg:block flex-shrink-0">
    {/* Glow */}
    <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full scale-125 pointer-events-none" />

    {/* Card */}
    <div className="relative bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 w-76 shadow-2xl" style={{ width: '308px' }}>
      {/* Header row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/50 text-xs font-nine">Question 3 of 10</span>
        <div className="flex items-center gap-1.5 bg-orange-500/25 border border-orange-400/30 px-2.5 py-1 rounded-full">
          <LuClock className="size-3 text-orange-400" />
          <span className="text-orange-400 text-xs font-nine font-bold">0:28</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" style={{ width: '30%' }} />
      </div>

      <p className="text-white font-nine font-semibold text-sm mb-4 leading-relaxed">
        Which planet is known as the "Red Planet"?
      </p>

      {/* Options */}
      {[
        { l: 'A', t: 'Venus',   active: false },
        { l: 'B', t: 'Mars',    active: true  },
        { l: 'C', t: 'Jupiter', active: false },
        { l: 'D', t: 'Saturn',  active: false },
      ].map((opt) => (
        <div
          key={opt.l}
          className={`mb-2 px-3 py-2 rounded-lg text-xs font-nine flex items-center gap-2 transition-all ${
            opt.active
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-white/10 text-white/60 border border-white/10'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
            opt.active ? 'bg-white/25' : 'bg-white/15'
          }`}>{opt.l}</span>
          {opt.t}
          {opt.active && <LuCheck className="size-3 ml-auto" />}
        </div>
      ))}
    </div>

    {/* Floating score badge */}
    <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl px-4 py-2.5 shadow-xl shadow-orange-500/40">
      <p className="text-orange-100 text-[10px] font-nine leading-none mb-0.5">Your Score</p>
      <p className="text-white font-ten font-extrabold text-xl leading-none">85%</p>
    </div>

    {/* Floating category badge */}
    <div className="absolute -top-3 -left-4 bg-blue-600 rounded-full px-3 py-1.5 shadow-lg shadow-blue-900/40">
      <p className="text-white text-xs font-nine font-semibold">🔭 Science</p>
    </div>

    {/* Floating streak badge */}
    <div className="absolute top-1/2 -right-10 bg-white/15 backdrop-blur border border-white/20 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-white/60 text-[10px] font-nine leading-none mb-0.5">Streak</p>
      <p className="text-orange-400 font-ten font-bold text-base leading-none">🔥 5</p>
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

function Landing() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* BG decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-orange-400/15 border border-orange-400/25 rounded-full px-4 py-1.5 mb-6">
              <LuZap className="size-3.5 text-orange-400" />
              <span className="text-orange-300 text-xs font-nine font-semibold tracking-widest uppercase">
                The Quiz Platform for Curious Minds
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-ten font-extrabold text-white text-4xl sm:text-5xl md:text-6xl leading-tight mb-5">
              Learn.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Challenge.
              </span>
              <br />
              Dominate.
            </h1>

            {/* Sub */}
            <p className="text-blue-200 font-nine text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Create engaging quizzes, challenge yourself across 11 categories, and get detailed
              feedback on every answer — completely free.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link
                to="/takequiz"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-nine font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Quizzes <LuArrowRight className="size-4" />
              </Link>
              <Link
                to="/createquiz"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-nine font-semibold px-7 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <IoCreateOutline className="size-4" /> Create a Quiz
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center lg:justify-start gap-6">
              {[
                { val: '11+', label: 'Categories' },
                { val: '⚡', label: 'Timed Qs' },
                { val: '100%', label: 'Free' },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-white font-ten font-extrabold text-xl leading-none">{s.val}</p>
                    <p className="text-blue-300 font-nine text-xs mt-0.5">{s.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="h-8 w-px bg-white/15" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quiz mockup */}
          <MockQuizCard />
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full block" style={{ height: '40px' }}>
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" className="fill-slate-50 dark:fill-slate-900" />
          </svg>
        </div>
      </section>

      {/* ── Marquee strip ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900 pt-0 pb-0">
        <div className="bg-blue-600 dark:bg-blue-800 py-3">
          <Marquee speed={55} gradient={false}>
            <div className="flex items-center">
              {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, i) => (
                <div key={i} className="flex items-center">
                  <span className="font-nine font-semibold text-white text-sm md:text-base tracking-wide mx-2">
                    {item}
                  </span>
                  <span className="text-orange-400 mx-6 md:mx-10 text-lg font-bold select-none">★</span>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-nine font-bold text-orange-500 dark:text-orange-400 tracking-widest uppercase mb-3">
              Why QuizChamps?
            </span>
            <h2 className="font-ten font-extrabold text-slate-900 dark:text-white text-3xl md:text-4xl">
              Built for{' '}
              <span className="text-blue-600 dark:text-blue-400">real learning</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-nine text-sm mt-3 max-w-md mx-auto">
              Not just a quiz app — a complete knowledge-building platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className={`${f.card} ${f.border} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <div className={`inline-flex p-3 rounded-xl ${f.iconBg} mb-4`}>
                  <f.Icon className={`size-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-ten font-bold text-slate-900 dark:text-white text-lg mb-2">{f.title}</h3>
                <p className="font-nine text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="bg-blue-50 dark:bg-slate-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-nine font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3">
              Simple Process
            </span>
            <h2 className="font-ten font-extrabold text-slate-900 dark:text-white text-3xl md:text-4xl">
              How it{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                works
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 border border-blue-100 dark:border-slate-600 shadow-md flex items-center justify-center">
                    <step.Icon className="size-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] font-ten font-extrabold flex items-center justify-center shadow-md shadow-orange-500/30">
                    {step.num}
                  </span>
                </div>

                {/* Connector dots (between cards on md+) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute" style={{ display: 'none' }} />
                )}

                <h3 className="font-ten font-bold text-slate-900 dark:text-white text-lg mb-2">{step.title}</h3>
                <p className="font-nine text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA hint */}
          <div className="flex justify-center mt-12">
            <Link
              to="/takequiz"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-nine font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              Try it now <LuArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-nine font-bold text-orange-500 dark:text-orange-400 tracking-widest uppercase mb-3">
            Explore
          </span>
          <h2 className="font-ten font-extrabold text-slate-900 dark:text-white text-3xl md:text-4xl mb-3">
            11 categories,{' '}
            <span className="text-blue-600 dark:text-blue-400">infinite curiosity</span>
          </h2>
          <p className="font-nine text-slate-500 dark:text-slate-400 text-sm mb-10 max-w-lg mx-auto">
            Whatever sparks your interest, there's a quiz for it. Browse, play, and learn something new every day.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/takequiz"
                className={`${cat.cls} border px-4 py-2 rounded-full text-sm font-nine font-semibold hover:scale-105 hover:shadow-md transition-all duration-200`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <Link
            to="/takequiz"
            className="inline-flex items-center gap-2 font-nine font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Browse all quizzes <LuArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-orange-500 via-orange-500 to-amber-400 overflow-hidden py-16 px-6">
        {/* BG decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center">
          <GiBrain className="size-12 text-white/80 mx-auto mb-4" />

          <h2 className="font-ten font-extrabold text-white text-3xl md:text-4xl mb-3 leading-tight">
            Ready to test your knowledge?
          </h2>
          <p className="text-orange-100 font-nine text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Join learners who challenge themselves daily. It's free — no account needed to start.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/takequiz"
              className="flex items-center justify-center gap-2 bg-white text-orange-600 hover:text-orange-700 font-nine font-extrabold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Playing <LuArrowRight className="size-4" />
            </Link>
            <Link
              to="/createquiz"
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-nine font-semibold px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              <IoCreateOutline className="size-4" /> Create a Quiz
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Landing;
