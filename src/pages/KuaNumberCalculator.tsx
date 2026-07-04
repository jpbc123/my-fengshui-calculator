// src/pages/KuaNumberCalculator.tsx
import { Helmet } from "@/lib/helmet-shim";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Compass, TrendingUp, TrendingDown } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "react-router-dom";
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
  { label: "Feng Shui", path: "/feng-shui" },
  { label: "Kua Number Calculator" },
];

// Define the interface for your Kua tip data from Sanity
interface SanityKuaTip {
  kuaNumber: number;
  tips: string[];
}

const kuaEmojis: Record<number, string> = {
  1: "🌊", // Water
  2: "🏔️", // Earth
  3: "⚡", // Wood/Thunder
  4: "🌳", // Wood/Wind
  5: "🎯", // Center/Earth
  6: "⚔️", // Metal/Heaven
  7: "💎", // Metal/Lake
  8: "🏔️", // Earth/Mountain
  9: "🔥", // Fire
};

const kuaColors: Record<number, string> = {
  1: "text-blue-600",
  2: "text-yellow-600", 
  3: "text-green-600",
  4: "text-green-600",
  5: "text-yellow-600",
  6: "text-gray-600",
  7: "text-gray-600",
  8: "text-yellow-600",
  9: "text-red-600",
};

const kuaBgColors: Record<number, string> = {
  1: "bg-blue-50 border-blue-200",
  2: "bg-yellow-50 border-yellow-200",
  3: "bg-green-50 border-green-200", 
  4: "bg-green-50 border-green-200",
  5: "bg-yellow-50 border-yellow-200",
  6: "bg-gray-50 border-gray-200",
  7: "bg-gray-50 border-gray-200",
  8: "bg-yellow-50 border-yellow-200",
  9: "bg-red-50 border-red-200",
};

const kuaProfiles: Record<
  number,
  {
    name: string;
    traits: string[];
    lucky: string[];
    unlucky: string[];
    element: string;
    description: string;
  }
