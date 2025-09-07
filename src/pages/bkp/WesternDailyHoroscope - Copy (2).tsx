// src/pages/WesternDailyHoroscope.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import wheelImage from "@/assets/zodiac-wheel.png";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Horoscope", path: "/horoscope" },
  { label: "Western Horoscope" },
];

type PeriodTabType = 'today' | 'yesterday' | 'weekly' | 'yearly';
type CategoryTabType = 'overview' | 'love' | 'career' | 'wealth' | 'social' | 'lucky_color' | 'lucky_number';

const imageZodiacOrder = [
  "aries", "pisces", "aquarius", "capricorn", "sagittarius", "scorpio",
  "libra", "virgo", "leo", "cancer", "gemini", "taurus"
];

// Fixed API base URL to match your server
const API_BASE_URL = "http://localhost:3001";

export default function WesternDailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTabType>('today');
  const [selectedCategory, setSelectedCategory] = useState<CategoryTabType>('overview');
  const [horoscopeContent, setHoroscopeContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number | null>(null);
  const currentRotationRef = useRef(0);

  const fetchHoroscope = useCallback(async (sign: string, period: PeriodTabType) => {
    setLoading(true);
    setError(null);
    setHoroscopeContent(null);

    try {
      // Fixed: Use GET request with correct URL pattern matching your server
      let apiUrl = `${API_BASE_URL}/api/western-horoscope/${sign.toLowerCase()}`;
      
      // Add period parameter
      if (period === 'today') {
        apiUrl += '?period=daily&dayOffset=0';
      } else if (period === 'yesterday') {
        apiUrl += '?period=daily&dayOffset=-1';
      } else if (period === 'weekly') {
        apiUrl += '?period=weekly';
      } else if (period === 'yearly') {
        apiUrl += '?period=yearly';
      }

      console.log('Fetching from:', apiUrl); // Debug log

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 202) {
          // Request in progress, retry after delay
          setTimeout(() => fetchHoroscope(sign, period), 3000);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      setHoroscopeContent(data);
    } catch (err: any) {
      console.error('Error fetching horoscope:', err);
      setError(err.message || "Could not load horoscope. Please try again later.");
      
      // Set fallback data
      setHoroscopeContent({
        horoscope: "The stars suggest focusing on balance and mindful decision-making today. Trust your intuition and embrace new opportunities.",
        love: "Romantic energies are favorable. Open communication will strengthen your relationships.",
        career: "Professional matters require attention to detail. Your hard work will be recognized.",
        money: "Financial stability is within reach. Avoid impulsive spending decisions.",
        social: "Social connections bring positive energy. Collaborate with others for mutual benefit.",
        luckyColor: "Blue",
        luckyNumber: 7
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSign) {
      fetchHoroscope(selectedSign, selectedPeriod);
    }
  }, [selectedSign, selectedPeriod, fetchHoroscope]);

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

    const rotationNormalized = (360 - (currentRotationRef.current % 360) + 15) % 360;
    const zodiacIndex = Math.floor(rotationNormalized / 30) % 12;
    const zodiac = imageZodiacOrder[zodiacIndex];

    setSelectedSign(zodiac);
    setSelectedCategory('overview');
  };

  // FIXED: Return string instead of JSX to avoid DOM nesting issues
  const renderHoroscopeText = (): string => {
    if (loading && !horoscopeContent) return "Loading horoscope...";
    if (error && !horoscopeContent) return error;
    if (!selectedSign) return "Spin the wheel to reveal your horoscope.";
    if (!horoscopeContent) return "Horoscope not available.";

    // Handle different data structures from your API
    switch (selectedCategory) {
      case 'overview': 
        return horoscopeContent.horoscope || horoscopeContent.overviewContent || "Your general horoscope insight is being prepared.";
      case 'love': 
        return horoscopeContent.love || horoscopeContent.loveContent || "Love insights coming soon! For now, enjoy your overview.";
      case 'career': 
        return horoscopeContent.career || horoscopeContent.careerContent || "Career insights coming soon! For now, enjoy your overview.";
      case 'wealth': 
        return horoscopeContent.money || horoscopeContent.wealthContent || "Wealth insights coming soon! For now, enjoy your overview.";
      case 'social': 
        return horoscopeContent.social || horoscopeContent.socialContent || "Social insights coming soon! For now, enjoy your overview.";
      case 'lucky_color': 
        return horoscopeContent.luckyColor || horoscopeContent.lucky_color ? 
          `Your lucky color is: ${horoscopeContent.luckyColor || horoscopeContent.lucky_color}` : 
          "Lucky color coming soon! For now, enjoy your overview.";
      case 'lucky_number': 
        return horoscopeContent.luckyNumber || horoscopeContent.lucky_number ? 
          `Your lucky number is: ${horoscopeContent.luckyNumber || horoscopeContent.lucky_number}` : 
          "Lucky number coming soon! For now, enjoy your overview.";
      default: 
        return horoscopeContent.horoscope || horoscopeContent.overviewContent || "Your horoscope insight is being prepared.";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80 mb-6" />
          <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Western Horoscope</h1>
          
          {/* Single column layout - removed right sidebar */}
          <div className="max-w-xl mx-auto">
            <div className="relative mx-auto mb-8 w-full max-w-sm sm:max-w-md lg:max-w-xl aspect-square">
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
            <div className="p-6 border border-gold/30 rounded-xl bg-gray-50 text-black">
              {selectedSign && (
                <div className="text-gold font-semibold mb-4">
                  Your Sign: {selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1)}
                </div>
              )}

              {/* Period Tab buttons */}
              <div className="flex flex-wrap space-x-2 mb-4">
                {(['today', 'yesterday', 'weekly', 'yearly'] as PeriodTabType[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm mb-2 transition-colors ${
                      selectedPeriod === period ? "bg-gold text-black font-bold" : "bg-gray-200 text-black/70 hover:bg-gray-300"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              {/* Category Tab buttons */}
              <div className="flex flex-wrap space-x-2 mb-4">
                {(['overview', 'love', 'career', 'wealth', 'social', 'lucky_color', 'lucky_number'] as CategoryTabType[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-md text-sm mb-2 transition-colors ${
                      selectedCategory === category ? "bg-gold text-black font-bold" : "bg-gray-200 text-black/70 hover:bg-gray-300"
                    }`}
                  >
                    {category.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>

              {/* FIXED: Tab content - changed from <p> to <div> to avoid DOM nesting error */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-black/80 leading-relaxed min-h-[100px]">
                  {renderHoroscopeText()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}