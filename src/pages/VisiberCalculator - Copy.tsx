import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Share2 } from "lucide-react";
import VisiberCalculatorResultModal from "./VisiberCalculatorResultModal";

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
  const year = date.getFullYear().toString(); // "1990"
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // "05"
  const day = date.getDate().toString().padStart(2, "0"); // "26"

  const digits = (year + month + day).split("").map(Number); // [1,9,9,0,0,5,2,6]

  let sum = digits.reduce((a, b) => a + b, 0); // 32

  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b);
  }

  return sum; // 5 ✅
}

const VisiberCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [visiberNumber, setVisiberNumber] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;
    const result = calculateVisiberNumber(birthDate);
    setVisiberNumber(result);
    setCopied(false);
    setShowModal(true);
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

      <main className="pt-28 px-1 pb-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gold">
            Visiber Number Calculator
          </h1>

          <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
            <Info size={20} className="text-gold mt-1 shrink-0" />
            <p className="text-left">
              Visiber is a life philosophy system founded by Datuk Patrick Tan and Datuk David Hew, based on the belief that every aspect of a person's life can be explained through numbers. The name "Visiber" comes from "Vision" and "Number", symbolizing the idea that with a clear vision and understanding of one’s numbers, a person can achieve personal growth and success. Using your birth date, Visiber reveals a unique numeric pattern that reflects your personality, strengths, and life path.
            </p>
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

<VisiberCalculatorResultModal
  open={showModal}
  onClose={() => setShowModal(false)}
  birthDate={birthDate as Date}
  resultNumber={visiberNumber ?? 0}
/>
    </div>
  );
};

export default VisiberCalculator;
