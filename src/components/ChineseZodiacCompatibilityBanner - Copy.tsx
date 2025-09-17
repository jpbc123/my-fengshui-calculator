// src/components/ZodiacCompatibilityBanner.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const chineseZodiacSigns = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

const ZodiacCompatibilityBanner = () => {
  const [sign1, setSign1] = useState("");
  const [sign2, setSign2] = useState("");
  const navigate = useNavigate();

  const handleCompatibilityCheck = () => {
    if (sign1 && sign2) {
      // Navigate to compatibility page with URL parameters
      navigate(`/chinese-compatibility?sign1=${encodeURIComponent(sign1)}&sign2=${encodeURIComponent(sign2)}`);
    }
  };

  const isReadyToCheck = sign1 && sign2;

  return (
    <div className="w-full mt-8 mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full blur-2xl transform -translate-x-8 translate-y-8"></div>
        
        {/* Main content */}
        <div className="relative px-6 py-8 md:px-8 md:py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Chinese Zodiac Compatibility
              </h2>
            </div>
            <p className="text-white/90 text-lg">
              Discover how your Chinese zodiac signs align in love and friendship
            </p>
          </div>

          {/* Compatibility Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                
                {/* Person 1 */}
                <div className="flex flex-col items-center space-y-2 min-w-0 flex-1">
                  <label className="text-sm font-semibold text-gray-700">
                    I am
                  </label>
                  <Select value={sign1} onValueChange={setSign1}>
                    <SelectTrigger className="w-full md:w-40 h-12 bg-white border-2 border-gray-200 hover:border-pink-300 focus:border-pink-400 rounded-lg text-center font-medium text-black placeholder:text-black">
                      <SelectValue placeholder="Your sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {chineseZodiacSigns.map((sign) => (
                        <SelectItem key={sign} value={sign}>
                          {sign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Heart connector */}
                <div className="flex items-center justify-center py-2">
                  <div className="bg-gradient-to-r from-pink-400 to-red-400 rounded-full p-3 shadow-lg">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>

                {/* Person 2 */}
                <div className="flex flex-col items-center space-y-2 min-w-0 flex-1">
                  <label className="text-sm font-semibold text-gray-700">
                    He / She is
                  </label>
                  <Select value={sign2} onValueChange={setSign2}>
                    <SelectTrigger className="w-full md:w-40 h-12 bg-white border-2 border-gray-200 hover:border-pink-300 focus:border-pink-400 rounded-lg text-center font-medium text-black placeholder:text-black">
                      <SelectValue placeholder="Their sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {chineseZodiacSigns.map((sign) => (
                        <SelectItem key={sign} value={sign}>
                          {sign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Check Compatibility Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleCompatibilityCheck}
                  disabled={!isReadyToCheck}
                  className={`
                    px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 flex items-center gap-2
                    ${isReadyToCheck 
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <Heart className="w-5 h-5" />
                  Are you a match?
                  <Sparkles className="w-5 h-5" />
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't know your Chinese zodiac sign?{" "}
                  <button
                    onClick={() => navigate('/chinese-zodiac-calculator')}
                    className="text-pink-600 hover:text-pink-700 font-semibold underline"
                  >
                    Find it here →
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZodiacCompatibilityBanner;