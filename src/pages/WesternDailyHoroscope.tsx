import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import wheelImage from "@/assets/zodiac-wheel.png";
import { Link } from "react-router-dom"; // For related articles, assuming external links or internal pages

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Western Horoscope" },
];

type PeriodTabType = 'today' | 'yesterday' | 'weekly' | 'yearly';
type CategoryTabType = 'overview' | 'love' | 'career' | 'wealth' | 'social' | 'lucky_color' | 'lucky_number';

// Zodiac order clockwise in your image, starting at top (Aries at 0 degrees, then Pisces, etc.)
// Each sign covers 30 degrees.
const imageZodiacOrder = [
  "aries", "pisces", "aquarius", "capricorn", "sagittarius", "scorpio",
  "libra", "virgo", "leo", "cancer", "gemini", "taurus"
];

// Helper to get start and end dates for periods, or identifiers for weekly/yearly
const getPeriodDetails = (period: PeriodTabType) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  let dateIdentifier: string | null = null;
  let weekIdentifier: string | null = null;
  let yearIdentifier: number | null = null;

  if (period === 'today') {
    dateIdentifier = today.toISOString().split('T')[0];
  } else if (period === 'yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    dateIdentifier = yesterday.toISOString().split('T')[0];
  } else if (period === 'weekly') {
    const dayOfWeek = today.getDay(); // Sunday is 0, Saturday is 6
    const weekStart = new Date(today.setDate(today.getDate() - dayOfWeek));
    const weekEnd = new Date(today.setDate(today.getDate() + 6)); // +6 days from weekStart
    weekIdentifier = `${weekStart.toISOString().split('T')[0]}_${weekEnd.toISOString().split('T')[0]}`;
  } else if (period === 'yearly') {
    yearIdentifier = today.getFullYear();
  }

  return { dateIdentifier, weekIdentifier, yearIdentifier };
};

export default function WesternDailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTabType>('today');
  const [selectedCategory, setSelectedCategory] = useState<CategoryTabType>('overview');
  const [horoscopeContent, setHoroscopeContent] = useState<any | null>(null); // Stores the full JSON response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number | null>(null);
  const currentRotationRef = useRef(0);

  // Function to fetch horoscope from the backend
  // This function is now responsible for fetching the *entire* horoscope object for a given sign and period.
  // The 'category' parameter is now primarily for the backend to know what data *might* be needed,
  // but the frontend expects a full object if possible.
  const fetchHoroscope = useCallback(async (sign: string, period: PeriodTabType) => { // Removed category from here
    setLoading(true);
    setError(null);
    setHoroscopeContent(null); // Clear previous content

    const { dateIdentifier, weekIdentifier, yearIdentifier } = getPeriodDetails(period);

    try {
      const response = await fetch('/api/western-horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sign,
          period,
          category: 'overview', // Always request 'overview' to get the full object for caching purposes
          dateIdentifier,
          weekIdentifier,
          yearIdentifier,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to fetch horoscope for ${sign}.`);
      }

      const data = await response.json();
      setHoroscopeContent(data.horoscope); // Backend should return a structured horoscope object

    } catch (err: any) {
      console.error('Error fetching horoscope:', err);
      setError(err.message || "Could not load horoscope. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies remain empty because it's a stable function

  // Effect to fetch horoscope when sign or period changes (but NOT category)
  useEffect(() => {
    if (selectedSign) {
      // Fetch the full horoscope object. 'overview' is passed to the backend,
      // but the frontend expects the full object regardless.
      fetchHoroscope(selectedSign, selectedPeriod);
    }
  }, [selectedSign, selectedPeriod, fetchHoroscope]); // Removed selectedCategory from dependencies

  // Drag rotation handlers - UNCHANGED from your original code
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
    const rotationNormalized = (360 - (currentRotationRef.current % 360) + 15) % 360; // Adjust for Aries at top

    // Determine zodiac using the image order (Aries is at 0 index in imageZodiacOrder)
    const zodiacIndex = Math.floor(rotationNormalized / 30) % 12;
    const zodiac = imageZodiacOrder[zodiacIndex];

    setSelectedSign(zodiac); // Only set the sign, the useEffect will trigger fetch
    setSelectedCategory('overview'); // Reset category to overview when sign changes
  };

  // Function to render content based on category
  const renderHoroscopeText = () => {
    // Only check loading and error for the initial fetch, not category switching
    if (loading && !horoscopeContent) return <p className="text-black/70">Loading horoscope...</p>;
    if (error && !horoscopeContent) return <p className="text-red-400">{error}</p>;
    if (!selectedSign) return <p className="text-black/70">Spin the wheel to reveal your horoscope.</p>;
    if (!horoscopeContent) return <p className="text-black/70">Horoscope not available.</p>;

    // Now, just pick from the already fetched horoscopeContent
    switch (selectedCategory) {
      case 'overview': return horoscopeContent.overview_content;
      case 'love': return horoscopeContent.love_content || "💖 Love insights coming soon! For now, enjoy your overview.";
      case 'career': return horoscopeContent.career_content || "💼 Career insights coming soon! For now, enjoy your overview.";
      case 'wealth': return horoscopeContent.wealth_content || "💰 Wealth insights coming soon! For now, enjoy your overview.";
      case 'social': return horoscopeContent.social_content || "👥 Social insights coming soon! For now, enjoy your overview.";
      case 'lucky_color': return horoscopeContent.lucky_color ? `🎨 Your lucky color is: ${horoscopeContent.lucky_color}` : "🎨 Lucky color coming soon! For now, enjoy your overview.";
      case 'lucky_number': return horoscopeContent.lucky_number ? `🔢 Your lucky number is: ${horoscopeContent.lucky_number}` : "🔢 Lucky number coming soon! For now, enjoy your overview.";
      default: return horoscopeContent.overview_content;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Outer container for main content - Added pb-16 for spacing */}
      <div className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumbs + title centered like FengShui page */}
        <div className="max-w-3xl mx-auto mb-8">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mt-4">Western Horoscope</h1>
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
            <div className="p-6 border border-gold/30 rounded-xl bg-gray-50 text-black">
              {selectedSign && (
                <p className="text-gold font-semibold mb-4">
                  Your Sign: {selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1)}
                </p>
              )}

              {/* Period Tab buttons */}
              <div className="flex flex-wrap space-x-2 mb-4">
                {(['today', 'yesterday', 'weekly', 'yearly'] as PeriodTabType[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm mb-2 ${
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
                    className={`px-3 py-1 rounded-md text-sm mb-2 ${
                      selectedCategory === category ? "bg-gold text-black font-bold" : "bg-gray-200 text-black/70 hover:bg-gray-300"
                    }`}
                  >
                    {category.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <p className="text-black/80 leading-relaxed min-h-[100px]">
                {renderHoroscopeText()}
              </p>
            </div>
          </div>

          {/* Right side - related links */}
          <div className="max-w-md">
            <h2 className="text-xl font-semibold text-black mb-4">Related Articles</h2>
            <ul className="space-y-2">
              <li><Link to="#" className="text-black/80 hover:text-gold">How to Make the Most of Your Zodiac Energy</Link></li>
              <li><Link to="#" className="text-black/80 hover:text-gold">Love Compatibility Between Signs</Link></li>
              <li><Link to="#" className="text-black/80 hover:text-gold">Career Growth Based on Astrology</Link></li>
              {/* Add more relevant links as needed */}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}