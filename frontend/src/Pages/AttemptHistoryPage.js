import { useEffect } from 'react';
import AttemptHistory from '../Components/Quiz/AttemptHistory';

const AttemptHistoryPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <AttemptHistory />;
};

export default AttemptHistoryPage;
