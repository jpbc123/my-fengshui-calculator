import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { westernZodiacData } from "@/data/westernZodiacData";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Western Zodiac Calculator" }
];

const zodiacSigns = [
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] }
];

function getWesternZodiac(month: number, day: number) {
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth < endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign.name;
      }
    } else {
      // For Capricorn, spans Dec -> Jan
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth || month < endMonth)
      ) {
        return sign.name;
      }
    }
  }
  return "";
}

export default function WesternZodiacCalculator() {
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string>("");
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (birthMonth && birthDay) {
      const sign = getWesternZodiac(birthMonth, birthDay);
      setZodiacSign(sign);
    }
  };

  const signData = zodiacSign ? westernZodiacData[zodiacSign] : null;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-2xl font-bold text-gold mb-4">
            Western Zodiac Calculator
          </h1>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Summary Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
              <Info size={20} className="text-gold mt-1 shrink-0" />
              <div className="text-left">
                <p>
                  The Western Zodiac is based on twelve constellations, each
                  linked to specific dates and personality traits, determined
                  by the position of the Sun at the time of birth.
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
                  The twelve zodiac signs — from Aries to Pisces — are each
                  associated with unique strengths, weaknesses, and tendencies.
                </p>
                <p className="mb-2">
                  Your sign can reveal insights into love compatibility, career
                  choices, and life challenges.
                </p>
                <p>
                  Unlike the Chinese zodiac, the Western zodiac is determined
                  solely by your birth month and day.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bg-white/5 p-6 rounded-xl border border-gold/20">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <input
                type="number"
                placeholder="Month (1-12)"
                value={birthMonth ?? ""}
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                min={1}
                max={12}
                className="bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold flex-1"
              />
              <input
                type="number"
                placeholder="Day (1-31)"
                value={birthDay ?? ""}
                onChange={(e) => setBirthDay(Number(e.target.value))}
                min={1}
                max={31}
                className="bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold flex-1"
              />
              <Button
                variant="gold"
                size="lg"
                onClick={handleCalculate}
                disabled={!birthMonth || !birthDay}
                className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
              >
                Calculate Western Zodiac
              </Button>
            </div>
          </div>

          {/* Result */}
          {zodiacSign && signData && (
            <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-gold/20 shadow-inner text-left">
              <h2 className="text-3xl font-semibold text-white text-center">
                Your Western Zodiac Sign is:{" "}
                <span className="text-gold">{zodiacSign}</span>
              </h2>

              <img
                src={westernZodiacImages[zodiacSign]}
                alt={zodiacSign}
                className="w-40 h-40 mx-auto object-contain"
              />

              <div>
                <h3 className="text-xl font-semibold text-gold mb-2">
                  Traits of {zodiacSign}:
                </h3>
                <p className="text-white/90">{signData.traits}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gold mb-2">
                  2025 Forecast for {zodiacSign}:
                </h3>
                <p className="text-white/90">{signData.yearAnalysis}</p>
              </div>

              {signData.compatibility && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Compatibility:
                  </h3>
                  <p className="text-white/90">{signData.compatibility}</p>
                </div>
              )}

              {signData.luckyNumbers && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Lucky Numbers:
                  </h3>
                  <p className="text-white/90">{signData.luckyNumbers}</p>
                </div>
              )}

              {signData.luckyColors && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Lucky Colors:
                  </h3>
                  <p className="text-white/90">{signData.luckyColors}</p>
                </div>
              )}

              {signData.careerAdvice && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Career Advice:
                  </h3>
                  <p className="text-white/90">{signData.careerAdvice}</p>
                </div>
              )}

              {signData.personalityInsights && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Personality Insights:
                  </h3>
                  <p className="text-white/90">
                    {signData.personalityInsights}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
