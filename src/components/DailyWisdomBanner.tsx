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
  const articlePath = "/daily-wisdom-article";

  useEffect(() => {
    const fetchAndSetDailyWisdom = async () => {
      const today = getTodayDate();
      const cachedMessage = localStorage.getItem(`dailyWisdom_${today}`);
      const cachedFullArticle = localStorage.getItem(`dailyWisdomFullArticle_${today}`);

      if (cachedMessage && cachedFullArticle) {
        setPartialMessage(cachedMessage);
        setFullArticle(cachedFullArticle);
        return;
      }

      let generatedQuote = "";
      let generatedArticle = "";

      try {
        const response = await fetch('/api/daily-wisdom');
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        
        const result = await response.json();
        generatedQuote = result.quote;
        generatedArticle = result.article;
      } catch (error) {
        console.error("Failed to fetch daily wisdom:", error);
        const randomIndex = Math.floor(Math.random() * fallbackMessages.length);
        generatedQuote = fallbackMessages[randomIndex];
        generatedArticle = `**${generatedQuote}**\n\n(This is a fallback message. The full article would expand on this, perhaps with a short reflection on its meaning in daily life or a small task related to it. For example, if the quote is about 'peaceful home', the article could suggest decluttering one corner today.)`;
      }

      const displayMessage = generatedQuote.length > 80
        ? generatedQuote.substring(0, 77) + "..."
        : generatedQuote;

      setPartialMessage(displayMessage);
      setFullArticle(generatedArticle);
      
      localStorage.setItem(`dailyWisdom_${today}`, displayMessage);
      localStorage.setItem(`dailyWisdomFullArticle_${today}`, generatedArticle);
    };

    fetchAndSetDailyWisdom();
    
  }, []);

  const storeFullArticle = () => {
    sessionStorage.setItem('currentDailyWisdomArticle', fullArticle);
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
                "{partialMessage}"
              </p>
              <div className="mt-4 md:mt-6">
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