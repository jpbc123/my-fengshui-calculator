// src/components/MeditationBanner.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Heart, Target, Moon, Sunrise, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const MeditationBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const meditationOptions = [
    {
      id: 'morning',
      title: "Morning Mindfulness",
      description: "Start your day with intention, gratitude, and mindful awareness",
      icon: <Sunrise className="w-8 h-8" />,
      link: "/meditate-morning",
      gradient: "from-yellow-400/20 via-orange-400/20 to-red-400/20",
      iconBg: "from-yellow-400 to-orange-500",
      time: "15-20 min",
      benefits: ["Set daily intentions", "Practice gratitude", "Center your mind"]
    },
    {
      id: 'affirmations',
      title: "Daily Affirmations",
      description: "Empower your mindset with positive thoughts and self-compassion",
      icon: <Heart className="w-8 h-8" />,
      link: "/meditate-affirmation",
      gradient: "from-pink-400/20 via-rose-400/20 to-red-400/20",
      iconBg: "from-pink-400 to-rose-500",
      time: "5-10 min",
      benefits: ["Boost confidence", "Cultivate self-love", "Positive mindset"]
    },
    {
      id: 'visualization',
      title: "Visualization Exercises",
      description: "Create peaceful mental imagery to reduce stress and find clarity",
      icon: <Target className="w-8 h-8" />,
      link: "/meditate-visualization",
      gradient: "from-purple-400/20 via-indigo-400/20 to-blue-400/20",
      iconBg: "from-purple-400 to-indigo-500",
      time: "10-15 min",
      benefits: ["Reduce stress", "Enhance focus", "Inner peace"]
    },
    {
      id: 'yoga',
      title: "Yoga Pose for the Day",
      description: "Energize your body with mindful movement and flexibility",
      icon: <Sun className="w-8 h-8" />,
      link: "/meditate-yoga-pose",
      gradient: "from-green-400/20 via-emerald-400/20 to-teal-400/20",
      iconBg: "from-green-400 to-emerald-500",
      time: "10-30 min",
      benefits: ["Improve flexibility", "Build strength", "Body awareness"]
    },
    {
      id: 'evening',
      title: "Evening Relaxation",
      description: "Unwind and prepare for restful sleep with calming practices",
      icon: <Moon className="w-8 h-8" />,
      link: "/meditate-evening",
      gradient: "from-slate-400/20 via-gray-400/20 to-zinc-400/20",
      iconBg: "from-slate-400 to-gray-500",
      time: "15-25 min",
      benefits: ["Release tension", "Prepare for sleep", "Reflect on day"]
    }
  ];

  // Auto-rotate every 4 seconds when not hovered
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % meditationOptions.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, meditationOptions.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % meditationOptions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + meditationOptions.length) % meditationOptions.length);
  };

  const currentOption = meditationOptions[currentIndex];

  return (
    <div className="w-full mt-6">
      <section 
        className="relative py-8 px-6 md:py-10 md:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-transparent rounded-full blur-2xl"></div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Daily Meditation & Mindfulness
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto opacity-75"></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentOption.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8"
            >
              {/* Icon and Animation */}
              <div className="flex-shrink-0 relative">
                <motion.div
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 360 : 0,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${currentOption.iconBg} flex items-center justify-center text-white shadow-lg`}
                >
                  {currentOption.icon}
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Content */}
              <div className="flex-grow text-center md:text-left">
                <div className="mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {currentOption.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-3">
                    {currentOption.description}
                  </p>
                  
                  {/* Time and Benefits */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center justify-center sm:justify-start">
                      <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                        {currentOption.time}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {currentOption.benefits.map((benefit, index) => (
                        <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link to={currentOption.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r ${currentOption.iconBg} text-white 
                      font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300
                      transform hover:-translate-y-0.5
                    `}
                  >
                    <span>Begin Practice</span>
                    <motion.span
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {meditationOptions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-indigo-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeditationBanner;