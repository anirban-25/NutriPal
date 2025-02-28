import Image from "next/image";
import React, { useState, useEffect } from "react";
import Testimonials from "./Testimonials2";
import BotPage from "../botComponent/BotPage";

const HeroSection = () => {
  const [scale, setScale] = useState(1);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scaleFactor = 1 + scrollY / 5000;  // Subtle zoom by adjusting divisor (larger divisor = less zoom)
    setScale(scaleFactor);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="p-10">
      <div>
        <div className="text-center tracking-widest font-semibold text-base">
          Your Personalized Online Doctor !
        </div>
        <div className="text-center text-3xl font-bold mt-5">
          No need to book appointments anymore.
        </div>
        <div className="space-x-32 mt-20 flex justify-center">
          <div>
            <Image
              src="/template.jpg"
              height={200}
              width={200}
              alt="png1"
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `scale(${scale})` }}  // Apply subtle dynamic scaling for the image
            />
          </div>
          <div className="text-left max-w-[50%]">
            <div className="font-bold text-lg">MedAI</div>
            <div className="max-w-96 space-y-2">
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `scale(${scale})` }}  // Apply subtle dynamic scaling for text
              >
                Our Medical Chatbot performs a specialized diagnosis based on your user profile.
              </div>
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `scale(${scale})` }}  // Apply subtle dynamic scaling for text
              >
                Have any question regarding your health? Ask Away!
              </div>
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `scale(${scale})` }}  // Apply subtle dynamic scaling for text
              >
                Need an urgent diagnosis? We are here for you.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="font-bold tracking-widest text-center">TESTIMONIALS</div>
        <div className="text-center text-3xl font-bold mt-5">Check out our reviews!</div>
        <div className="mt-10">
          <Testimonials />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
