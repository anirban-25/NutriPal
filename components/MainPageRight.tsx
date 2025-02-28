import Image from "next/image";
import React from "react";

const MainPageRight = () => {
  return (
    <div className="mt-10 mr-10 animate-fadeIn">
      <Image
        src="/sam.jpg"
        height={700}
        width={750}
        alt="template"
        className="transition-transform duration-500 ease-in-out hover:scale-110"
      />
    </div>
  );
};

export default MainPageRight;
