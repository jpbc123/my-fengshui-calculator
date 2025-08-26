import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Share2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Numerology", path: "/numerology" },
  { label: "Visiber Calculator" },
];

const visiberMeanings: Record<number, string> = {
  1: "Leadership, independence, ambitious",
  2: "Sensitivity, harmony, cooperation",
  3: "Creativity, self-expression, optimism",
  4: "Stability, discipline, organization",
  5: "Freedom, adventure, change",
  6: "Responsibility, care, nurturing",
  7: "Introspection, analysis, spirituality",
  8: "Power, wealth, material success",
  9: "Compassion, wisdom, humanitarianism",
};

const visiberPositiveTraits: Record<number, string> = {
  1: "Leadership skill, independent, goal-getter, righteous, humorous",
  2: "Good communication skills, calm and collected, friendly, matured in thinking",
  3: "Doer, proactive, clarity in thoughts, creative",
  4: "Good in strategizing, intelligent, knowledge-seeker, extrovert, punctual",
  5: "Good sense of direction, curious, good reflexes, loves freedom",
  6: "Wise, artistic, imaginative, strong family values",
  7: "Popular with people, good analytical skills, strong religious faith, lucky",
  8: "Responsible, full of drive, in control of emotions, trustworthy",
  9: "Optimistic, liberal, business-minded, loves to dream",
};

const visiberNegativeTraits: Record<number, string> = {
  1: "Stubborn, self-centered, greedy",
  2: "Indecisive, timid, not assertive, loves to daydream, stubborn",
  3: "Impulsive, bad-tempered, flippant, mischievous",
  4: "Insecure, impatient, overly direct, poor in managing money",
  5: "Stubborn, self-destructive, short-tempered, impatient for improvement",
  6: "Materialistic, egotistic, proud",
  7: "Loves to procrastinate, careless, indecisive",
  8: "Vain, easily worried, oppressed, lack of order when working",
  9: "Emotional, unrealistic, greedy, not meticulous, loner",
};

function calculateVisiberNumber(date: Date): number {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const digits = (year + month + day).split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b);
  }

  return sum;
}

const VisiberCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [visiberNumber, setVisiberNumber] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;
    const result = calculateVisiberNumber(birthDate);
    setVisiberNumber(result);
    setCopied(false);
  };

  const handleShare = () => {
    const text = `My Visiber number is ${visiberNumber} – ${visiberMeanings[visiberNumber!]}!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const breakdown = (() => {
    if (!birthDate) return null;

    const day = birthDate.getDate().toString().padStart(2, "0");
    const month = (birthDate.getMonth() + 1).toString().padStart(2, "0");
    const year = birthDate.getFullYear().toString();

    const birthDigits = [...day, ...month, ...year];

    const sumDigits = (str: string) =>
      str.split("").reduce((sum, d) => sum + parseInt(d), 0);
    const reduceToSingleDigit = (num: number) =>
      num > 9 ? sumDigits(num.toString()) : num;

    const daySum = sumDigits(day);
    const monthSum = sumDigits(month);
    const yearFirstSum = reduceToSingleDigit(sumDigits(year.slice(0, 2)));
    const yearLastSum = reduceToSingleDigit(sumDigits(year.slice(2)));

    const leftMiddleSum = reduceToSingleDigit(daySum + monthSum);
    const rightMiddleSum = reduceToSingleDigit(yearFirstSum + yearLastSum);

    return {
      day,
      month,
      year,
      birthDigits,
      daySum,
      monthSum,
      yearFirstSum,
      yearLastSum,
      leftMiddleSum,
      rightMiddleSum,
    };
  })();

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mb-4">Visiber Calculator</h1>
          <p className="text-black/80 mb-6">
            Unlock the secrets of your personality and life path through <span className="font-semibold">Visiber numerology</span>, a unique system that interprets your birthdate's energetic patterns.
          </p>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-10">
          
          {/* Summary Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <Info size={20} className="text-gold mt-1 shrink-0" />
              <div className="text-left">
                <p>
                  <span className="font-semibold">Visiber</span> is a life philosophy system founded by Datuk Patrick Tan and Datuk David Hew, based on the belief that every aspect of a person's life can be explained through numbers.
                </p>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-2 text-gold hover:underline text-xs font-medium">
                  {showMore ? "View Less" : "View More"}
                </button>
              </div>
            </div>
            
            {/* Additional Info */}
            {showMore && (
              <div className="bg-gray-50 text-black/90 p-4 rounded-xl border border-gray-200 text-left">
                <p className="mb-2">
                  The name <span className="font-semibold">"Visiber"</span> is a combination of "Vision" and "Number", symbolizing the idea that with a clear vision and understanding of one’s numbers, a person can achieve personal growth and success.
                </p>
                <p className="mb-2">
                  Using your birth date, Visiber reveals a unique numeric pattern that reflects your personality, strengths, and life path.
                </p>
                <p>
                  It provides insights into behavior, destiny, and potential obstacles by interpreting the vibration of numbers. Many people use it to guide decisions in relationships, career, and health.
                </p>
              </div>
            )}
          </div>

          {/* Input and Button Box */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
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
                Calculate
              </Button>
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {visiberNumber && breakdown && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gold text-center">
                    Your Character Number: <span className="text-black">{visiberNumber}</span>
                  </h2>
                  <p className="text-black/90 text-lg text-center mt-2">
                    {visiberMeanings[visiberNumber]}
                  </p>
                </div>

                <div className="text-black/70 text-center">
                  <div className="font-bold text-gold mb-2">Breakdown</div>

                  {/* Birthdate Digits */}
                  <div className="flex justify-center flex-wrap gap-1 mb-1">
                    {breakdown.birthDigits.map((digit, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 flex items-center justify-center border border-gold text-black font-mono"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  {/* Triangle Diagram */}
                  <svg
                    viewBox="0 0 380 380"
                    className="mx-auto -mt-10"
                    width="380"
                    height="380"
                  >
                    <polygon
                      points="60,60 320,60 190,320"
                      fill="none"
                      stroke="gold" 
                      strokeWidth="1.6"
                    />
                    <line
                      x1="190"
                      y1="60"
                      x2="190"
                      y2="220"
                      stroke="gold" 
                      strokeWidth="1.3"
                    />
                    <line
                      x1="100"
                      y1="140"
                      x2="280"
                      y2="140"
                      stroke="gold" 
                      strokeWidth="1.3"
                    />
                    <line
                      x1="140"
                      y1="220"
                      x2="240"
                      y2="220"
                      stroke="gold" 
                      strokeWidth="1.3"
                    />

                    {/* Top row */}
                    <text x="118" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                      {breakdown.daySum}
                    </text>
                    <text x="158" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                      {breakdown.monthSum}
                    </text>
                    <text x="222" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                      {breakdown.yearFirstSum}
                    </text>
                    <text x="262" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                      {breakdown.yearLastSum}
                    </text>

                    {/* Middle row */}
                    <text x="155" y="182" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                      {breakdown.leftMiddleSum}
                    </text>
                    <text x="225" y="182" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                      {breakdown.rightMiddleSum}
                    </text>

                    {/* Final number */}
                    <text x="190" y="266" fill="black" fontSize="30" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {visiberNumber}
                    </text>
                  </svg>

                  {/* Traits */}
                  <div className="space-y-4 text-left max-w-lg mx-auto">
                    <div>
                      <h2 className="text-lg font-bold text-gold">Positive Traits</h2>
                      <p className="text-black/90 leading-relaxed">
                        {visiberPositiveTraits[visiberNumber]}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gold">Negative Traits</h2>
                      <p className="text-black/90 leading-relaxed">
                        {visiberNegativeTraits[visiberNumber]}
                      </p>
                    </div>
                  </div>

                  {/* Share Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="mt-8 border-gold text-gold hover:bg-gold hover:text-black transition"
                  >
                    <Share2 size={16} className="mr-2" />
                    {copied ? "Copied!" : "Share My Number"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VisiberCalculator;