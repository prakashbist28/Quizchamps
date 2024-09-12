import React from 'react'
import Marquee from "react-fast-marquee";
import { Infidata } from '../Data/Vols';
import { IoStarSharp } from "react-icons/io5";



function InfiSlide() {

    const createRepeatedArray = (arr, times) => {
        let result = [];
        for (let i = 0; i < times; i++) {
          result = result.concat(arr);
        }
        return result;
      };

      const repeatedData = createRepeatedArray(Infidata, 10);

  return (
    <div className='blur-0 dark:bg-gradient-to-tr from-indigo-400 to-purple-300 '>
        <Marquee  >
            <div className='flex h-16 cursor-pointer  pt-2 pb-2 md:pt-4 md:pb-4'>
            {repeatedData && repeatedData.map((data, index)=>(
                <div key={index} className='flex items-center justify-center'>
                    <div className='font-first md:pt-2  tracking-tight font-semibold text-black/40 dark:text-black flex text-2xl md:text-4xl hover:text-indigo-500  transition duration-300'>{data.title}</div>
                    <IoStarSharp className='text-indigo-500 ml-16 mr-16 dark:text-indigo-600 dark:hover:text-black hover:text-indigo-200 transition ease-in-out duration-500 text-2xl md:text-4xl'/>
                    
                </div>
            ))}
            </div>
        </Marquee>

    </div>
  )
}

export default InfiSlide