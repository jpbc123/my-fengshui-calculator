import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const chineseZodiacSigns = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

const ZodiacCompatibilityBanner = () => {
  const [sign1, setSign1] = useState("");
  const [sign2, setSign2] = useState("");

  const handleCompatibilityCheck = () => {
    if (sign1 && sign2) {
      // Navigate to compatibility page with URL parameters
      console.log(`Navigate to: /chinese-compatibility?sign1=${encodeURIComponent(sign1)}&sign2=${encodeURIComponent(sign2)}`);
    }
  };

  const handleZodiacCalculator = () => {
    console.log('Navigate to: /chinese-zodiac-calculator');
  };

  const isReadyToCheck = sign1 && sign2;

  return (
    <div className="w-full mt-6 mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 shadow-xl border border-white/20">
        {/* Romantic background elements */}
        <div className="absolute inset-0">
          {/* Subtle romantic texture */}
          <div className="absolute inset-0 opacity-15" 
               style={{
                 backgroundImage: `radial-gradient(circle at 20% 30%, #fbbf24 0%, transparent 40%), 
                                 radial-gradient(circle at 80% 70%, #f59e0b 0%, transparent 40%),
                                 radial-gradient(circle at 50% 50%, #ec4899 0%, transparent 30%)`
               }}></div>
          
          {/* Floating hearts effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-pink-300/20 rounded-full blur-2xl transform translate-x-16 -translate-y-8 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-300/20 to-orange-300/20 rounded-full blur-xl transform -translate-x-12 translate-y-4 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>
        
        {/* Compact main content */}
        <div className="relative px-10 py-10 md:px-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Left: Title and subtitle */}
              <div className="text-center lg:text-left lg:flex-shrink-0">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Heart className="w-6 h-6 text-yellow-200 fill-current animate-pulse" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Chinese Zodiac Love Match
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" style={{animationDelay: '0.5s'}} />
                </div>
                <p className="text-white/90 text-sm md:text-base font-medium">
                  Discover your romantic compatibility through ancient wisdom
                </p>
              </div>

              {/* Right: Compact form */}
              <div className="flex-1 max-w-2xl w-full">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    
                    {/* Person 1 compact */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">I am</span>
                      <div className="relative flex-1 min-w-[120px]">
                        <select 
                          value={sign1} 
                          onChange={(e) => setSign1(e.target.value)}
                          className="w-full h-10 bg-white border-2 border-gray-200 hover:border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-lg text-sm font-medium text-gray-800 text-center appearance-none cursor-pointer transition-all duration-200"
                        >
                          <option value="" disabled>Choose</option>
                          {chineseZodiacSigns.map((sign) => (
                            <option key={sign} value={sign}>{sign}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Compact heart separator */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-rose-400 to-pink-500 rounded-full p-2 shadow-md">
                        <Heart className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>

                    {/* Person 2 compact */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">He/She is</span>
                      <div className="relative flex-1 min-w-[120px]">
                        <select 
                          value={sign2} 
                          onChange={(e) => setSign2(e.target.value)}
                          className="w-full h-10 bg-white border-2 border-gray-200 hover:border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-lg text-sm font-medium text-gray-800 text-center appearance-none cursor-pointer transition-all duration-200"
                        >
                          <option value="" disabled>Choose</option>
                          {chineseZodiacSigns.map((sign) => (
                            <option key={sign} value={sign}>{sign}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Compact button */}
                    <button
                      onClick={handleCompatibilityCheck}
                      disabled={!isReadyToCheck}
                      className={`
                        flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                        ${isReadyToCheck 
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Check Match</span>
                    </button>
                  </div>

                  {/* Compact help text */}
                  <div className="text-center mt-3">
                    <p className="text-xs text-gray-600">
                      Need your sign?{" "}
                      <button
                        onClick={handleZodiacCalculator}
                        className="text-rose-600 hover:text-rose-700 font-semibold underline transition-colors duration-200"
                      >
                        Calculate here →
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZodiacCompatibilityBanner;