import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ChineseZodiacData2025 } from "@/data/ChineseZodiacData2025";
import Breadcrumb from "@/components/Breadcrumb";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Zodiac images
import ratImg from "@/assets/chinese-zodiac/year-of-the-rat.png";
import oxImg from "@/assets/chinese-zodiac/year-of-the-ox.png";
import tigerImg from "@/assets/chinese-zodiac/year-of-the-tiger.png";
import rabbitImg from "@/assets/chinese-zodiac/year-of-the-rabbit.png";
import dragonImg from "@/assets/chinese-zodiac/year-of-the-dragon.png";
import snakeImg from "@/assets/chinese-zodiac/year-of-the-snake.png";
import horseImg from "@/assets/chinese-zodiac/year-of-the-horse.png";
import goatImg from "@/assets/chinese-zodiac/year-of-the-goat.png";
import monkeyImg from "@/assets/chinese-zodiac/year-of-the-monkey.png";
import roosterImg from "@/assets/chinese-zodiac/year-of-the-rooster.png";
import dogImg from "@/assets/chinese-zodiac/year-of-the-dog.png";
import pigImg from "@/assets/chinese-zodiac/year-of-the-pig.png";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Chinese Zodiac Calculator" },
];

interface ZodiacInfo {
  image?: string;
  traits: string;
  yearAnalysis: string;
  compatibility?: string;
  luckyNumbers?: string;
  luckyColors?: string;
  luckyDirections?: string;
  careerAdvice?: string;
  fengShuiTips?: string;
  personalityInsights?: string;
}

const zodiacImages: { [key: string]: string } = {
  Rat: ratImg,
  Ox: oxImg,
  Tiger: tigerImg,
  Rabbit: rabbitImg,
  Dragon: dragonImg,
  Snake: snakeImg,
  Horse: horseImg,
  Goat: goatImg,
  Monkey: monkeyImg,
  Rooster: roosterImg,
  Dog: dogImg,
  Pig: pigImg,
};

// Chinese New Year dates for range of years
const chineseNewYearDates: Record<number, string> = {
  2024: "2024-02-10",
  2025: "2025-01-29",
  2026: "2026-02-17",
  2027: "2027-02-06",
  2028: "2028-01-26",
  // add more as needed...
};

const ChineseZodiacCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;

    const year = birthDate.getFullYear();
    const cnyString = chineseNewYearDates[year] || null;

    let zodiacYear = year;
    if (cnyString) {
      const cnyDate = new Date(cnyString + "T00:00:00");
      if (birthDate < cnyDate) {
        zodiacYear = year - 1;
      }
    }

    const zodiacIndex = (zodiacYear - 4) % 12;
    const sign = [
      "Rat",
      "Ox",
      "Tiger",
      "Rabbit",
      "Dragon",
      "Snake",
      "Horse",
      "Goat",
      "Monkey",
      "Rooster",
      "Dog",
      "Pig",
    ][zodiacIndex];

    setZodiacSign(sign);
    setZodiacInfo(ChineseZodiacData2025[sign]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* Left side - Calculator and Results */}
            <div className="max-w-xl">
              {/* Breadcrumbs + title */}
              <div className="mb-8">
                <Breadcrumb items={breadcrumbs} className="text-black/80" />
                <h1 className="text-2xl font-bold text-gold mt-4 mb-6">
                  Chinese Zodiac Calculator
                </h1>
                <p className="text-black/80 mb-6">
                  Find your <span className="font-semibold">Chinese Zodiac</span> animal to discover your personality traits, strengths, and compatibility.
                </p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <h2 className="sr-only">Chinese Zodiac Information</h2>
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      The <span className="font-semibold">Chinese Zodiac (生肖, Shēngxiào)</span> is a 12-year cycle based on the traditional Chinese lunar calendar, where each year is associated with a specific animal sign and its unique personality traits.
                    </p>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-2 text-gold hover:underline text-xs font-medium"
                    >
                      {showMore ? "Hide Details" : "View More"}
                    </button>
                  </div>
                </div>

                {showMore && (
                  <div className="bg-gray-50 text-black/90 p-4 rounded-xl border border-gray-200 text-left">
                    <p className="mb-2">
                      Each animal in the Chinese Zodiac is linked to certain characteristics. For example, those born in the year of the <span className="font-semibold">Dragon</span> are said to be confident and ambitious, while <span className="font-semibold">Rabbits</span> are gentle and compassionate.
                    </p>
                    <p className="mb-2">
                      Because the Chinese zodiac follows the <span className="font-semibold">lunar calendar</span>, the zodiac year does not start on January 1 but rather on <span className="font-semibold">Chinese New Year</span>, which usually falls between late January and mid-February. This means your zodiac sign depends on both your <span className="font-semibold">birth date</span> and the exact start of the <span className="font-semibold">lunar year</span>.
                    </p>
                    <p>
                      The Chinese Zodiac also plays a role in <span className="font-semibold">compatibility</span>, <span className="font-semibold">career paths</span>, and <span className="font-semibold">feng shui practices</span>.
                    </p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <DatePickerInput
                    date={birthDate}
                    onDateChange={setBirthDate}
                    placeholder="Enter your birthdate"
                  />
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleCalculate}
                    disabled={!birthDate}
                    className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
                  >
                    Calculate Chinese Zodiac
                  </Button>
                </div>
              </div>

              {/* Result */}
              {zodiacSign && zodiacInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left"
                >
                  <h2 className="text-2xl font-bold text-gold mb-4 text-center">
                    Your Chinese Zodiac Sign is: <span className="text-black">{zodiacSign}</span>
                  </h2>

                  <img
                    src={zodiacImages[zodiacSign]}
                    alt={zodiacSign}
                    className="w-40 h-40 mx-auto object-contain"
                  />
                  <div className="flex flex-col gap-4 mt-8">
                    {zodiacInfo.traits && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Traits:</h3>
                        <p className="text-black/80">{zodiacInfo.traits}</p>
                      </div>
                    )}
                    {zodiacInfo.yearAnalysis && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">2025 Forecast:</h3>
                        <p className="text-black/80">{zodiacInfo.yearAnalysis}</p>
                      </div>
                    )}
                    {zodiacInfo.compatibility && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Compatibility:</h3>
                        <p className="text-black/80">{zodiacInfo.compatibility}</p>
                      </div>
                    )}
                    {zodiacInfo.luckyNumbers && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Lucky Numbers:</h3>
                        <p className="text-black/80">{zodiacInfo.luckyNumbers}</p>
                      </div>
                    )}
                    {zodiacInfo.luckyColors && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Lucky Colors:</h3>
                        <p className="text-black/80">{zodiacInfo.luckyColors}</p>
                      </div>
                    )}
                    {zodiacInfo.luckyDirections && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Lucky Directions:</h3>
                        <p className="text-black/80">{zodiacInfo.luckyDirections}</p>
                      </div>
                    )}
                    {zodiacInfo.careerAdvice && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Career Advice:</h3>
                        <p className="text-black/80">{zodiacInfo.careerAdvice}</p>
                      </div>
                    )}
                    {zodiacInfo.fengShuiTips && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Feng Shui Tips:</h3>
                        <p className="text-black/80">{zodiacInfo.fengShuiTips}</p>
                      </div>
                    )}
                    {zodiacInfo.personalityInsights && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Personality Insights:</h3>
                        <p className="text-black/80">{zodiacInfo.personalityInsights}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 pt-4 border-t border-gray-300 text-center">
                    <Link to={`/zodiac/${zodiacSign.toLowerCase()}`} className="text-sm font-semibold text-black/80 hover:text-gold hover:underline">
                      Discover Your Daily Chinese Horoscope →
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right side - related articles */}
            <div className="max-w-md mt-40 lg:mt-0">
              <h2 className="text-xl font-semibold text-black mb-4">Related Articles</h2>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-black/80 hover:text-gold">Feng Shui for Beginners: The Basics</Link></li>
                <li><Link to="#" className="text-black/80 hover:text-gold">Balancing the Five Elements in Your Home</Link></li>
                <li><Link to="#" className="text-black/80 hover:text-gold">Discover Your Personal Element</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChineseZodiacCalculator;