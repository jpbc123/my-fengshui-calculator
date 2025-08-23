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
    const fetchDailyMessage = async () => {
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
        const prompt = "Generate a concise, uplifting motivational quote (under 15 words) related to feng shui, numerology, or astrology. Then, expand on that quote with a short, insightful article (about 250-300 words) that provides practical advice or deeper meaning. Format the output as a JSON object with 'quote' and 'article' keys.";
        
        const payload = {
          prompt, // Send the prompt to your backend
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                "quote": { "type": "STRING" },
                "article": { "type": "STRING" }
              }
            }
          }
        };

        // This is the key change: call your own secure endpoint
        const response = await fetch('http://localhost:3001/api/gemini/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();
        const jsonResponse = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonResponse);
        generatedQuote = parsedJson.quote;
        generatedArticle = parsedJson.article;

      } catch (error) {
        console.error("Failed to fetch AI-generated message:", error);
        const randomIndex = Math.floor(Math.random() * fallbackMessages.length);
        generatedQuote = fallbackMessages[randomIndex];
        generatedArticle = generatedQuote + "\n\n(This is a fallback message. The full article would expand on this, perhaps with a short reflection on its meaning in daily life or a small task related to it. For example, if the quote is about 'peaceful home', the article could suggest decluttering one corner today.)";
      }

      const displayMessage = generatedQuote.length > 80
        ? generatedQuote.substring(0, 77) + "..."
        : generatedQuote;

      setPartialMessage(displayMessage);
      setFullArticle(generatedArticle);

      localStorage.setItem(`dailyWisdom_${today}`, displayMessage);
      localStorage.setItem(`dailyWisdomFullArticle_${today}`, generatedArticle);
    };

    fetchDailyMessage();
  }, []);

  const storeFullArticle = () => {
    sessionStorage.setItem('currentDailyWisdomArticle', fullArticle);
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-r from-purple-800 to-indigo-800 text-white rounded-lg shadow-xl mx-auto max-w-6xl my-8 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer">
      <Link to={articlePath} onClick={storeFullArticle} className="block w-full h-full no-underline">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0 text-3xl md:text-4xl">✨</div>
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Daily Wisdom</h2>
            <p className="text-lg md:text-xl font-medium italic">
              "{partialMessage}"
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="inline-flex items-center text-gold hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default DailyWisdomBanner;