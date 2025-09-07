import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { label: "Daily Affirmations" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditate-yoga-pose",
  },
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditate-visualization",
  },
  {
    title: "Morning Mindfulness",
    description: "Start your day calm, centered, and ready for opportunities",
    image: morningImage,
    link: "/meditate-morning",
  },
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditate-evening",
  },
];

// Example affirmations list
const affirmations = [
  "I am calm, focused, and ready to take on the day.",
  "I attract positive energy and opportunities into my life.",
  "I am confident in my abilities and decisions.",
  "I radiate love, peace, and harmony.",
  "I deserve success, happiness, and abundance.",
  "I let go of what I can’t control and trust the process.",
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

  // Pick an affirmation of the day based on date
  useEffect(() => {
    const today = new Date();
    const idx = today.getDate() % affirmations.length;
    setIndex(idx);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <main className="flex-grow pt-6 px-4 pb-10">
		<div className="pt-24 max-w-3xl mx-auto">
			<Breadcrumb items={breadcrumbs} className="text-black/80 mb-4" />
			<h1 className="text-2xl font-bold text-yellow-600 mb-4">
            Daily Affirmations
			</h1>
			<p className="text-black/80 mb-6">
            Empower your day with a positive thought. Each affirmation helps you
            reframe your mindset and focus on growth, confidence, and peace.
			</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={affirmations[index]}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-8"
            >
              <p className="text-lg md:text-xl font-semibold text-yellow-700 italic">
                “{affirmations[index]}”
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            <Button
              variant="gold"
              size="lg"
              className="px-8 h-14 text-lg font-semibold border border-yellow-500"
              onClick={handleNext}
            >
              Show Another
            </Button>
          </div>
		  
		  {/* Explore More Features Section using ImageSwiper */}
          <div className="mt-16 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
              Explore Other Meditation Exercises
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Swipe through our meditation options to find your perfect practice
            </p>
            <div className="w-full max-w-2xl mx-auto">
              <ImageSwiper 
                meditationOptions={meditationOptions}
                className="shadow-lg"
              />
            </div>
          </div>
		  
        </div>
      </main>
    </div>
  );
};

export default Affirmations;
