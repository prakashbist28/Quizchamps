import React, { useEffect } from "react";
import CreateQuiz from "../Components/Quiz/CreateQuiz";

function CreateQuizPage() {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-grow min-h-screen">
      <CreateQuiz />
    </div>
  );
}

export default CreateQuizPage;
