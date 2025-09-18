// src/components/BirthChartBanner.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Sparkles, ArrowRight, Clock } from 'lucide-react';
import cosmicImage from '../assets/cosmic-2.jpg';

const BirthChartBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 group hover:scale-[1.02] transition-all duration-500"
      style={{
        backgroundImage: `url(${cosmicImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Blurred overlay to maintain readability */}
      <div className="absolute inset-0 " />

      {/* Animated Stars Background */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Constellation patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-transparent rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-16 right-16 w-32 h-32 bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-transparent rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10 group-hover:opacity-75 transition-opacity duration-500" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Birth Chart Analysis
            </h2>
          </div>
          
          <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-lg mx-auto">
            Unlock the secrets of your cosmic blueprint with our AI-powered birth chart analysis. 
            Discover your unique strengths and life's purpose.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium">AI-powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium">Instant delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Star className="w-3 h-3" />
              <span className="text-xs font-medium">100% Free</span>
            </div>
          </div>

          {/* Zodiac wheel - Simplified */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-3 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Star className="w-10 h-10 mx-auto mb-2 text-yellow-300" />
                <div className="text-xs font-bold">Cosmic</div>
                <div className="text-xs font-bold">Blueprint</div>
              </div>
            </div>

            {/* Zodiac symbols */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-yellow-300/80 rounded-full flex items-center justify-center text-xs font-bold text-purple-900">♈</div>
            </div>
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-yellow-300/80 rounded-full flex items-center justify-center text-xs font-bold text-purple-900">♌</div>
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-yellow-300/80 rounded-full flex items-center justify-center text-xs font-bold text-purple-900">♑</div>
            </div>
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-yellow-300/80 rounded-full flex items-center justify-center text-xs font-bold text-purple-900">♊</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link
              to="/birth-chart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/btn"
            >
              <span>Get My Chart</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BirthChartBanner;