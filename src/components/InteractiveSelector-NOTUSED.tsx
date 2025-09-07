// src/components/InteractiveSelector.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import yogaImage from "../assets/yoga.jpg";
import affirmationImage from "../assets/affirmation.jpg";
import morningImage from "../assets/morning.jpg";
import eveningImage from "../assets/evening.jpg";
import visualizationImage from "../assets/visualization.jpg";

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  const navigate = useNavigate();

  const options = [
    {
      title: "Yoga Pose for the Day",
      description: "Stretch and energize your body with a simple daily pose",
      image: yogaImage,
      link: "/yoga",
    },
    {
      title: "Daily Affirmations",
      description: "Repeat a daily phrase to boost confidence, luck, and clarity",
      image: affirmationImage,
      link: "/affirmations",
    },
    {
      title: "Visualization Exercises",
      description: "Focus your mind and imagine positive energy flowing into your day",
      image: visualizationImage,
      link: "/visualization",
    },
    {
      title: "Morning Mindfulness",
      description: "Start your day calm, centered, and ready for opportunities",
      image: morningImage,
      link: "/morning",
    },
    {
      title: "Evening Relaxation",
      description: "Unwind and release tension before sleep for a peaceful night",
      image: eveningImage,
      link: "/evening",
    },
    {
      title: "Mini Breathing Exercise",
      description: "Take a minute to breathe deeply and reset your mind",
      image:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
      link: "/breathing",
    },
  ];

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    } else {
      navigate(options[index].link); // client-side routing, respects basename
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center font-sans text-black rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="w-full max-w-2xl px-4 py-4 text-center">
        <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg mx-auto animate-fadeInTop delay-600">
          Unwind with quick exercises, mindfulness, and daily meditations.
        </p>
      </div>

      {/* Options Container */}
      <div className="options flex w-full max-w-4xl h-[350px] mx-4 items-stretch overflow-hidden relative rounded-lg">
        {options.map((option, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              className={`option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out ${
                isActive ? "active" : ""
              }`}
              style={{
                backgroundImage: `url('${option.image}')`,
                backgroundSize: isActive ? "auto 100%" : "auto 120%",
                backgroundPosition: "center",
                opacity: animatedOptions.includes(index) ? 1 : 0,
                transform: animatedOptions.includes(index)
                  ? "translateX(0)"
                  : "translateX(-60px)",
                minWidth: "50px",
                minHeight: "90px",
                borderColor: isActive ? "#fff" : "#292929",
                cursor: "pointer",
                backgroundColor: "#18181b",
                boxShadow: isActive
                  ? "0 15px 40px rgba(0,0,0,0.50)"
                  : "0 8px 20px rgba(0,0,0,0.30)",
                flex: isActive ? "7 1 0%" : "1 1 0%",
                zIndex: isActive ? 10 : 1,
              }}
              onClick={() => handleOptionClick(index)}
            >
              {/* Shadow effect */}
              <div
                className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
                style={{
                  bottom: isActive ? "0" : "-30px",
                  height: "80px",
                  boxShadow: isActive
                    ? "inset 0 -80px 80px -80px #000, inset 0 -80px 80px -60px #000"
                    : "inset 0 -80px 0px -80px #000, inset 0 -80px 0px -60px #000",
                }}
              ></div>

              {/* Label with info */}
              <div className="label absolute left-0 right-0 bottom-3 flex items-center justify-start h-8 z-2 px-3 gap-2 w-full">
                <div className="info text-white whitespace-pre relative">
                  <div
                    className="main font-bold text-sm md:text-base transition-all duration-700 ease-in-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateX(0)"
                        : "translateX(25px)",
                    }}
                  >
                    {option.title}
                  </div>
                  <div
                    className="sub text-xs md:text-sm text-gray-300 transition-all duration-700 ease-in-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateX(0)"
                        : "translateX(25px)",
                    }}
                  >
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pb-4"></div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default InteractiveSelector;
