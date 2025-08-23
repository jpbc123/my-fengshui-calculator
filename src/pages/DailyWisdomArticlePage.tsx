// src/pages/DailyWisdomArticlePage.tsx
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
    <div className="min-h-screen bg-white text-black flex flex-col mt-8">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Daily Words of Wisdom</h1>
          <p className="whitespace-pre-line">{articleContent}</p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default DailyWisdomArticlePage;