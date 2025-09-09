// src/pages/WesternDailyHoroscope.tsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import wheelImage from "@/assets/zodiac-wheel.png";
import { ImageSwiper } from '../components/OlderImageSwiper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import lotteryImage from '../assets/lottery.jpg';
import ncompatibilityImage from '../assets/name-compatibility.jpg';
import ccompatibilityImage from '../assets/chinese-compatibility.jpg';
import wcompatibilityImage from '../assets/western-compatibility.jpg';
import fcookieImage from '../assets/fortunecookie.jpg';

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Horoscope", path: "/horoscope" },
  { label: "Western Horoscope" },
];

type PeriodTabType = 'today' | 'yesterday' | 'weekly' | 'yearly';
type CategoryTabType = 'overview' | 'love' | 'career' | 'wealth' | 'social' | 'lucky_color' | 'lucky_number';

interface PeriodTabItem {
  id: PeriodTabType;
  label: string;
}

interface CategoryTabItem {
  id: CategoryTabType;
  label: string;
  icon: string;
}

interface PeriodTabsProps {
  tabs: PeriodTabItem[];
  activeTab: PeriodTabType;
  onTabClick: (tabId: PeriodTabType) => void;
}

interface HoroscopeTabsProps {
  tabs: CategoryTabItem[];
  activeTab: CategoryTabType;
  onTabClick: (tabId: CategoryTabType) => void;
}

const imageZodiacOrder = [
  "aries", "pisces", "aquarius", "capricorn", "sagittarius", "scorpio",
  "libra", "virgo", "leo", "cancer", "gemini", "taurus"
];

// Animated PeriodTabs component matching Chinese horoscope style
const PeriodTabs = ({ tabs, activeTab, onTabClick }: PeriodTabsProps) => {
  return (
    <div className="relative flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none border ${
              isActive
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="period-bubble"
                className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Animated HoroscopeTabs component matching Chinese horoscope style
const HoroscopeTabs = ({ tabs, activeTab, onTabClick }: HoroscopeTabsProps) => {
  return (
    <div className="relative flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none border ${
              isActive
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-bubble"
                className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function WesternDailyHoroscope() {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTabType>('today');
  const [selectedCategory, setSelectedCategory] = useState<CategoryTabType>('overview');
  const [horoscopeContent, setHoroscopeContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [periodLoading, setPeriodLoading] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number | null>(null);
  const currentRotationRef = useRef(0);

  const handleCardSwipe = (newIndex: number) => {
    setActiveCardIndex(newIndex);
  };

  const periodTabs = useMemo(() => [
    { id: 'yesterday' as PeriodTabType, label: 'Yesterday' },
    { id: 'today' as PeriodTabType, label: 'Today' },
    { id: 'weekly' as PeriodTabType, label: 'Weekly' },
    { id: 'yearly' as PeriodTabType, label: 'Current Year' },
  ], []);
  
  const featureCards = useMemo(() => [
      {
          title: "Lucky Number Generator",
          description: "Discover your fortune through numbers",
          images: lotteryImage,
          link: '/lucky-numbers'
      },
      {
          title: "Name Compatibility",
          description: "Find out if he/she is the one",
          images: ncompatibilityImage,
          link: '/name-compatibility'
      },
      {
          title: "Chinese Zodiac Compatibility",
          description: "Explore how your Chinese zodiac sign aligns with others",
          images: ccompatibilityImage,
          link: '/chinese-compatibility'
      },
      {
          title: "Western Zodiac Compatibility",
          description: "See how your Western star sign matches with different signs",
          images: wcompatibilityImage,
          link: '/western-compatibility'
      },
      {
          title: "Daily Fortune Cookie",
          description: "Crack open a virtual cookie for a daily dose of wisdom and fortune",
          images: fcookieImage,
          link: '/fortune-cookie'
      }
  ], []);

  const allFeatureImages = useMemo(() =>
    featureCards.map(card => card.images).join(','),
    [featureCards]
  );

  const categoryTabs = useMemo(() => [
    { id: 'overview' as CategoryTabType, label: 'Overview', icon: '' },
    { id: 'love' as CategoryTabType, label: 'Love', icon: '' },
    { id: 'career' as CategoryTabType, label: 'Career', icon: '' },
    { id: 'wealth' as CategoryTabType, label: 'Wealth', icon: '' },
    { id: 'social' as CategoryTabType, label: 'Social', icon: '' },
    { id: 'lucky_color' as CategoryTabType, label: 'Lucky Color', icon: '' },
    { id: 'lucky_number' as CategoryTabType, label: 'Lucky Number', icon: '' },
  ], []);

  const renderPeriodDateInfo = () => {
    if (!horoscopeContent) return null;

    if (selectedPeriod === 'today' || selectedPeriod === 'yesterday') {
      // For daily periods, try to get the date from the horoscope data
      const dateString = horoscopeContent.forDate || horoscopeContent.for_date;
      if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      }
      
      // Fallback to calculate based on selectedPeriod
      const today = new Date();
      if (selectedPeriod === 'yesterday') {
        today.setDate(today.getDate() - 1);
      }
      return today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
    } else if (selectedPeriod === 'weekly') {
      const startDateString = horoscopeContent.startDate || horoscopeContent.start_date;
      const endDateString = horoscopeContent.endDate || horoscopeContent.end_date;
      
      if (startDateString && endDateString) {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return `Week of ${start} - ${end}`;
        }
      }
      
      // Fallback to current week
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day;
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), diff);
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), diff + 6);
      const start = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `Week of ${start} - ${end}`;
      
    } else if (selectedPeriod === 'yearly') {
      const year = horoscopeContent.year || new Date().getFullYear();
      return `Year ${year} General Outlook`;
    }
    
    return null;
  };

