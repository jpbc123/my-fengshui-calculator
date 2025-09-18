// src/components/FengShuiWeddingDatesBanner.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Calendar, ArrowRight, Users, Sparkles } from 'lucide-react';
import fengShuiBannerImage from '../assets/fengshui-banner-image-2.jpg';

const FengShuiWeddingDatesBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 group hover:scale-[1.02] transition-all duration-500"
      style={{
        backgroundImage: `url(${fengShuiBannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Blurred overlay to maintain readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-300/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 group-hover:opacity-75 transition-opacity duration-500" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Feng Shui Wedding Dates
            </h2>
          </div>
          
          <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-lg mx-auto">
            Discover your perfect wedding date using ancient Chinese wisdom. Find auspicious dates 
            that align with your zodiac signs and cosmic energies.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Calendar className="w-3 h-3" />
              <span className="text-xs font-medium">Year-round dates</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Users className="w-3 h-3" />
              <span className="text-xs font-medium">Zodiac compatibility</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium">Cultural guidance</span>
            </div>
          </div>

          {/* Decorative Element - Simplified */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/80 via-pink-500/70 to-red-500/80 rounded-full backdrop-blur-sm border border-white/30" />
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-300/30 to-pink-300/30 rounded-full animate-pulse" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-90" />
                <div className="text-lg font-bold">2025</div>
              </div>
            </div>

            {/* Floating hearts */}
            <Heart className="absolute top-2 right-4 w-4 h-4 text-white/60 animate-bounce" />
            <Heart className="absolute bottom-2 left-4 w-3 h-3 text-white/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>

          <Link
            to="/auspicious-wedding-date-planner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/btn"
          >
            <span>Find Our Perfect Date</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FengShuiWeddingDatesBanner;