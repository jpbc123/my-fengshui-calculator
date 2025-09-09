import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const getTodayDate = () => {
  return dayjs().format('YYYY-MM-DD');
};

const DailyWisdomBanner = () => {
  const [partialMessage, setPartialMessage] = useState("Loading daily wisdom...");
  const [fullArticle, setFullArticle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const articlePath = "/daily-wisdom-article";

  useEffect(() => {
    const fetchDailyWisdom = async () => {
      const today = getTodayDate();
      
      // Check cache first - using in-memory storage instead of localStorage
      const cacheKey = `dailyWisdom_${today}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { quote, article } = JSON.parse(cachedData);
        console.log(`Using cached daily wisdom for ${today}`);
        setPartialMessage(quote);
        setFullArticle(article);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/daily-wisdom');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        if (data && data.quote && data.article) {
          setPartialMessage(data.quote);
          setFullArticle(data.article);
          
          // Cache the data in sessionStorage
          sessionStorage.setItem(cacheKey, JSON.stringify({
            quote: data.quote,
            article: data.article
          }));
          console.log(`Cached daily wisdom for ${today}`);
        } else {
          setPartialMessage("Daily wisdom not available today. Please check back later.");
          setFullArticle("");
        }
      } catch (error) {
        console.error("Failed to fetch daily wisdom:", error);
        setPartialMessage("Failed to load today's wisdom.");
        setFullArticle("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyWisdom();
  }, []);

  const storeFullArticle = () => {
    if (fullArticle && partialMessage) {
      sessionStorage.setItem('currentDailyWisdomArticle', fullArticle);
      sessionStorage.setItem('currentDailyWisdomQuote', partialMessage);
      console.log('Stored daily wisdom in sessionStorage for article page');
    }
  };

  return (
    <div className="w-full mt-6">
      <section 
        className="relative py-8 px-6 md:py-12 md:px-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-3xl group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
        
        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <Link to={articlePath} onClick={storeFullArticle} className="relative z-10 block w-full h-full no-underline">
          <div className="flex flex-col items-center md:flex-row md:items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
            {/* Icon with animation */}
            <div className="flex-shrink-0 relative">
              <div className={`text-5xl md:text-6xl transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                ✨
              </div>
              <div className="absolute inset-0 text-5xl md:text-6xl opacity-30 blur-sm">✨</div>
            </div>
            
            {/* Content */}
            <div className="flex flex-col text-center md:text-left flex-grow">
              {/* Title with gradient text */}
              <div className="mb-4">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-1">
                  Today's Insight
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full mx-auto md:mx-0 opacity-75"></div>
              </div>
              
              {/* Quote with better typography */}
              <div className="mb-6">
                {isLoading ? (
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-lg text-gray-300 ml-3">Loading daily wisdom...</span>
                  </div>
                ) : (
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-gray-100 relative">
                    <span className="text-yellow-400 text-3xl absolute -left-2 -top-2 font-serif">"</span>
                    <span className="italic">{partialMessage}</span>
                    <span className="text-yellow-400 text-3xl absolute -bottom-4 font-serif">"</span>
                  </blockquote>
                )}
              </div>
              
              {/* CTA Button with modern styling */}
              <div className="flex flex-col sm:flex-row gap-3 items-center md:items-start">
                <button className={`
                  group/btn relative px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full 
                  shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105
                  overflow-hidden ${isHovered ? 'animate-pulse' : ''}
                `}>
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Discover More</span>
                    <span className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                {/* Date indicator */}
                <div className="text-sm text-gray-400 flex items-center space-x-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span>{dayjs().format('MMMM D, YYYY')}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default DailyWisdomBanner;