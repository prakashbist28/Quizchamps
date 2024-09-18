import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuizFin from "./QuizFin";
import ClockLoader from "react-spinners/ClockLoader";
import { SiTicktick } from "react-icons/si";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TakeQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quesno, setQuesno] = useState(1);

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const toastOptions= {
    position:"top-center",
    autoClose:3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition : Bounce,
}


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/quiz/${id}`
        );

        const data = await response.json();
        setQuiz(data);
        setTimeLeft(data.questions[0].timeLimit);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    setSelectedAnswers((prev) => [...prev, selectedOption]);

    if (selectedOption === quiz.questions[currentQuestionIndex].answer) {
      
      setScore((prevScore) => prevScore + 1);
      toast.success( ' Correct Answer', toastOptions)
    }
    else {
    toast.error( ' Wrong Answer', toastOptions)
    }
    setSelectedOption(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(quiz.questions[currentQuestionIndex + 1].timeLimit);
      setQuesno((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setTimeLeft(0);
    }
  };

  const handleFinish = () => {
    if (selectedOption === quiz.questions[currentQuestionIndex].answer) {
      setScore(score);
    }
    setSelectedAnswers((prev) => [...prev, selectedOption]);
    setQuizFinished(true);
    setTimeLeft(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 md:gap-8 w-full min-h-screen items-center text-center m-auto justify-center">
        <h1 className="font-ten text-[18px] md:text-[24px] font-bold text-indigo-400">
          {" "}
          Quiz is Loading... BE PREPARED
        </h1>
        <ClockLoader size={150} color="#524fff" />
        <h1 className="font-ten text-[14px] md:text-[20px] font-bold text-indigo-500">
          {" "}
          Note : There is time limit for each question
        </h1>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div>
        <h1 className="font-ten text-[18px] md:text-[24px] font-bold text-indigo-400">
          {" "}
          ERROR : Quiz can't be opened{" "}
        </h1>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div>
        <QuizFin score={score} quiz={quiz} selectedAnswers={selectedAnswers} />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="mt-10 md:mt-20 mb-10 md:mb-20">
      <h1 className=" text-transparent bg-clip-text bg-gradient-to-b  from-indigo-600 to-purple-300 dark:from-black dark:to-black font-thirteen dark:text-white font-bold text-4xl md:text-8xl pb-10 ">
        {quiz.title}
      </h1>
      <div className="p-6 dark:bg-black border border-indigo-400 w-10/12 md:w-1/2 lg:w-1/3 mx-auto bg-white rounded-xl shadow-lg shadow-black/50 dark:shadow-indigo-500 space-y-4">
        <h1 className="font-ten font-semibold text-black text-md md:text-xl dark:text-white">
          Question{" "}
          <span className="text-indigo-500 ml-4 text-md md:text-xl">
            {quesno} / {quiz.questions.length}
          </span>{" "}
        </h1>
        <h1 className=" font-eight dark:text-white text-[18px] md:text-[24px] font-bold">
          {currentQuestion.question}
        </h1>
        <div className=" flex flex-col gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              className={`flex items-center group justify-between dark:bg-transparent border-2 dark:border-indigo-400  dark:text-white dark:hover:bg-indigo-400  text-[14px] md:text-[18px] hover:bg-indigo-300 transition duration-300 w-full p-2 px-8 my-2  rounded-lg ${
                selectedOption === option
                  ? "bg-indigo-600 shadow-lg shadow-indigo-400 dark:bg-indigo-600 dark:shadow-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
              <div className=" hidden  group-focus:flex  ">
                <SiTicktick />
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <div className="mt-8">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="px-4 py-2 w-1/2 bg-indigo-500 text-white hover:shadow-lg border border-indigo-500 hover:shadow-indigo-500 hover:bg-black rounded-full font-nine text-[16px] md:text-[20px] font-semibold hover:-translate-y-1 transition duration-300"
              >
                Finish
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 w-1/2 bg-indigo-500 text-white hover:shadow-lg border border-indigo-500 hover:shadow-indigo-500 hover:bg-black rounded-full font-nine text-[16px] md:text-[20px] font-semibold hover:-translate-y-1 transition duration-300"
              >
                Next
              </button>
            )}
          </div>

          <p className="mt-8 font-nine text-[16px] md:text-[20px] font-bold text-indigo-500">
            TIME LEFT
          </p>

          <div className="flex w-20 m-auto items-center justify-center ">
            <CircularProgressbar
              styles={buildStyles({
                strokeLinecap: "round",
                textSize: "24px",
                pathTransitionDuration: 0.5,
                textColor: "#6260f0",
                trailColor: "#d6d6d6",
                pathColor: "#6765e6",
              })}
              minValue={0}
              maxValue={quiz.questions[currentQuestionIndex].timeLimit}
              value={timeLeft}
              text={`${timeLeft}`}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TakeQuiz;
