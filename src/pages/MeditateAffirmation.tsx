import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ImageSwiper } from "@/components/ImageSwiper"; 

import visualizationImage from '../assets/meditate-visualization.jpg';
import affirmationImage from '../assets/meditate-affirmation.jpg';
import yogaImage from '../assets/meditate-yoga.jpg';
import morningImage from '../assets/meditate-morning.jpg';
import eveningImage from '../assets/meditate-evening.jpg';
import breathingImage from '../assets/meditate-breathing.jpg';

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Meditation", path: "/meditation" },
  { label: "Daily Affirmations" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditate-visualization-exercise",
  },
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditate-yoga-pose",
  },
  {
    title: "Morning Mindfulness",
    description: "Start your day calm, centered, and ready for opportunities",
    image: morningImage,
    link: "/meditate-morning-mindfulness",
  },
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditate-evening-relaxation",
  },
];

// Enhanced affirmations list
const affirmations = [
  "I am calm, focused, and ready to take on the day.",
  "I attract positive energy and opportunities into my life.",
  "I am confident in my abilities and decisions.",
  "I radiate love, peace, and harmony.",
  "I deserve success, happiness, and abundance.",
  "I let go of what I can't control and trust the process.",
  "Every day, I grow stronger, wiser, and more grounded.",
  "I am worthy of love, respect, and kindness.",
  "I release stress and embrace inner calm.",
  "I trust my intuition and follow my inner guidance.",
  "I am worthy of love, success, and happiness.",
  "I trust the journey I am on.",
  "I release what I cannot control and focus on what I can.",
  "I attract positive energy into my life.",
  "I am strong, confident, and resilient.",
  "I choose peace over worry.",
  "I am grateful for the blessings in my life.",
  "I believe in myself and my abilities.",
  "I radiate positivity and kindness.",
  "I am open to new opportunities.",
  "I let go of doubts and embrace confidence.",
  "I deserve success and abundance.",
  "I am present in this moment.",
  "I choose to see challenges as opportunities to grow.",
  "I am proud of who I am becoming.",
  "I attract supportive and loving people into my life.",
  "I am calm, patient, and at peace.",
  "I forgive myself and release past mistakes.",
  "I trust the timing of my life.",
  "I welcome love, joy, and abundance every day.",
  "I am aligned with my purpose.",
  "I choose happiness in every situation.",
  "I am healthy, vibrant, and full of energy.",
  "I focus on progress, not perfection.",
  "I am resilient and can handle whatever comes my way.",
  "I am confident in my decisions.",
  "I let go of fear and embrace courage.",
  "I am worthy of financial abundance.",
  "I am constantly growing and evolving.",
  "I create space for peace and clarity in my life.",
  "I love and accept myself fully.",
  "I wake up each day with purpose and gratitude.",
  "I spread light and positivity to those around me.",
  "I am a magnet for good things.",
  "I attract opportunities that align with my goals.",
];

const Affirmations = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Pick an affirmation of the day based on date
  useEffect(() => {
  const randomIdx = Math.floor(Math.random() * affirmations.length);
  setIndex(randomIdx);
	}, []);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % affirmations.length);
      setIsAnimating(false);
    }, 300);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-4 pb-10">
        <div className="pt-24 max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80 mb-4" />
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-pink-500 mr-2" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                Daily Affirmations
              </h1>
              <Heart className="w-8 h-8 text-pink-500 ml-2" />
            </div>
            <div className="mb-4">
              <span className="text-lg text-gray-600 font-medium">{getGreeting()}! </span>
              <span className="text-gray-500">Transform your mindset with positive thoughts</span>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-auto"></div>
          </div>

          {/* Main Affirmation Section */}
          <div className="relative mb-12">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
              {/* Floating animation elements */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  animate={{ y: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 left-4 w-4 h-4 bg-pink-300 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [10, -10, 10], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 right-8 w-3 h-3 bg-rose-300 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [-8, 8, -8], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-8 left-1/4 w-2 h-2 bg-orange-300 rounded-full blur-sm"
                />
              </div>

              {/* Central breathing animation */}
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300/30 to-rose-400/30 blur-sm"></div>
                </motion.div>
              </div>

              {/* Affirmation Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={affirmations[index]}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center mb-8"
                >
                  <div className="relative">
                    <span className="absolute -top-4 -left-4 text-6xl text-pink-300 opacity-50 font-serif">"</span>
                    <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 leading-relaxed px-8 italic">
                      {affirmations[index]}
                    </p>
                    <span className="absolute -bottom-8 -right-4 text-6xl text-pink-300 opacity-50 font-serif">"</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                >
                  <span className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5" />
                    <span>New Affirmation</span>
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </motion.button>
              </div>

              {/* Affirmation counter */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  
                </p>
                <div className="flex justify-center mt-2">
                  <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
                      style={{ width: `${((index + 1) / affirmations.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 grid md:grid-cols-2 gap-6 mb-6"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
                How to Use Affirmations
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Repeat your affirmation 3-5 times</li>
                <li>• Say it with conviction and feeling</li>
                <li>• Visualize the affirmation being true</li>
                <li>• Practice daily for best results</li>
              </ul>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Heart className="w-5 h-5 text-rose-500 mr-2" />
                Best Times to Practice
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• First thing in the morning</li>
                <li>• Before important events</li>
                <li>• During meditation sessions</li>
                <li>• Before sleep for positive dreams</li>
              </ul>
            </div>
          </motion.div>

          {/* Explore More Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Explore More Meditation Practices
              </h2>
              <p className="text-gray-600">
                Discover other ways to cultivate mindfulness and inner peace
              </p>
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <ImageSwiper 
                meditationOptions={meditationOptions}
                className="shadow-lg"
              />
            </div>
          </motion.div>


        </div>
      </main>
    </div>
  );
};

export default Affirmations;