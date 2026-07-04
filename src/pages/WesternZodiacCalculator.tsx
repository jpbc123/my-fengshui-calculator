//src/pages/WesternZodiacCalculator.tsx
import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info, ChevronDown, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { DatePickerInput } from "@/components/DatePickerInput";
import { westernZodiacData } from "@/data/westernZodiacData";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@sanity/client';

// Create Sanity client inline
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  perspective: 'published',
});

// Helper function to check if client is configured
const isClientConfigured = () => {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET;
  return !!(projectId && dataset);
};

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Western Zodiac Calculator" },
];

// Interface for article data from Sanity
interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  tags?: string[];
}

interface SignInfo {
  image?: string;
  traits: string;
  yearAnalysis: string;
  compatibility?: string;
  luckyNumbers?: string;
  luckyColors?: string;
  careerAdvice?: string;
  personalityInsights?: string;
}

// Unicode zodiac symbols
const zodiacSymbols: { [key: string]: string } = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊", 
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

// Sign-specific colors for display
const signColors: { [key: string]: string } = {
  Aries: "text-red-600 bg-red-50 border-red-200",
  Taurus: "text-green-600 bg-green-50 border-green-200",
  Gemini: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Cancer: "text-blue-600 bg-blue-50 border-blue-200",
  Leo: "text-orange-600 bg-orange-50 border-orange-200",
  Virgo: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Libra: "text-pink-600 bg-pink-50 border-pink-200",
  Scorpio: "text-purple-600 bg-purple-50 border-purple-200",
  Sagittarius: "text-indigo-600 bg-indigo-50 border-indigo-200",
  Capricorn: "text-gray-600 bg-gray-50 border-gray-200",
  Aquarius: "text-cyan-600 bg-cyan-50 border-cyan-200",
  Pisces: "text-teal-600 bg-teal-50 border-teal-200",
};

const zodiacSigns = [
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] },
];

function getWesternZodiac(month: number, day: number) {
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth < endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign.name;
      }
    } else {
      // Capricorn wraps Dec -> Jan
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth || month < endMonth)
      ) {
        return sign.name;
      }
    }
  }
  return "";
}

const WesternZodiacCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [signInfo, setSignInfo] = useState<SignInfo | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    traits: false,
    forecast: false,
    compatibility: false,
    career: false,
    personality: false
  });
  const RELATED_ARTICLES_LIMIT = 5;

  const handleCalculate = () => {
    if (!birthDate) return;
    const month = birthDate.getMonth() + 1; // 1–12
    const day = birthDate.getDate();
    const sign = getWesternZodiac(month, day);
    setZodiacSign(sign);
    setSignInfo(sign ? (westernZodiacData as Record<string, SignInfo>)[sign] : null);
  };
  
  // Fetch related articles on component mount
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!isClientConfigured()) {
        console.warn('Sanity client not configured properly');
        setRelatedArticles([]);
        return;
      }
      
      setLoading(true);
      try {
        const query = `*[_type == "article" && defined(tags) && ("western zodiac" in tags || "astrology" in tags || "western" in tags)] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
          _id,
          title,
          "slug": slug.current,
          tags
        }`;
        
        const articles = await sanityClient.fetch<SanityArticle[]>(query);
        
        if (articles.length === 0) {
          const fallbackQuery = `*[_type == "article"] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
            _id,
            title,
            "slug": slug.current
          }`;
          const fallbackArticles = await sanityClient.fetch<SanityArticle[]>(fallbackQuery);
          setRelatedArticles(fallbackArticles);
        } else {
          setRelatedArticles(articles);
        }
      } catch (error) {
        console.error("Error fetching related articles:", error);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
  <>
  <Helmet>
  <title>Western Zodiac Calculator - Find Your Sun Sign & Astrological Profile</title>
  <meta name="description" content="Free Western zodiac calculator to find your sun sign by date of birth. Get personality traits, sign dates, elements, compatibility, cusp guidance, and lucky elements for all 12 zodiac signs." />
  <meta name="keywords" content="western zodiac calculator, sun sign calculator, astrology calculator, find my zodiac sign, horoscope sign calculator, birth date zodiac" />
  <link rel="canonical" href="https://fengshuiandbeyond.com/astrology/western-zodiac-calculator" />
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Western Zodiac Calculator",
      "applicationCategory": "UtilitiesApplication",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Calculate your Western zodiac sun sign with detailed astrological profile"
    })}
  </script>
