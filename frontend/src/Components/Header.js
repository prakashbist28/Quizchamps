import React from 'react'
import { useEffect, useState } from 'react';
import { MdDarkMode } from "react-icons/md";
import { GiBrain } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

function Header() {

  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className='bg-black dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-400 flex justify-between items-center   z-20 h-auto'>
        <div className='flex items-center cursor-pointer p-2 gap-4' onClick={()=> navigate('/')}>
        <GiBrain className='text-indigo-500 dark:text-black size-8 md:size-20' />
        <h1 className='  text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-300 dark:from-black dark:to-black font-first font-extrabold  cursor-pointer text-2xl md:text-7xl '> Quiz Champs</h1>
        </div>
        <button
          onClick={toggleTheme}
          className=" mr-4 md:mr-20 group "
        >
          <h1 className='text-black p-1 font-medium font-nine top-20 rounded-md absolute border border-black bg-indigo-300 z-20 hidden lg:group-hover:flex'>{theme === 'light' ? 'light' : 'dark'}</h1>
          <MdDarkMode title='change theme' className='size-6 md:size-10 bg-indigo-400 dark:bg-black dark:text-indigo-400 dark:shadow-md dark:shadow-indigo-300 text-black rounded-full transition ease-in-out duration-500'/>
        </button>
    </div>
  )
}

export default Header