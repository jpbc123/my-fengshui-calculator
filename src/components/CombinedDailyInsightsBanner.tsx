// CombinedDailyInsightsBanner.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);

// Interfaces
interface PlanetaryOverviewData {
  date: string;
  planetary_index?: number;
  summary?: string;
  article?: string;
  is_fallback?: boolean;
}

interface FengShuiTipData {
  tip: string;
}

interface DailyWisdomData {
  quote: string;
  article: string;
}

// Stars Background Component
const StarsBackground = ({ className = "", children }: { className?: string; children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    const numStars = 50;

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Utility functions (copied from original components)
const getTodayDate = () => {
  return dayjs().format('YYYY-MM-DD');
};

const cleanupOldCache = (type: string) => {
  const today = getTodayDate();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const yesterdayKey = `${type}_${yesterday}`;
  localStorage.removeItem(yesterdayKey);
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${type}_`)) {
      const match = key.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const cacheDate = match[1];
        if (cacheDate < yesterday) {
          localStorage.removeItem(key);
        }
      }
    }
  });
};

const getCachedData = (type: string, date: string) => {
  const cacheKey = `${type}_${date}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.error(`Error parsing cached ${type}:`, error);
      localStorage.removeItem(cacheKey);
    }
  }
  return null;
};

const setCachedData = (type: string, date: string, data: any) => {
  const cacheKey = `${type}_${date}`;
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      ...data,
      date,
      cached_at: new Date().toISOString()
    }));
    console.log(`Cached ${type} for ${date}`);
  } catch (error) {
    console.error(`Error caching ${type}:`, error);
  }
};

const CombinedDailyInsightsBanner = () => {
  // State for all three data types
  const [dailyWisdom, setDailyWisdom] = useState<DailyWisdomData>({ quote: "", article: "" });
  const [fengShuiTip, setFengShuiTip] = useState<FengShuiTipData>({ tip: "" });
  const [planetaryOverview, setPlanetaryOverview] = useState<PlanetaryOverviewData | null>(null);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    wisdom: true,
    fengshui: true,
    planetary: true
  });

  // Rotation state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const today = getTodayDate();
  const totalSlides = 3;
  const rotationInterval = 4000; // 4 seconds

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [isPaused, isHovered, totalSlides]);

  // Fetch Daily Wisdom
  useEffect(() => {
    const fetchDailyWisdom = async () => {
      cleanupOldCache('dailyWisdom');
      
      const cached = getCachedData('dailyWisdom', today);
      if (cached && cached.quote && cached.article) {
        console.log(`Using cached daily wisdom for ${today}`);
        setDailyWisdom({ quote: cached.quote, article: cached.article });
        setLoadingStates(prev => ({ ...prev, wisdom: false }));
        return;
      }
      
      try {
        const response = await fetch('/api/daily-wisdom');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data && data.quote && data.article) {
          setDailyWisdom({ quote: data.quote, article: data.article });
          setCachedData('dailyWisdom', today, data);
        } else {
          setDailyWisdom({ 
            quote: "Wisdom comes from within. Trust your inner guidance today.",
            article: "" 
          });
        }
      } catch (error) {
        console.error("Failed to fetch daily wisdom:", error);
        setDailyWisdom({ 
          quote: "Wisdom comes from within. Trust your inner guidance today.",
          article: "" 
        });
      } finally {
        setLoadingStates(prev => ({ ...prev, wisdom: false }));
      }
    };

    fetchDailyWisdom();
  }, [today]);

  // Fetch Feng Shui Tip
  useEffect(() => {
    const fetchFengShuiTip = async () => {
      cleanupOldCache('fengshuiTip');
      
      const cached = getCachedData('fengshuiTip', today);
      if (cached && cached.tip) {
        console.log(`Using cached feng shui tip for ${today}`);
        setFengShuiTip({ tip: cached.tip });
        setLoadingStates(prev => ({ ...prev, fengshui: false }));
        return;
      }

      try {
        const response = await fetch('/api/daily-fengshui-tip');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        const tip = result?.tip || "Clear your mind to welcome positive chi.";

        setFengShuiTip({ tip });
        setCachedData('fengshuiTip', today, { tip });
      } catch (error) {
        console.error("Failed to fetch daily feng shui tip:", error);
        setFengShuiTip({ tip: "Clear your mind to welcome positive chi." });
      } finally {
        setLoadingStates(prev => ({ ...prev, fengshui: false }));
      }
    };

    fetchFengShuiTip();
  }, [today]);

  // Fetch Planetary Overview
  useEffect(() => {
    const fetchPlanetaryOverview = async () => {
      cleanupOldCache('planetaryOverview');
      
      const cached = getCachedData('planetaryOverview', today);
      if (cached) {
        console.log(`Using cached planetary overview for ${today}`);
        setPlanetaryOverview(cached);
        setLoadingStates(prev => ({ ...prev, planetary: false }));
        return;
      }

      try {
        const response = await fetch('/api/planetary-overview');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        
        if (result) {
          const planetaryData = { ...result, date: today };
          setPlanetaryOverview(planetaryData);
          setCachedData('planetaryOverview', today, planetaryData);
        } else {
          const fallbackData = {
            date: today,
            planetary_index: 2,
            summary: "Universal energies are in transition today. Take time for reflection and avoid making hasty decisions.",
            article: "Today brings a blend of practical and intuitive energies.",
            is_fallback: true
          };
          setPlanetaryOverview(fallbackData);
          setCachedData('planetaryOverview', today, fallbackData);
        }
      } catch (error) {
        console.error("Failed to fetch planetary overview:", error);
        const fallbackData = {
          date: today,
          planetary_index: 2,
          summary: "Universal energies are in transition today. Take time for reflection and avoid making hasty decisions.",
          article: "Today brings a blend of practical and intuitive energies.",
          is_fallback: true
        };
        setPlanetaryOverview(fallbackData);
      } finally {
        setLoadingStates(prev => ({ ...prev, planetary: false }));
      }
    };

    fetchPlanetaryOverview();
  }, [today]);

  // Handle manual slide change
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  };

  // Store wisdom article function
  const storeWisdomArticle = () => {
    if (dailyWisdom.article && dailyWisdom.quote) {
      sessionStorage.setItem('currentDailyWisdomArticle', dailyWisdom.article);
      sessionStorage.setItem('currentDailyWisdomQuote', dailyWisdom.quote);
      console.log('Stored daily wisdom in sessionStorage for article page');
    }
  };

  // Store planetary overview data
  const storePlanetaryOverview = () => {
    if (planetaryOverview) {
      sessionStorage.setItem('currentPlanetaryOverview', JSON.stringify(planetaryOverview));
      console.log('Stored planetary overview in sessionStorage for article page');
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const renderSlideContent = () => {
    const isLoading = Object.values(loadingStates).some(loading => loading);
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <span className="text-white ml-3">Loading daily insights...</span>
          </div>
        </div>
      );
    }

    switch (currentSlide) {
      case 0: // Daily Wisdom
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  Today's Insight
                </h3>
              </div>
            </div>
            
            <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-gray-100 relative mb-6">
              <span className="text-yellow-400 text-3xl absolute -left-2 -top-2 font-serif">"</span>
              <span className="italic">{dailyWisdom.quote}</span>
              <span className="text-yellow-400 text-3xl absolute -bottom-4 font-serif">"</span>
            </blockquote>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link
                to="/daily-wisdom-article"
                onClick={storeWisdomArticle}
                className="group/btn relative px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Discover More</span>
                  <span className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        );

      case 1: // Feng Shui Tip
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  Feng Shui Tip
                </h3>
              </div>
            </div>
            
            <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-gray-100 relative mb-6">
              <span className="text-yellow-400 text-3xl absolute -left-2 -top-2 font-serif">"</span>
              <span className="italic">{fengShuiTip.tip}</span>
              <span className="text-yellow-400 text-3xl absolute -bottom-4 font-serif">"</span>
            </blockquote>

          </div>
        );

      case 2: // Planetary Overview
        return (
          <StarsBackground className="w-full h-full rounded-2xl">
            <div className="text-center p-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                    Planetary Overview
                  </h3>
                </div>
              </div>
              
              {planetaryOverview && (
                <>
                  {planetaryOverview.planetary_index && (
                    <p className="text-sm text-gray-400 mb-2">
                      Planetary Index: {planetaryOverview.planetary_index}/5
                    </p>
                  )}
                  
                  <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-gray-100 relative mb-6">
                    <span className="text-yellow-400 text-2xl absolute -left-2 -top-2 font-serif">"</span>
                    <span className="italic">{planetaryOverview.summary}</span>
                    <span className="text-yellow-400 text-2xl absolute -bottom-4 font-serif">"</span>
                  </blockquote>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    <Link
                      to="/daily-wisdom-article"
                      onClick={storePlanetaryOverview}
                      className="group/btn relative px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <span>Read Full Overview</span>
                        <span className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                          →
                        </span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </StarsBackground>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <section className="relative py-6 px-4 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-3xl group" style={{ minHeight: '420px' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
        
        {/* Date indicator - moved to top left */}
        <div className="absolute top-6 left-4 z-20 text-sm text-gray-200 flex items-center space-x-1 font-medium">
          <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></span>
          <span>{dayjs().format('MMMM D, YYYY')}</span>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
          >
            {isPaused ? <Play size={16} className="text-white" /> : <Pause size={16} className="text-white" />}
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Content - fixed height to prevent jumping */}
        <div className="relative z-10 flex items-center" style={{ minHeight: '340px' }}>
          <AnimatePresence mode="wait" custom={currentSlide}>
            <motion.div
              key={currentSlide}
              custom={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
};

export default CombinedDailyInsightsBanner;