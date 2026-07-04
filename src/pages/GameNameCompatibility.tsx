import { useState } from "react";
import { Helmet } from "@/lib/helmet-shim";
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
    link: "/meditation/daily-affirmation",
  },
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditation/visualization-exercises",
  },
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditation/yoga",
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
      <Helmet>
        <title>Name Compatibility Calculator - Love Match | Feng Shui & Beyond</title>
        <meta name="description" content="Check your name compatibility with your partner. Our free name compatibility calculator reveals the harmony between two names using numerology principles." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/games-fun/name-compatibility" />
      </Helmet>
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
		  
          {/* Evergreen SEO content — always rendered in the static HTML */}
          <section className="text-left mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gold mb-4">
              How the Name Compatibility Calculator Works
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              Our free name compatibility calculator compares two names and reveals a fun compatibility score for
              love, friendship, or any relationship. It looks at the letters the two names share and how they
              harmonise, turning that into a percentage. Enter your name and your partner's, crush's, or best
              friend's name to see how your names click — no birth dates required.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              Names, Numerology, and Compatibility
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              The idea that names carry energy is ancient. In <strong>numerology</strong>, each letter maps to a
              number, and adding them up produces an "Expression" or "Destiny" number believed to reflect a
              person's character. When two names are compared, their letters and vibrations can feel harmonious or
              contrasting — which is the playful principle behind name-matching. It is a lighthearted way to explore
              connection, not a scientific measurement.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              What Your Compatibility Score Means
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-10">
              {[
                { range: "90–100%", label: "Cosmic Connection", desc: "Your names resonate in near-perfect harmony — a rare and radiant match." },
                { range: "70–89%", label: "Strong Bond", desc: "Plenty of positive energy and natural chemistry between your names." },
                { range: "50–69%", label: "Room to Grow", desc: "A promising match that blossoms with understanding and effort." },
                { range: "Below 50%", label: "Opposites Attract", desc: "Your differences could be exactly what makes the connection interesting." },
              ].map((s) => (
                <div key={s.range} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-bold text-black mb-1">{s.label}</h3>
                  <p className="text-xs font-semibold text-gold mb-2">{s.range}</p>
                  <p className="text-sm text-black/70 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Is name compatibility real?</h3>
                <p className="text-black/70 leading-relaxed">
                  It is a fun, entertainment-based tool rooted in numerology traditions — not scientific proof of a
                  relationship's success. Enjoy it as a playful conversation starter rather than a verdict.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Should I use full names or nicknames?</h3>
                <p className="text-black/70 leading-relaxed">
                  Try both! Numerology traditions often use the full birth name, but comparing the names you
                  actually call each other can be just as fun and revealing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Can I check compatibility for friends?</h3>
                <p className="text-black/70 leading-relaxed">
                  Definitely. The calculator works for any pair of names — partners, crushes, friends, or family
                  members.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/games-fun/western-zodiac-compatibility" className="text-gold font-semibold hover:underline">
                Try zodiac compatibility →
              </Link>
              <Link to="/numerology/visiber-calculator" className="text-gold font-semibold hover:underline">
                Explore your numerology →
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

export default NameCompatibility;