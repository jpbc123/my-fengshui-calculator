import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DailyWisdomArticlePage = () => {
  const [articleContent, setArticleContent] = useState('Content not found. Please go back to the homepage.');

  useEffect(() => {
    const content = sessionStorage.getItem('currentDailyWisdomArticle');
    if (content) {
      setArticleContent(content);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col pt-8">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* The outer container with the soft blue-purple gradient */}
        <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-300 to-purple-400">
          {/* The main article with the gold border */}
          <article className="prose lg:prose-xl mx-auto bg-white p-6 md:p-10 rounded-2xl border-4 border-white shadow-xl ring-2 ring-yellow-400 transform transition-transform duration-300 hover:scale-[1.01]">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Your insight for the day ✨</h1>
            <p className="whitespace-pre-line text-gray-800 leading-relaxed text-lg">{articleContent}</p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DailyWisdomArticlePage;