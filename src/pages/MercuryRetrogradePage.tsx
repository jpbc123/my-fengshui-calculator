// src/pages/MercuryRetrogradePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import dayjs from "dayjs";
import { createClient } from '@sanity/client';
import { motion } from "framer-motion";
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Heart, 
  Briefcase, 
  ArrowRight,
  Info,
  CheckCircle,
  XCircle,
  BookOpen,
  Sparkles,
  Zap,
  Moon,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Sanity client
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  perspective: 'published',
});

interface MercuryRetrogradePhase {
  _id: string;
  year: number;
  phase: number;
  startDate: string;
  endDate: string;
  preRetrograde?: string;
  postRetrograde?: string;
  sign: string;
  intensity: 'low' | 'medium' | 'high';
  description: string;
  effects?: string[];
}

interface CountdownTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const zodiacSignEffects = [
  {
    sign: "Aries",
    icon: "♈",
    color: "from-red-500 to-orange-500",
    effects: "Impulsive decisions may backfire. Practice patience in leadership roles and avoid rushing into new ventures."
  },
  {
    sign: "Taurus",
    icon: "♉",
    color: "from-green-600 to-emerald-600",
    effects: "Financial matters need extra attention. Double-check contracts and avoid major purchases, especially luxury items."
  },
  {
    sign: "Gemini",
    icon: "♊",
    color: "from-yellow-500 to-amber-500",
    effects: "Communication mishaps are likely. Your words may be misunderstood. Take time to clarify and listen carefully."
  },
  {
    sign: "Cancer",
    icon: "♋",
    color: "from-blue-400 to-cyan-400",
    effects: "Emotional communication may be clouded. Past relationship issues resurface for healing and closure."
  },
  {
    sign: "Leo",
    icon: "♌",
    color: "from-yellow-600 to-orange-600",
    effects: "Creative projects may stall. Avoid ego-driven decisions and focus on refining existing work rather than starting new."
  },
  {
    sign: "Virgo",
    icon: "♍",
    color: "from-green-500 to-teal-500",
    effects: "Details slip through the cracks. Your usual precision may falter. Triple-check everything and avoid over-analyzing."
  },
  {
    sign: "Libra",
    icon: "♎",
    color: "from-pink-400 to-rose-400",
    effects: "Relationship dynamics shift. Balance is disrupted. Use this time to address unresolved partnership issues."
  },
  {
    sign: "Scorpio",
    icon: "♏",
    color: "from-purple-600 to-fuchsia-600",
    effects: "Secrets and hidden matters emerge. Trust your intuition but verify facts before making transformative decisions."
  },
  {
    sign: "Sagittarius",
    icon: "♐",
    color: "from-purple-500 to-indigo-500",
    effects: "Travel plans face delays. Philosophical beliefs may be challenged. Stay flexible with plans and open to revision."
  },
  {
    sign: "Capricorn",
    icon: "♑",
    color: "from-gray-600 to-slate-600",
    effects: "Career plans may hit obstacles. Professional communication requires extra care. Postpone major business decisions."
  },
  {
    sign: "Aquarius",
    icon: "♒",
    color: "from-cyan-500 to-blue-500",
    effects: "Technology glitches amplified. Backup everything. Innovative ideas need more time to develop properly."
  },
  {
    sign: "Pisces",
    icon: "♓",
    color: "from-indigo-400 to-purple-400",
    effects: "Intuition may be foggy. Dreams and reality blur. Ground yourself and avoid making decisions based solely on feelings."
  }
];

export default function MercuryRetrogradePage() {
  const [mercuryPhases, setMercuryPhases] = useState<MercuryRetrogradePhase[]>([]);
  const [currentPhase, setCurrentPhase] = useState<MercuryRetrogradePhase | null>(null);
  const [nextPhase, setNextPhase] = useState<MercuryRetrogradePhase | null>(null);
  const [isRetrograde, setIsRetrograde] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTimer>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Real-time countdown update - FIXED to use actual retrograde dates, not shadow periods
  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs();
      let targetDate: dayjs.Dayjs;

      if (isRetrograde && currentPhase) {
        // Countdown to end of current retrograde (actual end, not post-shadow)
        targetDate = dayjs(currentPhase.endDate);
      } else if (nextPhase) {
        // Countdown to start of next retrograde (actual start, not pre-shadow)
        targetDate = dayjs(nextPhase.startDate);
      } else {
        return;
      }

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
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [isRetrograde, currentPhase, nextPhase]);

  // Fetch Mercury Retrograde data from Sanity
  useEffect(() => {
    async function fetchMercuryData() {
      try {
        const currentYear = new Date().getFullYear();
        
        const query = `
          *[_type == "mercuryRetrograde" && year >= ${currentYear}] 
          | order(startDate asc) {
            _id,
            year,
            phase,
            startDate,
            endDate,
            preRetrograde,
            postRetrograde,
            sign,
            intensity,
            description,
            effects
          }
        `;
        
        const data = await sanityClient.fetch(query);
        setMercuryPhases(data);
        
        // Determine current status - using actual retrograde dates, not shadow periods
        const now = dayjs();
        
        // Check if currently in retrograde (actual retrograde period only)
        const current = data.find((phase: MercuryRetrogradePhase) => 
          now.isAfter(dayjs(phase.startDate)) && now.isBefore(dayjs(phase.endDate))
        );
        
        if (current) {
          setCurrentPhase(current);
          setIsRetrograde(true);
          console.log('Currently in Mercury Retrograde:', current);
        } else {
          setIsRetrograde(false);
          // Find next upcoming phase (based on actual start date, not pre-shadow)
          const upcoming = data.find((phase: MercuryRetrogradePhase) => 
            now.isBefore(dayjs(phase.startDate))
          );
          setNextPhase(upcoming || null);
          
          if (upcoming) {
            const daysUntil = dayjs(upcoming.startDate).diff(now, 'days');
            console.log('Next Mercury Retrograde:', upcoming.startDate, `(in ${daysUntil} days)`);
          }
        }
        
      } catch (err) {
        console.error('Error fetching Mercury Retrograde data:', err);
        setError('Failed to load Mercury Retrograde data');
      } finally {
        setLoading(false);
      }
    }

    fetchMercuryData();
  }, []);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Astrology", path: "/astrology" },
    { label: "Mercury Retrograde" },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const CountdownDisplay = ({ countdown, isRetrograde }: { countdown: CountdownTimer, isRetrograde: boolean }) => (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {[
        { label: 'Days', value: countdown.days },
        { label: 'Hours', value: countdown.hours },
        { label: 'Minutes', value: countdown.minutes },
        { label: 'Seconds', value: countdown.seconds }
      ].map((unit, index) => (
        <div key={index} className="text-center">
          <div className={`text-2xl font-bold p-3 rounded-lg ${
            isRetrograde ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {unit.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-600 mt-1">{unit.label}</div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <div className="text-gray-500">Loading Mercury Retrograde data...</div>
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
                Mercury Retrograde
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Navigate Mercury's backward dance with confidence. Real-time tracking, comprehensive guidance, 
                and everything you need to thrive during retrograde cycles.
              </p>
            </div>
          </div>

          {/* Real-Time Status Card with Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 p-8 rounded-2xl border-2 ${
              isRetrograde 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center justify-center mb-6">
              {isRetrograde ? (
                <AlertTriangle className="text-red-600 mr-3" size={32} />
              ) : (
                <CheckCircle className="text-green-600 mr-3" size={32} />
              )}
              <h2 className={`text-2xl font-bold ${
                isRetrograde ? 'text-red-800' : 'text-green-800'
              }`}>
                {isRetrograde ? 'Mercury is Currently Retrograde' : 'Mercury is Direct'}
              </h2>
            </div>
            
            {/* Real-Time Countdown Timer */}
            {(isRetrograde && currentPhase) || nextPhase ? (
              <div className="text-center mb-6">
                <p className={`text-lg mb-4 ${isRetrograde ? 'text-red-700' : 'text-blue-700'}`}>
                  {isRetrograde 
                    ? `Ends in:` 
                    : `Next retrograde starts in:`
                  }
                </p>
                <CountdownDisplay countdown={countdown} isRetrograde={isRetrograde} />
              </div>
            ) : null}
            
            {isRetrograde && currentPhase ? (
              <div className="text-center">
                <p className="text-lg text-red-700 mb-4">
                  In {currentPhase.sign} until {dayjs(currentPhase.endDate).format('MMMM D, YYYY')}
                </p>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  getIntensityColor(currentPhase.intensity)
                }`}>
                  {currentPhase.intensity.toUpperCase()} INTENSITY
                </div>
                <p className="text-red-600 mt-4 max-w-2xl mx-auto">
                  {currentPhase.description}
                </p>
                
                {/* Shadow Period Info */}
                {(currentPhase.preRetrograde || currentPhase.postRetrograde) && (
                  <div className="mt-6 p-4 bg-white/50 rounded-lg max-w-xl mx-auto">
                    <div className="flex items-center justify-center mb-2">
                      <Moon className="text-purple-600 mr-2" size={18} />
                      <span className="text-sm font-semibold text-gray-700">Shadow Period Active</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Pre-Shadow: {currentPhase.preRetrograde ? dayjs(currentPhase.preRetrograde).format('MMM D') : 'N/A'} • 
                      Post-Shadow: {currentPhase.postRetrograde ? dayjs(currentPhase.postRetrograde).format('MMM D') : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            ) : nextPhase ? (
              <div className="text-center">
                <p className="text-lg text-green-700 mb-2">
                  Next retrograde: {dayjs(nextPhase.startDate).format('MMMM D')} - {dayjs(nextPhase.endDate).format('MMMM D, YYYY')} in {nextPhase.sign}
                </p>
                {nextPhase.preRetrograde && (
                  <p className="text-sm text-gray-600 mt-2">
                    Pre-Shadow begins: {dayjs(nextPhase.preRetrograde).format('MMMM D, YYYY')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-green-700 text-lg">
                Enjoy this period of clear communication and forward progress!
              </p>
            )}
          </motion.div>

          {/* Educational Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Understanding Mercury Retrograde
            </h2>
            
            <div className="space-y-4">
              {/* What is Mercury Retrograde? */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleSection('what-is')}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <BookOpen className="text-gold mr-3" size={24} />
                    <h3 className="text-xl font-bold text-black">What is Mercury Retrograde?</h3>
                  </div>
                  {expandedSection === 'what-is' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {expandedSection === 'what-is' && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Mercury retrograde is an optical illusion that occurs when the planet Mercury appears to move backward 
                      in the sky from our viewpoint on Earth. This happens approximately three to four times per year, each 
                      lasting about three weeks.
                    </p>
                    <p>
                      <strong>The Science:</strong> Mercury isn't actually reversing its orbit. As Earth passes Mercury in 
                      our respective orbits around the Sun, Mercury appears to move backward against the backdrop of stars—similar 
                      to how a car passing you on the highway seems to move backward relative to your position.
                    </p>
                    <p>
                      <strong>The Astrology:</strong> In astrology, Mercury governs communication, technology, travel, contracts, 
                      and clear thinking. When Mercury appears to move backward, these areas of life can experience disruptions, 
                      delays, and miscommunications.
                    </p>
                  </div>
                )}
              </div>

              {/* Why Does It Matter? */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleSection('why-matters')}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Sparkles className="text-gold mr-3" size={24} />
                    <h3 className="text-xl font-bold text-black">Why Does It Matter?</h3>
                  </div>
                  {expandedSection === 'why-matters' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {expandedSection === 'why-matters' && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Mercury retrograde matters because it affects our fast-paced, technology-dependent modern lifestyle. 
                      In a world where we rely on constant communication, reliable technology, and precise timing, disruptions 
                      in these areas can feel particularly jarring.
                    </p>
                    <p>
                      <strong>Historical Context:</strong> Ancient astrologers observed that planetary retrogrades coincided 
                      with periods of reflection, revision, and delays. Mercury, ruling communication and commerce, became 
                      especially noteworthy during retrograde periods.
                    </p>
                    <p>
                      <strong>Modern Interpretation:</strong> Today's astrologers view Mercury retrograde as a natural cycle 
                      encouraging us to slow down, review our plans, reconnect with the past, and fix what isn't working. 
                      Rather than a curse, it's an opportunity for necessary course correction.
                    </p>
                    <p className="bg-blue-50 p-4 rounded-lg">
                      <strong>The Silver Lining:</strong> Mercury retrograde isn't just chaos—it's a cosmic reminder to pause, 
                      reflect, and refine. Use this time to revisit old projects, reconnect with old friends, and review your path forward.
                    </p>
                  </div>
                )}
              </div>

              {/* Shadow Periods */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleSection('shadow-periods')}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Moon className="text-gold mr-3" size={24} />
                    <h3 className="text-xl font-bold text-black">Shadow Periods Explained</h3>
                  </div>
                  {expandedSection === 'shadow-periods' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {expandedSection === 'shadow-periods' && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Mercury retrograde doesn't happen in isolation. It's bookended by two shadow periods that extend the 
                      retrograde's influence for several weeks before and after the actual retrograde.
                    </p>
                    <div className="bg-purple-50 p-5 rounded-lg space-y-3">
                      <div>
                        <strong className="text-purple-800">Pre-Shadow Period:</strong>
                        <p className="text-gray-700 mt-1">
                          Begins about 2 weeks before Mercury goes retrograde. During this time, you might start noticing 
                          early signs of the retrograde's themes—minor miscommunications, tech hiccups, or old issues resurfacing. 
                          This is your warning period to back up data, double-check plans, and prepare.
                        </p>
                      </div>
                      <div>
                        <strong className="text-purple-800">Retrograde Period:</strong>
                        <p className="text-gray-700 mt-1">
                          The main event, lasting approximately 3 weeks. Effects are strongest during this time. Focus on 
                          the "re-" activities: review, revise, reconnect, reconsider, reflect.
                        </p>
                      </div>
                      <div>
                        <strong className="text-purple-800">Post-Shadow Period:</strong>
                        <p className="text-gray-700 mt-1">
                          Lasts about 2 weeks after Mercury goes direct. Mercury retraces its steps over the same degrees 
                          it covered during retrograde. You'll be cleaning up retrograde messes, implementing lessons learned, 
                          and moving forward with clarity.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      Total influence period: Approximately 7-8 weeks for each retrograde cycle, though the most intense 
                      effects occur during the actual retrograde.
                    </p>
                  </div>
                )}
              </div>

              {/* Debunking Myths */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleSection('myths')}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Zap className="text-gold mr-3" size={24} />
                    <h3 className="text-xl font-bold text-black">Debunking Common Myths</h3>
                  </div>
                  {expandedSection === 'myths' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {expandedSection === 'myths' && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed space-y-4">
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-500 pl-4">
                        <strong className="text-red-600">Myth:</strong> Mercury actually moves backward in space.
                        <p className="mt-1"><strong>Truth:</strong> It's an optical illusion. Mercury never reverses its orbit—it 
                        only appears to from our perspective on Earth.</p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4">
                        <strong className="text-red-600">Myth:</strong> Everything will go wrong during Mercury retrograde.
                        <p className="mt-1"><strong>Truth:</strong> While disruptions are more common, they're not guaranteed. 
                        Preparation and awareness significantly reduce negative impacts. Many people notice nothing unusual.</p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4">
                        <strong className="text-red-600">Myth:</strong> You should hide under a rock until it's over.
                        <p className="mt-1"><strong>Truth:</strong> Life doesn't stop during retrograde. You can still sign 
                        contracts, travel, and make decisions—just be extra careful, read the fine print, and have backup plans.</p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4">
                        <strong className="text-red-600">Myth:</strong> Mercury retrograde is scientifically proven to cause problems.
                        <p className="mt-1"><strong>Truth:</strong> There's no scientific evidence that Mercury's apparent motion 
                        affects Earth. The retrograde's impact is astrological and psychological—about awareness and interpretation, 
                        not physical forces.</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <strong className="text-green-600">Reality Check:</strong> Mercury retrograde is best understood as a 
                        psychological framework that encourages mindfulness during specific times. Whether you believe in astrology 
                        or not, using this period to slow down, review your work, and double-check details is practical wisdom.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

		{/* By Zodiac Sign - WITH LINKS */}
		<motion.div
		   initial={{ opacity: 0, y: 20 }}
		   animate={{ opacity: 1, y: 0 }}
		   transition={{ delay: 0.2 }}
		   className="mb-12"
		>
		<h2 className="text-3xl font-bold text-black mb-4 text-center">
			How Mercury Retrograde Affects Each Zodiac Sign
		</h2>
		<p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
			Mercury retrograde influences each sign differently based on astrological house placements. 
			Click your sign to see your daily horoscope.
		</p>
		
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{zodiacSignEffects.map((zodiac) => (
			<Link
				key={zodiac.sign}
				to={`/horoscope/western-zodiac?sign=${zodiac.sign.toLowerCase()}`}
				className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
			>
				<div className="flex items-center mb-3">
				<div className={`text-3xl mr-3 bg-gradient-to-r ${zodiac.color} bg-clip-text text-transparent font-bold`}>
					{zodiac.icon}
				</div>
				<h3 className="text-xl font-bold text-black">{zodiac.sign}</h3>
				</div>
				<p className="text-sm text-gray-700 leading-relaxed mb-3">
				{zodiac.effects}
				</p>
				<div className="flex items-center text-purple-600 text-sm font-semibold">
				<span>View Daily Horoscope</span>
				<ArrowRight size={16} className="ml-1" />
				</div>
			</Link>
			))}
		</div>
		</motion.div>

          {/* Schedule from Sanity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Upcoming Mercury Retrograde Schedule
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mercuryPhases.slice(0, 6).map((phase) => {
                const isPast = dayjs().isAfter(dayjs(phase.endDate));
                const isCurrent = dayjs().isAfter(dayjs(phase.startDate)) && dayjs().isBefore(dayjs(phase.endDate));
                
                return (
                  <div 
                    key={phase._id} 
                    className={`rounded-2xl shadow-lg border p-6 ${
                      isCurrent 
                        ? 'bg-red-50 border-red-200' 
                        : isPast 
                        ? 'bg-gray-50 border-gray-200 opacity-60' 
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-black">
                        {phase.year} Phase {phase.phase}
                        {isCurrent && <span className="ml-2 text-red-600">• ACTIVE</span>}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getIntensityColor(phase.intensity)
                      }`}>
                        {phase.intensity.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm">
                          {dayjs(phase.startDate).format('MMM D')} - {dayjs(phase.endDate).format('MMM D, YYYY')}
                        </span>
                      </div>
                      
                      {(phase.preRetrograde || phase.postRetrograde) && (
                        <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                          Shadow: {phase.preRetrograde ? dayjs(phase.preRetrograde).format('MMM D') : 'N/A'} - {phase.postRetrograde ? dayjs(phase.postRetrograde).format('MMM D') : 'N/A'}
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <TrendingUp size={16} className="mr-2" />
                        <span className="text-sm font-medium">In {phase.sign}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {phase.description}
                      </p>
                      
                      {phase.effects && phase.effects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {phase.effects.slice(0, 2).map((effect, effectIndex) => (
                            <span key={effectIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {effect}
                            </span>
                          ))}
                          {phase.effects.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                              +{phase.effects.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Tips and Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Your Mercury Retrograde Survival Guide
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  icon: <CheckCircle className="text-green-600" size={20} />,
                  title: "Do",
                  items: [
                    "Review and revise existing projects",
                    "Back up important data and files",
                    "Double-check travel arrangements",
                    "Practice patience in communications",
                    "Reflect on past relationships and patterns",
                    "Reconnect with old friends or contacts",
                    "Repair or maintain technology and vehicles"
                  ]
                },
                {
                  icon: <XCircle className="text-red-600" size={20} />,
                  title: "Avoid",
                  items: [
                    "Signing important contracts without thorough review",
                    "Starting major new projects or ventures",
                    "Making large purchases (especially electronics)",
                    "Sending important emails when emotional",
                    "Rushing into new relationships",
                    "Having difficult conversations via text",
                    "Relying solely on technology without backups"
                  ]
                }
              ].map((tip, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center mb-6">
                    {tip.icon}
                    <h3 className="text-2xl font-bold text-black ml-3">{tip.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {tip.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Areas of Life Affected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Areas Most Affected
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Briefcase className="text-blue-600" size={24} />,
                  title: "Communication & Technology",
                  description: "Emails, contracts, electronics, and digital communications may experience glitches or delays. Back up everything important."
                },
                {
                  icon: <Heart className="text-pink-600" size={24} />,
                  title: "Relationships",
                  description: "Misunderstandings may arise. It's a good time to resolve old issues rather than start new relationships. Exes may reappear."
                },
                {
                  icon: <Clock className="text-purple-600" size={24} />,
                  title: "Travel & Transportation",
                  description: "Delays, cancellations, and unexpected changes in travel plans are common. Allow extra time and have backup plans."
                }
              ].map((area, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {area.icon}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-3">{area.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Health and Self-Care Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Self-Care During Mercury Retrograde
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Mercury retrograde can increase stress and anxiety levels, affecting your sleep and overall wellbeing. 
                Use these tips to maintain balance during the retrograde period.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <h4 className="font-bold text-black mb-3 flex items-center">
                    <CheckCircle className="text-green-600 mr-2" size={18} />
                    Do for Your Health
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Set proper alarms and double-check them</li>
                    <li>• Practice breathing exercises when stressed</li>
                    <li>• Schedule a digital detox day</li>
                    <li>• Use noise-canceling tools for better sleep</li>
                    <li>• Keep meals simple and nourishing</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <h4 className="font-bold text-black mb-3 flex items-center">
                    <XCircle className="text-red-600 mr-2" size={18} />
                    Avoid for Better Rest
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Using bright screens before bedtime</li>
                    <li>• Watching news or stressful content at night</li>
                    <li>• Consuming caffeine late in the day</li>
                    <li>• Planning elaborate cooking projects</li>
                    <li>• Engaging in heated debates online</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Articles CTA */}
		  {/*
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-8 text-center"
          >
            <Info className="text-gold mx-auto mb-4" size={32} />
            <h2 className="text-2xl font-bold text-black mb-4">
              Want More Mercury Retrograde Insights?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore our collection of Mercury Retrograde articles for deeper insights, 
              personal stories, and detailed guidance for each zodiac sign.
            </p>
            <Link 
              to="/article?category=Mercury Retrograde"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-full font-semibold hover:bg-gold/90 transition-colors"
            >
              Browse Mercury Retrograde Articles
              <ArrowRight size={18} />
            </Link>
          </motion.div>
		  */}
        </div>
      </main>
    </div>
  );
}