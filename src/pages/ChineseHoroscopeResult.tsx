// src/pages/ChineseHoroscopeResult.tsx
import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import PeriodTabs from '../components/PeriodTabs';
import { ImageSwiper } from '../components/OlderImageSwiper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Image imports
import ratImage from '../assets/chinese-zodiac/year-of-the-rat.png';
import oxImage from '../assets/chinese-zodiac/year-of-the-ox.png';
import tigerImage from '../assets/chinese-zodiac/year-of-the-tiger.png';
import rabbitImage from '../assets/chinese-zodiac/year-of-the-rabbit.png';
import dragonImage from '../assets/chinese-zodiac/year-of-the-dragon.png';
import snakeImage from '../assets/chinese-zodiac/year-of-the-snake.png';
import horseImage from '../assets/chinese-zodiac/year-of-the-horse.png';
import goatImage from '../assets/chinese-zodiac/year-of-the-goat.png';
import monkeyImage from '../assets/chinese-zodiac/year-of-the-monkey.png';
import roosterImage from '../assets/chinese-zodiac/year-of-the-rooster.png';
import dogImage from '../assets/chinese-zodiac/year-of-the-dog.png';
import pigImage from '../assets/chinese-zodiac/year-of-the-pig.png';

import lotteryImage from '../assets/lottery.jpg';
import ncompatibilityImage from '../assets/name-compatibility.jpg';
import ccompatibilityImage from '../assets/chinese-compatibility.jpg';
import wcompatibilityImage from '../assets/western-compatibility.jpg';
import fcookieImage from '../assets/fortunecookie.jpg';

// Evergreen per-sign content, rendered at build time so Googlebot sees real
// content instead of an empty client-fetched shell.
import { ChineseZodiacData2025 } from '../data/ChineseZodiacData2025';


const zodiacImages: { [key: string]: string } = {
    rat: ratImage, ox: oxImage, tiger: tigerImage, rabbit: rabbitImage,
    dragon: dragonImage, snake: snakeImage, horse: horseImage,
    goat: goatImage, monkey: monkeyImage, rooster: roosterImage,
    dog: dogImage, pig: pigImage,
};

const allZodiacs = [
    "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse",
    "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

// Define types for better type safety
type CategoryTabType = 'horoscope' | 'relationship' | 'career' | 'wealth' | 'social' | 'lucky_color' | 'lucky_number';
type PeriodTabType = 'today' | 'yesterday' | 'weekly' | 'yearly';
type LanguageType = 'both' | 'cn' | 'en';

interface CategoryTabItem {
    id: CategoryTabType;
    label: string;
    icon: string;
    field: string;
    field_en: string;
}

interface HoroscopeTabsProps {
    tabs: CategoryTabItem[];
    activeTab: CategoryTabType;
    onTabClick: (tabId: CategoryTabType) => void;
}

// Base interface for all horoscope data
interface BaseHoroscopeData {
    _id?: string;
    sign: string;
    horoscope?: string;
    horoscope_en?: string;
    money?: string;
    money_en?: string;
    social?: string;
    social_en?: string;
    career?: string;
    career_en?: string;
    love?: string;
    love_en?: string;
    lucky_color?: string;
    lucky_color_en?: string;
    lucky_number?: string;
    lucky_number_en?: string;
    // Sanity fields
    overviewContent?: string;
    loveContent?: string;
    careerContent?: string;
    wealthContent?: string;
    socialContent?: string;
    luckyColor?: string;
    luckyNumber?: string | number;
}

// Specific interfaces for each period
interface DailyHoroscopeDataType extends BaseHoroscopeData {
    for_date?: string;
    forDate?: string;
}

interface WeeklyHoroscopeDataType extends BaseHoroscopeData {
    start_date?: string;
    end_date?: string;
    startDate?: string;
    endDate?: string;
}

interface YearlyHoroscopeDataType extends BaseHoroscopeData {
    year: number;
}

// Union type for all possible horoscope data
type HoroscopeDataType = DailyHoroscopeDataType | WeeklyHoroscopeDataType | YearlyHoroscopeDataType;

/**
 * Utility function to calculate the start and end dates of the current week (Sunday to Saturday).
 * @returns An object with the start and end dates in YYYY-MM-DD format.
 */
function getWeekDates(date = new Date()) {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - day;
    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), diff);
    const endOfWeek = new Date(date.getFullYear(), date.getMonth(), diff + 6);
    return {
        start: startOfWeek.toISOString().slice(0, 10),
        end: endOfWeek.toISOString().slice(0, 10)
    };
}

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
                                layoutId="bubble"
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

const ChineseHoroscopeResult = () => {
    const { zodiac } = useParams<{ zodiac: string }>();
    const navigate = useNavigate();
    const [horoscopeData, setHoroscopeData] = useState<HoroscopeDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabType>('horoscope');
    const [activePeriodTab, setActivePeriodTab] = useState<PeriodTabType>('today');
    const [language, setLanguage] = useState<LanguageType>('en');
	const [periodLoading, setPeriodLoading] = useState(false); // Add loading state specifically for period changes
    const [contentKey, setContentKey] = useState(0); // For triggering content animations
	const [activeCardIndex, setActiveCardIndex] = useState(0);
	
	const handleCardSwipe = (newIndex) => {
        setActiveCardIndex(newIndex);
    };

    const periodTabs = useMemo(() => [
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'today', label: 'Today' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'yearly', label: 'Current Year' },
    ], []);

// DEFINE THE FEATURE CARDS WITH IMAGES AND LINKS
const featureCards = useMemo(() => [
    {
        title: "Lucky Number Generator",
        description: "Discover your fortune through numbers",
        images: lotteryImage,
        link: '/games-fun/lucky-numbers-generator'
    },
    {
        title: "Name Compatibility",
        description: "Find out if he/she is the one",
        images: ncompatibilityImage,
        link: '/games-fun/name-compatibility'
    },
    {
        title: "Chinese Zodiac Compatibility",
        description: "Explore how your Chinese zodiac sign aligns with others",
        images: ccompatibilityImage,
        link: '/games-fun/chinese-zodiac-compatibility'
    },
    {
        title: "Western Zodiac Compatibility",
        description: "See how your Western star sign matches with different signs",
        images: wcompatibilityImage,
        link: '/games-fun/western-zodiac-compatibility'
    },
    {
        title: "Daily Fortune Cookie",
        description: "Crack open a virtual cookie for a daily dose of wisdom and fortune",
        images: fcookieImage,
        link: '/games-fun/fortune-cookie'
    }
], [navigate]);


