import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dayjs from 'dayjs';

const DailyWisdomArticlePage = () => {
  const [articleContent, setArticleContent] = useState('Loading your daily wisdom...');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    
    // Try to get from sessionStorage first (for immediate navigation)
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col pt-8">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-300 to-purple-400">
          <article className="prose lg:prose-xl mx-auto bg-white p-6 md:p-10 rounded-2xl border-4 border-white shadow-xl ring-2 ring-yellow-400 transform transition-transform duration-300 hover:scale-[1.01]">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
              Your insight for the day ✨
            </h1>
            
            {quote && (
              <blockquote className="text-xl md:text-2xl font-semibold text-center mb-8 text-purple-700 italic border-l-4 border-purple-500 pl-4">
                "{quote}"
              </blockquote>
            )}
            
            <div className="whitespace-pre-line text-gray-800 leading-relaxed text-lg">
              {articleContent}
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => window.history.back()}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                ← Back to Home
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default DailyWisdomArticlePage;