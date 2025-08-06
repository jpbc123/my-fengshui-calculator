// src/pages/PersonalElement.tsx
import { useState } from "react";
import Header from "@/components/Header";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const heavenlyStems = [
  "Jia", "Yi", "Bing", "Ding", "Wu",
  "Ji", "Geng", "Xin", "Ren", "Gui"
];

const elementByHeavenlyStem: Record<string, string> = {
  Jia: "Wood",
  Yi: "Wood",
  Bing: "Fire",
  Ding: "Fire",
  Wu: "Earth",
  Ji: "Earth",
  Geng: "Metal",
  Xin: "Metal",
  Ren: "Water",
  Gui: "Water",
};

const elementDescriptions: Record<string, string> = {
  Wood: "Wood people are creative, kind-hearted, and strong-willed. They value growth, compassion, and collaboration.",
  Fire: "Fire people are passionate, charismatic, and ambitious. They have strong leadership qualities and love being in the spotlight.",
  Earth: "Earth people are stable, reliable, and nurturing. They bring harmony, support, and practicality into their surroundings.",
  Metal: "Metal people are disciplined, righteous, and focused. They pursue excellence and have a strong sense of justice.",
  Water: "Water people are intuitive, wise, and flexible. They adapt well and value wisdom, communication, and philosophy.",
};

export default function PersonalElement() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [result, setResult] = useState<{
    stem: string;
    element: string;
    description: string;
  } | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;

    const year = birthDate.getFullYear();
    const stemIndex = (year - 4) % 10;
    const stem = heavenlyStems[stemIndex];
    const element = elementByHeavenlyStem[stem];
    const description = elementDescriptions[element];

    setResult({ stem, element, description });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-28 px-1 pb-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gold">Personal Element Analysis</h1>

          {/* Expandable Info Box */}
          <div className="flex flex-col gap-2">
            {/* Summary Box */}
            <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
              <Info size={20} className="text-gold mt-1 shrink-0" />
              <div className="text-left">
                <p>
                  Your Personal Element is derived from the heavenly stem of your birth year and reflects your intrinsic character and destiny. It plays a key role in Feng Shui, Five Elements theory, and classical Chinese metaphysics.
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
                  The Five Elements (Wu Xing 五行) — Wood, Fire, Earth, Metal, and Water — are essential to Chinese metaphysics, philosophy, and medicine.
                </p>
                <p>• Each person is born under a heavenly stem tied to one of these five elements.</p>
                <p>• Your element affects your strengths, personality, and compatibility with others and spaces.</p>
                <p className="mb-2">
                  This concept is often used alongside the Four Pillars (BaZi), Feng Shui, and health practices to guide life decisions, career paths, and relationships.
                </p>
                <p className="mb-2">
                  Understanding your personal element can help you create more balance and alignment in your home, work, and lifestyle.
                </p>
              </div>
            )}
          </div>

          {/* Input and Button Box */}
          <div className="bg-white/10 backdrop-blur-md border border-gold/30 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
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

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-xl bg-gold/10 border border-gold/30 text-left"
            >
              <h2 className="text-xl font-bold text-gold mb-2">Your Element: {result.element}</h2>
              <p className="text-white/90 text-sm mb-2">
                <strong>Heavenly Stem:</strong> {result.stem}
              </p>
              <p className="text-white/90 text-sm mb-2">
                <strong>Element:</strong> {result.element}
              </p>
              <p className="text-white/90 text-sm">{result.description}</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
