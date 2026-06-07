import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
  position: 'top-center',
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
  transition: Bounce,
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <h1 className="font-first font-bold text-slate-900 dark:text-white text-5xl pb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 font-nine mb-10">
            Sign in to your Quiz Champs account
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 border border-blue-300 rounded-xl shadow-lg dark:shadow-blue-500/20 p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2 font-nine">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full p-3 bg-transparent border border-blue-400 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2 font-nine">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full p-3 bg-transparent border border-blue-400 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-nine font-semibold rounded-md border border-orange-400 hover:shadow-lg hover:shadow-orange-400 hover:-translate-y-0.5 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 dark:text-gray-400 font-nine">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-500 font-semibold hover:text-blue-400 transition duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
