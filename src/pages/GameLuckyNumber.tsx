import { useState } from "react";
import { Helmet } from "@/lib/helmet-shim";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
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
  { label: "Lucky Numbers Generator" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditation/yoga",
  },
  {
    title: "Daily Affirmations",
    description: "Repeat a daily phrase to boost confidence, luck, and clarity",
    image: affirmationImage,
    link: "/meditation/daily-affirmation",
  },
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditation/visualization-exercises",
  },
  {
    title: "Morning Mindfulness",
    description: "Start your day calm, centered, and ready for opportunities",
    image: morningImage,
    link: "/meditation/morning-mindfulness",
  },
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditation/evening-relaxation",
  },
];

const LuckyNumbersGenerator = () => {
  const [numbersToGenerate, setNumbersToGenerate] = useState(6);
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(49);
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNumbers = () => {
    setIsGenerating(true);
    setLuckyNumbers([]); // Clear numbers for a fresh animation

    // Validate inputs
    const numToGen = parseInt(numbersToGenerate);
    const minVal = parseInt(minRange);
    const maxVal = parseInt(maxRange);

    if (numToGen > (maxVal - minVal + 1) || numToGen <= 0 || minVal > maxVal) {
      // Replaced alert with a simple console log for user feedback
      console.log("Invalid input: Please check your numbers and range.");
      setIsGenerating(false);
      return;
    }

    const generatedNumbers = new Set();
    while (generatedNumbers.size < numToGen) {
      const newNumber = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      generatedNumbers.add(newNumber);
    }

    // Sort the numbers for a clean display
    const sortedNumbers = Array.from(generatedNumbers).sort((a, b) => a - b);

    // Stagger the animation of each number appearing
    sortedNumbers.forEach((num, index) => {
      setTimeout(() => {
        setLuckyNumbers(prev => [...prev, num]);
        if (index === sortedNumbers.length - 1) {
          setIsGenerating(false);
        }
      }, index * 200); // 200ms delay between each number appearing
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Helmet>
        <title>Lucky Numbers Generator - Find Your Lucky Numbers | Feng Shui & Beyond</title>
        <meta name="description" content="Generate your personalized lucky numbers based on numerology and astrology. Discover numbers that align with your birth date and zodiac energy." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/games-fun/lucky-numbers-generator" />
      </Helmet>
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mb-4">Lucky Numbers Generator</h1>
          <p className="text-black/80 mb-6">
            Feeling lucky? Generate your own set of lucky numbers for games, lotteries, or any special occasion.
          </p>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-10">
          
          {/* Input Box */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-center">
              <div className="flex flex-col items-start w-full">
                <label htmlFor="num-count" className="text-sm font-semibold text-gold mb-1">
                  How many numbers?
                </label>
                <input
                  id="num-count"
                  type="number"
                  value={numbersToGenerate}
                  onChange={(e) => setNumbersToGenerate(e.target.value)}
                  className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-gold transition"
                  min="1"
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="min-range" className="text-sm font-semibold text-gold mb-1">
                  Min. Range
                </label>
                <input
                  id="min-range"
                  type="number"
                  value={minRange}
                  onChange={(e) => setMinRange(e.target.value)}
                  className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-gold transition"
                  min="1"
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="max-range" className="text-sm font-semibold text-gold mb-1">
                  Max. Range
                </label>
                <input
                  id="max-range"
                  type="number"
                  value={maxRange}
                  onChange={(e) => setMaxRange(e.target.value)}
                  className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-gold transition"
                  min={minRange + 1}
                />
              </div>
            </div>
            <Button
              variant="gold"
              size="lg"
              onClick={handleGenerateNumbers}
              disabled={isGenerating}
              className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
            >
              {isGenerating ? "Generating..." : "Generate My Lucky Numbers"}
              <Wand2 size={20} className="ml-2 text-gold" />
            </Button>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {luckyNumbers.length > 0 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-6"
              >
                <h2 className="text-2xl font-bold text-gold text-center">
                  Your Lucky Numbers
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <AnimatePresence>
                    {luckyNumbers.map((number, index) => (
                      <motion.div
                        key={number}
                        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-yellow-300 text-black text-2xl font-bold shadow-xl border-2 border-gold"
                      >
                        {number}
                      </motion.div>
                    ))}
                  </AnimatePresence>
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

export default LuckyNumbersGenerator;