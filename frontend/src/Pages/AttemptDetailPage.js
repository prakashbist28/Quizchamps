import { useEffect } from 'react';
import AttemptDetail from '../Components/Quiz/AttemptDetail';

const AttemptDetailPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <AttemptDetail />;
};

export default AttemptDetailPage;
