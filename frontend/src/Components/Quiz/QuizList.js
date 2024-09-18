import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader'
import { LuSearch } from "react-icons/lu";

const QuizList = () => {

  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const filteredList = quizList.filter( (item)=> item.title.toLowerCase().includes(search.toLowerCase()) )


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/quiz`);
        const data = await response.json();
        setQuizList(data);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);


  if (loading) {
    return (
    <div className="flex flex-col gap-4 md:gap-8 w-full min-h-screen items-center text-center m-auto justify-center">
      <h1 className="font-ten text-[18px] md:text-[24px] font-bold text-indigo-400"> Please wait... </h1>
      <HashLoader size={150} color="#524fff" />
      <h1 className="font-ten text-[14px] md:text-[20px] font-bold text-indigo-500"> Note : There is time limit for each question</h1>
    </div>);
  }

  return (
    <div className="p-6 w-full md:w-10/12 mx-auto mt-10 md:mt-20 mb-20 min-h-screen">
      <h1 className=" text-transparent bg-clip-text bg-gradient-to-b  from-indigo-600 to-purple-300  font-thirteen  font-bold text-4xl md:text-8xl pb-10 ">
        Select the Quiz
      </h1>
      <input onChange={(e) => setSearch(e.target.value)} placeholder='Search for quiz...' className=' bg-transparent rounded-md dark:placeholder:text-indigo-200 dark:text-white outline-none border-2 border-black dark:border-indigo-400 focus:border-indigo-600 p-2 md:p-4 mb-8 w-2/3'/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8  md:gap-12">
        {filteredList.length>0 ? filteredList.map((quiz) => (
          <Link to={`/takequiz/${quiz._id}`} key={quiz._id}>
            <div className="bg-slate-100/50 dark:bg-black group relative border border-indigo-400 p-4 rounded-lg h-36 md:h-72 flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg hover:shadow-gray-300 dark:hover:shadow-indigo-300/40 hover:scale-110 transition ease-in-out duration-500 overflow-hidden">
              <div className=" h-60 w-60 md:h-96 md:w-96 rounded-full bg-indigo-300/10  absolute group-hover:scale-[600%] transition ease-in-out duration-700"></div>
              <div className=" h-44 w-44 md:h-72 md:w-72 rounded-full bg-indigo-300/20  absolute group-hover:scale-[600%] transition ease-in-out duration-700"></div>
              <div className=" h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-300 absolute group-hover:scale-[600%] transition ease-in-out duration-700"></div>
              <h2 className=" text-lg md:text-xl group-hover:scale-[150%] font-ten font-semibold z-10 transition duration-500">{quiz.title}</h2>
            </div>
          </Link>
        )) : 
        <div className='w-full '>
        <h1 className=' font-ten text-xl text-center mb-4 '> No Quiz available</h1>
        <div className='flex w-full items-center justify-center flex-col gap-4'>
          <button
            onClick={() => navigate('/createquiz')}
            className=" px-4 py-2 bg-indigo-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-indigo-400 hover:bg-black hover:shadow-lg hover:shadow-indigo-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Add New Quiz
          </button>
         
          <button
            onClick={() => navigate('/')}
            className=" px-4 py-2 bg-red-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-red-400 hover:bg-black hover:shadow-lg hover:shadow-red-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Go to Home
          </button>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default QuizList;
