"use client"
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import Logo from '../assets/Logo.svg'

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClickLogin = (text) => {
    setIsClicked(text);
    setTimeout(() => setIsClicked(false), 2000); // Reset the pulse effect after 1 second
    // Add your login logic here
  };

  return (  
    <>
      <div className="sm:w-[425px] sm:h-[520px] border-2 border-[red] w-full h-full flex justify-center items-center">
        <div className="w-auto h-auto flex flex-col gap-20 justify-center items-center">
          <Image
            src={Logo}
            className="w-[50%] h-[50%]"
          />
          <div className="flex flex-col gap-4">
            {/* <div 
              className={`w-[200px] h-auto py-2 px-6 rounded-[10px] flex justify-center items-center bg-[#F54E4E] ${isClicked === "Test" ? 'animate-pulse' : ''}`}
              onClick={() => {handleClickLogin("Test")}}
            >
              <span className="text-[20px] font-[500] text-white">Login</span>
            </div>
            <div 
              className="w-[200px] h-auto py-2 px-6 rounded-[10px] flex justify-center items-center bg-[#F54E4E]"
            
            >
              <span className="text-[20px] font-[500] text-white">Sign Up</span>
            </div> */}
            <Link href={"/Login"}>
              <button 
                className="btn btn-wide bg-[#F54E4E] flex gap-4"
                onClick={() => {handleClickLogin("Login")}}
              >
                {
                  isClicked === "Login" ?
                    <span className="loading loading-spinner text-white"></span>
                  :
                  <></>
                }
                <span className="text-[20px] font-[500] text-white">Login</span>
              </button>
            </Link>
            <Link href={"/Signup"}>
              <button 
                className="btn btn-wide bg-[#F54E4E] flex gap-4"
                onClick={() => {handleClickLogin("Sign Up")}}
              >
                {
                  isClicked === "Sign Up" ?
                    <span className="loading loading-spinner text-white"></span>
                  :
                  <></>
                }
                <span className="text-[20px] font-[500] text-white">Sign Up</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
