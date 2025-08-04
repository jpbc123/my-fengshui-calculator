import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Info } from "lucide-react";
import zodiacData from "@/data/zodiacData2025";

interface ZodiacInfo {
  image: string;
  traits: string;
  yearAnalysis: string;
}

const ChineseZodiacCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);

  const handleCalculate = () => {
    if (!birthDate) return;
    const year = birthDate.getFullYear();
    const zodiacIndex = (year - 4) % 12;
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
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-28 px-1 pb-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gold">
            Chinese Zodiac Calculator
          </h1>

          <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
            <Info size={20} className="text-gold mt-1 shrink-0" />
            <p className="text-left">
              The Chinese Zodiac is a repeating cycle of 12 years, with each year
              represented by an animal. This tradition is deeply rooted in Chinese
              culture and believed to influence people’s personalities and fortunes.
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

          {zodiacSign && zodiacInfo && (
            <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-gold/20 shadow-inner">
			  <h2 className="text-3xl font-semibold text-white">
			  Your Chinese Zodiac Sign is:{" "}
			  <span className="text-gold">{zodiacSign}</span>
			  </h2>

			  <img
			  src={`/src/assets/zodiac/${zodiacSign.toLowerCase()}.png`}
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
    </div>
  );
};

export default ChineseZodiacCalculator;