const allFeatureImages = useMemo(() =>
    featureCards.map(card => card.images).join(','),
    [featureCards]
);

    const zodiacName = zodiac ? zodiac.charAt(0).toUpperCase() + zodiac.slice(1) : '';
    // The dataset keys the Goat sign as "Sheep"; map the route param accordingly.
    const zodiacDataKey = zodiacName === 'Goat' ? 'Sheep' : zodiacName;
    const zodiacInfo = (ChineseZodiacData2025 as Record<string, any>)[zodiacDataKey];
    const breadcrumbs = [
        { label: "Home", path: "/" },
		{ label: "Horoscope", path: "/horoscope" },
        { label: `${zodiacName} Horoscope` },
    ];

    const categoryTabs: CategoryTabItem[] = useMemo(() => [
        { id: 'horoscope', label: 'Overview', icon: '', field: 'horoscope', field_en: 'horoscope_en' },
        { id: 'relationship', label: 'Relationship', icon: '', field: 'love', field_en: 'love_en' },
        { id: 'career', label: 'Career', icon: '', field: 'career', field_en: 'career_en' },
        { id: 'wealth', label: 'Wealth', icon: '', field: 'money', field_en: 'money_en' },
        { id: 'social', label: 'Social', icon: '', field: 'social', field_en: 'social_en' },
        { id: 'lucky_color', label: 'Lucky Color', icon: '', field: 'lucky_color', field_en: 'lucky_color_en' },
        { id: 'lucky_number', label: 'Lucky Number', icon: '', field: 'lucky_number', field_en: 'lucky_number_en' },
    ], []);

    // Enhanced period tab handler with optimistic loading
    const handlePeriodTabChange = (newPeriod: PeriodTabType) => {
        if (newPeriod === activePeriodTab) return;
        
        setPeriodLoading(true);
        setActivePeriodTab(newPeriod);
        setContentKey(prev => prev + 1); // Force content re-render with animation
    };

    useEffect(() => {
    const fetchHoroscopeData = async () => {
        if (!zodiac) {
            setLoading(false);
            setPeriodLoading(false);
            setHoroscopeData(null);
            setError(null);
            return;
        }

        // Don't show main loading for period changes
        if (!periodLoading) {
            setLoading(true);
        }
        setError(null);

		let apiUrl = `/api/chinese-horoscope?zodiac=${zodiac.toLowerCase()}`;
		
		if (activePeriodTab === 'today' || activePeriodTab === 'yesterday') {
			const dayOffset = activePeriodTab === 'today' ? 0 : -1;
			apiUrl = `/api/chinese-horoscope?zodiac=${zodiac.toLowerCase()}&period=daily&dayOffset=${dayOffset}`;
		} else if (activePeriodTab === 'weekly') {
			apiUrl = `/api/chinese-horoscope?zodiac=${zodiac.toLowerCase()}&period=weekly`;
		} else if (activePeriodTab === 'yearly') {
			apiUrl = `/api/chinese-horoscope?zodiac=${zodiac.toLowerCase()}&period=yearly`;
		}

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.statusText}`);
            }
            const data: HoroscopeDataType = await response.json();
            console.log('Received horoscope data:', data); // Debug log
            setHoroscopeData(data);
        } catch (err: any) {
            console.error("Failed to fetch horoscope data:", err);
            setError(err.message || 'Failed to fetch horoscope data. Please try again.');
            setHoroscopeData(null);
        } finally {
            setLoading(false);
            setPeriodLoading(false);
        }
    };

    fetchHoroscopeData();
}, [zodiac, activePeriodTab]);

    const renderContent = () => {
        if (loading && !periodLoading) return null;
        if (error) return <div className="text-center text-red-500 py-8"><p>{error}</p></div>;
        if (!horoscopeData) return <div className="text-center text-gray-500 py-8"><p>No data available for this section.</p></div>;

        const activeTabData = categoryTabs.find(tab => tab.id === activeCategoryTab);
        if (!activeTabData) return null;

        // Handle both snake_case and camelCase field names
        let chineseContent = (horoscopeData as any)[activeTabData.field];
        let englishContent = (horoscopeData as any)[activeTabData.field_en];

        // Fallback for yearly data structure
        if (activePeriodTab === 'yearly' && !chineseContent && !englishContent) {
            switch (activeTabData.id) {
                case 'horoscope':
                    chineseContent = (horoscopeData as any).overviewContent;
                    englishContent = (horoscopeData as any).overviewContent;
                    break;
                case 'relationship':
                    chineseContent = (horoscopeData as any).loveContent;
                    englishContent = (horoscopeData as any).loveContent;
                    break;
                case 'career':
                    chineseContent = (horoscopeData as any).careerContent;
                    englishContent = (horoscopeData as any).careerContent;
                    break;
                case 'wealth':
                    chineseContent = (horoscopeData as any).wealthContent;
                    englishContent = (horoscopeData as any).wealthContent;
                    break;
                case 'social':
                    chineseContent = (horoscopeData as any).socialContent;
                    englishContent = (horoscopeData as any).socialContent;
                    break;
                case 'lucky_color':
                    chineseContent = (horoscopeData as any).luckyColor;
                    englishContent = (horoscopeData as any).luckyColor;
                    break;
                case 'lucky_number':
                    chineseContent = String((horoscopeData as any).luckyNumber || '');
                    englishContent = String((horoscopeData as any).luckyNumber || '');
                    break;
            }
        }

        if (!chineseContent && !englishContent) {
            return <div className="text-center text-gray-500 py-8"><p>No data available for this section.</p></div>;
        }

        return (
            <motion.div 
                key={contentKey} // This will trigger re-animation when content changes
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-6"
            >
                {englishContent && (language === 'both' || language === 'en') && (
                    <div>
                        {language === 'both' && <p className="text-gray-400 text-sm mb-2 font-semibold">English:</p>}
                        <p className="prose text-lg leading-relaxed text-gray-800">{englishContent}</p>
                    </div>
                )}
                {chineseContent && (language === 'both' || language === 'cn') && (
                    <div>
                        {language === 'both' && <p className="text-gray-400 text-sm mb-2 font-semibold">CN</p>}
                        <p className="prose text-lg leading-relaxed text-gray-800">{chineseContent}</p>
                    </div>
                )}
            </motion.div>
        );
    };

    const renderPeriodDateInfo = () => {
        if (!horoscopeData) return null;

        if (activePeriodTab === 'today' || activePeriodTab === 'yesterday') {
            const dailyData = horoscopeData as DailyHoroscopeDataType;
            const dateString = dailyData.for_date || dailyData.forDate;
            if (!dateString) return null;
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null; // Check for invalid date
            
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } else if (activePeriodTab === 'weekly') {
            const weeklyData = horoscopeData as WeeklyHoroscopeDataType;
            const startDateString = weeklyData.start_date || weeklyData.startDate;
            const endDateString = weeklyData.end_date || weeklyData.endDate;
            
            if (!startDateString || !endDateString) return null;
            
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);
            
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
            
            const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `Week of ${start} - ${end}`;
        } else if (activePeriodTab === 'yearly') {
            const yearlyData = horoscopeData as YearlyHoroscopeDataType;
            return `Year ${yearlyData.year} General Outlook`;
        }
        return null;
    };

    const currentZodiac = zodiac || '';

    // NOTE: We intentionally do NOT early-return a full-page spinner while loading.
    // Doing so meant the prerendered (SSG) HTML was just a spinner, so Googlebot saw
    // no content. Instead the page shell + evergreen content always render, and the
    // daily-forecast box shows its own inline loading state (see below).

    return (
<>
<Helmet>
  <title>{zodiacName} Chinese Horoscope - Daily, Weekly & Yearly Predictions | Feng Shui and Beyond</title>
  <meta name="description" content={`Get your ${zodiacName} Chinese horoscope with daily, weekly, and yearly predictions. Discover love, career, wealth, and social insights based on Chinese zodiac wisdom.`} />
  <meta name="keywords" content={`${zodiacName.toLowerCase()} horoscope, chinese horoscope ${zodiacName.toLowerCase()}, ${zodiacName.toLowerCase()} zodiac, chinese zodiac ${zodiacName.toLowerCase()}, daily horoscope, weekly horoscope, yearly horoscope`} />
  <link rel="canonical" href={`https://fengshuiandbeyond.com/zodiac/${zodiacName.toLowerCase()}`} />
  
  <meta property="og:title" content={`${zodiacName} Chinese Horoscope - Your Daily Guide`} />
  <meta property="og:description" content={`Free ${zodiacName} Chinese horoscope with daily, weekly, and yearly predictions for love, career, and wealth.`} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://fengshuiandbeyond.com/zodiac/${zodiacName.toLowerCase()}`} />
  <meta property="og:image" content={zodiacImages[currentZodiac]} />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${zodiacName} Chinese Horoscope`} />
  <meta name="twitter:description" content={`Daily predictions for ${zodiacName} sign`} />
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${zodiacName} Chinese Horoscope - ${activePeriodTab.charAt(0).toUpperCase() + activePeriodTab.slice(1)}`,
      "description": `Chinese horoscope predictions for ${zodiacName} sign`,
      "url": `https://fengshuiandbeyond.com/zodiac/${zodiacName.toLowerCase()}`,
      "publisher": {
        "@type": "Organization",
        "name": "Feng Shui and Beyond"
      }
    })}
  </script>
</Helmet>
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl mt-20">
                <Breadcrumb items={breadcrumbs} />

                {/* Always-rendered page heading + intro so the prerendered HTML has a real
                    h1 and descriptive copy even before the client-side daily forecast loads. */}
                <header className="text-center mt-6 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                        {zodiacName ? `${zodiacName} Chinese Horoscope` : 'Chinese Horoscope'}
                    </h1>
                    {zodiacInfo && (
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
                            {zodiacInfo.personalityInsights} Below you'll find today's {zodiacName} forecast
                            alongside the sign's core traits, compatibility, and lucky attributes.
                        </p>
                    )}
                </header>

                <div className="flex flex-col lg:flex-row gap-6 mt-8">
                    {/* Main Content Area */}
                    <div className="flex-1">
                        {currentZodiac && horoscopeData ? (
                            <div className="space-y-8">
                                {/* EXISTING HOROSCOPE RESULTS BOX */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    {/* Zodiac title + image */}
                                    <div className="mb-8 text-center">
                                        <img src={zodiacImages[currentZodiac]} alt={zodiacName} className="w-24 h-24 object-contain mx-auto mb-4" />
                                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800">{zodiacName || 'Chinese Horoscope'}</h2>
                                    </div>

                                    {/* Zodiac Dropdown for changing signs */}
                                    <div className="relative inline-block w-full text-center mb-6">
                                        <div className="relative inline-block w-full md:w-auto">
                                            <select
                                                value={currentZodiac}
                                                onChange={(e) => {
                                                    const selectedZodiac = e.target.value;
                                                    if (selectedZodiac) navigate(`/zodiac/${selectedZodiac.toLowerCase()}`);
                                                }}
                                                className="w-full pl-3 pr-10 py-2 text-lg text-black bg-gray-100 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="" disabled>Change Sign</option>
                                                {allZodiacs.map((sign) => (
                                                    <option key={sign} value={sign.toLowerCase()} className="bg-white text-black">{sign}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                                <svg className="fill-current h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Language Toggle buttons */}
                                    <div className="flex justify-center md:justify-end mb-6">
                                        <div className="inline-flex bg-gray-100 rounded-lg p-1 space-x-1 border border-gray-200">
                                            <button onClick={() => setLanguage('en')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'en' ? 'bg-black text-white' : 'text-gray-600 hover:bg-white'}`}>EN</button>
                                            <button onClick={() => setLanguage('cn')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'cn' ? 'bg-black text-white' : 'text-gray-600 hover:bg-white'}`}>CN</button>
                                            <button onClick={() => setLanguage('both')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'both' ? 'bg-black text-white' : 'text-gray-600 hover:bg-white'}`}>Both</button>
                                        </div>
                                    </div>

                                    {/* Period Tabs with loading indicator */}
                                    <div className="gap-2 mb-6 relative">
                                        <PeriodTabs
                                            tabs={periodTabs}
                                            activeTab={activePeriodTab}
                                            onTabClick={handlePeriodTabChange}
                                        />
                                        {periodLoading && (
                                            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Horoscope Category Tabs using Framer Motion style */}
                                    <div className="flex justify-start flex-wrap mb-6">
                                        <HoroscopeTabs
                                            tabs={categoryTabs}
                                            activeTab={activeCategoryTab}
                                            onTabClick={setActiveCategoryTab}
                                        />
                                    </div>

                                    {/* Content display area with enhanced animations */}
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
                                                key={`${activePeriodTab}-${activeCategoryTab}`}
                                                initial={{ opacity: periodLoading ? 0.3 : 1 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-gray-500 mb-4 text-center text-sm">
                                                    {renderPeriodDateInfo()}
                                                </div>
                                                {renderContent()}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* ADD THIS NEW SECTION - IMAGESWIPER */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">

		{/* Related Zodiac Signs - Internal Links - FIXES ORPHAN PAGES */}
        <section className="max-w-6xl mx-auto px-4 mt-16 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gold mb-6 text-center">
            Explore Other Chinese Zodiac Signs
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allZodiacs.map((zodiacSign) => (
              <Link
                key={zodiacSign}
                to={`/zodiac/${zodiacSign.toLowerCase()}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all text-center"
              >
                <img
                  src={zodiacImages[zodiacSign.toLowerCase()]}
                  alt={`${zodiacSign} Chinese zodiac sign`}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <h3 className="text-sm font-semibold text-gray-800">{zodiacSign}</h3>
              </Link>
            ))}
          </div>
        </section>
		
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
                Play & Discover
            </h2>
            <div className="flex flex-col items-center">
                <ImageSwiper
                    images={allFeatureImages}
                    // 2. Pass the index from the swiper to the handler
                    onSwipe={handleCardSwipe}
                />

                <div className="text-center mt-4">
                    {/* The details now correctly update with the new index */}
                    <h3 className="text-lg font-semibold">{featureCards[activeCardIndex].title}</h3>
                    <p className="text-sm text-muted-foreground">{featureCards[activeCardIndex].description}</p>
                    <p className="mt-1">
                        <span className="font-semibold">{featureCards[activeCardIndex].price}</span>
                    </p>
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
                        ) : loading && zodiac ? (
                            // Daily forecast is still being fetched client-side.
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center text-gray-600 py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mx-auto mb-6"></div>
                                <p className="text-lg font-semibold text-gray-800">
                                    Unveiling your {zodiacName} horoscope…
                                </p>
                            </div>
                        ) : (
                            // UI for when no horoscope data is found or zodiac is not selected
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center text-gray-600 py-8">
                                <p className="mb-4 text-xl font-semibold">
                                    {zodiac ? `No horoscope data found for ${zodiacName} today. Please try another sign or check back later.` : 'Please select a Chinese Zodiac sign to view its horoscope.'}
                                </p>
                                <p>You can also use the Chinese Zodiac Calculator to find your sign.</p>
                                <button onClick={() => navigate('/astrology/chinese-zodiac-calculator')} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-4 inline-block">Calculate My Sign</button>

                            </div>
                        )}
                    </div>
                </div>

                {/* Evergreen, prerendered per-sign content. Sourced from static data (not
                    the client-fetched API), so this renders into the SSG HTML and gives the
                    page real, unique, indexable content that never goes stale. */}
                {zodiacInfo && (
                    <section className="max-w-3xl mx-auto px-2 mt-16 mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                            About the {zodiacName} in Chinese Astrology
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700 mb-8">
                            {zodiacInfo.personalityInsights}{' '}
                            <span className="font-semibold">Key traits:</span> {zodiacInfo.traits}
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {zodiacName} Compatibility
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-700 mb-8">
                            {zodiacInfo.compatibility}
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {zodiacName} Lucky Numbers, Colors &amp; Directions
                        </h3>
                        <ul className="text-lg leading-relaxed text-gray-700 mb-8 list-disc list-inside space-y-1">
                            <li><span className="font-semibold">Lucky numbers:</span> {zodiacInfo.luckyNumbers.join(', ')}</li>
                            <li><span className="font-semibold">Lucky colors:</span> {zodiacInfo.luckyColors.join(', ')}</li>
                            <li><span className="font-semibold">Lucky directions:</span> {zodiacInfo.luckyDirections.join(', ')}</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Career &amp; Wealth for the {zodiacName}
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-700 mb-8">
                            {zodiacInfo.careerAdvice}
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Feng Shui Tips for the {zodiacName}
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-700">
                            {zodiacInfo.fengShuiTips}
                        </p>
                    </section>
                )}
            </main>
        </div>
	</>
    );
};

export default ChineseHoroscopeResult;