import React, { useEffect, useState } from 'react';
import { MdDarkMode } from 'react-icons/md';
import { GiBrain } from 'react-icons/gi';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { getDefaultAvatar } from '../constants/avatars';

function Header() {
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const navLinkClass = (to) =>
    `flex items-center w-full px-4 py-3 font-nine text-sm border-l-2 transition duration-200 ${
      pathname === to
        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold'
        : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300'
    }`;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <div className="bg-slate-950 flex justify-between items-center z-20 h-auto px-2 border-b border-slate-800">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer p-2 gap-2 md:gap-4"
        onClick={() => navigate('/')}
      >
        <GiBrain className="text-blue-400 size-8 md:size-20 shrink-0" />
        <h1 className=" sm:block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-300 font-first font-extrabold cursor-pointer text-md md:text-7xl">
          Quiz Champs
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3 mr-2 md:mr-10">
        {/* Theme toggle */}
        <button onClick={toggleTheme} className="group relative">
          <h1 className="text-white p-1 font-medium font-nine top-10 rounded-md absolute border border-slate-600 bg-slate-700 z-20 hidden lg:group-hover:flex whitespace-nowrap">
            {theme === 'light' ? 'light' : 'dark'}
          </h1>
          <MdDarkMode
            title="change theme"
            className="size-5 md:size-10 bg-blue-500 text-white dark:bg-slate-700 dark:text-blue-400 dark:shadow-md dark:shadow-blue-900 rounded-full transition ease-in-out duration-500"
          />
        </button>

        {/* Auth area */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 group"
              aria-label="User menu"
            >
              {/* Avatar circle */}
              {user.avatarType === 'uploaded' && user.avatarUrl?.startsWith('data:') ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="size-8 md:size-10 rounded-full object-cover border-2 border-orange-400"
                />
              ) : (
                <div
                  className={`size-8 md:size-10 rounded-full bg-gradient-to-br ${getDefaultAvatar(user.avatarUrl).gradient} border-2 border-orange-400 flex items-center justify-center text-white font-nine font-bold text-xs md:text-sm select-none`}
                >
                  {initials}
                </div>
              )}
              <span className="hidden md:block font-nine font-semibold text-blue-300 text-sm max-w-[120px] truncate">
                {user.name}
              </span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl dark:shadow-black/50 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-nine font-semibold text-gray-800 dark:text-white text-sm truncate">
                    {user.name}
                  </p>
                  <p className="font-nine text-gray-500 dark:text-gray-400 text-xs truncate">
                    {user.email}
                  </p>
                </div>
                <Link to="/profile"   onClick={() => setMenuOpen(false)} className={navLinkClass('/profile')}>Profile</Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={navLinkClass('/dashboard')}>Dashboard</Link>
                <Link to="/myquizzes" onClick={() => setMenuOpen(false)} className={navLinkClass('/myquizzes')}>My Quizzes</Link>
                <Link to="/analytics" onClick={() => setMenuOpen(false)} className={navLinkClass('/analytics')}>Creator Analytics</Link>
                <Link to="/history"   onClick={() => setMenuOpen(false)} className={navLinkClass('/history')}>Attempt History</Link>
                <div className="border-t border-slate-100 dark:border-slate-700" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 font-nine text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="font-nine font-semibold text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 text-blue-300 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="font-nine font-semibold text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 text-white rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
