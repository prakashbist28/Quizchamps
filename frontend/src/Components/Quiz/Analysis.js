import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

const Analysis = ({ score, quiz, selectedAnswers }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-10 md:mt-20 mb-10 md:mb-20 text-center ">
      <h1 className="font-first font-bold text-slate-900 dark:text-white text-4xl md:text-5xl">
        Analysis Report
      </h1>
      <h1 className="dark:text-white pb-4 font-semibold font-nine text-[24px] md:text-[40px]">
        Your Score: {score} / {quiz.questions.length}
      </h1>

      <div className="mt-8 mx-auto w-10/12 md:w-2/3 lg:w-1/2 text-left space-y-6">
        {quiz.questions.length > 0 ? (
          quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.answer;

            return (
              <div
                key={index}
                className={`flex flex-col p-6 rounded-lg shadow-lg border-2 ${
                  userAnswer ? isCorrect
                    ? "border-green-200 bg-green-200 dark:bg-green-800/40 "
                    : "border-red-200 bg-red-200 dark:bg-red-800/40 "
                    : "border-red-200 bg-yellow-200 dark:bg-yellow-500/40 "
                }`}
              >
                <div className="flex flex-col md:pl-8 lg:flex-row justify-between">
                  <div>
                    <h3 className="font-semibold dark:text-white text-[14px] md:text-xl">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="mt-4">
                      <p
                        className={`font-semibold font-ten ${
                          userAnswer ? isCorrect ? "text-green-600" : "text-red-600" : "text-yellow-600"
                        }`}
                      >
                        Your Answer: {userAnswer || "No answer selected"}
                      </p>
                      <p className="font-semibold font-ten text-green-600">
                        Correct Answer: {question.answer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    {userAnswer ? isCorrect ? (
                      <h1 className=" text-[24px]  mt-4 md:mt-0 md:text-[24px] lg:text-[32px] text-green-600">
                        Correct (+1){" "}
                      </h1>
                    ) : (
                      <h1 className="text-[24px]  mt-4 md:mt-0 md:text-[24px] lg:text-[32px] text-red-600">
                        {" "}
                        Wrong (0)
                      </h1>
                    ) : <h1 className="text-[24px]  mt-4 md:mt-0 md:text-[24px] lg:text-[32px] text-yellow-600"> Didn't Answer (0)</h1>}
                  </div>
                </div>

                {question.explanation && (
                  <div className="mt-4 md:ml-8 p-3 bg-white/50 dark:bg-black/30 border border-white/60 dark:border-gray-600/50 rounded-lg">
                    <p className="text-xs font-nine font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Explanation
                    </p>
                    <p className="text-sm font-nine text-gray-800 dark:text-gray-200">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col gap-4 md:gap-8 w-full min-h-screen items-center text-center m-auto justify-center">
            <h1 className="font-ten text-[18px] md:text-[24px] font-bold text-blue-400">
              {" "}
              Quiz is Loading... BE PREPARED
            </h1>
            <BeatLoader size={150} color="#f97316" />
            <h1 className="font-ten text-[14px] md:text-[20px] font-bold text-blue-500">
              {" "}
              Note : There is time limit for each question
            </h1>
          </div>
        )}
        {/* buttons */}
        <div className="flex w-full items-center justify-center flex-col gap-4">
          <button
            onClick={() => window.location.reload()}
            className=" px-4 py-2 bg-blue-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-blue-400 hover:bg-black hover:shadow-lg hover:shadow-blue-400 text-white font-nine font-bold rounded-md transition duration-300"
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
    </div>
  );
};

export default Analysis;
