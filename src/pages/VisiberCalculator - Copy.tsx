// src/pages/VisiberCalculator.tsx
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Share2 } from "lucide-react";

const visiberMeanings: Record<number, string> = {
  1: "Leadership, independence, ambition",
  2: "Sensitivity, harmony, cooperation",
  3: "Creativity, self-expression, optimism",
  4: "Stability, discipline, organization",
  5: "Freedom, adventure, change",
  6: "Responsibility, care, nurturing",
  7: "Introspection, analysis, spirituality",
  8: "Power, wealth, material success",
  9: "Compassion, wisdom, humanitarianism",
};

function calculateVisiberNumber(date: Date): number {
  const digits = date
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "")
    .split("")
    .map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum;
}

const VisiberCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [visiberNumber, setVisiberNumber] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Global Navigation Header */}
      <Header />

      <main className="pt-20 px-4 pb-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gold">
            Visiber Number Calculator
          </h1>

          <div className="flex justify-center items-center gap-2 text-sm text-white/80">
            <Info size={16} className="text-gold" />
            <span>
              Visiber numbers are derived from your birthdate and reflect your inner traits.
            </span>
          </div>

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

          <AnimatePresence>
            {visiberNumber && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10 space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gold">
                  Your Visiber Number: {visiberNumber}
                </h2>
                <p className="text-white/90 text-lg">
                  {visiberMeanings[visiberNumber]}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="mt-4 border-gold text-gold hover:bg-gold hover:text-black transition"
                >
                  <Share2 size={16} className="mr-2" />
                  {copied ? "Copied!" : "Share My Number"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default VisiberCalculator;
