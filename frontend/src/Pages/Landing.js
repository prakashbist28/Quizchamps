import React, { useEffect } from "react";
import Carous from "../Components/Carous";
import InfiSlide from "../Components/InfiSlide";
import Path from "../Components/Path";

function Landing() {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="overflow-x-scroll no-scrollbar min-h-screen flex flex-col flex-grow">
      <Carous />

      <InfiSlide />

      <Path />
    </div>
  );
}

export default Landing;
