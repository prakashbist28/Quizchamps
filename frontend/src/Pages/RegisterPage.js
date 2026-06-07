import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('Passwords do not match', toastOptions);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-first font-bold text-slate-900 dark:text-white text-5xl pb-2 text-center">
            Join Us
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 font-nine mb-10">
            Create your Quiz Champs account
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 border border-blue-300 rounded-xl shadow-lg dark:shadow-blue-500/20 p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2 font-nine">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
                className="w-full p-3 bg-transparent border border-blue-400 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

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
                <span className="ml-2 text-xs font-normal text-gray-400">(min 6 characters)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
                className="w-full p-3 bg-transparent border border-blue-400 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2 font-nine">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 dark:text-gray-400 font-nine">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:text-blue-400 transition duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
