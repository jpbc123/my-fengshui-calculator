import { useState } from "react";
import Header from "@/components/Header";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion } from "framer-motion";

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

const PersonalElement = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [result, setResult] = useState<{
    stem: string;
    element: string;
    description: string;
  } | null>(null);

  const handleCalculate = () => {
    if (!birthDate) return;

    const year = birthDate.getFullYear();
    const stemIndex = (year - 4) % 10; // Stems repeat every 10 years starting from 1984
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
        <p className="text-lg text-white/80 mb-8">
          Discover your Feng Shui element based on your birth year’s heavenly stem.
        </p>

        <div className="mb-6">
          <DatePickerInput
			date={birthDate}
			onDateChange={setBirthDate}
			placeholder="Enter your birthdate"
			/>
        </div>
        <button
          onClick={handleCalculate}
          className="bg-gold text-black font-semibold px-6 py-2 rounded hover:opacity-90 transition"
        >
          Analyze My Element
        </button>

        {result && (
		  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl bg-gold/10 border border-gold/30"
          >
          <div className="mt-6 space-y-4 text-left max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-gold">Result</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              <strong>Heavenly Stem:</strong> {result.stem}
            </p>
            <p className="text-white/90 text-sm leading-relaxed">
              <strong>Element:</strong> {result.element}
            </p>
            <p className="text-white/90 text-sm leading-relaxed">{result.description}</p>
          </div>
		  </motion.div>
        )}
		</div>
      </main>
    </div>
  );
};

export default PersonalElement;
