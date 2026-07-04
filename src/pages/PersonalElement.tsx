// src/pages/PersonalElement.tsx
import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Solar, Lunar } from "lunar-typescript";
import Breadcrumb from "@/components/Breadcrumb";
import ReactMarkdown from 'react-markdown';
import ShareResult from "@/components/ShareResult";
import { Link } from "react-router-dom";
import { createClient } from '@sanity/client';

// Create Sanity client inline to avoid import issues
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

const elementByHeavenlyStem: Record<string, string> = {
  Jia: "Wood", Yi: "Wood",
  Bing: "Fire", Ding: "Fire",
  Wu: "Earth", Ji: "Earth",
  Geng: "Metal", Xin: "Metal",
  Ren: "Water", Gui: "Water",
};

const stemChineseNames: Record<string, string> = {
  Jia: "甲", Yi: "乙", Bing: "丙", Ding: "丁", Wu: "戊",
  Ji: "己", Geng: "庚", Xin: "辛", Ren: "壬", Gui: "癸",
};

const stemEnglishNames: Record<string, string> = {
  "甲": "Jia", "乙": "Yi", "丙": "Bing", "丁": "Ding",
  "戊": "Wu", "己": "Ji", "庚": "Geng", "辛": "Xin",
  "壬": "Ren", "癸": "Gui",
};

const elementDescriptions: Record<string, string> = {
  Wood: "Wood people are creative, kind-hearted, and strong-willed. They value growth, compassion, and collaboration.",
  Fire: "Fire people are passionate, charismatic, and ambitious. They have strong leadership qualities and love being in the spotlight.",
  Earth: "Earth people are stable, reliable, and nurturing. They bring harmony, support, and practicality into their surroundings.",
  Metal: "Metal people are disciplined, righteous, and focused. They pursue excellence and have a strong sense of justice.",
  Water: "Water people are intuitive, wise, and flexible. They adapt well and value wisdom, communication, and philosophy.",
};

const elementEmojis: Record<string, string> = {
  Wood: "🌳",
  Fire: "🔥",
  Earth: "🏔️",
  Metal: "⚔️",
  Water: "🌊",
};

const elementColors: Record<string, string> = {
  Wood: "text-green-600",
  Fire: "text-red-600",
  Earth: "text-yellow-600",
  Metal: "text-gray-600",
  Water: "text-blue-600",
};

const elementBgColors: Record<string, string> = {
  Wood: "bg-green-50 border-green-200",
  Fire: "bg-red-50 border-red-200",
  Earth: "bg-yellow-50 border-yellow-200",
  Metal: "bg-gray-50 border-gray-200",
  Water: "bg-blue-50 border-blue-200",
};