</Helmet>
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-8">
            {/* Left side - Calculator and Results */}
            <div className="max-w-xl flex-1">
              {/* Breadcrumbs + title */}
              <div className="mb-8">
                <Breadcrumb items={breadcrumbs} className="text-black/80" />
                <h1 className="text-2xl font-bold text-gold mt-4 mb-6">
                  Western Zodiac Calculator
                </h1>
                <p className="text-black/80 mb-6">
                  Discover your <span className="font-semibold">Western Zodiac</span> sign and unlock insights into your personality traits, strengths, and astrological influences.
                </p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      The <span className="font-semibold">Western Zodiac</span> is based on twelve constellations, each linked to specific date ranges and personality traits. Your sign is determined by the position of the Sun at the time of your birth.
                    </p>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-2 text-gold hover:underline text-xs font-medium"
                    >
                      {showMore ? "Hide Details" : "View More"}
                    </button>
                  </div>
                </div>

                {showMore && (
                  <div className="bg-gray-50 text-black/90 p-4 rounded-xl border border-gray-200 text-left">
                    <p className="mb-2">
                      The twelve zodiac signs — from Aries to Pisces — are each associated with unique strengths, challenges, and behavioral patterns rooted in ancient astronomical observations.
                    </p>
                    <p className="mb-2">
                      Your sign can offer insights into love compatibility, career paths, and personal growth themes based on the elemental associations (Fire, Earth, Air, Water).
                    </p>
                    <p>
                      Unlike the Chinese zodiac, which follows the lunar calendar, the Western zodiac changes roughly every month based on the Sun's position in the ecliptic.
                    </p>
                  </div>
                )}
              </div>

              {/* Input and Button Box */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <DatePickerInput
                    date={birthDate}
                    onDateChange={setBirthDate}
                    placeholder="Enter your birthdate"
                    className="bg-white text-black border border-gray-300"
                  />
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleCalculate}
                    disabled={!birthDate}
                    className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
                  >
                    Calculate
                  </Button>
                </div>
              </div>

              {/* Result */}
              <AnimatePresence>
                {zodiacSign && signInfo && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Main Zodiac Display */}
                    <div className={`p-6 rounded-xl text-center ${signColors[zodiacSign]}`}>
                      <div className="text-8xl mb-4">
                        {zodiacSymbols[zodiacSign]}
                      </div>
                      <h2 className="text-2xl font-bold text-gold mb-2">
                        Your Zodiac Sign: <span className={signColors[zodiacSign].split(' ')[0]}>{zodiacSign}</span>
                      </h2>
                      <p className="text-black/80 leading-relaxed">
                        Born under the constellation of {zodiacSign}, you carry the celestial influences and characteristics of this powerful astrological sign.
                      </p>
                    </div>

                    {/* Detailed Analysis Sections */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                      <h3 className="text-xl font-bold text-gold text-center mb-4">Your Astrological Profile</h3>
                      
                      {/* Traits */}
                      {signInfo.traits && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('traits')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-gold">Core Personality Traits</h4>
                            {expandedSections.traits ? (
                              <ChevronDown size={20} className="text-gold" />
                            ) : (
                              <ChevronRight size={20} className="text-gold" />
                            )}
                          </button>
                          {expandedSections.traits && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">
                                {Array.isArray(signInfo.traits) ? signInfo.traits.join(", ") : signInfo.traits}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2025 Forecast */}
                      {signInfo.yearAnalysis && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('forecast')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-green-600">2025 Astrological Forecast</h4>
                            {expandedSections.forecast ? (
                              <ChevronDown size={20} className="text-green-600" />
                            ) : (
                              <ChevronRight size={20} className="text-green-600" />
                            )}
                          </button>
                          {expandedSections.forecast && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{signInfo.yearAnalysis}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Compatibility */}
                      {signInfo.compatibility && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('compatibility')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-purple-600">Love & Compatibility</h4>
                            {expandedSections.compatibility ? (
                              <ChevronDown size={20} className="text-purple-600" />
                            ) : (
                              <ChevronRight size={20} className="text-purple-600" />
                            )}
                          </button>
                          {expandedSections.compatibility && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">
                                {Array.isArray(signInfo.compatibility) ? signInfo.compatibility.join(", ") : signInfo.compatibility}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lucky Elements Grid */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gold mb-3">Your Astrological Elements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          {signInfo.luckyNumbers && (
                            <div>
                              <span className="font-medium text-black">Lucky Numbers:</span>
                              <p className="text-black/80">
                                {Array.isArray(signInfo.luckyNumbers) ? signInfo.luckyNumbers.join(", ") : signInfo.luckyNumbers}
                              </p>
                            </div>
                          )}
                          {signInfo.luckyColors && (
                            <div>
                              <span className="font-medium text-black">Lucky Colors:</span>
                              <p className="text-black/80">
                                {Array.isArray(signInfo.luckyColors) ? signInfo.luckyColors.join(", ") : signInfo.luckyColors}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Career Advice */}
                      {signInfo.careerAdvice && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('career')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-blue-600">Career & Life Path</h4>
                            {expandedSections.career ? (
                              <ChevronDown size={20} className="text-blue-600" />
                            ) : (
                              <ChevronRight size={20} className="text-blue-600" />
                            )}
                          </button>
                          {expandedSections.career && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{signInfo.careerAdvice}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Personality Insights */}
                      {signInfo.personalityInsights && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('personality')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-indigo-600">Deep Personality Insights</h4>
                            {expandedSections.personality ? (
                              <ChevronDown size={20} className="text-indigo-600" />
                            ) : (
                              <ChevronRight size={20} className="text-indigo-600" />
                            )}
                          </button>
                          {expandedSections.personality && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{signInfo.personalityInsights}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Horoscope Link */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                        <Link 
                          to="/horoscope/western-zodiac" 
                          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 font-semibold transition-colors"
                        >
                          Get Your Daily Western Horoscope
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side - Related Articles */}
            <div className="max-w-md mt-12 lg:mt-0 lg:ml-8">
              <h2 className="text-xl font-semibold text-black mb-4">Related Articles</h2>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : relatedArticles.length > 0 ? (
                <div className="space-y-3">
                  {relatedArticles.map((article) => (
                    <div key={article._id}>
                      <Link
                        to={`/articles/${article.slug}`}
                        className="block text-base font-medium text-black hover:text-gold transition-colors"
                      >
                        {article.title}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No related articles found.</p>
              )}
            </div>
          </div>

          {/* Evergreen SEO content — always rendered in the static HTML */}
          <section className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gold mb-4">
              How to Find Your Zodiac Sign by Date of Birth
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              Your <strong>Western zodiac sign</strong> — also called your <strong>sun sign</strong> or star
              sign — is determined by the position of the Sun on the day you were born. There are twelve signs,
              each covering roughly one month of the year. To find out <em>"what zodiac sign am I,"</em> just
              enter your date of birth above and the calculator returns your sun sign along with your
              personality traits, compatibility, and lucky elements.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              The 12 Zodiac Signs and Their Dates
            </h2>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                <thead className="bg-gray-50 text-black">
                  <tr>
                    <th className="p-3 font-semibold">Sign</th>
                    <th className="p-3 font-semibold">Dates</th>
                    <th className="p-3 font-semibold">Element</th>
                    <th className="p-3 font-semibold">Ruling Planet</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Aries", dates: "Mar 21 – Apr 19", element: "Fire", planet: "Mars" },
                    { name: "Taurus", dates: "Apr 20 – May 20", element: "Earth", planet: "Venus" },
                    { name: "Gemini", dates: "May 21 – Jun 20", element: "Air", planet: "Mercury" },
                    { name: "Cancer", dates: "Jun 21 – Jul 22", element: "Water", planet: "Moon" },
                    { name: "Leo", dates: "Jul 23 – Aug 22", element: "Fire", planet: "Sun" },
                    { name: "Virgo", dates: "Aug 23 – Sep 22", element: "Earth", planet: "Mercury" },
                    { name: "Libra", dates: "Sep 23 – Oct 22", element: "Air", planet: "Venus" },
                    { name: "Scorpio", dates: "Oct 23 – Nov 21", element: "Water", planet: "Pluto / Mars" },
                    { name: "Sagittarius", dates: "Nov 22 – Dec 21", element: "Fire", planet: "Jupiter" },
                    { name: "Capricorn", dates: "Dec 22 – Jan 19", element: "Earth", planet: "Saturn" },
                    { name: "Aquarius", dates: "Jan 20 – Feb 18", element: "Air", planet: "Uranus / Saturn" },
                    { name: "Pisces", dates: "Feb 19 – Mar 20", element: "Water", planet: "Neptune / Jupiter" },
                  ].map((row) => (
                    <tr key={row.name} className="border-t border-gray-200">
                      <td className="p-3 font-semibold text-black whitespace-nowrap">
                        <span className="mr-2">{zodiacSymbols[row.name]}</span>{row.name}
                      </td>
                      <td className="p-3 text-black/70 whitespace-nowrap">{row.dates}</td>
                      <td className="p-3 text-black/70">{row.element}</td>
                      <td className="p-3 text-black/70">{row.planet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              The Four Zodiac Elements
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-10">
              {[
                { el: "🔥 Fire Signs", signs: "Aries, Leo, Sagittarius", desc: "Passionate, bold, and energetic. Fire signs are natural leaders driven by inspiration and action." },
                { el: "🌍 Earth Signs", signs: "Taurus, Virgo, Capricorn", desc: "Grounded, practical, and reliable. Earth signs value stability, hard work, and tangible results." },
                { el: "💨 Air Signs", signs: "Gemini, Libra, Aquarius", desc: "Intellectual, social, and communicative. Air signs live in the world of ideas, connection, and curiosity." },
                { el: "🌊 Water Signs", signs: "Cancer, Scorpio, Pisces", desc: "Emotional, intuitive, and deep. Water signs feel everything and are guided by empathy and instinct." },
              ].map((e) => (
                <div key={e.el} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-bold text-black mb-1">{e.el}</h3>
                  <p className="text-xs font-semibold text-black/60 mb-2">{e.signs}</p>
                  <p className="text-sm text-black/70 leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              What About Cusp Birthdays?
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              If you were born on the boundary between two signs — a <strong>zodiac cusp</strong> — your sun
              sign can vary by a day depending on the exact year and time of your birth, because the Sun does
              not change signs at the same clock time every year. If your birthday falls on or near a start/end
              date in the table above and your result feels off, you may have been born just inside the
              neighboring sign. A full birth chart using your exact time and place gives the definitive answer.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">What is the difference between a sun sign and a star sign?</h3>
                <p className="text-black/70 leading-relaxed">
                  They are the same thing. "Sun sign" and "star sign" both refer to the zodiac sign the Sun was
                  travelling through when you were born — the sign this calculator gives you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Is my zodiac sign the same as my horoscope?</h3>
                <p className="text-black/70 leading-relaxed">
                  Your zodiac sign is fixed for life; your horoscope is the changing daily, weekly, or monthly
                  forecast written for that sign. Once you know your sign here, you can read its current
                  horoscope.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Why is my sign different on some websites?</h3>
                <p className="text-black/70 leading-relaxed">
                  Most differences come from cusp dates or from sites using the astronomical constellations
                  rather than the standard tropical zodiac. This calculator uses the widely accepted tropical
                  date ranges shown in the table above.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/horoscope/western-zodiac" className="text-gold font-semibold hover:underline">
                Read your daily horoscope →
              </Link>
              <Link to="/birth-chart" className="text-gold font-semibold hover:underline">
                Get your full birth chart →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
	</>
  );
};

export default WesternZodiacCalculator;