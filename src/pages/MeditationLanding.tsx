// src/pages/MeditationLanding.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Flower2, Eye, Sunrise, Moon, ArrowRight, Clock, Target, Brain, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Meditation & Mindfulness" },
];

const MeditationLanding = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const meditationPractices = [
    {
      id: 'affirmations',
      title: 'Daily Affirmations',
      description: 'Transform your mindset with positive thoughts and self-compassion. Build confidence and cultivate inner peace through powerful affirmations.',
      icon: Heart,
      link: '/meditate-affirmation',
      gradient: 'from-pink-400 via-rose-400 to-red-400',
      bgGradient: 'from-pink-50 to-rose-50',
      duration: '5-10 min',
      difficulty: 'Beginner',
      benefits: ['Boost self-confidence', 'Reduce negative self-talk', 'Cultivate positive mindset'],
      bestFor: 'Morning motivation or confidence building'
    },
    {
      id: 'morning',
      title: 'Morning Mindfulness',
      description: 'Start your day with intention, gratitude, and mindful awareness. Set a positive tone through breathing, gratitude, and daily intentions.',
      icon: Sunrise,
      link: '/meditate-morning-mindfulness',
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      bgGradient: 'from-yellow-50 to-orange-50',
      duration: '15-20 min',
      difficulty: 'Beginner',
      benefits: ['Set daily intentions', 'Practice gratitude', 'Center your mind'],
      bestFor: 'Starting your day with purpose and clarity'
    },
    {
      id: 'visualization',
      title: 'Visualization Exercises',
      description: 'Create peaceful mental imagery to reduce stress and find clarity. Journey within through guided imagery and healing light meditations.',
      icon: Eye,
      link: '/meditate-visualization-exercise',
      gradient: 'from-purple-400 via-indigo-400 to-blue-400',
      bgGradient: 'from-purple-50 to-indigo-50',
      duration: '10-15 min',
      difficulty: 'Beginner',
      benefits: ['Reduce stress levels', 'Enhance focus', 'Promote inner peace'],
      bestFor: 'Stress relief and mental clarity'
    },
    {
      id: 'yoga',
      title: 'Yoga Pose for the Day',
      description: 'Energize your body with mindful movement and flexibility. Daily poses to strengthen, stretch, and connect mind with body.',
      icon: Flower2,
      link: '/meditate-yoga-pose',
      gradient: 'from-green-400 via-emerald-400 to-teal-400',
      bgGradient: 'from-green-50 to-emerald-50',
      duration: '10-30 min',
      difficulty: 'All Levels',
      benefits: ['Improve flexibility', 'Build strength', 'Body awareness'],
      bestFor: 'Physical wellness and mind-body connection'
    },
    {
      id: 'evening',
      title: 'Evening Relaxation',
      description: 'Unwind and prepare for restful sleep with calming practices. Reflect, release tension, and transition peacefully into night.',
      icon: Moon,
      link: '/meditate-evening-relaxation',
      gradient: 'from-slate-400 via-gray-400 to-zinc-400',
      bgGradient: 'from-slate-50 to-gray-50',
      duration: '15-25 min',
      difficulty: 'Beginner',
      benefits: ['Release tension', 'Prepare for sleep', 'Reflect on day'],
      bestFor: 'Winding down and better sleep quality'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <main className="pt-6 px-4 pb-16">
        <div className="pt-24 max-w-4xl mx-auto">
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
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300/30 to-purple-400/30 animate-pulse blur-sm"></div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            >
              Meditation & Mindfulness
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <p className="text-xl md:text-2xl text-gray-600 mb-2">
                <span className="font-medium">{getGreeting()}!</span> Welcome to your mindfulness journey
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Discover inner peace through guided meditation, mindful movement, and transformative practices designed to nurture your mind, body, and spirit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full mx-auto"
            />
          </div>

          {/* Meditation Practices */}
          <div className="space-y-8">
            {meditationPractices.map((practice, index) => {
              const IconComponent = practice.icon;
              
              return (
                <motion.div
                  key={practice.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="group"
                >
                  <Link to={practice.link} className="block">
                    <div className={`relative bg-gradient-to-r ${practice.bgGradient} p-8 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden`}>
                      {/* Background decoration */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-3xl"></div>
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${practice.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}
                          >
                            <IconComponent className="w-10 h-10 text-white" />
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div>
                              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                {practice.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <div className="flex items-center text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {practice.duration}
                                </div>
                                <div className="flex items-center text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                  <Target className="w-4 h-4 mr-1" />
                                  {practice.difficulty}
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

                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            {practice.description}
                          </p>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Best for: <span className="text-gray-800 font-normal">{practice.bestFor}</span>
                            </p>
                          </div>

                          {/* Benefits */}
                          <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                              Key Benefits:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {practice.benefits.map((benefit, benefitIndex) => (
                                <span
                                  key={benefitIndex}
                                  className="text-xs bg-white/70 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full border border-white/30"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Mobile arrow */}
                          <div className="md:hidden flex justify-end mt-4">
                            <motion.div
                              className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-sm font-medium mr-2">Start Practice</span>
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Begin Your Journey Today
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              Whether you're a complete beginner or looking to deepen your practice, these guided sessions will help you find peace, clarity, and wellness in your daily life.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>No experience required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Practice anytime, anywhere</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Build lasting wellness habits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MeditationLanding;