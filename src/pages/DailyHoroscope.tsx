// src/pages/DailyHoroscope.tsx
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import wheelImage from "@/assets/zodiac-wheel.png";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Daily Horoscope" },
];

// Zodiac order clockwise in your image, starting at top
const imageZodiacOrder = [
  "aries", "pisces", "aquarius", "capricorn", "sagittarius", "scorpio",
  "libra", "virgo", "leo", "cancer", "gemini", "taurus"
];

export default function DailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "love" | "career">("overview");

  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number | null>(null);
  const currentRotationRef = useRef(0);

  // Load cached horoscope
  useEffect(() => {
    if (selectedSign) {
      const cached = localStorage.getItem(`horoscope_${selectedSign}`);
      if (cached) setHoroscope(cached);
    }
  }, [selectedSign]);

  // Fetch horoscope from RapidAPI
  const fetchHoroscope = async (sign: string) => {
    setSelectedSign(sign);
    setLoading(true);
    setError(null);

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
      localStorage.setItem(`horoscope_${sign}`, data.horoscope);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not load horoscope. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Drag rotation handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = wheelRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;
    startAngleRef.current = Math.atan2(y, x);
    wheelRef.current!.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startAngleRef.current === null) return;
    const rect = wheelRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;
    const angle = Math.atan2(y, x);
    const delta = angle - startAngleRef.current;
    const deg = delta * (180 / Math.PI);
    wheelRef.current!.style.transform = `rotate(${currentRotationRef.current + deg}deg)`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startAngleRef.current === null) return;
    const rect = wheelRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;
    const angle = Math.atan2(y, x);
    const delta = angle - startAngleRef.current;
    const deg = delta * (180 / Math.PI);
    currentRotationRef.current += deg;
    startAngleRef.current = null;

    // Normalize rotation to [0, 360)
    const rotationNormalized = (360 - (currentRotationRef.current % 360) + 15) % 360;

    // Determine zodiac using the image order
    const zodiacIndex = Math.floor(rotationNormalized / 30) % 12;
    const zodiac = imageZodiacOrder[zodiacIndex];

    fetchHoroscope(zodiac);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Outer container */}
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Breadcrumbs + title centered like FengShui page */}
        <div className="max-w-3xl mx-auto mb-8">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-2xl font-bold text-gold mt-4">Daily Horoscope</h1>
          <div className="border-t-4 border-gold w-32 mt-2"></div>
        </div>

        {/* 2-column layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - wheel & results */}
          <div>
            <div className="relative mx-auto mb-8 w-96 h-96">
              {/* Fixed Arrow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gold rounded z-10"></div>

              {/* Rotating Wheel */}
              <div
                ref={wheelRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: "none", cursor: "grab" }}
                className="w-full h-full"
              >
                <img src={wheelImage} alt="Zodiac Wheel" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Tabs */}
            <div className="p-6 border border-gold/30 rounded-xl bg-white/5">
              {selectedSign && (
                <p className="text-gold font-semibold mb-4">
                  Your Sign: {selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1)}
                </p>
              )}

              {/* Tab buttons */}
              <div className="flex space-x-4 mb-4">
                {["overview", "love", "career"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1 rounded ${
                      activeTab === tab ? "bg-gold text-black font-bold" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {loading && <p className="text-white/70">Loading horoscope...</p>}
              {error && <p className="text-red-400">{error}</p>}

              {!loading && !error && (
                <>
                  {activeTab === "overview" && (
                    <p className="text-white/80 leading-relaxed">
                      {horoscope || "Spin the wheel to reveal your horoscope."}
                    </p>
                  )}
                  {activeTab === "love" && (
                    <p className="text-white/80 leading-relaxed">
                      💖 Love insights coming soon! For now, enjoy your daily overview.
                    </p>
                  )}
                  {activeTab === "career" && (
                    <p className="text-white/80 leading-relaxed">
                      💼 Career insights coming soon! For now, enjoy your daily overview.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side - related links */}
          <div className="max-w-md">
            <h2 className="text-xl font-semibold text-gold mb-4">Related Articles</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/80 hover:text-gold">How to Make the Most of Your Zodiac Energy</a></li>
              <li><a href="#" className="text-white/80 hover:text-gold">Love Compatibility Between Signs</a></li>
              <li><a href="#" className="text-white/80 hover:text-gold">Career Growth Based on Astrology</a></li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
