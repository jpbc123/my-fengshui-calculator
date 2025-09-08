import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { DatePickerInput } from "@/components/DatePickerInput";
import { westernZodiacData } from "@/data/westernZodiacData";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

// Western zodiac images
import ariesImg from "@/assets/western/aries.png";
import taurusImg from "@/assets/western/taurus.png";
import geminiImg from "@/assets/western/gemini.png";
import cancerImg from "@/assets/western/cancer.png";
import leoImg from "@/assets/western/leo.png";
import virgoImg from "@/assets/western/virgo.png";
import libraImg from "@/assets/western/libra.png";
import scorpioImg from "@/assets/western/scorpio.png";
import sagittariusImg from "@/assets/western/sagittarius.png";
import capricornImg from "@/assets/western/capricorn.png";
import aquariusImg from "@/assets/western/aquarius.png";
import piscesImg from "@/assets/western/pisces.png";

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

const westernZodiacImages: { [key: string]: string } = {
  Aries: ariesImg,
  Taurus: taurusImg,
  Gemini: geminiImg,
  Cancer: cancerImg,
  Leo: leoImg,
  Virgo: virgoImg,
  Libra: libraImg,
  Scorpio: scorpioImg,
  Sagittarius: sagittariusImg,
  Capricorn: capricornImg,
  Aquarius: aquariusImg,
  Pisces: piscesImg,
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
        const query = `*[_type == "article" && defined(tags) && ("western zodiac" in tags || "astrology" in tags || "western zodiac" in tags || "astrology" in tags)] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
          _id,
          title,
          "slug": slug.current,
          tags
        }`;
        
        console.log('Fetching filtered articles...');
        const articles = await sanityClient.fetch<SanityArticle[]>(query);
        console.log('Filtered articles:', articles);
        
        // If no filtered articles, fall back to recent articles
        if (articles.length === 0) {
          console.log('No tagged articles found, falling back to recent articles');
          const fallbackQuery = `*[_type == "article"] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
            _id,
            title,
            "slug": slug.current
          }`;
          const fallbackArticles = await sanityClient.fetch<SanityArticle[]>(fallbackQuery);
          console.log('Fallback articles:', fallbackArticles);
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
  
  return (
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
                  Find your <span className="font-semibold">Western Zodiac</span> animal to discover your personality traits, strengths, and compatibility.
                </p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      The <span className="font-semibold">Western Zodiac</span> is based on twelve constellations, each linked to specific date ranges and personality traits. Your sign is determined by the position of the Sun at the exact time of your birth according to the solar (Gregorian) calendar.
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
                      The twelve zodiac signs – from Aries to Pisces – are each associated with unique strengths, challenges, and behavioral patterns.
                    </p>
                    <p className="mb-2">
                      Your sign can offer insights into love compatibility, career paths, and personal growth themes.
                    </p>
                    <p>
                      Unlike the Chinese zodiac, which follows the lunar calendar and assigns one animal to an entire birth year, the Western zodiac changes roughly every month, making it more focused on the season and Sun's position rather than the year of birth.
                    </p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <DatePickerInput
                    date={birthDate}
                    onDateChange={setBirthDate}
                    placeholder="Enter your birthdate"
                  />
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleCalculate}
                    disabled={!birthDate}
                    className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
                  >
                    Calculate Western Zodiac
                  </Button>
                </div>
              </div>

              {/* Result */}
              {zodiacSign && signInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left"
                >
                  <h2 className="text-2xl font-bold text-gold mb-4 text-center">
                    Your Western Zodiac Sign is: <span className="text-black">{zodiacSign}</span>
                  </h2>

                  <img
                    src={westernZodiacImages[zodiacSign]}
                    alt={zodiacSign}
                    className="w-40 h-40 mx-auto object-contain"
                  />
                  <div className="flex flex-col gap-4 mt-8">
                    {signInfo.traits && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Traits:</h3>
                        <p className="text-black/80">
                          {Array.isArray(signInfo.traits) ? signInfo.traits.join(", ") : signInfo.traits}
                        </p>
                      </div>
                    )}
                    {signInfo.yearAnalysis && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">2025 Forecast:</h3>
                        <p className="text-black/80">{signInfo.yearAnalysis}</p>
                      </div>
                    )}
                    {signInfo.compatibility && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Compatibility:</h3>
                        <p className="text-black/80">
                          {Array.isArray(signInfo.compatibility) ? signInfo.compatibility.join(", ") : signInfo.compatibility}
                        </p>
                      </div>
                    )}
                    {signInfo.luckyNumbers && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Lucky Numbers:</h3>
                        <p className="text-black/80">
                          {Array.isArray(signInfo.luckyNumbers) ? signInfo.luckyNumbers.join(", ") : signInfo.luckyNumbers}
                        </p>
                      </div>
                    )}
                    {signInfo.luckyColors && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Lucky Colors:</h3>
                        <p className="text-black/80">
                          {Array.isArray(signInfo.luckyColors) ? signInfo.luckyColors.join(", ") : signInfo.luckyColors}
                        </p>
                      </div>
                    )}
                    {signInfo.careerAdvice && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Career Advice:</h3>
                        <p className="text-black/80">{signInfo.careerAdvice}</p>
                      </div>
                    )}
                    {signInfo.personalityInsights && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Personality Insights:</h3>
                        <p className="text-black/80">{signInfo.personalityInsights}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 pt-4 border-t border-gray-300 text-center">
                    <Link to={`/western-horoscope`} className="text-sm font-semibold text-black/80 hover:text-gold hover:underline">
                      Discover Your Daily Western Horoscope →
                    </Link>
                  </div>
                </motion.div>
              )}
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
        </div>
      </main>
    </div>
  );
};

export default WesternZodiacCalculator;