> = {
  1: {
    name: "Kan (Water)",
    element: "Water",
    description: "Like flowing water, you are adaptable and intuitive, able to navigate life's challenges with wisdom and grace.",
    traits: [
      "Adaptable and resourceful",
      "Strong intuition and insight",
      "Calm and reflective by nature",
      "Excellent at networking and connecting with others",
    ],
    lucky: ["North", "South", "Southeast", "East"],
    unlucky: ["Southwest", "West", "Northwest", "Northeast"],
  },
  2: {
    name: "Kun (Earth)",
    element: "Earth",
    description: "Grounded like the earth itself, you provide stability and nurturing support to those around you.",
    traits: [
      "Reliable, patient, and steady",
      "Strong family values",
      "Nurturing and supportive personality",
      "Prefers stability over risk",
    ],
    lucky: ["Southwest", "West", "Northwest", "Northeast"],
    unlucky: ["North", "South", "Southeast", "East"],
  },
  3: {
    name: "Zhen (Wood)",
    element: "Wood",
    description: "Dynamic like thunder, you bring energy and initiative to everything you do, inspiring growth and progress.",
    traits: [
      "Energetic and driven",
      "Thrives on taking initiative",
      "Creative and quick to adapt",
      "Can be impatient or easily frustrated",
    ],
    lucky: ["South", "North", "Southeast", "East"],
    unlucky: ["Southwest", "West", "Northwest", "Northeast"],
  },
  4: {
    name: "Xun (Wood)",
    element: "Wood",
    description: "Gentle like the wind, you influence others through diplomacy and charm rather than force.",
    traits: [
      "Diplomatic and persuasive",
      "Highly creative and adaptable",
      "Good with relationships and partnerships",
      "Sometimes indecisive due to considering too many options",
    ],
    lucky: ["Southeast", "East", "North", "South"],
    unlucky: ["Southwest", "West", "Northwest", "Northeast"],
  },
  5: {
    name: "Center (Earth)",
    element: "Earth",
    description: "Balanced at the center of all energies, you possess natural leadership and the ability to bring harmony to any situation.",
    traits: [
      "Balanced and grounded personality",
      "Natural leader with a sense of fairness",
      "Stable, reliable, and practical",
      "Must adapt based on gender in calculations",
    ],
    lucky: [
      "Varies depending on gender — usually follows #2 for women and #8 for men",
    ],
    unlucky: [
      "Varies depending on gender — usually follows #2 for women and #8 for men",
    ],
  },
  6: {
    name: "Qian (Metal)",
    element: "Metal",
    description: "Strong like heaven itself, you possess natural authority and the determination to achieve your highest goals.",
    traits: [
      "Strong, determined, and disciplined",
      "Respected for leadership skills",
      "Goal-oriented and ambitious",
      "Sometimes too rigid or stubborn",
    ],
    lucky: ["Northwest", "Northeast", "Southwest", "West"],
    unlucky: ["South", "North", "Southeast", "East"],
  },
  7: {
    name: "Dui (Metal)",
    element: "Metal",
    description: "Joyful like a serene lake, you bring happiness and communication skills that brighten any gathering.",
    traits: [
      "Charming and sociable",
      "Enjoys communication and fun activities",
      "Optimistic and adaptable",
      "May struggle with focus or persistence",
    ],
    lucky: ["West", "Southwest", "Northeast", "Northwest"],
    unlucky: ["East", "Southeast", "North", "South"],
  },
  8: {
    name: "Gen (Earth)",
    element: "Earth",
    description: "Steady like a mountain, you possess deep wisdom and the patience to build lasting success through careful planning.",
    traits: [
      "Calm, patient, and steady",
      "Values knowledge and self-improvement",
      "Good at long-term planning",
      "Can be slow to act but thorough",
    ],
    lucky: ["Northeast", "West", "Northwest", "Southwest"],
    unlucky: ["South", "North", "East", "Southeast"],
  },
  9: {
    name: "Li (Fire)",
    element: "Fire",
    description: "Brilliant like fire, you illuminate the world with your passion, creativity, and natural ability to inspire others.",
    traits: [
      "Passionate and ambitious",
      "Creative and expressive",
      "Radiates warmth and enthusiasm",
      "May become impulsive or overly emotional",
    ],
    lucky: ["South", "North", "Southeast", "East"],
    unlucky: ["West", "Northwest", "Southwest", "Northeast"],
  },
};

// Interface for article data from Sanity
interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  tags?: string[];
}

const kuaGroup = (kua: number) =>
  [1, 3, 4, 9].includes(kua) ? "East Group" : "West Group";

const groupColors = {
  "East Group": "text-green-600",
  "West Group": "text-blue-600"
};

