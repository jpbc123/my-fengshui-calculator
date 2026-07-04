import { useState } from "react";
import { Helmet } from "@/lib/helmet-shim";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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

          {/* Evergreen SEO content — always rendered in the static HTML */}
          <section className="text-left mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gold mb-4">
              How the Lucky Numbers Generator Works
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              Our free lucky numbers generator picks a set of random numbers within the range you choose — perfect
              for lottery tickets, raffles, bingo, picking a winner, or simply adding a little fortune to your day.
              Set how many numbers you want and the minimum and maximum range, then generate as many fresh sets as
              you like. Every draw is independent and random, so no two sets are ever guaranteed to repeat.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              What Makes a Number "Lucky"?
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              Across cultures, certain numbers carry special meaning. In Chinese culture, <strong>8</strong> is the
              luckiest number (it sounds like "prosperity"), while <strong>9</strong> symbolises longevity and{" "}
              <strong>6</strong> means smooth progress. In Western numerology, <strong>7</strong> is the classic
              lucky number tied to intuition and spirituality, and <strong>3</strong> represents joy and creativity.
              Lucky numbers can also come from meaningful dates — a birthday, an anniversary, or the day something
              wonderful happened to you.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              How to Find Your Personal Lucky Number
            </h2>
            <p className="text-black/80 leading-relaxed mb-3">
              In numerology, your <strong>Life Path number</strong> is one of your most personal lucky numbers. To
              find it, add up all the digits of your full birth date and reduce to a single digit. For example, a
              birthday of <em>14 March 1990</em> becomes 1+4+3+1+9+9+0 = 27, then 2+7 = <strong>9</strong>. Many
              people also treat their birth day, house number, or a repeating "angel number" they keep noticing as
              lucky.
            </p>
            <ul className="list-disc list-inside space-y-2 text-black/80 mb-8">
              <li><strong>Life Path number</strong> — reduce your full birth date to a single digit.</li>
              <li><strong>Birth day number</strong> — the day of the month you were born.</li>
              <li><strong>Zodiac lucky numbers</strong> — each sign has its own traditional favourites.</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Are these numbers truly random?</h3>
                <p className="text-black/70 leading-relaxed">
                  Yes — each set is generated randomly within the range you set, with no duplicates in a single
                  draw. It works just like drawing numbered balls from a bag.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Can I use this for lottery numbers?</h3>
                <p className="text-black/70 leading-relaxed">
                  Absolutely. Set the count and range to match your game (for example, 6 numbers from 1 to 49) and
                  generate a quick pick. Remember that all lottery outcomes are pure chance — play responsibly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">How do I make my numbers more meaningful?</h3>
                <p className="text-black/70 leading-relaxed">
                  Combine the generator with your personal lucky numbers — your Life Path number, birthday, or a
                  culturally lucky digit like 8 — for a set that feels uniquely yours.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/numerology/visiber-calculator" className="text-gold font-semibold hover:underline">
                Explore your numerology chart →
              </Link>
              <Link to="/games-fun" className="text-gold font-semibold hover:underline">
                More games &amp; fun tools →
              </Link>
            </div>
          </section>

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