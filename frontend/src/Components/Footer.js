import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { footerlink } from "../Data/Vols";

function Footer() {
  return (
    <footer className="mt-4 bg-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:to-blue-950 border-t border-slate-800">
      <div className="w-full flex flex-col md:flex-row p-8 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3 md:w-1/3">
          <div className="flex items-center gap-2">
            <GiBrain className="text-blue-400 size-7" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-300 font-first font-extrabold text-lg">
              Quiz Champs
            </span>
          </div>
          <p className="text-slate-400 text-sm text-left font-nine">
            Test your knowledge. Challenge your friends.
          </p>
          <div className="flex gap-4 text-[28px] md:text-[36px] mt-1">
            <a href="https://www.linkedin.com/in/prakashbist28/" target="_blank" rel="noreferrer">
              <FaLinkedin className="text-slate-400 hover:text-blue-400 hover:scale-110 transition duration-300" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              <FaSquareInstagram className="text-slate-400 hover:text-pink-400 hover:scale-110 transition duration-300" />
            </a>
            <a href="https://x.com/" target="_blank" rel="noreferrer">
              <FaSquareXTwitter className="text-slate-400 hover:text-slate-200 hover:scale-110 transition duration-300" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-[14px] md:text-[16px] font-first font-extrabold">
            Company
          </h3>
          <div className="flex gap-8 md:gap-12 lg:gap-24 text-[12px] md:text-[15px]">
            {footerlink && footerlink.map((item) => (
              <a
                href={item.link}
                key={item.id}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 group flex items-center font-medium font-first hover:text-orange-300 transition duration-300 hover:translate-x-1"
              >
                <span className="hidden group-hover:inline-flex mr-1 text-orange-300">
                  <FaAngleRight />
                </span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-8 py-4 text-center">
        <p className="text-xs text-slate-500 font-nine">
          © {new Date().getFullYear()} Quiz Champs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
