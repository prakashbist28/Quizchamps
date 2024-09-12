import React from 'react'
import { useNavigate } from 'react-router-dom'

function Success() {

    const navigate = useNavigate();
  return (
    <div className='min-h-screen flex items-center justify-center m-auto flex-col w-10/12'>
        <h1 className=" pb-10 md:pb-20 dark:text-white text-[36px] md:text-[44px] lg:text-[96px] font-bold"> Quiz created <br/> successfully !!!</h1>

        <div className='flex w-full items-center justify-center flex-col gap-4'>
          <button
            onClick={() => navigate('/createquiz')}
            className=" px-4 py-2 bg-indigo-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-indigo-400 hover:bg-black hover:shadow-lg hover:shadow-indigo-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Add New Quiz
          </button>
          <button
            onClick={() => navigate('/takequiz')}
            className=" px-4 py-2 bg-green-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-green-400 hover:bg-black hover:shadow-lg hover:shadow-green-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Checkout Quizzes
          </button>
          <button
            onClick={() => navigate('/')}
            className=" px-4 py-2 bg-red-500 w-1/2 md:w-1/4 text-[16px] md:text-[20px] hover:-translate-y-2 border border-red-400 hover:bg-black hover:shadow-lg hover:shadow-red-400 text-white font-nine font-bold rounded-md transition duration-300"
          >
            Go to Home
          </button>
          </div>
    </div>
  )
}

export default Success