const stemDescriptions: Record<string, string> = {
  Jia: `🌳 **Jia (甲) — Yang Wood**
**Element:** Wood

Jia is like a tall, sturdy tree — upright, dependable, and growth-oriented.

**Those with Jia as their Heavenly Stem often:**
- Are principled and dependable
- Take initiative and lead with vision
- Strive for steady growth and progress

**They may also:**
- Be stubborn or inflexible
- Struggle with adapting quickly to change`,

  Yi: `🌱 **Yi (乙) — Yin Wood**
**Element:** Wood

Yi is like climbing vines or delicate flowers — flexible, adaptive, and diplomatic.

**Those with Yi as their Heavenly Stem often:**
- Are creative and adaptable
- Build relationships through charm and empathy
- Work well behind the scenes to influence outcomes

**They may also:**
- Be overly dependent on others
- Avoid confrontation even when necessary`,

  Bing: `🔥 **Bing (丙) — Yang Fire**
**Element:** Fire

Bing is like the sun — warm, bright, and energizing.

**Those with Bing as their Heavenly Stem often:**
- Inspire others with optimism
- Have a big presence and strong leadership
- Thrive when motivating or teaching

**They may also:**
- Be impatient or restless
- Overextend themselves trying to help everyone`,

  Ding: `🕯 **Ding (丁) — Yin Fire**
**Element:** Fire

Ding is like candlelight — subtle, nurturing, and refined.

**Those with Ding as their Heavenly Stem often:**
- Offer emotional warmth and comfort
- Work quietly yet effectively
- Have strong intuition and insight

**They may also:**
- Be overly sensitive or moody
- Struggle with self-confidence`,

  Wu: `🏔 **Wu (戊) — Yang Earth**
**Element:** Earth

Wu is like a mountain — stable, protective, and reliable.

**Those with Wu as their Heavenly Stem often:**
- Are trustworthy and responsible
- Provide security for others
- Have great endurance and patience

**They may also:**
- Be overly cautious or resistant to change
- Struggle with expressing emotions`,

  Ji: `🌾 **Ji (己) — Yin Earth**
**Element:** Earth

Ji is like fertile soil — nurturing, supportive, and grounded.

**Those with Ji as their Heavenly Stem often:**
- Care deeply for others' well-being
- Offer practical solutions and guidance
- Are humble and approachable

**They may also:**
- Worry too much about small details
- Be prone to self-doubt`,

  Geng: `⚔ **Geng (庚) — Yang Metal**
**Element:** Metal

Geng is like an axe or raw metal — strong, bold, and decisive.

**Those with Geng as their Heavenly Stem often:**
- Are courageous and ambitious
- Excel in solving problems directly
- Have a strong sense of justice

**They may also:**
- Be overly critical or harsh
- Have a short temper`,

  Xin: `💎 **Xin (辛) — Yin Metal**
**Element:** Metal

Xin is like refined jewelry — elegant, sharp, and intelligent.

**Those with Xin as their Heavenly Stem often:**
- Possess great taste and attention to detail
- Communicate with charm and diplomacy
- Value refinement and etiquette

**They may also:**
- Be passive-aggressive when upset
- Struggle with inner vulnerability`,

  Ren: `🌊 **Ren (壬) — Yang Water**
**Element:** Water

Ren is like the ocean — vast, deep, and adaptable.

**Those with Ren as their Heavenly Stem often:**
- Are resourceful and intelligent
- Adapt quickly to changing situations
- Inspire others with their vision

**They may also:**
- Be unpredictable or secretive
- Struggle with commitment`,

  Gui: `💧 **Gui (癸) — Yin Water**
**Element:** Water

Gui is like gentle rain — nurturing, subtle, and intuitive.

**Those with Gui as their Heavenly Stem often:**
- Are empathetic and understanding
- Possess strong intuition and imagination
- Work best in peaceful environments

**They may also:**
- Be indecisive or hesitant
- Avoid conflict even when necessary`
};

const compatibilityInsights: Record<string, string> = {
  Wood: "Wood works well with Water (which nurtures it), and struggles with Metal (which cuts it).",
  Fire: "Fire thrives with Wood (fuel) and is weakened by Water (extinguishes it).",
  Earth: "Earth benefits from Fire (creates earth) but is drained by Wood (overcomes it).",
  Metal: "Metal is supported by Earth and is melted by Fire.",
  Water: "Water is nourished by Metal but blocked or absorbed by Earth.",
};

const luckyTips: Record<string, { numbers: number[]; colors: string[]; careers: string[] }> = {
  Wood: {
    numbers: [3, 4],
    colors: ["green", "teal"],
    careers: ["writer", "teacher", "botanist", "environmentalist"],
  },
  Fire: {
    numbers: [9],
    colors: ["red", "orange", "purple"],
    careers: ["leader", "entrepreneur", "public speaker", "entertainer"],
  },
  Earth: {
    numbers: [2, 5, 8],
    colors: ["yellow", "beige", "brown"],
    careers: ["nurse", "real estate", "chef", "mediator"],
  },
  Metal: {
    numbers: [6, 7],
    colors: ["white", "silver", "gold"],
    careers: ["lawyer", "engineer", "banker", "designer"],
  },
  Water: {
    numbers: [1],
    colors: ["blue", "black", "navy"],
    careers: ["philosopher", "therapist", "musician", "sailor"],
  },
};

