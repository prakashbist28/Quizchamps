import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoPlusCircle } from "react-icons/go";
import RingLoader from 'react-spinners/RingLoader'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '', timeLimit: 0 }]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const toastOptions= {
    position:"top-center",
    autoClose:5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition : Bounce
}

  const handleAddQuestion = () => {

      setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '', timeLimit: 0 }]);
  
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answer = value;
    setQuestions(newQuestions);
  };

  const handleTimeLimitChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].timeLimit = value;
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async (event) => {
    event.preventDefault(); 
    setLoading(true);
    const newQuiz = {
      title: quizTitle,
      questions,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/createquiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuiz),
      });

      

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setLoading(false)
        navigate('/success');
      } else {
        setLoading(false)
        const error = await response.json();
        console.log(error.message)
        toast.warning(error.message, toastOptions);
      }
    } catch (error) {
      setLoading(false)
      alert('Error creating quiz:', error);
    }
  };

  
  if (loading) {
    return (
    <div className="flex flex-col gap-4 md:gap-8 w-full min-h-screen items-center text-center m-auto justify-center">
      <h1 className="font-ten text-[18px] md:text-[24px] font-bold text-indigo-400"> Please wait... </h1>
      <RingLoader size={150} color="#a181f0" />
      <h1 className="font-ten text-[14px] md:text-[20px] font-bold text-indigo-500"> Creating a new Quiz</h1>
    </div>);
  }

  return (
    <>
    <div className="p-8 w-full lg:w-2/3 mx-auto rounded-lg">
      <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-purple-300 font-thirteen font-bold text-4xl md:text-8xl pb-10">
        Create a Quiz
      </h1>

      <form onSubmit={handleCreateQuiz}>
        <div className="mb-10">
          <label className="flex left-0 text-xl font-semibold text-gray-700 dark:text-white mb-2">Quiz Title</label>
          <input
            type="text"
            className="w-full p-4 bg-transparent mb-4 border border-indigo-400 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter a catchy quiz title"
            required
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {questions.map((q, index) => (
            <div key={index} className="mb-8 p-6 dark:bg-black bg-white border border-indigo-300 rounded-lg shadow-lg dark:hover:shadow-indigo-500">
              <h2 className="text-2xl font-ten font-semibold text-indigo-400 mb-4">Question {index + 1}</h2>

              <label className="flex left-0 text-lg font-semibold text-gray-600 dark:text-white mb-2">Enter the Question</label>
              <input
                type="text"
                className="w-full p-3 bg-transparent mb-4 border border-gray-300 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder="Write down the question"
                required
              />

              <label className="flex left-0 text-lg font-semibold text-gray-600 dark:text-white mb-2">Options</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {q.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    className="w-full p-3 bg-transparent mb-4 border border-gray-300 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                    
                  />
                ))}
              </div>

              <label className="flex left-0 text-lg font-semibold text-gray-600 dark:text-white mb-2">Correct Answer</label>
              <select
                className="w-full dark:bg-black  p-3 bg-transparent mb-4 border border-gray-300 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 "
                value={q.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                required
              >
                <option value="">Set the correct answer</option>
                {q.options.map((option, optionIndex) => (
                  <option className="" key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="flex left-0 text-lg font-semibold text-gray-600 dark:text-white mb-2">Time Limit (in seconds)</label>
              <input
                type="number"
                className="w-full p-3 bg-transparent dark:text-white mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={q.timeLimit}
                onChange={(e) => handleTimeLimitChange(index, e.target.value)}
                placeholder="Set time limit"
                required
              />
            </div>
          ))}

          <div onClick={handleAddQuestion} className="group h-[600px] border border-indigo-300 dark:hover:bg-indigo-800/40 rounded-lg shadow-lg dark:hover:shadow-indigo-500 hover:bg-indigo-200/20 transition duration-300 mb-8 w-full flex items-center justify-center dark:bg-black bg-white">
            <GoPlusCircle className="size-24 text-slate-400/60 rounded-full group-hover:text-indigo-400 group-hover:scale-90 transition duration-300" />
          </div>
        </div>

        <button
          type="submit"
          className="w-1/2 py-4 h-16 z-0 border border-indigo-500 -top-1 -left-1 hover:top-0 hover:left-0 before:hover:top-0 dark:before:z-0 before:hover:left-0 relative bg-indigo-500 before:absolute before:top-2 before:left-2 before:py-7 before:h-full before:w-full before:border-2 before:border-indigo-500 text-white font-semibold shadow-lg dark:hover:bg-black hover:bg-indigo-500 hover:shadow-indigo-400 transition duration-300"
        >
          Create Quiz
        </button>
      </form>
     
    </div>
    <ToastContainer />
    </>
    
  );
};

export default CreateQuiz;
