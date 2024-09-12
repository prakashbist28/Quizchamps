import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { footerlink } from "../Data/Vols";

function Footer() {
  return (
    <div className="mt-4">
      <div className=" bg-black dark:bg-gradient-to-tr dark:from-indigo-500 dark:to-purple-400 min-h-40  w-full flex flex-col md:flex-row p-8 gap-8">
        <div className="w-1/3 flex flex-col items-start gap-2 ">

          <h1 className="text-white dark:text-black text-[14px] md:text-[18px] font-first font-extrabold"> Social Links</h1>
          <div className="flex gap-3 md:gap-6 text-[30px] md:text-[40px] mt-2">
            <a
              href="https://www.linkedin.com/in/prakashbist28/"
              target="_blank"
            >
              <FaLinkedin className="text-white dark:text-black  hover:scale-110 hover:text-blue-500 transition duration-300 hover:shadow-lg hover:shadow-blue-400 " />
            </a>
            <a href="https://www.instagram.com/" target="_blank">
              <FaSquareInstagram className="text-white hover:scale-110 dark:text-black hover:text-pink-400 transition duration-300 hover:shadow-lg hover:shadow-pink-400" />
            </a>
            <a href="https://www.instagram.com/" target="_blank">
              <FaSquareXTwitter className="text-white hover:scale-110 dark:text-black hover:text-gray-400 transition duration-300 hover:shadow-lg hover:shadow-gray-400" />
            </a>
          </div>
        </div>


        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-white dark:text-black text-[14px] md:text-[18px] font-first font-extrabold"> Company </h1>
          <div className="flex gap-8 md:gap-12  lg:gap-24 text-[12px] md:text-[16px]">

            {footerlink && footerlink.map((item)=>(
               <a
               href={item.link}
               key={item.id}
               target="_blank"
               className="text-white dark:text-black dark:hover:text-black group flex items-center font-medium font-first hover:text-indigo-200 transition duration-500 hover:translate-x-2"
             >
               {" "}
               <h1 className="hidden absolute left-[-20px] group-hover:flex dark:group-hover:text-black group-hover:text-indigo-200 transition duration-500">
                 {" "}
                 <FaAngleRight />{" "}
               </h1>
               {item.title}{" "}
             </a>
            ))}
           
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
