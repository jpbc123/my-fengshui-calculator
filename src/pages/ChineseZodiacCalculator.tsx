import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { DatePickerInput } from "@/components/DatePickerInput";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Chinese Zodiac Calculator" },
];

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
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

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

    // Redirect to HeroLanding page for that zodiac
    navigate(`/zodiac/${sign.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-2xl font-bold text-gold mb-4">
            Chinese Zodiac Calculator
          </h1>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Summary Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
              <Info size={20} className="text-gold mt-1 shrink-0" />
              <div className="text-left">
                <p>
                  The Chinese Zodiac (生肖, Shēngxiào) is a 12-year cycle based on the traditional Chinese lunar calendar, where each year is associated with a specific animal sign and its unique personality traits.
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
              <div className="bg-black/40 text-white/90 text-sm p-4 rounded-xl border border-gold/26 text-left">
                <p className="mb-2">
                  Each animal in the Chinese Zodiac is linked to certain characteristics. For example, those born in the year of the Dragon are said to be confident and ambitious, while Rabbits are gentle and compassionate.
                </p>
                <p className="mb-2">
                  Because the Chinese zodiac follows the lunar calendar, the zodiac year does not start on January 1 but rather on Chinese New Year, which usually falls between late January and mid-February. This means your zodiac sign depends on both your birth date and the exact start of the lunar year.
                </p>
                <p>
                  The Chinese Zodiac also plays a role in compatibility, career paths, and feng shui practices.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bg-white/5 p-6 rounded-xl border border-gold/20">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChineseZodiacCalculator;
