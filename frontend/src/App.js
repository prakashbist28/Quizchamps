import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Header from './Components/Header';
import Footer from './Components/Footer';
import PageLoader from './Components/ui/PageLoader';

// Eagerly loaded — needed on first paint or tiny
import Landing from './Pages/Landing';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

// Lazy-loaded routes
const QuizListPage      = lazy(() => import('./Pages/QuizListPage'));
const TakeQuizPage      = lazy(() => import('./Pages/TakeQuizPage'));
const Analysis          = lazy(() => import('./Components/Quiz/Analysis'));
const CreateQuizPage    = lazy(() => import('./Pages/CreateQuizPage'));
const Success           = lazy(() => import('./Components/Quiz/Success'));
const MyQuizzesPage     = lazy(() => import('./Pages/MyQuizzesPage'));
const EditQuiz          = lazy(() => import('./Components/Quiz/EditQuiz'));
const DashboardPage     = lazy(() => import('./Pages/DashboardPage'));
const AttemptHistoryPage = lazy(() => import('./Pages/AttemptHistoryPage'));
const AttemptDetailPage = lazy(() => import('./Pages/AttemptDetailPage'));
const AnalyticsPage     = lazy(() => import('./Pages/AnalyticsPage'));
const ProfilePage       = lazy(() => import('./Pages/ProfilePage'));

function App() {
  return (
    <div className="App min-h-screen bg-slate-100 dark:bg-slate-900 -z-40">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/takequiz" element={<QuizListPage />} />
              <Route path="/takequiz/:id" element={<TakeQuizPage />} />
              <Route path="/analysis" element={<Analysis />} />

              {/* Protected */}
              <Route path="/createquiz" element={<ProtectedRoute><CreateQuizPage /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="/myquizzes" element={<ProtectedRoute><MyQuizzesPage /></ProtectedRoute>} />
              <Route path="/editquiz/:id" element={<ProtectedRoute><EditQuiz /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><AttemptHistoryPage /></ProtectedRoute>} />
              <Route path="/attempts/:id" element={<ProtectedRoute><AttemptDetailPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </Suspense>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
