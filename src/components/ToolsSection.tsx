// src/components/ToolsSection.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

const ToolsSection = () => {
  const [showMore, setShowMore] = useState(false);

  const initialTools = [
    {
      id: 1,
      title: "Kua Number Calculator",
      description: "Discover your best directions for success and harmony.",
      icon: "🧭",
      link: "/kua-number-calculator",
      category: "Feng Shui",
    },
    {
      id: 2,
      title: "Personal Element Analysis",
      description: "Learn your core Feng Shui element and how it shapes your life.",
      icon: "🌳",
      link: "/personal-element",
      category: "Feng Shui",
    },
    {
      id: 3,
      title: "Chinese Zodiac Horoscope",
      description: "Get personalized daily, weekly, and yearly guidance based on your sign.",
      icon: "🔮",
      link: "/chinese-zodiac-calculator",
      category: "Horoscope",
    },
  ];

  const extraTools = [
    {
      id: 4,
      title: "Western Zodiac Calculator",
      description: "Uncover your Western sun sign and its unique characteristics.",
      icon: "♈",
      link: "/western-zodiac-calculator",
      category: "Astrology",
    },
    {
      id: 5,
      title: "Visiber Numerology",
      description: "Explore the hidden meanings behind the numbers in your life.",
      icon: "🔢",
      link: "/visiber",
      category: "Numerology",
    },
    {
      id: 6,
      title: "Western Zodiac Horoscope",
      description: "Your daily forecast to navigate life's challenges and opportunities.",
      icon: "✨",
      link: "western-horoscope",
      category: "Horoscope",
    },
  ];

  const displayedTools = showMore
    ? [...initialTools, ...extraTools]
    : initialTools;

  return (
    <section className="bg-white text-black" id="tools">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gold">
            Our All-in-One Guidance Tools
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Gain deep, personalized insights with our interactive calculators and daily forecasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.link}
              className="group block transition-transform duration-300 hover:scale-105"
            >
              {/* Outer container for the card */}
              <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 transition-all duration-500 h-full flex flex-col items-center text-center group-hover:bg-gradient-to-br group-hover:from-purple-900 group-hover:via-indigo-900 group-hover:to-gray-800 group-hover:shadow-2xl">
                {/* Icon wrapper with hover effect */}
                <div className="text-2xl w-12 h-12 bg-white border rounded-full shadow flex items-center justify-center mb-4 transition-colors duration-500 group-hover:bg-gold group-hover:border-gold">
                  {tool.icon}
                </div>
                {/* Category tag with hover effect */}
                <div className="text-xs font-semibold bg-gray-300 text-gray-700 px-3 py-1 rounded-md mb-2 transition-colors duration-500 group-hover:bg-purple-600 group-hover:text-white">
                  {tool.category}
                </div>
                {/* Title with hover effect */}
                <h3 className="text-lg font-semibold mb-2 text-black transition-colors duration-500 group-hover:text-gold">
                  {tool.title}
                </h3>
                {/* Description with hover effect */}
                <p className="text-sm text-gray-700 line-clamp-2 transition-colors duration-500 group-hover:text-gray-300">
                  {tool.description}
                </p>
                {/* 'View Tool' link with hover effect */}
                <div className="pt-4 mt-auto w-full text-sm font-medium text-black/80 transition-colors duration-500 group-hover:text-white">
                  View Tool →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setShowMore(!showMore)}
            className="inline-flex items-center justify-center rounded-lg bg-gold text-white hover:bg-gold/80 px-8 py-3 font-medium shadow-lg transition"
          >
            {showMore ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;