const fengShuiTips: Record<string, string> = {
  Wood: "Place plants and green décor in the East or Southeast of your home.",
  Fire: "Use red or triangular décor in the South for fame and recognition.",
  Earth: "Strengthen the center of your home with ceramics and earthy tones.",
  Metal: "Add metallic objects in the West or Northwest for creativity and leadership.",
  Water: "Incorporate fountains or blue accents in the North for career success.",
};

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Feng Shui", path: "/feng-shui" },
  { label: "Personal Element Analysis" },
];

// Interface for article data from Sanity
interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  tags?: string[];
}

export default function PersonalElement() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [result, setResult] = useState<{
    stem: string;
    element: string;
    description: string;
    stemDescription: string;
  } | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const RELATED_ARTICLES_LIMIT = 5;

  // Test environment variables on component mount
  useEffect(() => {
    console.log('Environment variables check:', {
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
      dataset: import.meta.env.VITE_SANITY_DATASET,
      apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
      hasProjectId: !!import.meta.env.VITE_SANITY_PROJECT_ID,
      hasDataset: !!import.meta.env.VITE_SANITY_DATASET,
    });
  }, []);

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
        // First, test basic fetch
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
        const query = `*[_type == "article" && defined(tags) && ("fengshui" in tags || "element" in tags || "feng-shui" in tags || "elements" in tags)] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
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
  
  const handleCalculate = () => {
    if (!birthDate) return;

    try {
      const lunar = Lunar.fromDate(new Date(birthDate));
      const dayGanZhi = lunar.getDayInGanZhi();
      const stemChineseChar = dayGanZhi.charAt(0);
      const dayHeavenlyStem = stemEnglishNames[stemChineseChar];

      if (!dayHeavenlyStem) {
        console.error(`Unrecognized stem: ${stemChineseChar}`);
        return;
      }

      const stemChinese = stemChineseNames[dayHeavenlyStem];
      const element = elementByHeavenlyStem[dayHeavenlyStem];
      const description = elementDescriptions[element];
      const stemDescription = stemDescriptions[dayHeavenlyStem];

      setResult({
        stem: `${dayHeavenlyStem} (${stemChinese})`,
        element,
        description,
        stemDescription,
      });
    } catch (err) {
      console.error("Failed to calculate:", err);
    }
  };

  return (
  <>
    <Helmet>
    <title>Personal Element Analysis - Find Your Five Element Profile</title>
    <meta name="description" content="Discover your personal element (Wood, Fire, Earth, Metal, Water) based on your birth date. Get detailed Five Elements analysis with personality insights, compatibility, and Feng Shui guidance." />
    <meta name="keywords" content="personal element calculator, five elements, wu xing, heavenly stem, feng shui elements, birth element, chinese elements, elemental analysis" />
    <link rel="canonical" href="https://fengshuiandbeyond.com/feng-shui/personal-element" />
    
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Personal Element Calculator",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
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
                <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Personal Element Analysis</h1>
                <p className="text-black/80 mb-6">
                  Discover your <span className="font-semibold">Personal Element</span> and unlock a deeper understanding of your inner nature, strengths, and ideal environment. This tool analyzes your birthdate to reveal your <span className="font-semibold">Five Element</span> profile.
                </p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      Your Personal Element is derived from the heavenly stem of your birth <strong>day</strong> and reflects your intrinsic character and destiny.
                    </p>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-2 text-gold hover:underline text-xs font-medium"
                    >
                      {showMore ? "Hide Details" : "View More"}
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                {showMore && (
                  <div className="bg-gray-50 text-black/90 p-4 rounded-xl border border-gray-200 text-left">
                    <p className="mb-2">The Five Elements (Wu Xing 五行) — Wood, Fire, Earth, Metal, and Water — are essential to Chinese metaphysics, philosophy, and medicine.</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Each person is born under a heavenly stem tied to one of these five elements.</li>
                      <li>Your element affects your strengths, personality, and compatibility with others and spaces.</li>
                    </ul>
                    <p className="mb-2 mt-2">Used in Four Pillars (BaZi), Feng Shui, and holistic wellness, your element can guide career, love, and lifestyle alignment.</p>
                    <p className="mb-2">
                      Use your Personal Element to choose colors, décor, and environments that strengthen your energy, and to balance relationships by understanding elemental harmony.
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
                {result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Main Element Display */}
                    <div className={`p-6 rounded-xl border text-center ${elementBgColors[result.element]}`}>
                      <div className="text-6xl mb-4">{elementEmojis[result.element]}</div>
                      <h2 className="text-2xl font-bold text-gold mb-2">
                        Your Element: <span className={elementColors[result.element]}>{result.element}</span>
                      </h2>
                      <p className="text-lg text-black/80 mb-4">
                        <strong>Heavenly Stem:</strong> {result.stem}
                      </p>
                      <p className="text-black/90 leading-relaxed">{result.description}</p>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                      <h3 className="text-xl font-bold text-gold text-center mb-4">Detailed Analysis</h3>
                      
                      {/* Stem Description */}
                      <div className="prose max-w-none">
                        <ReactMarkdown 
                          components={{
                            h3: ({children}) => <h4 className="text-gold font-semibold mb-2 text-base">{children}</h4>,
                            p: ({children}) => <p className="text-black/90 mb-3">{children}</p>,
                            li: ({children}) => <li className="text-black/90">{children}</li>,
                            ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                            strong: ({children}) => <strong className="font-semibold text-black">{children}</strong>
                          }}
                        >
                          {result.stemDescription}
                        </ReactMarkdown>
                      </div>

                      {/* Compatibility & Tips Grid */}
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gold mb-2">Element Compatibility</h4>
                          <p className="text-black/90 text-sm">{compatibilityInsights[result.element]}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gold mb-2">Feng Shui Tip</h4>
                          <p className="text-black/90 text-sm">{fengShuiTips[result.element]}</p>
                        </div>
                      </div>

                      {/* Lucky Elements */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gold mb-3">Your Lucky Elements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-black">Numbers:</span>
                            <p className="text-black/80">{luckyTips[result.element].numbers.join(", ")}</p>
                          </div>
                          <div>
                            <span className="font-medium text-black">Colors:</span>
                            <p className="text-black/80">{luckyTips[result.element].colors.join(", ")}</p>
                          </div>
                          <div>
                            <span className="font-medium text-black">Career Paths:</span>
                            <p className="text-black/80">{luckyTips[result.element].careers.join(", ")}</p>
                          </div>
                        </div>
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
              What Is Your Personal Element?
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              In Chinese metaphysics, your <strong>personal element</strong> — often called your{" "}
              <em>Day Master</em> — is the one of the Five Elements (Wood, Fire, Earth, Metal, or Water)
              that represents your core self. It comes from the <strong>Heavenly Stem of the day you were
              born</strong> in the traditional Chinese solar calendar, not simply your birth year. That is
              why two people born in the same year can have entirely different personal elements. Your Day
              Master is the anchor of a full <strong>BaZi (Four Pillars of Destiny)</strong> chart and gives
              a fast, meaningful snapshot of your natural temperament, your strengths, and the environments
              where you flourish.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              How to Find Your Personal Element by Date of Birth
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              Enter your date of birth above and the calculator converts it to the Chinese solar calendar,
              identifies the Heavenly Stem of your birth day, and maps it to one of the five elements. No
              birth time is needed for this day-element reading. If you have ever wondered{" "}
              <em>"what is my feng shui element"</em> or <em>"which of the five elements am I"</em>, this is
              the quickest authentic way to find out — free and instant.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              The Five Elements and Their Personalities
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-10">
              {(["Wood", "Fire", "Earth", "Metal", "Water"] as const).map((el) => (
                <div key={el} className={`rounded-xl p-5 border ${elementBgColors[el]}`}>
                  <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${elementColors[el]}`}>
                    <span>{elementEmojis[el]}</span> {el} Element Personality
                  </h3>
                  <p className="text-sm text-black/80 leading-relaxed mb-2">{elementDescriptions[el]}</p>
                  <p className="text-xs text-black/60">
                    <strong>Lucky colors:</strong> {luckyTips[el].colors.join(", ")} ·{" "}
                    <strong>Numbers:</strong> {luckyTips[el].numbers.join(", ")}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              How the Five Elements Interact
            </h2>
            <p className="text-black/80 leading-relaxed mb-3">
              The elements are not isolated — they flow through two classic cycles that explain compatibility,
              balance, and tension in Chinese astrology and feng shui:
            </p>
            <ul className="list-disc list-inside space-y-2 text-black/80 mb-8">
              <li>
                <strong>The Generating (Sheng) cycle</strong> — each element nourishes the next: Water feeds
                Wood, Wood fuels Fire, Fire creates Earth (ash), Earth bears Metal, and Metal collects Water.
                Elements that generate yours are supportive and energising.
              </li>
              <li>
                <strong>The Controlling (Ke) cycle</strong> — each element restrains another: Water puts out
                Fire, Fire melts Metal, Metal cuts Wood, Wood breaks up Earth, and Earth dams Water.
                Understanding what controls your element shows where you may feel drained or challenged.
              </li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Using Your Personal Element in Feng Shui
            </h2>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                <thead className="bg-gray-50 text-black">
                  <tr>
                    <th className="p-3 font-semibold">Element</th>
                    <th className="p-3 font-semibold">Feng Shui Tip</th>
                    <th className="p-3 font-semibold">Best Careers</th>
                  </tr>
                </thead>
                <tbody>
                  {(["Wood", "Fire", "Earth", "Metal", "Water"] as const).map((el) => (
                    <tr key={el} className="border-t border-gray-200">
                      <td className={`p-3 font-semibold ${elementColors[el]}`}>
                        {elementEmojis[el]} {el}
                      </td>
                      <td className="p-3 text-black/80">{fengShuiTips[el]}</td>
                      <td className="p-3 text-black/70">{luckyTips[el].careers.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">
                  What is the difference between my personal element and my Chinese zodiac?
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Your Chinese zodiac animal comes from your birth <em>year</em>, while your personal element
                  comes from your birth <em>day</em>. They describe different layers of your chart — the zodiac
                  is your outward, social self, and the Day Master element is your deeper core nature.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Do I need my exact birth time?</h3>
                <p className="text-black/70 leading-relaxed">
                  Not for the personal (day) element shown here. Birth time is only needed for the full
                  four-pillar BaZi chart, which adds the "hour pillar" for more detailed analysis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Can my personal element change over time?</h3>
                <p className="text-black/70 leading-relaxed">
                  No — your Day Master element is fixed at birth. What changes is how the elements around you
                  (in a year, a home, or a relationship) support or challenge it, which is where feng shui
                  adjustments come in.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">
                  How do I balance my element with feng shui?
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Use the colors, directions, and décor linked to your element (see the table above) to
                  strengthen it, and add its "generating" element to nourish it. For example, a Wood person
                  benefits from Water features and green tones in the East or Southeast.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/feng-shui/kua-number" className="text-gold font-semibold hover:underline">
                Calculate your Kua number →
              </Link>
              <Link to="/astrology/chinese-zodiac-calculator" className="text-gold font-semibold hover:underline">
                Find your Chinese zodiac sign →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
	</>
  );
}