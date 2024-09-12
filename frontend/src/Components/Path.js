import React from "react";
import { LuBrain } from "react-icons/lu";
import { IoCreateOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

function Path() {
  return (
    <div className="mt-16 md:mt-28">
      <h1 className="font-ten font-bold text-transparent bg-clip-text bg-gradient-to-t from-indigo-600 to-purple-400 text-3xl md:text-6xl"> CHOOSE YOUR PATH</h1>
      <div className="flex flex-col min-h-40 md:flex-row flex-grow gap-8 items-center justify-center mt-8">
        {/* create */}
        <Link
         to='/createquiz'
          className="border-2 border-r-8 border-b-8  w-80 cursor-pointer relative flex border-black 
          dark:border-indigo-400 dark:hover:border-indigo-400  p-4  group before:absolute dark:before:bg-indigo-400 dark:before:z-10 
        before:bg-gradient-to-t from-indigo-500 to-purple-300 before:h-full before:w-full before:top-0 before:left-0 before:origin-top before:transition before:ease-in-out before:duration-300 before:-z-10 before:scale-y-0 hover:before:scale-y-100"
        >

          <div className="flex gap-4 z-20">
            <div className=" dark:text-indigo-400 dark:group-hover:text-black">
              <IoCreateOutline className="size-20" />
            </div>
            <div className="flex flex-col pt-2">
              <h1 className="text-left text-[16px] font-fourth font-semibold  dark:text-indigo-400 dark:group-hover:text-black">
                Be the Creator
              </h1>
              <h1 className="text-[32px] font-fourth font-bold  dark:text-indigo-400 dark:group-hover:text-black">
                Create Quiz
              </h1>
            </div>
          </div>

        </Link> 

        {/* list quiz */}
        <Link
          to='/takequiz'
          className="border-2 border-r-8 border-b-8  w-80 cursor-pointer relative flex border-black 
          dark:border-indigo-400 dark:hover:border-indigo-400  p-4  group before:absolute dark:before:bg-indigo-400 dark:before:z-10 
        before:bg-gradient-to-t from-indigo-500 to-purple-300 before:h-full before:w-full before:top-0 before:left-0 before:origin-top before:transition before:ease-in-out before:duration-300 before:-z-10 before:scale-y-0 hover:before:scale-y-100"
        >

          <div className="flex gap-4 z-20">
            <div className=" dark:text-indigo-400 dark:group-hover:text-black">
              <LuBrain  className="size-20" />
            </div>
            <div className="flex flex-col pt-2">
              <h1 className="text-left text-[16px] font-fourth font-semibold  dark:text-indigo-400 dark:group-hover:text-black">
                Challenge the Creator
              </h1>
              <h1 className="text-[32px] font-fourth font-bold  dark:text-indigo-400 dark:group-hover:text-black">
                Take Quiz
              </h1>
            </div>
          </div>

        </Link>

      </div>

      
    </div>
  );
}

export default Path;
