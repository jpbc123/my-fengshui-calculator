// src/pages/DailyHoroscope.tsx
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import wheelImage from "@/assets/zodiac-wheel.png"; // your wheel image

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
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">Daily Horoscope</h1>
        <div className="border-t-4 border-gold w-32 mb-4"></div>

        {/* Wheel wrapper */}
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

        {/* Selected sign & horoscope display */}
        <div className="p-6 border border-gold/30 rounded-xl bg-white/5">
          {selectedSign && <p className="text-gold font-semibold mb-2">Your Sign: {selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1)}</p>}
          {loading && <p className="text-white/70">Loading horoscope...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {horoscope && (
            <p className="text-white/80 leading-relaxed">{horoscope}</p>
          )}
          {!loading && !horoscope && !error && (
            <p className="text-white/50 italic">
              Drag the wheel to point your zodiac at the arrow.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
