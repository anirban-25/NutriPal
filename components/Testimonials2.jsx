"use client";
import Star from "@/utils/Star";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineRateReview } from "react-icons/md";
const reviews = [
  {
    description:
      "Med-AI has really helped me out during those late night health scares! When my son had a fever come up one night out of the blue; I was able to get prompt and comforting advice, about when its necessary to see a doctor. The chatbots explanations are easy to understand and I like how it always suggests reaching out, to a doctor for serious issues.",
    stars: 5,
    author: "Sarah Thompson, 35",
    position: "Working Professional",
  },
  {
    description:
      "Having diabetes requires me to stay informed, about my health needs. The Med-AI app has become my choice for learning about how medications interact with each other and keeping track of my symptoms and receiving nutritional guidance. It’s akin, to having a informed health buddy with me all the time.",
    stars: 5,
    author: "Michael Rodriguez, 42",
    position: "Chronic Condition Manager",
  },
  {
    description:
      "As a person who struggles with anxiety related to health concerns I find Med-AI to be extremely beneficial. It offers accurate details that assist me in comprehending my symptoms without descending into thoughts. The empathetic approach and backed answers have significantly improved my knowledge about health.",
    stars: 5,
    author: "Emily Chen,  28",
    position: "Graduate Student",
  },
  {
    description:
      "I had my doubts, about AI health tools initially. Med-AI has really won me over! It simplifies jargon from my doctors notes and keeps me on track with my medication schedule while offering clear explanations about my health issues. I find it very easy to use. It has boosted my confidence, in taking charge of my healthcare.",
    stars: 5,
    author: "Robert Kim, 55",
    position: "Retired Teacher ",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const calculateOpacity = (index) => {
    const distance = Math.abs(currentIndex - index);
    return 1 - distance * 0.15; // Opacity decreases by 25% per card distance
  };
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 1500
  };
  return (
    <div className="slider-container relative">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className=" bg-gray-100 text-black  border-2 border-gray-300 rounded-lg min-w-[300px] max-w-[300px] border-gradient p-5 space-y-3"
          >
            <Star stars={5} />
            <MdOutlineRateReview />
            <div className="text-sm">{review.description}</div>
            <div className="mt-4">
              <div className="text-xs">{review.author}</div>
              <div className="text-xs text-[#B3B3B3]">{review.position}</div>
            </div>
          </div>
        ))}

        </Slider>
        <div className="absolute top-80 right-50 z-10 gradient-02 w-96 h-96" />
        <div className="absolute -bottom-0 right-50 z-10 gradient-01 w-96 h-96" />
    </div>
  );
};

export default Testimonials;
