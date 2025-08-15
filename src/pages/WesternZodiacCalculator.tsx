import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { DatePickerInput } from "@/components/DatePickerInput";
import { westernZodiacData } from "@/data/westernZodiacData";

// Western zodiac images (update paths to match your project)
import ariesImg from "@/assets/western/aries.png";
import taurusImg from "@/assets/western/taurus.png";
import geminiImg from "@/assets/western/gemini.png";
import cancerImg from "@/assets/western/cancer.png";
import leoImg from "@/assets/western/leo.png";
import virgoImg from "@/assets/western/virgo.png";
import libraImg from "@/assets/western/libra.png";
import scorpioImg from "@/assets/western/scorpio.png";
import sagittariusImg from "@/assets/western/sagittarius.png";
import capricornImg from "@/assets/western/capricorn.png";
import aquariusImg from "@/assets/western/aquarius.png";
import piscesImg from "@/assets/western/pisces.png";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Western Zodiac Calculator" },
];

interface SignInfo {
  image?: string;
  traits: string;
  yearAnalysis: string;
  compatibility?: string;
  luckyNumbers?: string;
  luckyColors?: string;
  careerAdvice?: string;
  personalityInsights?: string;
}

 const westernZodiacImages: { [key: string]: string } = {
   Aries: ariesImg,
   Taurus: taurusImg,
   Gemini: geminiImg,
   Cancer: cancerImg,
   Leo: leoImg,
   Virgo: virgoImg,
   Libra: libraImg,
   Scorpio: scorpioImg,
   Sagittarius: sagittariusImg,
   Capricorn: capricornImg,
   Aquarius: aquariusImg,
   Pisces: piscesImg,
 };

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
  { name: "Pisces", start: [2, 19], end: [3, 20] },
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
      // Capricorn wraps Dec -> Jan
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

const WesternZodiacCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [signInfo, setSignInfo] = useState<SignInfo | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;
    const month = birthDate.getMonth() + 1; // 1–12
    const day = birthDate.getDate();
    const sign = getWesternZodiac(month, day);
    setZodiacSign(sign);
    setSignInfo(sign ? (westernZodiacData as Record<string, SignInfo>)[sign] : null);
  };

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
                  The Western Zodiac is based on twelve constellations, each linked to specific date ranges and personality traits. Your sign is determined by the position of the Sun at the exact time of your birth according to the solar (Gregorian) calendar.
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
                  The twelve zodiac signs — from Aries to Pisces — are each associated with unique strengths, challenges, and behavioral patterns.
                </p>
                <p className="mb-2">
                  Your sign can offer insights into love compatibility, career paths, and personal growth themes.
                </p>
                <p>
                  Unlike the Chinese zodiac, which follows the lunar calendar and assigns one animal to an entire birth year, the Western zodiac changes roughly every month, making it more focused on the season and Sun’s position rather than the year of birth.
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
                Calculate Western Zodiac
              </Button>
            </div>
          </div>

          {/* Result */}
          {zodiacSign && signInfo && (
            <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-gold/20 shadow-inner text-left">
              <h2 className="text-3xl font-semibold text-white text-center">
                Your Western Zodiac Sign is:{" "}
                <span className="text-gold">{zodiacSign}</span>
              </h2>

              {westernZodiacImages[zodiacSign] && (
                <img
                  src={westernZodiacImages[zodiacSign]}
                  alt={zodiacSign}
                  className="w-40 h-40 mx-auto object-contain"
                />
              )}

              <div>
                <h3 className="text-xl font-semibold text-gold mb-2">
                  Traits of {zodiacSign}:
                </h3>
                <p className="text-white/90">{signInfo.traits}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gold mb-2">
                  2025 Forecast for {zodiacSign}:
                </h3>
                <p className="text-white/90">{signInfo.yearAnalysis}</p>
              </div>

              {signInfo.compatibility && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Compatibility:
                  </h3>
                  <p className="text-white/90">{signInfo.compatibility}</p>
                </div>
              )}

              {signInfo.luckyNumbers && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Lucky Numbers:
                  </h3>
                  <p className="text-white/90">{signInfo.luckyNumbers}</p>
                </div>
              )}

              {signInfo.luckyColors && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Lucky Colors:
                  </h3>
                  <p className="text-white/90">{signInfo.luckyColors}</p>
                </div>
              )}

              {signInfo.careerAdvice && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Career Advice:
                  </h3>
                  <p className="text-white/90">{signInfo.careerAdvice}</p>
                </div>
              )}

              {signInfo.personalityInsights && (
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Personality Insights:
                  </h3>
                  <p className="text-white/90">{signInfo.personalityInsights}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WesternZodiacCalculator;
