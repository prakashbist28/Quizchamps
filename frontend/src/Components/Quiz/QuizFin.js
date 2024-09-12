import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Analysis from "./Analysis";
import BeatLoader from 'react-spinners/BeatLoader'

function QuizFin({ score, quiz, selectedAnswers }) {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(false);

  const winpercentage = (score / quiz.questions.length) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if(analysis){
    return <Analysis score={score} quiz={quiz} selectedAnswers={selectedAnswers} />
  }

  return (
    <div>
      { quiz.questions.length ?
      <div className="text-center flex flex-col items-center justify-center mt-10 md:mt-10  ">
      
        <h1 className="pb-10 md:pb-20 dark:text-white text-[36px] md:text-[44px] lg:text-[96px] font-bold">
          Quiz Completed!
        </h1>
        <p className="dark:text-white pb-4 font-semibold font-nine text-[20px]">
          You scored :{" "}
          <span className="font-bold text-[32px] font-ten text-indigo-400">
            {score}
          </span>{" "}
          out of{" "}
          <span className="font-bold text-[32px] font-ten text-indigo-400">
            {quiz.questions.length}
          </span>
        </p>
        <p className="dark:text-white pb-10 font-semibold font-nine text-[20px]">
          Your Success Rate :{" "}
          <span className="font-bold text-[32px] font-ten text-indigo-400">
            {winpercentage} %{" "}
          </span>
        </p>

        {winpercentage >= 50 && winpercentage < 75 && (
          <div className=" flex flex-col items-center justify-center">
            <img
              className=" mb-4 size-20 md:size-40"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.gif"
              alt="🥳"
            />
            <h1 className="dark:text-white font-semibold font-nine text-[20px] md:text-[28px]">
              {" "}
              You did{" "}
              <span className="font-bold text-[36px] font-thirteen tracking-wider text-green-500">
                GREAT !
              </span>
            </h1>
          </div>
        )}

        {winpercentage === 100 && (
          <div className=" flex flex-col items-center justify-center">
            <img
              className=" mb-4 size-20 md:size-40"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f48e/512.gif"
              alt="💎"
            />
            <h1 className="dark:text-white font-semibold font-nine text-[20px] md:text-[28px]">
              {" "}
              You are{" "}
              <span className="font-bold text-[36px] font-thirteen tracking-wider text-green-500">
                PERFECTION !
              </span>
            </h1>
          </div>
        )}

        {winpercentage >= 75 && winpercentage < 100 && (
          <div className=" flex flex-col items-center justify-center">
            <img
              className=" mb-4 size-20 md:size-40"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.gif"
              alt="🌟"
            />
            <h1 className="dark:text-white font-semibold font-nine text-[20px] md:text-[28px]">
              {" "}
              You are a
              <span className="font-bold text-[36px] font-thirteen tracking-wider text-green-500">
                {" "}
                STAR !
              </span>
            </h1>
          </div>
        )}

        {winpercentage < 50 && (
          <div className=" flex flex-col items-center justify-center">
            <img
              className=" mb-4 size-20 md:size-40"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a1/512.gif"
              alt="💡"
            />
            <h1 className="dark:text-white font-semibold font-nine text-[20px] md:text-[28px]">
              {" "}
              We will get them{" "}
              <span className="font-bold text-[36px] font-thirteen tracking-wider text-green-500">
                NEXT TIME !
              </span>
            </h1>
          </div>
        )}

        <div className="flex flex-col items-center m-8 w-full">
          <h1 className=" dark:text-white  font-semibold font-nine text-[20px] md:text-[28px]"> Check out the analysis  </h1>
          <button
            onClick={() => setAnalysis(true)}
            className=" px-4 py-2 bg-cyan-500 w-1/2 md:w-2/12 text-[16px] md:text-[20px] hover:-translate-y-2 border border-cyan-400 hover:bg-black hover:shadow-lg hover:shadow-cyan-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Analysis Report
          </button>
        </div>



        {/* buttons */}
        <div className="flex w-full items-center justify-center flex-col gap-4">

          <button
            onClick={() => window.location.reload()}
            className=" px-4 py-2 bg-indigo-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-indigo-400 hover:bg-black hover:shadow-lg hover:shadow-indigo-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Restart Quiz
          </button>

          <button
            onClick={() => navigate("/takequiz")}
            className=" px-4 py-2 bg-green-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-green-400 hover:bg-black hover:shadow-lg hover:shadow-green-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Try Different Quiz
          </button>

          <button
            onClick={() => navigate("/")}
            className=" px-4 py-2 bg-red-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-red-400 hover:bg-black hover:shadow-lg hover:shadow-red-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Go to Home
          </button>
        </div>
          
      </div>
      : 
      <div className="flex flex-col gap-4 md:gap-8 w-full min-h-screen items-center text-center m-auto justify-center">
      <h1 className="font-ten text-[18px] md:text-[24px] font-bold text-indigo-400"> Quiz is Loading... BE PREPARED</h1>
      <BeatLoader size={150} color="#a181f0" />
      <h1 className="font-ten text-[14px] md:text-[20px] font-bold text-indigo-500"> Note : There is time limit for each question</h1>
    </div>}

    </div>
  );
}

export default QuizFin;
