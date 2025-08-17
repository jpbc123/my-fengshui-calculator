// src/pages/DailyHoroscope.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Daily Horoscope" },
];

const zodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

export default function DailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cached horoscope from localStorage on component mount
  useEffect(() => {
    if (selectedSign) {
      const cached = localStorage.getItem(`horoscope_${selectedSign}`);
      if (cached) {
        setHoroscope(cached);
      }
    }
  }, [selectedSign]);

  const fetchHoroscope = async (sign: string) => {
    setSelectedSign(sign);
    setLoading(true);
    setError(null);

    // Check localStorage first
    const cached = localStorage.getItem(`horoscope_${sign}`);
    if (cached) {
      setHoroscope(cached);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com/horoscope?lang=en&zodiac=${sign}&type=daily&timezone=UTC`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) throw new Error(`Status ${response.status}`);

      const data = await response.json();
      setHoroscope(data.horoscope);

      // Save to localStorage
      localStorage.setItem(`horoscope_${sign}`, data.horoscope);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not load horoscope. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">Daily Horoscope</h1>
        <div className="border-t-4 border-gold w-32 mb-4"></div>

        {/* Zodiac sign buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {zodiacSigns.map((sign) => (
            <button
              key={sign}
              onClick={() => fetchHoroscope(sign)}
              className={`py-2 px-4 rounded border border-gold/40 hover:bg-gold hover:text-black transition ${
                selectedSign === sign ? "bg-gold text-black" : "text-gold"
              }`}
            >
              {sign.charAt(0).toUpperCase() + sign.slice(1)}
            </button>
          ))}
        </div>

        {/* Horoscope display */}
        <div className="p-6 border border-gold/30 rounded-xl bg-white/5">
          {loading && <p className="text-white/70">Loading horoscope...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {horoscope && (
            <p className="text-white/80 leading-relaxed">{horoscope}</p>
          )}
          {!loading && !horoscope && !error && (
            <p className="text-white/50 italic">
              Select a zodiac sign to see today’s horoscope.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
