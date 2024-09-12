import React, { useEffect, useState } from 'react'
import { Vols } from '../Data/Vols'


function Carous() {
    const [currimg,setCurrimg] = useState(0)
    
    const next = () => setCurrimg((currimg) => currimg === Vols.length-1 ? 0 : currimg+1)

    useEffect(() => {
        const interval = setInterval(next, 3000);
        return () => clearInterval(interval); 
    }, [currimg])

    const handleDotClick = (index) => {
      setCurrimg(index);
    };

  return (
    <div>
        <div className="w-full h-full flex relative items-center overflow-hidden pb-6 ">

       
        <div className='flex transition  ease-in-out duration-500 ' style={{transform: `translateX(-${currimg*100}%)`}}>
        {Vols.map((vol, index)=>(
            <div key={index} className='w-full grid grid-cols-2 md:grid-cols-3  flex-shrink-0 ' >
                <div className='flex justify-center items-center ml-16'>
                <h1 className=' font-sixth  text-white text-shadow-md font-bold text-[30px] md:text-[60px] lg:text-[100px] tracking-wider ' >{vol.desc1}<br/> <h1 className=' flex md:hidden'>{vol.desc2}</h1></h1>
                </div>
                <div className='absolute bg-gradient-to-tr from-indigo-800 to-purple-400 opacity-80 w-full h-[800px] object-cover object-center -z-10 '></div>
                <img className='w-full absolute -z-20 rounded-lg  h-[800px] object-cover object-center blur-3xl ' src={vol.image}  />
                <img className='z-10 mt-4 rounded-lg h-[250px] md:h-[400px] mx-auto mb-4  hover:scale-110 transition duration-500 ' src={vol.image} />

                <div className='hidden md:flex justify-center items-center'>
                <h1 className=' font-sixth  text-white text-shadow-md font-bold text-[30px] md:text-[60px] lg:text-[100px] tracking-wider ' >{vol.desc2}</h1>
                </div>
            </div>
            

        ))}
        </div>
        <div className='absolute flex bottom-0 w-full justify-center z-20  space-x-2 pb-2'>
        {Vols.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-6 h-1 md:w-8 md:h-2 rounded-full ${currimg === index ? 'bg-purple-400' : 'bg-white' } transition duration-300`}
          />
        ))}
      </div>
        
      

        </div>
    </div>
  )
}

export default Carous