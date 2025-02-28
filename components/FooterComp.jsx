
import React from "react";
import { motion } from "framer-motion";
import { slideIn, staggerContainer, textVariant } from "../utils/motion";

const FooterComp = () => {
  return (
    <div className="md:m-5 max-w-full rounded-lg md:px-10 5 flex justify-center font-extrabold">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="mt-10 glassmorphism bg-opacity-15 rounded-lg hover:scale-105 transition hover:bg-opacity-25 shadow-xl">
          <div className="">
            <div className="flex justify-center font-bold text-base md:text-2xl pt-5 tracking-wide">
              ABOUT US
            </div>
            <div className="flex justify-center">
              <div className="p-2 md:p-5 text-slate-900 md:text-base text-sm">
              Med-AI is a cutting edge health assistant powered by AI that offers trustworthy advice and assistance to users in need of preliminary information or guidance regarding their health concerns at any time of the day or night through an intelligent chatbot tool designed to connect patients with a wealth of medical expertise and tailored health recommendations in a user friendly manner while highlighting the importance that this service serves as a supplement rather than a replacement, for professional medical consultation. 
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 bg-white bg-opacity-15 rounded-lg hover:scale-105 transition hover:bg-opacity-25 shadow-xl">
          <div className="flex justify-center font-bold text-base md:text-2xl pt-5 tracking-wide">
            CONTACT US
          </div>
          <div className="flex justify-center">
            <div className="p-2 md:p-5 text-slate-900 md:text-base text-sm">
            You can contact us through our email – medichat@gmail.com or through our telephone number +447714307770
            </div>
          </div>
        </div>
        <div className="mt-10 bg-white bg-opacity-15 rounded-lg hover:scale-105 transition hover:bg-opacity-25 shadow-xl">
          <div className="flex justify-center font-bold text-base md:text-2xl pt-5 tracking-wide">
            STEPS TO FOLLOW
          </div>
          <div className="flex justify-center">
            <div className="p-2 md:p-5 text-slate-900 md:text-base text-sm">
              Just sign-up on our application and fill up the form to personalize your diagnosis. 
              Ask any health related queries or get a thorough diagnosis of your symptoms and reports.
      
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComp;
