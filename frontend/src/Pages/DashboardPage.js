import { useEffect } from 'react';
import Dashboard from '../Components/Dashboard';

const DashboardPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <Dashboard />;
};

export default DashboardPage;
