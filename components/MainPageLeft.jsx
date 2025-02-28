import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <div className="py-5 lg:py-20 px-2 lg:px-10 ">
      <div className="hidden md:flex absolute left-5 z-10 gradient-01 w-96 h-96" />
      <div className="absolute top-80 right-50 z-10 gradient-02 w-96 h-96" />
      <div className=" space-y-5 ">
        <div className="font-extrabold text-2xl lg:text-4xl tracking-wide text-center lg:text-left">
          WE HELP ANALYZE YOUR HEALTH
        </div>
        <div className="font-semibold text-base lg:text-lg text-center lg:text-left">
          Your online doctor!
        </div>
        <div className=" lg:max-w-[70%] text-center lg:text-left transition-transform duration-500 ease-in-out">
        Medical diagnosis is now at your fingertips. <span className="hidden lg:flex">
          Chat about any health related questions, general queries for research or personal health. Set up your user profile for the bot to provide an accurate diagnosis.  
          </span>
        </div>
        <div className="pt-10 flex space-x-10 justify-center lg:justify-start">
        <Link href="/dashboard">
          <div className="bg-green-800 text-white p-1 lg:px-3 lg:p-2 rounded-md cursor-pointer hover:bg-green-700">
            Go to Dashboard
          </div>
        </Link>
        <Link href="/fill-up-form">
          <div className="bg-gray-200 text-black border border-gray-700 p-1 lg:px-5 lg:p-2 rounded-md cursor-pointer hover:bg-gray-300">
            Fill your reports
          </div>
        </Link>
        </div>
      </div>
    </div>
  );
}
