// src/components/DailyWisdomBanner.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const fallbackMessages = [
  "Your home is a reflection of your inner self. Make it peaceful.",
  "Small changes in your space can bring big changes in your life.",
  "Today is the perfect day to align your environment with your goals.",
  "Let positive energy flow through your living space today.",
  "Harmony in your surroundings creates harmony within.",
  "Your environment shapes your mindset. Choose to make it uplifting.",
  "A balanced space fosters a balanced life.",
  "Welcome positive chi into your home today."
];

const getTodayDate = () => {
  const date = new Date();
  return date.toISOString().slice(0, 10);
};

const DailyWisdomBanner = () => {
  const [partialMessage, setPartialMessage] = useState("Loading daily wisdom...");
  const [fullArticle, setFullArticle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const articlePath = "/daily-wisdom-article";

  useEffect(() => {
    const fetchAndSetDailyWisdom = async () => {
      const today = getTodayDate();
      const cachedMessage = localStorage.getItem(`dailyWisdom_${today}`);
      const cachedFullArticle = localStorage.getItem(`dailyWisdomFullArticle_${today}`);

      // Only use cache if both quote AND article exist and article is not a fallback
      if (cachedMessage && cachedFullArticle && !cachedFullArticle.includes('(This is a fallback message')) {
        setPartialMessage(cachedMessage);
        setFullArticle(cachedFullArticle);
        setIsLoading(false);
        return;
      }

      let generatedQuote = "";
      let generatedArticle = "";
      let usedFallback = false;

      try {
        console.log('Fetching daily wisdom from API...');
        // Try full URL if relative URL doesn't work
        const response = await fetch('http://localhost:3001/api/daily-wisdom');
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Check if the API returned valid data
        if (!result.quote || !result.article) {
          throw new Error('API returned incomplete data');
        }
        
        generatedQuote = result.quote;
        generatedArticle = result.article;
        console.log('Successfully fetched from API');
      } catch (error) {
        console.error("Failed to fetch daily wisdom:", error);
        const randomIndex = Math.floor(Math.random() * fallbackMessages.length);
        generatedQuote = fallbackMessages[randomIndex];
        generatedArticle = `**${generatedQuote}**\n\n(This is a fallback message. Today's article cannot be found.)`;
        usedFallback = true;
      }

      const displayMessage = generatedQuote.length > 80
        ? generatedQuote.substring(0, 77) + "..."
        : generatedQuote;

      setPartialMessage(displayMessage);
      setFullArticle(generatedArticle);
      
      // Only cache if we didn't use fallback
      if (!usedFallback) {
        localStorage.setItem(`dailyWisdom_${today}`, displayMessage);
        localStorage.setItem(`dailyWisdomFullArticle_${today}`, generatedArticle);
        console.log('Cached fresh content to localStorage');
      } else {
        console.log('Using fallback, not caching to localStorage');
      }
      
      setIsLoading(false);
    };

    fetchAndSetDailyWisdom();
    
  }, []);

  const storeFullArticle = () => {
    // Always store the current full article to sessionStorage when clicking
    sessionStorage.setItem('currentDailyWisdomArticle', fullArticle);
    console.log('Stored article to sessionStorage:', fullArticle.substring(0, 100) + '...');
  };

  const clearTodayCache = () => {
    const today = getTodayDate();
    localStorage.removeItem(`dailyWisdom_${today}`);
    localStorage.removeItem(`dailyWisdomFullArticle_${today}`);
    console.log('Cleared today\'s cache');
    window.location.reload();
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