// src/pages/ChineseHoroscopeResult.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header'; // Adjusted import path
import Footer from '../components/Footer'; // Adjusted import path
import Breadcrumb from '../components/Breadcrumb'; // Adjusted import path

// Import zodiac images - Adjusted import paths
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
  rat: ratImage,
  ox: oxImage,
  tiger: tigerImage,
  rabbit: rabbitImage,
  dragon: dragonImage,
  snake: snakeImage,
  horse: horseImage,
  goat: goatImage,
  monkey: monkeyImage,
  rooster: roosterImage,
  dog: dogImage,
  pig: pigImage
};

// List of all zodiac signs for the dropdown
const allZodiacs = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse",
  "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

type TabType = 'horoscope' | 'relationship' | 'career' | 'wealth' | 'social' | 'lucky_color' | 'lucky_number';
type LanguageType = 'both' | 'cn' | 'en';

const ChineseHoroscopeResult = () => {
  const { zodiac } = useParams<{ zodiac: string }>();
  const navigate = useNavigate();
  const [horoscopeData, setHoroscopeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('horoscope');
  const [language, setLanguage] = useState<LanguageType>('en'); // 2. Default language set to English

  // Create breadcrumbs based on the zodiac
  const zodiacName = zodiac ? zodiac.charAt(0).toUpperCase() + zodiac.slice(1) : '';
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: `${zodiacName} Horoscope` },
  ];

  const horoscopeTabs = [
    { id: 'horoscope', label: 'Horoscope', icon: '☀️', field: 'horoscope', field_en: 'horoscope_en' },
    { id: 'relationship', label: 'Relationship', icon: '💕', field: 'love', field_en: 'love_en' },
    { id: 'career', label: 'Career', icon: '💼', field: 'career', field_en: 'career_en' },
    { id: 'wealth', label: 'Wealth', icon: '💰', field: 'money', field_en: 'money_en' },
    { id: 'social', label: 'Social', icon: '👥', field: 'social', field_en: 'social_en' },
    { id: 'lucky_color', label: 'Lucky Color', icon: '🌈', field: 'lucky_color', field_en: 'lucky_color_en' },
    { id: 'lucky_number', label: 'Lucky Number', icon: '🔢', field: 'lucky_number', field_en: 'lucky_number_en' },
  ];

  useEffect(() => {
    const fetchHoroscopeData = async () => {
      if (!zodiac) {
        setLoading(false);
        setHoroscopeData(null);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split('T')[0];
        const { data, error: supabaseError } = await supabase
          .from('daily_chinese_horoscope')
          .select('*')
          .eq('sign', zodiac)
          .eq('for_date', today)
          .single();

        if (supabaseError) {
          setError('Horoscope data not found for today. Please try again later.');
          return;
        }

        setHoroscopeData(data);
      } catch (err) {
        setError('Failed to fetch horoscope data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscopeData();
  }, [zodiac]);

  const renderContent = () => {
    if (!horoscopeData) return null;
    const activeTabData = horoscopeTabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;

    const chineseContent = horoscopeData[activeTabData.field];
    const englishContent = horoscopeData[activeTabData.field_en];

    if (!chineseContent && !englishContent) {
      return (
        <div className="text-center text-white/70 py-8">
          <p>No data available for this section.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {chineseContent && (language === 'both' || language === 'cn') && (
          <div>
            {language === 'both' && <p className="text-white/90 text-sm mb-2 font-semibold">中文:</p>}
            <p className="text-lg leading-relaxed text-white">{chineseContent}</p>
          </div>
        )}
        {englishContent && (language === 'both' || language === 'en') && (
          <div>
            {language === 'both' && <p className="text-white/90 text-sm mb-2 font-semibold">English:</p>}
            <p className="text-lg leading-relaxed text-white">{englishContent}</p>
          </div>
        )}
      </div>
    );
  };

  const currentZodiac = zodiac || '';

  if (loading && zodiac) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white">
        <Header />
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading {zodiac?.toUpperCase()} horoscope...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white">
      <Header />
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 1. Everything left aligned */}
        <div className="mb-8 text-left">
          <div className="flex items-center mb-4 justify-start">
            {currentZodiac && (
              <img
                src={zodiacImages[currentZodiac]}
                alt={zodiacName}
                className="w-20 h-20 object-contain mr-4"
              />
            )}
            <h1 className="text-4xl md:text-5xl font-bold">
              {zodiacName || 'Chinese Horoscope'}
            </h1>
          </div>
          
          {/* Zodiac Dropdown with Placeholder */}
          <div className="relative inline-block text-white mb-2">
            <select
              value={currentZodiac}
              onChange={(e) => {
                const selectedZodiac = e.target.value;
                if (selectedZodiac) {
                  navigate(`/zodiac/${selectedZodiac.toLowerCase()}`);
                }
              }}
              className="w-full pl-3 pr-10 py-2 text-lg text-white bg-white/20 border border-white/40 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="" disabled hidden={!!currentZodiac} selected={!currentZodiac}>
                Change Sign
              </option>
              {allZodiacs.map((sign) => (
                <option key={sign} value={sign.toLowerCase()} className="bg-red-900 text-white">
                  {sign}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Main content box with tabs, date, and language toggle */}
        {currentZodiac && horoscopeData ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            {/* Tab Navigation */}
            <h2 className="text-2xl font-bold text-gold mb-6 text-center">
              More Horoscopes for {zodiacName}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {horoscopeTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center px-4 py-3 rounded-lg border transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gold text-red-900 border-gold shadow-lg transform scale-105'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  <span className="font-medium text-sm md:text-base">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 5. Date and 6. Language Toggle (adjacent and right-aligned) */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 text-left">
              <p className="text-white/80 mb-2 sm:mb-0">
                {new Date(horoscopeData.for_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex-shrink-0">
                <button
                  onClick={() => setLanguage('cn')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    language === 'cn' ? 'bg-gold text-red-900' : 'text-white hover:bg-white/10'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    language === 'en' ? 'bg-gold text-red-900' : 'text-white hover:bg-white/10'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('both')} // 3. "Both Languages" last
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    language === 'both' ? 'bg-gold text-red-900' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Both Languages
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="mb-12">
              {renderContent()}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center text-white/70 py-8">
            <p className="mb-4 text-xl font-semibold">
              {zodiac ? `No horoscope data found for ${zodiacName} today. Please try another sign or check back later.` : 'Please select a Chinese Zodiac sign from the dropdown above to view its horoscope.'}
            </p>
            <p>You can also use the Chinese Zodiac Calculator to find your sign.</p>
            <button
              onClick={() => navigate('/chinese-zodiac-calculator')}
              className="bg-gold text-red-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors mt-4 inline-block"
            >
              Calculate My Sign
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Horoscope updated daily. Check back tomorrow for new insights!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChineseHoroscopeResult;