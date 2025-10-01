// src/pages/FullMoonForecastPage.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import dayjs from "dayjs";
import { createClient } from '@sanity/client';
import { motion } from "framer-motion";
import { 
  Moon, 
  Calendar, 
  Star, 
  TrendingUp, 
  Heart, 
  Briefcase,
  ArrowRight,
  Sparkles,
  Clock,
  Eye
} from "lucide-react";

// Sanity client
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  perspective: 'published',
});

interface FullMoonPhase {
  _id: string;
  year: number;
  month: number;
  date: string;
  name: string;
  sign: string;
  peakTime: string;
  intensity: 'gentle' | 'moderate' | 'intense';
  description: string;
  energy: string;
  themes: string[];
  isEclipse: boolean;
}

interface CountdownTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function FullMoonForecastPage() {
  const [fullMoons, setFullMoons] = useState<FullMoonPhase[]>([]);
  const [nextFullMoon, setNextFullMoon] = useState<FullMoonPhase | null>(null);
  const [currentFullMoon, setCurrentFullMoon] = useState<FullMoonPhase | null>(null);
  const [countdown, setCountdown] = useState<CountdownTimer>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFullMoonPeriod, setIsFullMoonPeriod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time countdown update
  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs();
      let targetDate: dayjs.Dayjs;

      if (nextFullMoon) {
        targetDate = dayjs(nextFullMoon.date);
        const diff = targetDate.diff(now);
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setCountdown({ days, hours, minutes, seconds });
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }
    };

    // Update immediately
    updateCountdown();
    
    // Update every second for real-time countdown
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [nextFullMoon]);

  // Fetch Full Moon data from Sanity
  useEffect(() => {
    async function fetchFullMoonData() {
      try {
        const currentYear = new Date().getFullYear();
        
        const query = `
          *[_type == "fullMoon" && year >= ${currentYear}] 
          | order(date asc) {
            _id,
            year,
            month,
            date,
            name,
            sign,
            peakTime,
            intensity,
            description,
            energy,
            themes,
            isEclipse
          }
        `;
        
        const data = await sanityClient.fetch(query);
        setFullMoons(data);
        
        // Determine current status
        const now = dayjs();
        
        // Check if today is within 1 day of a full moon
        const todayFullMoon = data.find((moon: FullMoonPhase) => 
          Math.abs(now.diff(dayjs(moon.date), 'day')) <= 1
        );
        
        if (todayFullMoon) {
          setCurrentFullMoon(todayFullMoon);
          setIsFullMoonPeriod(true);
        } else {
          setIsFullMoonPeriod(false);
          // Find next upcoming full moon
          const upcoming = data.find((moon: FullMoonPhase) => 
            now.isBefore(dayjs(moon.date))
          );
          setNextFullMoon(upcoming || null);
        }
        
      } catch (err) {
        console.error('Error fetching Full Moon data:', err);
        setError('Failed to load Full Moon data');
      } finally {
        setLoading(false);
      }
    }

    fetchFullMoonData();
  }, []);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Astrology", path: "/astrology" },
    { label: "Full Moon Forecast" },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'intense': return 'text-purple-600 bg-purple-100';
      case 'moderate': return 'text-blue-600 bg-blue-100'; 
      case 'gentle': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const CountdownDisplay = ({ countdown }: { countdown: CountdownTimer }) => (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {[
        { label: 'Days', value: countdown.days },
        { label: 'Hours', value: countdown.hours },
        { label: 'Minutes', value: countdown.minutes },
        { label: 'Seconds', value: countdown.seconds }
      ].map((unit, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold p-3 rounded-lg bg-purple-600 text-white">
            {unit.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-600 mt-1">{unit.label}</div>
        </div>
      ))}
    </div>
  );

  const fullMoonRituals = [
    {
      title: "Release Ritual",
      description: "Write down what you want to release and burn it safely under the full moon.",
      icon: <Sparkles className="text-purple-600" size={20} />
    },
    {
      title: "Moon Water",
      description: "Place water in a clear container under moonlight to charge with lunar energy.",
      icon: <Moon className="text-blue-600" size={20} />
    },
    {
      title: "Gratitude Practice", 
      description: "List three things you're grateful for and feel the abundance of the full moon.",
      icon: <Heart className="text-pink-600" size={20} />
    },
    {
      title: "Crystal Cleansing",
      description: "Place your crystals outside or on a windowsill to cleanse in moonlight.",
      icon: <Star className="text-gold" size={20} />
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <div className="text-gray-500">Loading Full Moon data...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center text-red-500">Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Breadcrumb items={breadcrumbs} />
          
          {/* Hero Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-black mt-8 mb-6">
                Full Moon Forecast
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Harness the powerful energy of the full moon for manifestation, release, and spiritual growth. 
                Real-time lunar tracking and guidance for your journey.
              </p>
            </div>
          </div>

          {/* Current Full Moon Status with Real-Time Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {isFullMoonPeriod && currentFullMoon ? (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200 rounded-2xl p-8 text-center">
                <Moon className="text-purple-600 mx-auto mb-4" size={48} />
                <h2 className="text-3xl font-bold text-purple-800 mb-4">
                  🌕 Full Moon Energy Active!
                </h2>
                <h3 className="text-2xl font-semibold text-purple-700 mb-2">
                  {currentFullMoon.name} in {currentFullMoon.sign}
                </h3>
                <p className="text-lg text-purple-600 mb-4">
                  Peak time: {currentFullMoon.peakTime} • {dayjs(currentFullMoon.date).format('MMMM D, YYYY')}
                </p>
                
                {currentFullMoon.isEclipse && (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      🌘 LUNAR ECLIPSE
                    </span>
                  </div>
                )}
                
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                  getIntensityColor(currentFullMoon.intensity)
                }`}>
                  {currentFullMoon.intensity.toUpperCase()} ENERGY
                </div>
                <p className="text-purple-700 max-w-2xl mx-auto mb-6">
                  {currentFullMoon.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentFullMoon.themes.map((theme, index) => (
                    <span key={index} className="px-3 py-1 bg-white/70 text-purple-700 rounded-full text-sm font-medium">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            ) : nextFullMoon ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                <Clock className="text-blue-600 mx-auto mb-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                  Next Full Moon
                </h2>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  {nextFullMoon.name} in {nextFullMoon.sign}
                </h3>
                
                {/* Real-Time Countdown */}
                <div className="mb-6">
                  <p className="text-lg text-blue-600 mb-4">
                    {dayjs(nextFullMoon.date).format('MMMM D, YYYY')} • Peak: {nextFullMoon.peakTime}
                  </p>
                  <CountdownDisplay countdown={countdown} />
                </div>
                
                <p className="text-blue-600 max-w-2xl mx-auto">
                  {nextFullMoon.energy}
                </p>
                
                {nextFullMoon.isEclipse && (
                  <div className="mt-4">
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      🌘 UPCOMING LUNAR ECLIPSE
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <Moon className="text-gray-400 mx-auto mb-4" size={32} />
                <p className="text-gray-600">Loading full moon data...</p>
              </div>
            )}
          </motion.div>

          {/* Full Moon Calendar from Sanity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Upcoming Full Moon Calendar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fullMoons.slice(0, 6).map((moon, index) => {
                const isPast = dayjs().isAfter(dayjs(moon.date).add(1, 'day'));
                const isCurrent = Math.abs(dayjs().diff(dayjs(moon.date), 'day')) <= 1;
                
                return (
                  <div 
                    key={moon._id} 
                    className={`rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-shadow ${
                      isCurrent 
                        ? 'bg-purple-50 border-purple-200' 
                        : isPast 
                        ? 'bg-gray-50 border-gray-200 opacity-60' 
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-black">
                        {moon.name}
                        {isCurrent && <span className="ml-2 text-purple-600">• ACTIVE</span>}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getIntensityColor(moon.intensity)
                      }`}>
                        {moon.intensity.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm">
                          {dayjs(moon.date).format('MMMM D, YYYY')}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Star size={16} className="mr-2" />
                        <span className="text-sm font-medium">In {moon.sign}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span className="text-sm">{moon.peakTime}</span>
                      </div>
                      
                      {moon.isEclipse && (
                        <div className="flex items-center text-red-600">
                          <span className="text-sm font-semibold">🌘 Lunar Eclipse</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {moon.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {moon.themes.slice(0, 3).map((theme, themeIndex) => (
                        <span key={themeIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {theme}
                        </span>
                      ))}
                      {moon.themes.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          +{moon.themes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Full Moon Rituals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Full Moon Rituals & Practices
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fullMoonRituals.map((ritual, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    {ritual.icon}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-3">{ritual.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{ritual.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How Full Moons Affect You */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              How Full Moons Affect Different Areas of Life
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Heart className="text-red-600" size={24} />,
                  title: "Emotions & Relationships",
                  description: "Full moons heighten emotions and bring relationship issues to the surface for healing and resolution.",
                  tips: ["Practice emotional awareness", "Communicate openly", "Release grudges"]
                },
                {
                  icon: <Briefcase className="text-blue-600" size={24} />,
                  title: "Career & Goals",
                  description: "Projects reach completion, achievements are recognized, and career paths become clearer.",
                  tips: ["Celebrate accomplishments", "Reassess goals", "Network actively"]
                },
                {
                  icon: <Eye className="text-purple-600" size={24} />,
                  title: "Intuition & Spirituality",
                  description: "Psychic abilities are heightened, making it perfect for meditation, divination, and spiritual practices.",
                  tips: ["Trust your intuition", "Practice meditation", "Keep a dream journal"]
                }
              ].map((area, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    {area.icon}
                    <h3 className="text-lg font-bold text-black ml-3">{area.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{area.description}</p>
                  <ul className="space-y-2">
                    {area.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Full Moon by Zodiac Sign */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8 }}
  className="mb-12"
>
  <h2 className="text-3xl font-bold text-black mb-8 text-center">
    Full Moon Energy by Zodiac Sign
  </h2>
  <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
    Discover how the full moon impacts your zodiac sign. Click your sign to see your daily horoscope.
  </p>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[
      { sign: "Aries", energy: "Bold action and new beginnings", color: "border-red-200 bg-red-50 hover:bg-red-100" },
      { sign: "Taurus", energy: "Grounding and material security", color: "border-green-200 bg-green-50 hover:bg-green-100" },
      { sign: "Gemini", energy: "Communication and learning", color: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100" },
      { sign: "Cancer", energy: "Family and emotional healing", color: "border-blue-200 bg-blue-50 hover:bg-blue-100" },
      { sign: "Leo", energy: "Creative expression and joy", color: "border-orange-200 bg-orange-50 hover:bg-orange-100" },
      { sign: "Virgo", energy: "Organization and health focus", color: "border-gray-200 bg-gray-50 hover:bg-gray-100" },
      { sign: "Libra", energy: "Balance and relationships", color: "border-pink-200 bg-pink-50 hover:bg-pink-100" },
      { sign: "Scorpio", energy: "Transformation and depth", color: "border-purple-200 bg-purple-50 hover:bg-purple-100" },
      { sign: "Sagittarius", energy: "Adventure and wisdom", color: "border-indigo-200 bg-indigo-50 hover:bg-indigo-100" },
      { sign: "Capricorn", energy: "Achievement and structure", color: "border-gray-300 bg-gray-100 hover:bg-gray-200" },
      { sign: "Aquarius", energy: "Innovation and freedom", color: "border-cyan-200 bg-cyan-50 hover:bg-cyan-100" },
      { sign: "Pisces", energy: "Intuition and spirituality", color: "border-teal-200 bg-teal-50 hover:bg-teal-100" }
    ].map((zodiac, index) => (
      <Link
        key={index}
        to={`/horoscope/western-zodiac?sign=${zodiac.sign.toLowerCase()}`}
        className={`rounded-lg border-2 p-4 ${zodiac.color} hover:shadow-lg transition-all cursor-pointer group`}
      >
        <h4 className="font-bold text-black mb-2 group-hover:text-purple-600 transition-colors">
          {zodiac.sign}
        </h4>
        <p className="text-sm text-gray-700 mb-2">{zodiac.energy}</p>
        <div className="flex items-center text-purple-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Horoscope</span>
          <ArrowRight size={14} className="ml-1" />
        </div>
      </Link>
    ))}
  </div>
</motion.div>

          {/* Related Articles CTA */}
		  {/* 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 text-center"
          >
            <Moon className="text-purple-600 mx-auto mb-4" size={32} />
            <h2 className="text-2xl font-bold text-black mb-4">
              Dive Deeper into Lunar Wisdom
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore our collection of Full Moon articles for personalized guidance, 
              ritual ideas, and detailed insights for each lunar cycle.
            </p>
            <Link 
              to="/article?category=Full Moon"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              Browse Full Moon Articles
              <ArrowRight size={18} />
            </Link>
          </motion.div>
		  */}
        </div>
      </main>
    </div>
  );
}