// src/pages/GamesFunLanding.tsx
import { Helmet } from "react-helmet-async";
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, MoonStar, Cookie, Wand2, Users, Sparkles, Zap, ArrowRight, Clock, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Games & Fun" },
];

const GamesFunLanding = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const games = [
    {
      id: 'name-compatibility',
      title: 'Name Compatibility',
      description: 'Discover the cosmic bond between two names! Find out your unique compatibility score based on the energy and vibrations of your names.',
      icon: Heart,
      link: '/games-fun/name-compatibility',
      gradient: 'from-pink-400 via-rose-400 to-red-400',
      bgGradient: 'from-pink-50 to-rose-50',
      duration: '1-2 min',
      category: 'Romance',
      benefits: ['Explore name energy', 'Fun compatibility test', 'Instant results'],
      bestFor: 'Couples or friends curious about their connection'
    },
    {
      id: 'western-zodiac',
      title: 'Western Zodiac Compatibility',
      description: 'Explore cosmic connections through Western astrology! Match zodiac signs to reveal friendship and relationship compatibility insights.',
      icon: Star,
      link: '/games-fun/western-zodiac-compatibility',
      gradient: 'from-purple-400 via-indigo-400 to-blue-400',
      bgGradient: 'from-purple-50 to-indigo-50',
      duration: '2-3 min',
      category: 'Astrology',
      benefits: ['Zodiac insights', 'Detailed analysis', 'Relationship guidance'],
      bestFor: 'Astrology enthusiasts and compatibility seekers'
    },
    {
      id: 'chinese-zodiac',
      title: 'Chinese Zodiac Compatibility',
      description: 'Uncover ancient secrets of Chinese Zodiac compatibility! Discover how zodiac animals align and interact in relationships.',
      icon: MoonStar,
      link: '/games-fun/chinese-zodiac-compatibility',
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      bgGradient: 'from-yellow-50 to-orange-50',
      duration: '2-3 min',
      category: 'Eastern Wisdom',
      benefits: ['Ancient wisdom', 'Animal personality traits', 'Cultural insights'],
      bestFor: 'Those interested in Eastern philosophy and culture'
    },
    {
      id: 'aura-analysis',
      title: 'Aura Analysis',
      description: 'Discover your spiritual energy through our comprehensive aura reading! Answer thoughtful questions to reveal your dominant aura color.',
      icon: Sparkles,
      link: '/games-fun/aura-analysis',
      gradient: 'from-indigo-400 via-purple-400 to-pink-400',
      bgGradient: 'from-indigo-50 to-purple-50',
      duration: '5-7 min',
      category: 'Spiritual',
      benefits: ['Self-discovery', 'Spiritual insights', 'Personal growth'],
      bestFor: 'Spiritual seekers and self-reflection enthusiasts'
    },
    {
      id: 'fortune-cookie',
      title: 'Daily Fortune Cookie',
      description: 'Crack open wisdom and inspiration! Get your daily fortune with messages of guidance, feng shui tips, and positive energy.',
      icon: Cookie,
      link: '/games-fun/fortune-cookie',
      gradient: 'from-amber-400 via-yellow-400 to-orange-400',
      bgGradient: 'from-amber-50 to-yellow-50',
      duration: '30 sec',
      category: 'Daily Wisdom',
      benefits: ['Daily inspiration', 'Quick wisdom', 'Positive energy'],
      bestFor: 'Daily motivation and quick spiritual guidance'
    },
    {
      id: 'lucky-numbers',
      title: 'Lucky Numbers Generator',
      description: 'Generate your personal lucky numbers! Perfect for games, lotteries, or any special occasion where fortune favors the bold.',
      icon: Wand2,
      link: '/games-fun/lucky-numbers-generator',
      gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      bgGradient: 'from-emerald-50 to-teal-50',
      duration: '1 min',
      category: 'Luck & Fortune',
      benefits: ['Customizable ranges', 'Instant generation', 'Lucky vibes'],
      bestFor: 'Lottery players and those seeking lucky numbers'
    }
  ];

  const categories = [
    { name: 'Romance', icon: Heart, color: 'text-pink-500' },
    { name: 'Astrology', icon: Star, color: 'text-purple-500' },
    { name: 'Eastern Wisdom', icon: MoonStar, color: 'text-orange-500' },
    { name: 'Spiritual', icon: Sparkles, color: 'text-indigo-500' },
    { name: 'Daily Wisdom', icon: Cookie, color: 'text-amber-500' },
    { name: 'Luck & Fortune', icon: Wand2, color: 'text-emerald-500' }
  ];

  return (
  <>
  <Helmet>
    <title>Games & Fun - Compatibility Tests, Fortune & Spiritual Games</title>
    <meta name="description" content="Explore fun spiritual games including name compatibility, zodiac compatibility calculators, aura analysis, daily fortune cookies, and lucky number generators. Discover your cosmic connections!" />
    <meta name="keywords" content="compatibility test, name compatibility, zodiac compatibility, fortune cookie, lucky numbers, aura analysis, spiritual games, astrology games, fun tests" />
    <link rel="canonical" href="https://fengshuiandbeyond.com/games-fun" />
    
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Games & Fun - Spiritual Entertainment",
        "description": "Collection of entertaining spiritual games and compatibility tests"
      })}
    </script>
  </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      <main className="pt-6 px-4 pb-16">
        <div className="pt-24 max-w-5xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80 mb-6" />
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-300/30 via-pink-400/30 to-orange-400/30 animate-pulse blur-sm"></div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4"
            >
              Games & Fun
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <p className="text-xl md:text-2xl text-gray-600 mb-2">
                <span className="font-medium">{getGreeting()}!</span> Discover your cosmic connections
              </p>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
                Explore the mystical world of compatibility, fortune, and spiritual insights through our collection of engaging games and tools designed to entertain and enlighten.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full mx-auto mb-8"
            />

            {/* Categories Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.name}
                    className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm"
                  >
                    <IconComponent className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {games.map((game, index) => {
              const IconComponent = game.icon;
              
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="group"
                >
                  <Link to={game.link} className="block h-full">
                    <div className={`relative bg-gradient-to-r ${game.bgGradient} p-8 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden h-full`}>
                      {/* Background decoration */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-3xl"></div>
                      </div>

                      <div className="relative z-10 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-grow">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${game.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300 mb-4`}
                            >
                              <IconComponent className="w-8 h-8 text-white" />
                            </motion.div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              {game.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <div className="flex items-center text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4 mr-1" />
                                {game.duration}
                              </div>
                              <div className="text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                {game.category}
                              </div>
                            </div>
                          </div>
                          
                          <motion.div
                            className="hidden md:flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <ArrowRight className="w-6 h-6" />
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            {game.description}
                          </p>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Perfect for: <span className="text-gray-800 font-normal">{game.bestFor}</span>
                            </p>
                          </div>

                          {/* Benefits */}
                          <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Target className="w-4 h-4 mr-2 text-purple-500" />
                              What you'll get:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {game.benefits.map((benefit, benefitIndex) => (
                                <span
                                  key={benefitIndex}
                                  className="text-xs bg-white/70 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full border border-white/30"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Mobile CTA */}
                        <div className="md:hidden flex justify-end mt-6">
                          <motion.div
                            className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-sm font-medium mr-2">Try It Now</span>
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Discover Your Cosmic Story
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              Each game offers a unique window into the mystical connections that shape our lives. Whether you're seeking relationship insights, spiritual guidance, or just some fun entertainment, explore the magic that surrounds us all.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Quick & entertaining</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Insightful results</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Share with friends</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
	</>
  );
};

export default GamesFunLanding;