const fetchHoroscope = useCallback(async (sign: string, period: PeriodTabType) => {
  if (!periodLoading) {
    setLoading(true);
  }
  setError(null);

  try {
    let apiUrl = `/api/western-zodiac-${sign.toLowerCase()}`;
    
    // FIXED: Match Chinese horoscope logic exactly
    if (period === 'today') {
      apiUrl += '?period=daily&dayOffset=0';  // Changed from -1 to 0
    } else if (period === 'yesterday') {
      apiUrl += '?period=daily&dayOffset=-1'; // Changed from -2 to -1
    } else if (period === 'weekly') {
      apiUrl += '?period=weekly';
    } else if (period === 'yearly') {
      apiUrl += '?period=yearly';
    }

    console.log('Fetching from:', apiUrl);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 202) {
        setTimeout(() => fetchHoroscope(sign, period), 3000);
        return;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received data:', data);
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
    setPeriodLoading(false);
  }
}, [periodLoading]);

  const handlePeriodTabChange = (newPeriod: PeriodTabType) => {
    if (newPeriod === selectedPeriod) return;
    
    setPeriodLoading(true);
    setSelectedPeriod(newPeriod);
    setContentKey(prev => prev + 1);
  };

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

  const renderHoroscopeText = (): string => {
    if (loading && !horoscopeContent) return "Loading horoscope...";
    if (error && !horoscopeContent) return error;
    if (!selectedSign) return "Spin the wheel to reveal your horoscope.";
    if (!horoscopeContent) return "Horoscope not available.";

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
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl mt-20">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="flex-1">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="relative mx-auto mb-8 w-full max-w-sm sm:max-w-md lg:max-w-xl aspect-square">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gold rounded z-10"></div>
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

                <div className="p-6 border border-gold/30 rounded-xl bg-gray-50 text-black">
                  {selectedSign && (
                    <div className="text-black text-xl font-semibold mb-4 text-center">
                      Your Sign: {selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1)}
                    </div>
                  )}

                  <div className="gap-2 mb-6 relative">
                    <PeriodTabs
                      tabs={periodTabs}
                      activeTab={selectedPeriod}
                      onTabClick={handlePeriodTabChange}
                    />
                    {periodLoading && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-start flex-wrap mb-6">
                    <HoroscopeTabs
                      tabs={categoryTabs}
                      activeTab={selectedCategory}
                      onTabClick={setSelectedCategory}
                    />
                  </div>

                  <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner relative">
                    {periodLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
                          <span className="text-gray-600">Loading...</span>
                        </div>
                      </div>
                    )}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedPeriod}-${selectedCategory}-${contentKey}`}
                        initial={{ opacity: periodLoading ? 0.3 : 1, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {/* Add the date info display here */}
                        <div className="text-gray-500 mb-4 text-center text-sm">
                          {renderPeriodDateInfo()}
                        </div>
                        <div className="text-black/80 leading-relaxed min-h-[100px]">
                          {renderHoroscopeText()}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
                  Play & Discover
                </h2>
                <div className="flex flex-col items-center">
                  <ImageSwiper
                    images={allFeatureImages}
                    onSwipe={handleCardSwipe}
                  />

                  <div className="text-center mt-4">
                    <h3 className="text-lg font-semibold">{featureCards[activeCardIndex].title}</h3>
                    <p className="text-sm text-muted-foreground">{featureCards[activeCardIndex].description}</p>
                    <button
                      onClick={() => navigate(featureCards[activeCardIndex].link)}
                      className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}