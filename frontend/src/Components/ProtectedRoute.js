import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import HashLoader from 'react-spinners/HashLoader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <HashLoader size={80} color="#2563eb" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
