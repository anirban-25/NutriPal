import Image from "next/image";
import React from "react";
import Navbar from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
const page = () => {
  return (
    <div className="min-h-screen bg-[#171717] text-white relative overflow-hidden">
      {/* Animated Gradient Splashes */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-600/30 via-red-500/20 to-transparent blur-3xl " />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-red-900/30 via-red-800/20 to-transparent blur-3xl " />

      <div className=" flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
