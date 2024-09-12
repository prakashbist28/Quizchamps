import React, { useEffect } from "react";
import TakeQuiz from "../Components/Quiz/TakeQuiz";

function TakeQuizPage() {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className=" flex-grow overflow-x-scroll no-scrollbar flex flex-col dark:bg-black min-h-screen">
      <TakeQuiz />
    </div>
  );
}

export default TakeQuizPage;
