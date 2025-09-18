import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Compass, 
  Zap, 
  Globe,
  ArrowLeft,
  Share2,
  Clock
} from 'lucide-react';

interface PlanetaryOverviewData {
  date: string;
  planetary_index?: number;
  summary?: string;
  article?: string;
  is_fallback?: boolean;
}

const DailyWisdomArticlePage = () => {
  const [articleContent, setArticleContent] = useState('Loading your daily wisdom...');
  const [quote, setQuote] = useState('');
  const [contentType, setContentType] = useState<'wisdom' | 'planetary'>('wisdom');
  const [planetaryData, setPlanetaryData] = useState<PlanetaryOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    
    // Check if we have planetary data in sessionStorage
    const planetaryOverviewData = sessionStorage.getItem('currentPlanetaryOverview');
    if (planetaryOverviewData) {
      try {
        const data = JSON.parse(planetaryOverviewData);
        setPlanetaryData(data);
        setContentType('planetary');
        setArticleContent(data.article || 'Planetary overview content is not available.');
        setQuote(data.summary || '');
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing planetary data:', error);
      }
    }
    
    // Try to get wisdom data from sessionStorage first (for immediate navigation)
    let content = sessionStorage.getItem('currentDailyWisdomArticle');
    let savedQuote = sessionStorage.getItem('currentDailyWisdomQuote');
    
    // If not found, try localStorage with today's date
    if (!content) {
      content = localStorage.getItem(`dailyWisdomFullArticle_${today}`);
      savedQuote = localStorage.getItem(`dailyWisdom_${today}`);
    }
    
    // If still not found, fetch from API
    if (!content) {
      fetchDailyWisdom();
    } else {
      setArticleContent(content);
      setQuote(savedQuote || '');
      setContentType('wisdom');
      setIsLoading(false);
    }
  }, []);

  const fetchDailyWisdom = async () => {
    try {
      const response = await fetch('/api/daily-wisdom');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.article && data.quote) {
        setArticleContent(data.article);
        setQuote(data.quote);
        setContentType('wisdom');
        
        // Store for future use
        const today = dayjs().format('YYYY-MM-DD');
        localStorage.setItem(`dailyWisdomFullArticle_${today}`, data.article);
        localStorage.setItem(`dailyWisdom_${today}`, data.quote);
        sessionStorage.setItem('currentDailyWisdomArticle', data.article);
        sessionStorage.setItem('currentDailyWisdomQuote', data.quote);
      } else {
        setArticleContent('Daily wisdom content is not available at the moment. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching daily wisdom:', error);
      setArticleContent('Unable to load daily wisdom. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: contentType === 'planetary' ? 'Daily Planetary Overview' : 'Daily Wisdom Insight',
          text: quote,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(`${quote} - ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const relatedLinks = [
    {
      title: "Chinese Zodiac Reading",
      description: "Discover your Chinese zodiac traits and compatibility",
      link: "/astrology/chinese-zodiac-calculator",
      icon: <Compass className="w-5 h-5" />,
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Western Horoscope",
      description: "Get your personalized astrological insights",
      link: "/astrology/western-zodiac-calculator",
      icon: <Star className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Feng Shui Calculator",
      description: "Find your Kua number and personal element",
      link: "/feng-shui/kua-number",
      icon: <Globe className="w-5 h-5" />,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Numerology Reading",
      description: "Explore the power of numbers in your life",
      link: "/numerology/visiber-calculator",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Meditation & Mindfulness",
      description: "Start your spiritual journey with guided meditation",
      link: "/meditation",
      icon: <Heart className="w-5 h-5" />,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Aura Analysis",
      description: "Discover your spiritual energy and aura colors",
      link: "/games-fun/aura-analysis",
      icon: <Zap className="w-5 h-5" />,
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const gameLinks = [
    {
      title: "Lucky Numbers",
      description: "Generate your personal lucky numbers",
      link: "/games-fun/lucky-numbers-generator",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: "Name Compatibility",
      description: "Check compatibility with someone special",
      link: "/games-fun/name-compatibility",
      icon: <Heart className="w-5 h-5" />
    },
    {
      title: "Fortune Cookie",
      description: "Get a personalized fortune message",
      link: "/games-fun/fortune-cookie",
      icon: <Star className="w-5 h-5" />
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-gray-800 text-lg">Loading your daily insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Header with date and controls */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-white transition-colors group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock size={16} />
                  <span className="text-sm font-medium">{dayjs().format('MMMM D, YYYY')}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  <Share2 size={16} />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {contentType === 'planetary' ? (
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {contentType === 'planetary' ? 'Planetary Overview' : 'Daily Wisdom'}
                </h1>
              </div>
              
              {planetaryData?.planetary_index && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-gray-600 font-medium">Planetary Index:</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={20}
                        className={`${
                          index < (planetaryData.planetary_index || 0)
                            ? 'text-purple-600 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-purple-600 font-bold">
                    {planetaryData.planetary_index}/5
                  </span>
                </div>
              )}
            </div>

            {/* Quote/Summary */}
            {quote && (
              <blockquote className="text-center mb-8">
                <div className="relative max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-8">
                  <span className="text-purple-400 text-6xl absolute -left-2 -top-2 font-serif opacity-50">"</span>
                  <p className="text-xl md:text-2xl font-medium text-gray-800 italic leading-relaxed px-8">
                    {quote}
                  </p>
                  <span className="text-purple-400 text-6xl absolute -right-2 -bottom-6 font-serif opacity-50">"</span>
                </div>
              </blockquote>
            )}
          </div>
        </motion.div>

        {/* Main Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-purple-50 rounded-3xl"></div>
          <article className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-100">
            <div className="prose lg:prose-xl mx-auto max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed text-lg">
                {articleContent}
              </div>
            </div>
          </article>
        </motion.div>

        {/* Related Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
            Continue Your Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {relatedLinks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Link
                  to={item.link}
                  className="group block relative overflow-hidden rounded-2xl bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-purple-200 p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${item.color} shadow-lg`}>
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun & Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Fun & Games
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gameLinks.map((game, index) => (
              <Link
                key={index}
                to={game.link}
                className="group relative overflow-hidden rounded-2xl bg-white hover:bg-pink-50 border-2 border-gray-100 hover:border-pink-200 p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                    {game.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-700 transition-colors">
                    {game.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {game.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DailyWisdomArticlePage;