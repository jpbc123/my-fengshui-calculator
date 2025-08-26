// src/pages/ChineseHoroscopeResult.tsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { motion } from 'framer-motion';
import PeriodTabs from '../components/PeriodTabs';

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
    id?: string;
    sign: string;
    horoscope: string;
    horoscope_en: string;
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
    updated_at: string;
}

// Specific interfaces for each period
interface DailyHoroscopeDataType extends BaseHoroscopeData {
    for_date: string;
}

interface WeeklyHoroscopeDataType extends BaseHoroscopeData {
    start_date: string;
    end_date: string;
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
    const [activePeriodTab, setActivePeriodTab] = useState<PeriodTabType>('today'); // New state for period tabs
    const [language, setLanguage] = useState<LanguageType>('en');

    const periodTabs = useMemo(() => [
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'today', label: 'Today' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'yearly', label: 'Current Year' },
    ], []);

    const zodiacName = zodiac ? zodiac.charAt(0).toUpperCase() + zodiac.slice(1) : '';
    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: `${zodiacName} Horoscope` },
    ];

    const categoryTabs: CategoryTabItem[] = useMemo(() => [
        { id: 'horoscope', label: 'Overview', icon: '☀️', field: 'horoscope', field_en: 'horoscope_en' },
        { id: 'relationship', label: 'Relationship', icon: '💕', field: 'love', field_en: 'love_en' },
        { id: 'career', label: 'Career', icon: '💼', field: 'career', field_en: 'career_en' },
        { id: 'wealth', label: 'Wealth', icon: '💰', field: 'money', field_en: 'money_en' },
        { id: 'social', label: 'Social', icon: '👥', field: 'social', field_en: 'social_en' },
        { id: 'lucky_color', label: 'Lucky Color', icon: '🌈', field: 'lucky_color', field_en: 'lucky_color_en' },
        { id: 'lucky_number', label: 'Lucky Number', icon: '🔢', field: 'lucky_number', field_en: 'lucky_number_en' },
    ], []);

    useEffect(() => {
        const fetchHoroscopeData = async () => {
            if (!zodiac) {
                setLoading(false);
                setHoroscopeData(null);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            let apiUrl = `/api/chinese-horoscope/${zodiac.toLowerCase()}`;
            
            // Construct the API URL based on the active period tab
            if (activePeriodTab === 'today' || activePeriodTab === 'yesterday') {
                const dayOffset = activePeriodTab === 'yesterday' ? -1 : 0;
                apiUrl += `?period=daily&dayOffset=${dayOffset}`;
            } else if (activePeriodTab === 'weekly') {
                const { start, end } = getWeekDates();
                apiUrl += `?period=weekly&startDate=${start}&endDate=${end}`;
            } else if (activePeriodTab === 'yearly') {
                apiUrl += `?period=yearly`;
            }

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.statusText}`);
                }
                const data: HoroscopeDataType = await response.json();
                setHoroscopeData(data);
            } catch (err: any) {
                console.error("Failed to fetch horoscope data:", err);
                setError(err.message || 'Failed to fetch horoscope data. Please try again.');
                setHoroscopeData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchHoroscopeData();
    }, [zodiac, activePeriodTab]); // Re-fetch when zodiac or period tab changes
    

    const renderContent = () => {
        if (loading) return null;
        if (error) return <div className="text-center text-red-500 py-8"><p>{error}</p></div>;
        if (!horoscopeData) return <div className="text-center text-gray-500 py-8"><p>No data available for this section.</p></div>;

        const activeTabData = categoryTabs.find(tab => tab.id === activeCategoryTab);
        if (!activeTabData) return null;

        const chineseContent = (horoscopeData as any)[activeTabData.field];
        const englishContent = (horoscopeData as any)[activeTabData.field_en];

        if (!chineseContent && !englishContent) {
            return <div className="text-center text-gray-500 py-8"><p>No data available for this section.</p></div>;
        }

        return (
            <div className="space-y-6">
                {englishContent && (language === 'both' || language === 'en') && (
                    <div>
                        {language === 'both' && <p className="text-gray-400 text-sm mb-2 font-semibold">English:</p>}
                        <p className="prose text-lg leading-relaxed text-gray-800">{englishContent}</p>
                    </div>
                )}
                {chineseContent && (language === 'both' || language === 'cn') && (
                    <div>
                        {language === 'both' && <p className="text-gray-400 text-sm mb-2 font-semibold">中文:</p>}
                        <p className="prose text-lg leading-relaxed text-gray-800">{chineseContent}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderPeriodDateInfo = () => {
        if (!horoscopeData) return null;

        if (activePeriodTab === 'today' || activePeriodTab === 'yesterday') {
            const dailyData = horoscopeData as DailyHoroscopeDataType;
            return new Date(dailyData.for_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (activePeriodTab === 'weekly') {
            const weeklyData = horoscopeData as WeeklyHoroscopeDataType;
            const start = new Date(weeklyData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const end = new Date(weeklyData.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `Week of ${start} - ${end}`;
        } else if (activePeriodTab === 'yearly') {
            const yearlyData = horoscopeData as YearlyHoroscopeDataType;
            return `Year ${yearlyData.year} General Outlook`;
        }
        return null;
    };

    const currentZodiac = zodiac || '';

    if (loading && zodiac) {
        return (
            <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-4">
                <Header />
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto mb-6"></div>
                        <p className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                            Unveiling Your {zodiacName} Horoscope...
                        </p>
                        <p className="text-sm text-gray-500">Please wait, this will only take a moment.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl mt-20">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex flex-col lg:flex-row gap-6 mt-8">
                    {/* Main Content Area */}
                    <div className="flex-1 lg:max-w-3xl">
                        {currentZodiac && horoscopeData ? (
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                {/* Zodiac title + image */}
                                <div className="mb-8 text-center">
                                    <img src={zodiacImages[currentZodiac]} alt={zodiacName} className="w-24 h-24 object-contain mx-auto mb-4" />
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{zodiacName || 'Chinese Horoscope'}</h1>
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
                                            <option value="" disabled hidden={!!currentZodiac} selected={!currentZodiac}>Change Sign</option>
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
                                        <button onClick={() => setLanguage('cn')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'cn' ? 'bg-black text-white' : 'text-gray-600 hover:bg-white'}`}>中文</button>
                                        <button onClick={() => setLanguage('both')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'both' ? 'bg-black text-white' : 'text-gray-600 hover:bg-white'}`}>Both</button>
                                    </div>
                                </div>

                                {/* Period Tabs (Today, Yesterday, Weekly, Yearly) */}
                                <div className="flex justify-start flex-wrap gap-2 mb-6">
                                    <PeriodTabs
                                        tabs={periodTabs}
                                        activeTab={activePeriodTab}
                                        onTabClick={setActivePeriodTab}
                                    />
                                </div>
                                

                                {/* Horoscope Category Tabs using Framer Motion style */}
                                <div className="mb-6">
                                    <HoroscopeTabs
                                        tabs={categoryTabs}
                                        activeTab={activeCategoryTab}
                                        onTabClick={setActiveCategoryTab}
                                    />
                                </div>

                                {/* Content display area */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                                    <div className="text-gray-500 mb-4 text-center text-sm">
                                        {renderPeriodDateInfo()} {/* Dynamic date/period info */}
                                    </div>
                                    {renderContent()} {/* Render the horoscope content */}
                                </div>
                            </div>
                        ) : (
                            // UI for when no horoscope data is found or zodiac is not selected
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center text-gray-600 py-8">
                                <p className="mb-4 text-xl font-semibold">
                                    {zodiac ? `No horoscope data found for ${zodiacName} today. Please try another sign or check back later.` : 'Please select a Chinese Zodiac sign to view its horoscope.'}
                                </p>
                                <p>You can also use the Chinese Zodiac Calculator to find your sign.</p>
                                <button onClick={() => navigate('/chinese-zodiac-calculator')} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-4 inline-block">Calculate My Sign</button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Ad Placeholder */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg p-4 text-center text-gray-600 border border-gray-200 shadow-sm">
                            <span className="font-semibold text-xl text-gray-800">Your Ad Here</span>
                            <p className="text-sm mt-2">Space for a sponsor or a relevant product.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ChineseHoroscopeResult;