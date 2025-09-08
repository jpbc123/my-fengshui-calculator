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
  const articlePath = "/daily-wisdom-article";

  useEffect(() => {
    const fetchDailyWisdom = async () => {
      const today = getTodayDate();
      
      // Check cache first
      const cachedQuote = localStorage.getItem(`dailyWisdom_${today}`);
      const cachedArticle = localStorage.getItem(`dailyWisdomFullArticle_${today}`);
      
      if (cachedQuote && cachedArticle) {
        console.log(`Using cached daily wisdom for ${today}`);
        setPartialMessage(cachedQuote);
        setFullArticle(cachedArticle);
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
          
          // Cache the data
          localStorage.setItem(`dailyWisdom_${today}`, data.quote);
          localStorage.setItem(`dailyWisdomFullArticle_${today}`, data.article);
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

  // FIXED: Store both article and quote in sessionStorage for immediate access
  const storeFullArticle = () => {
    if (fullArticle && partialMessage) {
      sessionStorage.setItem('currentDailyWisdomArticle', fullArticle);
      sessionStorage.setItem('currentDailyWisdomQuote', partialMessage);
      console.log('Stored daily wisdom in sessionStorage for article page');
    }
  };

  return (
    <div className="w-full mt-6">
      <section className="py-8 px-6 md:py-10 md:px-12 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-800 text-white rounded-xl shadow-xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer">
        <Link to={articlePath} onClick={storeFullArticle} className="block w-full h-full no-underline">
          <div className="flex flex-col items-center md:flex-row md:items-start justify-between space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0 text-4xl md:text-5xl">✨</div>
            <div className="flex flex-col text-center md:text-left flex-grow">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gold">Today's Insight</h2>
              <p className="text-lg md:text-xl font-medium italic">
                {isLoading ? "Loading daily wisdom..." : `"${partialMessage}"`}
              </p>
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-2 items-center">
                <button className="bg-gold text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-gold/80 transition-colors shadow-md">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default DailyWisdomBanner;