import React, { useEffect } from "react";
import QuizList from "../Components/Quiz/QuizList";

function QuizListPage() {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-grow min-h-screen">
      <QuizList />
    </div>
  );
}

export default QuizListPage;