export default function KuaNumberCalculator() {
  const [showMore, setShowMore] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState("male");
  const [kuaNumber, setKuaNumber] = useState<number | null>(null);
  const [kuaTips, setKuaTips] = useState<SanityKuaTip | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(false);
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
        const query = `*[_type == "article" && defined(tags) && ("feng shui" in tags || "kua" in tags || "ba zhai" in tags || "fengshui" in tags)] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
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
  
  useEffect(() => {
    if (kuaNumber) {
      const fetchTips = async () => {
        setLoadingTips(true);
        try {
          const query = `*[_type == "fengShuiTip" && kuaNumber == $kuaNumber][0]{
            kuaNumber,
            tips
          }`;
          const params = { kuaNumber: kuaNumber };
          const data = await sanityClient.fetch(query, params);

          if (data) {
            setKuaTips(data);
          } else {
            setKuaTips(null);
          }
        } catch (err) {
          console.error("Failed to fetch Kua tips:", err);
        } finally {
          setLoadingTips(false);
        }
      };
      fetchTips();
    } else {
      setKuaTips(null);
    }
  }, [kuaNumber]);
          
  const calculateKuaNumber = () => {
    const year = birthDate!.getFullYear();
    if (isNaN(year) || year < 1900 || year > 2100) {
      setKuaNumber(null);
      return;
    }

    const lastTwo = year % 100;
    const sum =
      lastTwo >= 10 ? (lastTwo % 10) + Math.floor(lastTwo / 10) : lastTwo;

    let kua = 0;

    if (gender === "male") {
      kua = year < 2000 ? 10 - sum : 9 - sum;
      if (kua === 5) kua = 2;
    } else {
      kua = year < 2000 ? sum + 5 : sum + 6;
      kua = kua >= 10 ? (kua % 10) + Math.floor(kua / 10) : kua;
      if (kua === 5) kua = 8;
    }

    setKuaNumber(kua);
  };

  const profile = kuaNumber ? kuaProfiles[kuaNumber] : null;
  const group = kuaNumber ? kuaGroup(kuaNumber) : null;

  return (
  <>
    <Helmet>
    <title>Kua Number Calculator - Find Your Lucky Feng Shui Directions</title>
    <meta name="description" content="Calculate your Kua number for free and discover your lucky directions for health, wealth, love, and growth. Based on authentic Ba Zhai Feng Shui principles with personalized guidance." />
    <meta name="keywords" content="kua number calculator, ming gua, ba zhai feng shui, lucky directions, feng shui calculator, eight mansions, personal feng shui number" />
    <link rel="canonical" href="https://fengshuiandbeyond.com/feng-shui/kua-number" />
    
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Kua Number Calculator",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      })}
    </script>
  </Helmet>
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-8">
            {/* Left side - Calculator and Results */}
            <div className="max-w-xl flex-1">
              {/* Breadcrumbs + title */}
              <div className="mb-8">
                <Breadcrumb items={breadcrumbs} className="text-black/80" />
                <h1 className="text-2xl font-bold text-gold mt-4 mb-6">
                  Kua Number Calculator
                </h1>
                <p className="text-black/80 mb-6">
                  Discover how <span className="font-semibold">Feng Shui</span> can
                  guide <span className="font-semibold">harmony, balance, and positive energy</span> in
                  your life. Start with our free tools below to explore your
                  <span className="font-semibold"> personal Feng Shui insights</span>, including
                  your <span className="font-semibold">Kua number</span> and
                  <span className="font-semibold"> lucky directions</span>.
                </p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      Your <span className="font-semibold">Kua Number (Ming Gua 命卦)</span> is an
                      essential part of Ba Zhai Feng Shui. Calculated from your
                      <span className="font-semibold"> birth year and gender</span>, it reveals
                      your personal Feng Shui energy type. Use your
                      <span className="font-semibold"> lucky directions</span> to find the best
                      positions for <span className="font-semibold">health, wealth, love, and growth</span>.
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
                    <p className="mb-2">
                      The <span className="font-semibold">Kua system</span> comes from the
                      <span className="font-semibold"> Ba Zhai (Eight Mansions) school of Feng Shui</span>,
                      rooted in:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        The <span className="font-semibold">Eight Trigrams (Bagua 八卦)</span> from
                        the I Ching.
                      </li>
                      <li>
                        <span className="font-semibold">Yin–Yang theory</span> and the
                        <span className="font-semibold"> Five Elements (Wood, Fire, Earth, Metal, Water)</span>.
                      </li>
                    </ul>
                    <p className="mb-2 mt-2">
                      <span className="font-semibold">Feng Shui practitioners</span> in ancient China
                      used this system to align a person's living environment
                      with <span className="font-semibold">cosmic energies</span> to bring harmony,
                      health, and prosperity.
                    </p>
                    <p className="mb-2">
                      The <span className="font-semibold">Ming Gua (命卦, meaning "life trigram")</span> reflects the
                      energy pattern you were born into — like an
                      <span className="font-semibold"> energetic blueprint of your Qi</span>.
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Favorable directions</span> are used for sleeping
                      positions, desk placement, and door orientation to attract
                      <span className="font-semibold"> positive Qi</span>.
                    </p>
                    <p>
                      Knowing your <span className="font-semibold">Kua Number</span> can help you
                      arrange your space to support
                      <span className="font-semibold"> prosperity, health, and harmonious relationships</span>.
                    </p>
                  </div>
                )}
              </div>

              {/* Input and Button Box */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col gap-4">
                  <DatePickerInput
                    placeholder="Enter your birthdate"
                    date={birthDate}
                    onDateChange={setBirthDate}
                    className="bg-white text-black border border-gray-300"
                  />
                  <RadioGroup
                    defaultValue="male"
                    onValueChange={setGender}
                    className="flex justify-center gap-6"
                  >
                    <div className="flex items-center space-x-2 text-black/90">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="border border-black"
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="flex items-center space-x-2 text-black/90">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="border border-black"
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                  </RadioGroup>
                  <Button
                    variant="gold"
                    size="lg"
                    disabled={!birthDate}
                    onClick={calculateKuaNumber}
                    className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
                  >
                    Calculate My Kua Number
                  </Button>
                </div>
              </div>

              {/* Result */}
              <AnimatePresence>
                {kuaNumber !== null && profile && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 space-y-6"
                  >
                    {/* Main Kua Display */}
                    <div className={`p-6 rounded-xl border text-center ${kuaBgColors[kuaNumber]}`}>
                      <div className="text-6xl mb-4">{kuaEmojis[kuaNumber]}</div>
                      <h2 className="text-2xl font-bold text-gold mb-2">
                        Kua Number: <span className={kuaColors[kuaNumber]}>{kuaNumber}</span>
                      </h2>
                      <h3 className="text-xl font-semibold text-black mb-1">{profile.name}</h3>
                      <p className="text-lg mb-3">
                        <span className="font-medium">Element:</span> {profile.element} • 
                        <span className={`font-semibold ml-1 ${groupColors[group!]}`}>{group}</span>
                      </p>
                      <p className="text-black/90 leading-relaxed">{profile.description}</p>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                      <h3 className="text-xl font-bold text-gold text-center mb-4">Your Feng Shui Profile</h3>
                      
                      {/* Key Traits */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gold mb-3 flex items-center gap-2">
                          <Compass size={18} />
                          Key Personality Traits
                        </h4>
                        <ul className="space-y-2">
                          {profile.traits.map((trait, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="text-black/90">{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Directions Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                            <TrendingUp size={18} />
                            Lucky Directions
                          </h4>
                          <ul className="space-y-2">
                            {profile.lucky.map((dir, i) => (
                              <li key={i} className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-black/90">{dir}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                            <TrendingDown size={18} />
                            Unlucky Directions
                          </h4>
                          <ul className="space-y-2">
                            {profile.unlucky.map((dir, i) => (
                              <li key={i} className="flex items-start">
                                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-black/90">{dir}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Dynamic tips from Sanity */}
                      {loadingTips ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-center text-gray-500">Loading personalized tips...</div>
                        </div>
                      ) : kuaTips && kuaTips.tips && kuaTips.tips.length > 0 ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gold mb-3">Practical Feng Shui Tips</h4>
                          <ul className="space-y-2">
                            {kuaTips.tips.map((tip, i) => (
                              <li key={i} className="flex items-start">
                                <span className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-black/90">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-500 text-sm text-center">
                            Use your lucky directions for sleeping, working, and meditation to enhance positive energy flow.
                          </p>
                        </div>
                      )}
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
              What Is a Kua Number?
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              Your <strong>Kua number</strong> (also written <em>Gua number</em> or <em>Ming Gua, 命卦</em>) is
              your personal feng shui number, calculated from your <strong>year of birth and gender</strong>.
              It comes from the <strong>Eight Mansions (Ba Zhai)</strong> school of feng shui and links you to
              one of the eight trigrams of the I Ching. Your Kua number reveals your <strong>four lucky
              directions</strong> and four unlucky ones — the compass directions you should face and orient
              toward for better sleep, focus, health, and prosperity.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              How to Calculate Your Kua Number
            </h2>
            <p className="text-black/80 leading-relaxed mb-3">
              The calculator above does this for you instantly, but here is the traditional method so you can
              see how your <em>"what is my kua number"</em> result is derived:
            </p>
            <ul className="list-disc list-inside space-y-2 text-black/80 mb-4">
              <li>Add the last two digits of your birth year together, then reduce to a single digit.</li>
              <li>
                <strong>For men:</strong> born before 2000, subtract that digit from 10; born in 2000 or
                later, subtract from 9. (If the result is 5, it becomes 2.)
              </li>
              <li>
                <strong>For women:</strong> born before 2000, add 5; born in 2000 or later, add 6; then reduce
                to a single digit. (If the result is 5, it becomes 8.)
              </li>
              <li>
                Because the feng shui year begins at <strong>Chinese New Year</strong> (late January to
                mid-February), anyone born in January or early February should use the previous year.
              </li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Kua Numbers 1 to 9 and Their Meanings
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {[1, 2, 3, 4, 6, 7, 8, 9].map((n) => (
                <div key={n} className={`rounded-xl p-5 border ${kuaBgColors[n]}`}>
                  <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${kuaColors[n]}`}>
                    <span>{kuaEmojis[n]}</span> Kua {n} — {kuaProfiles[n].name}
                  </h3>
                  <p className="text-xs font-semibold text-black/60 mb-2">
                    {kuaProfiles[n].element} · {kuaGroup(n)}
                  </p>
                  <p className="text-sm text-black/80 leading-relaxed">{kuaProfiles[n].description}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-black/60 mb-10">
              Note: there is no Kua 5 — men with a result of 5 use Kua 2, and women use Kua 8.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              East Group vs West Group
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              Every Kua number belongs to one of two groups. <strong>East Group</strong> people (Kua 1, 3, 4,
              and 9) are most in harmony with the east, southeast, south, and north. <strong>West Group</strong>{" "}
              people (Kua 2, 6, 7, and 8) thrive facing west, northwest, southwest, and northeast. Ideally your
              bed, desk, and main door align with your own group's directions. This grouping is also used in
              feng shui compatibility — partners in the same group often share more naturally aligned energy at
              home.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Your Four Lucky Directions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-10">
              {[
                { name: "Sheng Chi (生氣) — Success & Wealth", desc: "Your best direction for career growth, prosperity, and important goals. Face it while working or place your main door here." },
                { name: "Tian Yi (天醫) — Health", desc: "The direction for wellbeing and recovery. Sleep with your head pointing here to support good health." },
                { name: "Yan Nian (延年) — Love & Relationships", desc: "Enhances harmony, marriage, and family bonds. Ideal for the bedroom and shared spaces." },
                { name: "Fu Wei (伏位) — Stability & Focus", desc: "Brings calm, clarity, and personal growth. Great for a study, meditation corner, or desk." },
              ].map((d) => (
                <div key={d.name} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-bold text-black mb-1">{d.name}</h3>
                  <p className="text-sm text-black/70 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              How to Use Your Kua Number at Home
            </h2>
            <ul className="list-disc list-inside space-y-2 text-black/80 mb-10">
              <li>
                <strong>Best sleeping direction:</strong> point the top of your head toward one of your four
                lucky directions (many prefer their Tian Yi health direction).
              </li>
              <li>
                <strong>Desk and study:</strong> face your Sheng Chi success direction while working or studying.
              </li>
              <li>
                <strong>Main door:</strong> a front door that opens toward a favorable direction is considered
                especially auspicious for the whole household.
              </li>
              <li>
                <strong>Avoid</strong> spending long hours facing your unlucky directions — reserve those areas
                for storage, bathrooms, or utility spaces.
              </li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Why do men and women calculate it differently?</h3>
                <p className="text-black/70 leading-relaxed">
                  Ba Zhai feng shui treats yang (traditionally associated with men) and yin (women) energy as
                  moving in opposite directions through the trigrams, so the formula differs by gender. This is
                  why the same birth year can produce two different Kua numbers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">What if I was born in January or February?</h3>
                <p className="text-black/70 leading-relaxed">
                  The feng shui year starts at Chinese New Year, not January 1. If you were born before Chinese
                  New Year, use the previous year for your calculation. The calculator above handles common
                  cases, but check the Chinese New Year date for your birth year if you were born in early
                  February.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Is a lower or higher Kua number better?</h3>
                <p className="text-black/70 leading-relaxed">
                  Neither — no Kua number is luckier than another. Each simply points to a different set of
                  favorable directions. The goal is to align your space with <em>your</em> directions.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/feng-shui/personal-element" className="text-gold font-semibold hover:underline">
                Find your personal element →
              </Link>
              <Link to="/feng-shui" className="text-gold font-semibold hover:underline">
                Explore more feng shui tools →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
	</>
  );
}