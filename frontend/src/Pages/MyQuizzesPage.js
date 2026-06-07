import { useEffect } from 'react';
import MyQuizzes from '../Components/Quiz/MyQuizzes';

const MyQuizzesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <MyQuizzes />;
};

export default MyQuizzesPage;
