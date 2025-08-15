import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import zodiacData from "@/data/zodiacData2025";
import Breadcrumb from "@/components/Breadcrumb";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Chinese Zodiac Calculator" },
];

// Zodiac images
import ratImg from "@/assets/zodiac/rat.png";
import oxImg from "@/assets/zodiac/ox.png";
import tigerImg from "@/assets/zodiac/tiger.png";
import rabbitImg from "@/assets/zodiac/rabbit.png";
import dragonImg from "@/assets/zodiac/dragon.png";
import snakeImg from "@/assets/zodiac/snake.png";
import horseImg from "@/assets/zodiac/horse.png";
import goatImg from "@/assets/zodiac/goat.png";
import monkeyImg from "@/assets/zodiac/monkey.png";
import roosterImg from "@/assets/zodiac/rooster.png";
import dogImg from "@/assets/zodiac/dog.png";
import pigImg from "@/assets/zodiac/pig.png";

interface ZodiacInfo {
  image: string;
  traits: string;
  yearAnalysis: string;
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

const ChineseZodiacCalculator = () => {
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (!birthYear || birthYear < 1900 || birthYear > 2100) return;
    const zodiacIndex = (birthYear - 4) % 12;
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
    setZodiacInfo(zodiacData[sign]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Header />
	   <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">Chinese Zodiac Calculator</h1>
		</div>
			<div className="max-w-3xl mx-auto text-center space-y-10">
			{/* Summary Box */}
			<div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
              <Info size={20} className="text-gold mt-1 shrink-0" />
              <div className="text-left">
                <p>
                  The Chinese Zodiac (生肖, Shēngxiào) is a 12-year cycle where
                  each year is associated with a specific animal sign and its
                  unique personality traits. It is a fundamental part of
                  traditional Chinese astrology and influences beliefs about
                  destiny, character, compatibility, and fortune.
                </p>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-2 text-gold hover:underline text-xs font-medium"
                >
                  {showMore ? "Hide Details" : "View More"}
                </button>
              </div>
            </div>

			{/* Additional Info */}
            {showMore && (
              <div className="bg-black/40 text-white/90 text-sm p-4 rounded-xl border border-gold/26 text-left">
                <p className="mb-2">
                  Each animal in the Chinese Zodiac is associated with certain
                  traits and characteristics. These beliefs have been passed
                  down for generations and are still widely embraced today.
                </p>
                <p className="mb-2">
                  For example, those born in the year of the Dragon are said to
                  be confident and ambitious, while Rabbits are known to be
                  gentle and compassionate.
                </p>
                <p>
                  The Zodiac also plays a role in compatibility, career paths,
                  and even feng shui practices. It is one of the oldest systems
                  still used in modern Eastern astrology.
                </p>
              </div>
            )}
          </div>

          
		  <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-gold/20">
			{/* Year-only input */}
			<Input
			placeholder="Enter your birth year (e.g. 1992)"
			value={birthYear || ""}
			onChange={(e) => setBirthYear(Number(e.target.value))}
			className="bg-black text-white "
			/>
			
			<Button onClick={handleCalculate} className="bg-gold text-black hover:opacity-90 mt-4">
				Calculate My Zodiac
			</Button>
		  </div>

          
          {zodiacSign && zodiacInfo && (
            <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-gold/20 shadow-inner">
              <h2 className="text-3xl font-semibold text-white">
                Your Chinese Zodiac Sign is:{" "}
                <span className="text-gold">{zodiacSign}</span>
              </h2>

              <img
                src={zodiacImages[zodiacSign]}
                alt={zodiacSign}
                className="w-40 h-40 mx-auto object-contain"
              />

              <div>
                <h3 className="text-xl font-semibold text-gold mb-2">
                  Traits of the {zodiacSign}:
                </h3>
                <p className="text-white/90">{zodiacInfo.traits}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gold mb-2">
                  2025 Forecast for {zodiacSign}:
                </h3>
                <p className="text-white/90">{zodiacInfo.yearAnalysis}</p>
              </div>
            </div>
          )}
        </div>
      </main>
	  <Footer />
    </div>
  );
};

export default ChineseZodiacCalculator;
