import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
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
  { label: "Games & Fun", path: "/games-fun" },
  { label: "Name Compatibility" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Daily Affirmations",
    description: "Repeat a daily phrase to boost confidence, luck, and clarity",
    image: affirmationImage,
    link: "/meditate-affirmation",
  },
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditate-visualization",
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
    link: "/meditate-morning",
  },
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditate-evening",
  },
];

const compatibilityMessages = {
  90: "A cosmic connection! Your names resonate with perfect harmony.",
  70: "Destined for greatness! Your bond is strong and full of positive energy.",
  50: "A good match with room to grow. You bring out the best in each other.",
  30: "An interesting pair! Your differences might be a source of strength.",
  0: "The stars are just getting to know you. The future is unwritten!",
};

const NameCompatibility = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [compatibilityMessage, setCompatibilityMessage] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCompatibility = (n1, n2) => {
    // Basic, non-scientific name compatibility algorithm for fun
    const cleanName1 = n1.toLowerCase().replace(/[^a-z]/g, "");
    const cleanName2 = n2.toLowerCase().replace(/[^a-z]/g, "");

    if (!cleanName1 || !cleanName2) {
      return 0;
    }

    // Get unique letters from each name
    const uniqueLetters1 = new Set(cleanName1.split(""));
    const uniqueLetters2 = new Set(cleanName2.split(""));

    // Find the number of shared letters
    let sharedLettersCount = 0;
    uniqueLetters1.forEach(letter => {
      if (uniqueLetters2.has(letter)) {
        sharedLettersCount++;
      }
    });

    // Find the total number of unique letters across both names
    const allUniqueLetters = new Set([...uniqueLetters1, ...uniqueLetters2]);
    const totalUniqueLetters = allUniqueLetters.size;

    // Calculate a score
    const score = Math.round((sharedLettersCount / totalUniqueLetters) * 100);
    return score;
  };

  const getMessageFromScore = (score) => {
    if (score >= 90) return compatibilityMessages[90];
    if (score >= 70) return compatibilityMessages[70];
    if (score >= 50) return compatibilityMessages[50];
    if (score >= 30) return compatibilityMessages[30];
    return compatibilityMessages[0];
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setCompatibilityScore(null);
    setCompatibilityMessage("");

    // Simulate a brief delay for the 'Calculating...' state
    setTimeout(() => {
      const score = calculateCompatibility(name1, name2);
      const message = getMessageFromScore(score);
      setCompatibilityScore(score);
      setCompatibilityMessage(message);
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mb-4">Name Compatibility</h1>
          <p className="text-black/80 mb-6">
            Discover the cosmic bond between two names! Enter two names below to find out your unique compatibility score.
          </p>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-10">

          {/* Input Box */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-center">
              <div className="flex flex-col items-start w-full">
                <label htmlFor="name1" className="text-sm font-semibold text-gold mb-1">
                  Your Name
                </label>
                <input
                  id="name1"
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg text-center focus:outline-none focus:ring-2 focus:ring-gold transition"
                  placeholder="Enter your name..."
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="name2" className="text-sm font-semibold text-gold mb-1">
                  Partner's Name
                </label>
                <input
                  id="name2"
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg text-center focus:outline-none focus:ring-2 focus:ring-gold transition"
                  placeholder="Enter their name..."
                />
              </div>
            </div>
            <Button
			  variant="gold"
              onClick={handleCalculate}
              disabled={isCalculating || !name1 || !name2}
              className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
            >
              {isCalculating ? "Calculating..." : "Calculate My Compatibility"}
              <HeartHandshake size={20} className="ml-2" />
            </Button>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {compatibilityScore !== null && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-6"
              >
                <h2 className="text-2xl font-bold text-gold text-center">
                  Your Compatibility Score
                </h2>
                <div className="flex flex-col items-center justify-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-yellow-300 text-black text-5xl font-bold shadow-xl border-2 border-gold"
                  >
                    {compatibilityScore}
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-lg text-black/80 font-medium text-center"
                  >
                    {compatibilityMessage}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
		  
          {/* Explore More Features Section using ImageSwiper */}
          <div className="mt-16 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
              Explore Our Meditation Page
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

export default NameCompatibility;