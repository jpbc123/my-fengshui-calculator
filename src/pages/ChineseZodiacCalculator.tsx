//src/pages/ZhineseZodiacCalculator.tsx
import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info, ChevronDown, ChevronRight } from "lucide-react";
import { ChineseZodiacData2025 } from "@/data/ChineseZodiacData2025";
import Breadcrumb from "@/components/Breadcrumb";
import { DatePickerInput } from "@/components/DatePickerInput";
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

// Zodiac images
import ratImg from "@/assets/chinese-zodiac/year-of-the-rat.png";
import oxImg from "@/assets/chinese-zodiac/year-of-the-ox.png";
import tigerImg from "@/assets/chinese-zodiac/year-of-the-tiger.png";
import rabbitImg from "@/assets/chinese-zodiac/year-of-the-rabbit.png";
import dragonImg from "@/assets/chinese-zodiac/year-of-the-dragon.png";
import snakeImg from "@/assets/chinese-zodiac/year-of-the-snake.png";
import horseImg from "@/assets/chinese-zodiac/year-of-the-horse.png";
import goatImg from "@/assets/chinese-zodiac/year-of-the-goat.png";
import monkeyImg from "@/assets/chinese-zodiac/year-of-the-monkey.png";
import roosterImg from "@/assets/chinese-zodiac/year-of-the-rooster.png";
import dogImg from "@/assets/chinese-zodiac/year-of-the-dog.png";
import pigImg from "@/assets/chinese-zodiac/year-of-the-pig.png";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology", path: "/astrology" },
  { label: "Chinese Zodiac Calculator" },
];

// Interface for article data from Sanity
interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  tags?: string[];
}

interface ZodiacInfo {
  image?: string;
  traits: string;
  yearAnalysis: string;
  compatibility?: string;
  luckyNumbers?: string;
  luckyColors?: string;
  luckyDirections?: string;
  careerAdvice?: string;
  fengShuiTips?: string;
  personalityInsights?: string;
}

const zodiacImages: { [key: string]: string } = {
  Rat: ratImg,
  Ox: oxImg,
  Tiger: tigerImg,
  Rabbit: rabbitImg,
  Dragon: dragonImg,
  Snake: snakeImg,
  Horse: horseImg,
  Goat: goatImg,
  Monkey: monkeyImg,
  Rooster: roosterImg,
  Dog: dogImg,
  Pig: pigImg,
};

// Chinese New Year dates for range of years
const chineseNewYearDates: Record<number, string> = {
  2024: "2024-02-10",
  2025: "2025-01-29",
  2026: "2026-02-17",
  2027: "2027-02-06",
  2028: "2028-01-26",
  2029: "2029-02-13",
  2030: "2030-02-03",
  2031: "2031-01-23",
  2032: "2032-02-11",
  2033: "2033-01-31",
  2034: "2034-02-19",
  2035: "2035-02-08",
  2036: "2036-01-28",
  2037: "2037-02-15",
  2038: "2038-02-04",
  2039: "2039-01-24",
  2040: "2040-02-12",
  2041: "2041-02-01",
  2042: "2042-01-22",
  2043: "2043-02-10",
  2044: "2044-01-30",
  2045: "2045-02-17",
  2046: "2046-02-06",
  2047: "2047-01-26",
  2048: "2048-02-14",
  2049: "2049-02-02",
  2050: "2050-01-23",
};

const ChineseZodiacCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    traits: false,
    forecast: false,
    compatibility: false,
    lucky: false,
    career: false,
    fengshui: false,
    personality: false
  });
  const RELATED_ARTICLES_LIMIT = 5;
  
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
        // Test basic fetch
        console.log('Testing basic article fetch...');
        const testQuery = `*[_type == "article"][0...3]{
          _id,
          title,
          "slug": slug.current,
          tags,
          publishDate
        }`;
        
        const testArticles = await sanityClient.fetch(testQuery);
        console.log('Available articles:', testArticles);
        
        // Try filtered query
        const query = `*[_type == "article" && defined(tags) && ("chinese zodiac" in tags || "chinese" in tags || "zodiac" in tags )] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
          _id,
          title,
          "slug": slug.current,
          tags
        }`;
        
        console.log('Fetching filtered articles...');
        const articles = await sanityClient.fetch<SanityArticle[]>(query);
        console.log('Filtered articles:', articles);
        
        setRelatedArticles(articles);
      } catch (error) {
        console.error("Error fetching related articles:", error);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, []);

  const handleCalculate = () => {
    if (!birthDate) return;

    const year = birthDate.getFullYear();
    const cnyString = chineseNewYearDates[year] || null;

    let zodiacYear = year;
    if (cnyString) {
      const cnyDate = new Date(cnyString + "T00:00:00");
      if (birthDate < cnyDate) {
        zodiacYear = year - 1;
      }
    }

    const zodiacIndex = (zodiacYear - 4) % 12;
    const sign = [
      "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
      "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
    ][zodiacIndex];

    setZodiacSign(sign);
    setZodiacInfo(ChineseZodiacData2025[sign]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
  <>
  <Helmet>
  <title>Chinese Zodiac Calculator - Find Your Animal Sign & Personality Traits</title>
  <meta name="description" content="Free Chinese zodiac calculator to find your animal sign by date of birth. Get detailed personality traits, compatibility, lucky numbers, birth-year charts, and career guidance." />
  <meta name="keywords" content="chinese zodiac calculator, find my chinese zodiac, chinese astrology calculator, zodiac animal calculator, shengxiao calculator, birth year zodiac" />
  <link rel="canonical" href="https://fengshuiandbeyond.com/astrology/chinese-zodiac-calculator" />
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Chinese Zodiac Calculator",
      "applicationCategory": "UtilitiesApplication",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Calculate your Chinese zodiac sign with detailed personality analysis"
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
                  Chinese Zodiac Calculator
                </h1>
                <p className="text-black/80 mb-6">
                  Discover your <span className="font-semibold">Chinese Zodiac</span> animal and unlock insights into your personality traits, strengths, and compatibility based on ancient wisdom.
                </p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      The <span className="font-semibold">Chinese Zodiac (生肖, Shēngxiào)</span> is a 12-year cycle based on the traditional Chinese lunar calendar, where each year is associated with a specific animal sign and its unique personality traits.
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
                      Each animal in the Chinese Zodiac is linked to certain characteristics. For example, those born in the year of the <span className="font-semibold">Dragon</span> are said to be confident and ambitious, while <span className="font-semibold">Rabbits</span> are gentle and compassionate.
                    </p>
                    <p className="mb-2">
                      Because the Chinese zodiac follows the <span className="font-semibold">lunar calendar</span>, the zodiac year does not start on January 1 but rather on <span className="font-semibold">Chinese New Year</span>, which usually falls between late January and mid-February.
                    </p>
                    <p>
                      The Chinese Zodiac also plays a role in <span className="font-semibold">compatibility</span>, <span className="font-semibold">career paths</span>, and <span className="font-semibold">feng shui practices</span>.
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
                {zodiacSign && zodiacInfo && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Main Zodiac Display */}
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                      <div className="mb-4">
                        <img
                          src={zodiacImages[zodiacSign]}
                          alt={zodiacSign}
                          className="w-32 h-32 mx-auto object-contain"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-gold mb-2">
                        Your Chinese Zodiac: <span className="text-red-600">{zodiacSign}</span>
                      </h2>
                      <p className="text-black/80 leading-relaxed">
                        People born in the Year of the {zodiacSign} are known for their distinctive traits and characteristics rooted in ancient Chinese wisdom.
                      </p>
                    </div>

                    {/* Detailed Analysis Sections */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                      <h3 className="text-xl font-bold text-gold text-center mb-4">Your Complete Profile</h3>
                      
                      {/* Traits */}
                      {zodiacInfo.traits && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('traits')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-gold">Core Traits</h4>
                            {expandedSections.traits ? (
                              <ChevronDown size={20} className="text-gold" />
                            ) : (
                              <ChevronRight size={20} className="text-gold" />
                            )}
                          </button>
                          {expandedSections.traits && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{zodiacInfo.traits}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2025 Forecast */}
                      {zodiacInfo.yearAnalysis && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('forecast')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-green-600">2025 Forecast</h4>
                            {expandedSections.forecast ? (
                              <ChevronDown size={20} className="text-green-600" />
                            ) : (
                              <ChevronRight size={20} className="text-green-600" />
                            )}
                          </button>
                          {expandedSections.forecast && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{zodiacInfo.yearAnalysis}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Compatibility */}
                      {zodiacInfo.compatibility && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('compatibility')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-purple-600">Compatibility</h4>
                            {expandedSections.compatibility ? (
                              <ChevronDown size={20} className="text-purple-600" />
                            ) : (
                              <ChevronRight size={20} className="text-purple-600" />
                            )}
                          </button>
                          {expandedSections.compatibility && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{zodiacInfo.compatibility}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lucky Elements Grid */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gold mb-3">Your Lucky Elements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          {zodiacInfo.luckyNumbers && (
                            <div>
                              <span className="font-medium text-black">Numbers:</span>
                              <p className="text-black/80">{zodiacInfo.luckyNumbers}</p>
                            </div>
                          )}
                          {zodiacInfo.luckyColors && (
                            <div>
                              <span className="font-medium text-black">Colors:</span>
                              <p className="text-black/80">{zodiacInfo.luckyColors}</p>
                            </div>
                          )}
                          {zodiacInfo.luckyDirections && (
                            <div>
                              <span className="font-medium text-black">Directions:</span>
                              <p className="text-black/80">{zodiacInfo.luckyDirections}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Insights */}
                      {zodiacInfo.careerAdvice && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection('career')}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="text-lg font-semibold text-blue-600">Career Guidance</h4>
                            {expandedSections.career ? (
                              <ChevronDown size={20} className="text-blue-600" />
                            ) : (
                              <ChevronRight size={20} className="text-blue-600" />
                            )}
                          </button>
                          {expandedSections.career && (
                            <div className="p-4 bg-white border-t border-gray-200">
                              <p className="text-black/90 leading-relaxed">{zodiacInfo.careerAdvice}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Horoscope Link */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                        <Link 
                          to={`/zodiac/${zodiacSign.toLowerCase()}`} 
                          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 font-semibold transition-colors"
                        >
                          Get Your Daily Chinese Horoscope
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
              How to Find Your Chinese Zodiac Sign
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              Your <strong>Chinese zodiac sign</strong> (生肖, <em>shēngxiào</em>) is the animal that rules the
              year you were born, on a repeating twelve-year cycle: Rat, Ox, Tiger, Rabbit, Dragon, Snake,
              Horse, Goat, Monkey, Rooster, Dog, and Pig. To find yours, simply enter your date of birth
              above — the calculator checks it against the correct <strong>Chinese New Year</strong> cut-off
              and returns your animal instantly, along with your personality traits, compatibility, and lucky
              elements.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              Why Your Zodiac Year Starts at Chinese New Year
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              This is the mistake most online charts get wrong. The Chinese zodiac follows the{" "}
              <strong>lunar calendar</strong>, so the animal year does not begin on January 1 — it begins on
              Chinese New Year, which falls between <strong>late January and mid-February</strong>. If you were
              born in January or early February, you may actually belong to the <em>previous</em> year's animal.
              For example, someone born on February 10, 2024 is a Rabbit (2023's animal), not a Dragon, because
              they arrived before Chinese New Year. Our calculator accounts for this automatically.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              The 12 Chinese Zodiac Animals &amp; Birth Years
            </h2>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                <thead className="bg-gray-50 text-black">
                  <tr>
                    <th className="p-3 font-semibold">Animal</th>
                    <th className="p-3 font-semibold">Recent Birth Years</th>
                    <th className="p-3 font-semibold">Key Traits</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { animal: "🐀 Rat", years: "2020, 2008, 1996, 1984, 1972", traits: "Quick-witted, resourceful, charming" },
                    { animal: "🐂 Ox", years: "2021, 2009, 1997, 1985, 1973", traits: "Diligent, dependable, patient" },
                    { animal: "🐅 Tiger", years: "2022, 2010, 1998, 1986, 1974", traits: "Brave, confident, competitive" },
                    { animal: "🐇 Rabbit", years: "2023, 2011, 1999, 1987, 1975", traits: "Gentle, elegant, compassionate" },
                    { animal: "🐉 Dragon", years: "2024, 2012, 2000, 1988, 1976", traits: "Ambitious, charismatic, lucky" },
                    { animal: "🐍 Snake", years: "2025, 2013, 2001, 1989, 1977", traits: "Wise, intuitive, graceful" },
                    { animal: "🐎 Horse", years: "2026, 2014, 2002, 1990, 1978", traits: "Energetic, free-spirited, warm" },
                    { animal: "🐐 Goat", years: "2027, 2015, 2003, 1991, 1979", traits: "Kind, creative, calm" },
                    { animal: "🐒 Monkey", years: "2028, 2016, 2004, 1992, 1980", traits: "Clever, playful, adaptable" },
                    { animal: "🐓 Rooster", years: "2029, 2017, 2005, 1993, 1981", traits: "Observant, hardworking, honest" },
                    { animal: "🐕 Dog", years: "2030, 2018, 2006, 1994, 1982", traits: "Loyal, sincere, protective" },
                    { animal: "🐖 Pig", years: "2031, 2019, 2007, 1995, 1983", traits: "Generous, easygoing, sincere" },
                  ].map((row) => (
                    <tr key={row.animal} className="border-t border-gray-200">
                      <td className="p-3 font-semibold text-black whitespace-nowrap">{row.animal}</td>
                      <td className="p-3 text-black/70">{row.years}</td>
                      <td className="p-3 text-black/70">{row.traits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-black/60 mb-10">
              Years shown are approximate — if your birthday is in January or February, confirm it against the
              Chinese New Year date using the calculator above.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              Chinese Zodiac Compatibility
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              In Chinese astrology, the animals form <strong>four compatibility triangles</strong> of allies
              who naturally understand one another: Rat–Dragon–Monkey; Ox–Snake–Rooster;
              Tiger–Horse–Dog; and Rabbit–Goat–Pig. Signs directly opposite on the twelve-year wheel (six
              years apart) are traditionally considered the most challenging matches. Compatibility is used for
              love, marriage timing, friendships, and business partnerships — though a full reading also
              considers each person's element and birth chart.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">What is my Chinese zodiac sign if I was born in January?</h3>
                <p className="text-black/70 leading-relaxed">
                  It depends on whether you were born before or after Chinese New Year that year. Anyone born in
                  January (and often early February) usually belongs to the previous year's animal. Enter your
                  full date above for an accurate result.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Is the Chinese zodiac based on the year or the month?</h3>
                <p className="text-black/70 leading-relaxed">
                  The animal sign comes from your birth <em>year</em> (on the lunar calendar). There is also an
                  "inner animal" tied to your birth month and a "secret animal" from your birth hour, but the
                  year animal is the one most people mean by "Chinese zodiac sign."
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">What element is my Chinese zodiac sign?</h3>
                <p className="text-black/70 leading-relaxed">
                  Each animal also pairs with one of the five elements (Wood, Fire, Earth, Metal, Water) on a
                  sixty-year cycle — for example, 2024 is a Wood Dragon year. To find your personal birth
                  element, try our personal element calculator.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/feng-shui/personal-element" className="text-gold font-semibold hover:underline">
                Find your personal element →
              </Link>
              <Link to="/horoscope/chinese-zodiac" className="text-gold font-semibold hover:underline">
                Read your daily Chinese horoscope →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
	</>
  );
};

export default ChineseZodiacCalculator;