// src/pages/VisiberCalculator.tsx
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Share2, ChevronDown, ChevronRight } from "lucide-react";
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
  { label: "Numerology", path: "/numerology" },
  { label: "Visiber Calculator" },
];

// Interface for article data from Sanity
interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  tags?: string[];
}

// Complete Visiber data structure based on your text file
const visiberData: Record<number, {
  description: string;
  personalAttributes: string[];
  strengths: string[];
  weaknesses: string[];
}> = {
  1: {
    description: "The number 1 is the foundation of all numbers—the leader, the origin, and the symbol of beginnings. Moving from 0 to 1 signifies the transition from nothing to something, a spark of creation. Across many philosophies, 1 is closely tied to leadership, individuality, self-confidence, and new beginnings.\n\nPeople with Character Number 1 are natural leaders. Your creativity fuels independence, confidence, and ambition. You are self-reliant and courageous, willing to climb steadily toward success and leadership roles. However, because you find it difficult to fully trust others, you may sometimes come across as proud or overly self-assured, with a strong desire for recognition and validation.\n\nAt times, your focus on self-expression can cause you to overlook the feelings of others. This makes you prone to seeming self-centered, resistant to advice, or dismissive of constructive criticism. You like being in control and prefer obedience over debate, which can create challenges in relationships and may lead to feelings of loneliness or isolation.\n\nIf you learn to manage your ego and balance independence with humility, your leadership qualities will truly shine. Remember, the most successful leaders are not only bold and ambitious, but also wise in how they motivate, inspire, and uplift those around them.",
    personalAttributes: [
      "Efficient, competent, and naturally inspiring to others",
      "Strong sense of individuality and ambition",
      "Can be blunt when frustrated, unintentionally pushing people away"
    ],
    strengths: [
      "Constantly seeking opportunities; quick to learn and act",
      "Pays attention to personal appearance and enjoys being at the forefront of trends",
      "Strong instincts for investing; unique insights into markets and opportunities",
      "Hardworking, responsible, and capable of achieving great success—sometimes even a workaholic"
    ],
    weaknesses: [
      "Easily distracted, lacking sustained focus at times",
      "Can become preoccupied with small flaws or imperfections",
      "Risk of complacency or overspending when success comes easily",
      "May lack clear direction, chasing impractical or short-lived ideas",
      "Communication skills and emotional expression need refinement",
      "Indecisiveness may block progress toward long-term goals"
    ]
  },
  2: {
    description: "Number 2 is the symbol of connection and relationships. Just as two points create a line, 2 represents communication, partnership, and the ability to bring people together. Life, from beginning to end, is built on relationships, and for you, communication is at the heart of everything.\n\nYou are naturally empathetic, a strong listener, and often the mediator in conflicts. With your warmth, charm, and ability to connect, you can easily blend into different groups and make others feel comfortable. Friends see you as a peacemaker, someone who can balance perspectives and soothe tensions.\n\nHowever, your sensitivity can sometimes make you prone to misunderstandings. Your honesty, when too direct, may come across as blunt. You also tend to carry the emotional weight of others, which can be draining. The challenge for you is to balance your natural caring with boundaries, and to express yourself without losing sight of your own needs.",
    personalAttributes: [
      "Strong communicator and empathetic listener",
      "Natural peacemaker who values harmony",
      "Highly sensitive and emotionally aware"
    ],
    strengths: [
      "Talented at bringing people together and resolving conflicts",
      "Creative and expressive, often through art, writing, or humor",
      "Calm and approachable, able to blend into any social group",
      "Supportive friend, always willing to give thoughtful advice"
    ],
    weaknesses: [
      "Can be overly sensitive or take things personally",
      "Blunt honesty may unintentionally cause conflict",
      "Tendency to shoulder others' problems, leading to stress",
      "Struggles with indecision and self-doubt",
      "May avoid confrontation to 'keep the peace,' even at own expense"
    ]
  },
  3: {
    description: "The number 3 embodies momentum and action. Just as 'One, two, three… go!' propels us forward, 3 symbolizes energy, drive, and the impulse to move ahead without hesitation. It carries a powerful force that inspires action in the subconscious.\n\nPeople with Character Number 3 are dynamic doers who thrive on activity. You bring warmth, wit, and passion into everything you do, making you memorable and charismatic. Driven by strong emotions, you chase your dreams with determination and an eagerness to test every possible path to success. Challenges excite you, and your natural energy makes you ready to seize new opportunities.\n\nAt times, however, your impatience can get the better of you. Delays or indecisiveness in others frustrate you, and your childlike spirit may turn into impulsiveness or short bursts of rudeness. Still, your anger fades quickly, and your optimistic energy soon returns. You may also drift into idealistic dreams, losing touch with reality unless you ground yourself.",
    personalAttributes: [
      "Refined taste; enjoys social circles and high standards",
      "Confidence can tip into overconfidence, and unmet expectations may leave you disheartened"
    ],
    strengths: [
      "Energetic and resilient, always pushing forward",
      "Stylish and attentive to personal appearance",
      "Magnetic charisma balanced with responsibility",
      "Hardworking and determined; capable of excelling as a perfectionist"
    ],
    weaknesses: [
      "Worries about how others perceive you; prone to mood swings",
      "Easily unsettled by imperfections",
      "Overly concerned with the opinions of others",
      "Struggles with direction; may chase impractical ideas",
      "Tends to juggle too many tasks without delegating"
    ]
  },
  4: {
    description: "Number 4 is the foundation of order and structure. Just as there are four seasons, four directions, and four virtues, the number 4 represents stability, logic, and discipline. You thrive when life has a clear plan and a sense of security.\n\nYou are methodical, practical, and hardworking. A natural organizer, you approach tasks step by step and rarely leave things unfinished. People value your reliability and straightforwardness — you say what you mean and you get things done.\n\nYet, your blunt honesty may sometimes seem tactless, and your love for stability can make you resistant to change. Beneath your composed exterior, you often carry self-doubt and pressure yourself to work harder for security, whether in your career, relationships, or personal goals. This pursuit of certainty can make you conservative or rigid at times.\n\nWhen you learn to balance discipline with flexibility, you become a powerful and trusted leader who creates stability for yourself and others.",
    personalAttributes: [
      "Practical, disciplined, and reliable",
      "Direct communicator — gets straight to the point",
      "Values security and long-term stability"
    ],
    strengths: [
      "Natural ability to organize and manage",
      "Analytical and logical thinker; excellent planner",
      "Strong work ethic, dependable in all responsibilities",
      "Persuasive speaker with deep reasoning skills",
      "Persistent and self-motivated; not afraid of hard work"
    ],
    weaknesses: [
      "Can be rigid, conservative, or resistant to change",
      "Bluntness may offend others unintentionally",
      "Struggles with self-doubt and internal pressure",
      "May lack spontaneity, appearing dull or overly serious",
      "Prone to indecision when emotions conflict with logic",
      "Social skills may need development"
    ]
  },
  5: {
    description: "The number 5 represents the five directions (East, South, West, North, and Center) and the five elements of the I Ching, symbolizing transformation, stability, and groundedness. Associated with the Earth element, 5 is linked to strong foundations and the ability to adapt within a constantly shifting universe.\n\nPeople with Character Number 5 are resilient, determined, and strong-willed. Once you set your mind to a goal, no obstacle can sway you. You value freedom, independence, and objectivity, resisting control or restriction. Your adaptability allows you to navigate change with ease, winning friendships and social connections along the way.\n\nYet, this same free-spirited nature can make you restless and rebellious. At times, your stubbornness may trap you in unproductive cycles, and unresolved anger can surface destructively. Learning discipline and balance helps you channel your intensity more constructively, ensuring your determination leads to long-term success rather than burnout.",
    personalAttributes: [
      "Calm, detail-oriented, and intellectual",
      "May struggle with confidence, making it hard to see projects through to completion"
    ],
    strengths: [
      "Strong-willed and unwavering in pursuing goals",
      "Naturally creative with talents in writing, art, or other expressions",
      "Quick learner and opportunist",
      "Skilled decision-maker and effective leader",
      "Bold and visionary; willing to take risks others avoid"
    ],
    weaknesses: [
      "Struggles with insecurity and stability",
      "Opinionated and often clashes with others",
      "Difficulty maintaining focus; easily distracted",
      "Can be overly forceful or domineering",
      "Aggressiveness may hinder wealth accumulation",
      "Needs to strengthen social and communication skills"
    ]
  },
  6: {
    description: "The number 6 is often associated with the 'sixth sense', symbolizing heightened intuition and creative inspiration. In Mandarin, the pronunciation of '6' is a homonym for 'riches', linking it closely with prosperity. Within the trio of the famous Chinese deities Fook, Luk, and Sou, Luk (6) is the Deity of Literary Excellence, who bestows rank, fame, and fortune upon scholars. Because of this, the number 6 carries strong ties to wisdom, intuition, and wealth.\n\nPeople with Character Number 6 are naturally connected to matters of wealth and finance. You are a practical realist who values quality and luxury. You are often recognized for your courtesy, good manners, and refined social presence, as well as your sharp intuition and vivid imagination.\n\nIdealistic and compassionate, you are perceptive toward the needs of your family and friends. However, your strong sense of pride drives you to seek recognition and approval, making it difficult for you to say 'no'. This tendency may turn you into a 'yes person', agreeing to opportunities before carefully weighing the consequences.\n\nYou prefer to play it safe and adopt a conservative approach. Rash or impulsive decisions are not in your nature—you rely heavily on your instincts and prefer to evaluate situations carefully before taking action.",
    personalAttributes: [
      "Charismatic and magnetic, with a strong sense of responsibility",
      "Reliable, courteous, and well-mannered",
      "Sometimes overly concerned with how others perceive you"
    ],
    strengths: [
      "Courageous in expressing your thoughts; influential in social settings",
      "Loves traveling, making new connections, and gaining new experiences",
      "Quick to spot opportunities, learn, and take action",
      "Skilled at leveraging available resources to generate income and achieve business success",
      "Once you identify your long-term goal, you have the determination to stay on the path to success"
    ],
    weaknesses: [
      "Emotions and subjective experiences often cloud your judgment",
      "A busy lifestyle may leave you feeling overwhelmed or helpless",
      "Easily distracted and prone to frequent changes in direction",
      "Overconfidence can backfire if not kept in check",
      "Can be extremely stubborn and opinionated"
    ]
  },
  7: {
    description: "The number 7 carries deep symbolic meaning across cultures. In Chinese legend, the goddess Nu Wa created mankind on the seventh day, making 7 Mankind's Day during Lunar New Year. In VISIBER, 7 is similarly associated with humanity. In the West, 7 is also revered as a lucky and sacred number.\n\nPeople with Character Number 7 are social, graceful, and magnetic. You blend effortlessly into groups, excelling at networking and relationship-building. Attractive and charming, you naturally draw others to you and are often seen as the face of public relations.\n\nOn the flip side, 7 also carries the Biblical association with rest, which may manifest as laziness or passivity. You may take blessings for granted, assuming support will always be there. While you enjoy analyzing situations, stubbornness can keep you from accepting uncomfortable truths. Relying too heavily on others' backing can prevent you from cultivating your own strength.",
    personalAttributes: [
      "Stylish and attentive to appearance; enjoys being on trend",
      "Sensitive to imperfections, often worrying over small details"
    ],
    strengths: [
      "Efficient and inspiring; naturally motivates others",
      "Trend-conscious and adventurous; enjoys travel",
      "Hardworking and dependable, with a strong work ethic",
      "Skilled at building relationships; warm and likable"
    ],
    weaknesses: [
      "May speak harshly when frustrated, risking relationships",
      "Principled yet self-centered; struggles with compromise",
      "Lacks clear long-term direction; may chase impractical plans",
      "Willpower can be weak, making you easily swayed by others"
    ]
  },
  8: {
    description: "Number 8 is one of the most powerful and auspicious numbers in many cultures. Its shape resembles the infinity symbol (∞), representing endless potential, resilience, and balance. In Chinese culture, 8 is strongly associated with wealth, success, and ambition.\n\nYou are hardworking, responsible, and capable of carrying great pressure. You set high standards and take commitments seriously, always striving to deliver on your promises. Others see you as strong, authoritative, and reliable — someone who can lead with confidence and make bold decisions.\n\nHowever, with great energy comes great stress. You tend to take on too much, becoming overworked, frustrated, or distracted. Your strong opinions and forceful approach can also create conflict if not tempered with patience. Balancing your drive for achievement with self-care is key to unlocking your full potential.",
    personalAttributes: [
      "Strong, ambitious, and responsible",
      "Natural leader with an authoritative presence",
      "Practical but also visionary, able to see big opportunities"
    ],
    strengths: [
      "Courageous, willing to take risks for success",
      "Highly disciplined, hardworking, and goal-oriented",
      "Charismatic and influential in leadership roles",
      "Creative thinker with unique talents and vision",
      "Strong ability to handle stress and pressure"
    ],
    weaknesses: [
      "Opinionated and forceful, may create animosity",
      "Can become overly aggressive or impatient",
      "Risk of burnout from taking on too much",
      "Struggles with effective planning or long-term focus",
      "Prone to financial ups and downs due to risk-taking",
      "Tendency to put career or success above personal balance"
    ]
  },
  9: {
    description: "In ancient Chinese thought, numbers were divided into Yin (even) and Yang (odd). Nine is the ultimate Yang number, symbolizing strength, supremacy, and authority. Along with 5, it was revered as representing the Emperor himself, giving rise to the concept of the '95 Supreme'. As the final single-digit number, 9 also signifies completion, transition, and the start of a higher cycle.\n\nPeople with Character Number 9 are visionary and opportunistic, blessed with foresight and the ability to spot potential before others. Ambitious and driven, you aim for the highest goals and, when fully committed, can achieve recognition and lasting influence.\n\nHowever, others may view you as impractical or overly idealistic. A tendency toward greed or self-interest can make it difficult to sustain focus on one direction, leaving you scattered or unfulfilled. Without a strong sense of principles, you may appear inconsistent, confusing those around you. Harnessing discipline and clarity of purpose is essential for realizing your full potential.",
    personalAttributes: [
      "Innovative and full of fresh ideas, often sparking business opportunities",
      "Prone to impracticality or being lost in too many thoughts"
    ],
    strengths: [
      "Strives for excellence; perfectionism drives strong personal effort",
      "Charismatic, sociable, and affectionate; builds valuable connections"
    ],
    weaknesses: [
      "Overcommits by taking on too many tasks without delegating",
      "Weak willpower; easily influenced by others",
      "Passive in execution; struggles with follow-through",
      "Poor planning and lack of structure",
      "Indecisive and unclear in objectives",
      "May miss important cues in the environment; needs to stay alert and focused"
    ]
  }
};

// Simple meanings for initial display
const visiberMeanings: Record<number, string> = {
  1: "Leadership, independence, ambitious",
  2: "Sensitivity, harmony, cooperation",
  3: "Creativity, self-expression, optimism",
  4: "Stability, discipline, organization",
  5: "Freedom, adventure, change",
  6: "Responsibility, care, nurturing",
  7: "Introspection, analysis, spirituality",
  8: "Power, wealth, material success",
  9: "Compassion, wisdom, humanitarianism",
};

function calculateVisiberNumber(date: Date): { number: number; breakdown: any } {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  const birthDigits = [...day, ...month, ...year];

  const sumDigits = (str: string) =>
    str.split("").reduce((sum, d) => sum + parseInt(d), 0);
  const reduceToSingleDigit = (num: number) =>
    num > 9 ? sumDigits(num.toString()) : num;

  const daySum = sumDigits(day);
  const monthSum = sumDigits(month);
  const yearFirstSum = reduceToSingleDigit(sumDigits(year.slice(0, 2)));
  const yearLastSum = reduceToSingleDigit(sumDigits(year.slice(2)));

  const leftMiddleSum = reduceToSingleDigit(daySum + monthSum);
  const rightMiddleSum = reduceToSingleDigit(yearFirstSum + yearLastSum);

  const finalNumber = reduceToSingleDigit(leftMiddleSum + rightMiddleSum);

  return {
    number: finalNumber,
    breakdown: {
      day,
      month,
      year,
      birthDigits,
      daySum,
      monthSum,
      yearFirstSum,
      yearLastSum,
      leftMiddleSum,
      rightMiddleSum,
    }
  };
}

const VisiberCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [visiberNumber, setVisiberNumber] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    attributes: false,
    strengths: false,
    weaknesses: false
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
        const query = `*[_type == "article" && defined(tags) && ("numerology" in tags || "visiber" in tags || "numbers" in tags)] | order(publishDate desc)[0...${RELATED_ARTICLES_LIMIT}]{
          _id,
          title,
          "slug": slug.current,
          tags
        }`;
        
        const articles = await sanityClient.fetch<SanityArticle[]>(query);
        
        // If no filtered articles, fall back to recent articles
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

  const handleCalculate = () => {
    if (!birthDate) return;
    const result = calculateVisiberNumber(birthDate);
    setVisiberNumber(result.number);
    setBreakdown(result.breakdown);
    setCopied(false);
  };

  const handleShare = () => {
    const text = `My Visiber number is ${visiberNumber} — ${visiberMeanings[visiberNumber!]}!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: 'attributes' | 'strengths' | 'weaknesses') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
  <>
  <Helmet>
    <title>Visiber Calculator - Discover Your Life Path Number</title>
    <meta name="description" content="Free Visiber numerology calculator to discover your character number. Get comprehensive personality analysis, strengths, weaknesses, and life path insights based on your birth date." />
    <meta name="keywords" content="visiber calculator, visiber numerology, character number, life path number, numerology calculator, personality analysis, birth date numerology" />
    <link rel="canonical" href="https://fengshuiandbeyond.com/numerology/visiber-calculator" />
    
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Visiber Calculator",
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
                <h1 className="text-3xl md:text-4xl font-bold text-gold mt-6 mb-6">
  Visiber Calculator - Discover Your Character Number & Life Path
</h1>
                <p className="text-black/80 mb-6 text-lg leading-relaxed">
				Unlock the secrets of your personality and life path through <span className="font-semibold">Visiber numerology</span>, a unique system that interprets your birthdate's energetic patterns. Our free calculator provides comprehensive insights into your character number, revealing your natural strengths, potential challenges, and the unique energetic signature that guides your life journey. Discover how ancient numerology wisdom can help you make better decisions in relationships, career, and personal growth.
				</p>
              </div>

              {/* Summary Box */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Info size={20} className="text-gold mt-1 shrink-0" />
                  <div className="text-left">
                    <p>
                      <span className="font-semibold">Visiber</span> is a life philosophy system founded by Datuk Patrick Tan and Datuk David Hew, based on the belief that every aspect of a person's life can be explained through numbers.
                    </p>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-2 text-gold hover:underline text-xs font-medium">
                      {showMore ? "Hide Details" : "View More"}
                    </button>
                  </div>
                </div>
                
                {/* Additional Info */}
                {showMore && (
                  <div className="bg-gray-50 text-black/90 p-4 rounded-xl border border-gray-200 text-left">
                    <p className="mb-2">
                      The name <span className="font-semibold">"Visiber"</span> is a combination of "Vision" and "Number", symbolizing the idea that with a clear vision and understanding of one's numbers, a person can achieve personal growth and success.
                    </p>
                    <p className="mb-2">
                      Using your birth date, Visiber reveals a unique numeric pattern that reflects your personality, strengths, and life path.
                    </p>
                    <p>
                      It provides insights into behavior, destiny, and potential obstacles by interpreting the vibration of numbers. Many people use it to guide decisions in relationships, career, and health.
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
                {visiberNumber && breakdown && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gold text-center">
                        Your Character Number: <span className="text-black">{visiberNumber}</span>
                      </h2>
                    </div>

                    <div className="text-black/70 text-center">
                      <div className="font-bold text-gold mb-2">Breakdown</div>

                      {/* Birthdate Digits */}
                      <div className="flex justify-center flex-wrap gap-1 mb-1">
                        {breakdown.birthDigits.map((digit, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 flex items-center justify-center border border-gold text-black font-mono"
                          >
                            {digit}
                          </div>
                        ))}
                      </div>

                      {/* Triangle Diagram */}
                      <svg
                          viewBox="0 0 380 380"
                          className="w-full h-auto -mt-10"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <polygon
                            points="60,60 320,60 190,320"
                            fill="none"
                            stroke="gold" 
                            strokeWidth="1.6"
                          />
                          <line
                            x1="190"
                            y1="60"
                            x2="190"
                            y2="220"
                            stroke="gold" 
                            strokeWidth="1.3"
                          />
                          <line
                            x1="100"
                            y1="140"
                            x2="280"
                            y2="140"
                            stroke="gold" 
                            strokeWidth="1.3"
                          />
                          <line
                            x1="140"
                            y1="220"
                            x2="240"
                            y2="220"
                            stroke="gold" 
                            strokeWidth="1.3"
                          />

                          {/* Top row */}
                          <text x="118" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                            {breakdown.daySum}
                          </text>
                          <text x="158" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                            {breakdown.monthSum}
                          </text>
                          <text x="222" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                            {breakdown.yearFirstSum}
                          </text>
                          <text x="262" y="105" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                            {breakdown.yearLastSum}
                          </text>

                          {/* Middle row */}
                          <text x="155" y="182" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                            {breakdown.leftMiddleSum}
                          </text>
                          <text x="225" y="182" fill="black" fontSize="18" textAnchor="middle" fontFamily="monospace">
                            {breakdown.rightMiddleSum}
                          </text>

                          {/* Final number */}
                          <text x="190" y="266" fill="black" fontSize="30" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            {visiberNumber}
                          </text>
                        </svg>
                    </div>

                    {/* Comprehensive Character Analysis */}
                    <div className="space-y-6 text-left max-w-2xl mx-auto">
                      {visiberNumber && visiberData[visiberNumber] && (
                        <>
                          {/* Main Description */}
                          <div className="prose max-w-none">
                            {visiberData[visiberNumber].description.split('\n\n').map((paragraph, index) => (
                              <p key={index} className="text-black/90 leading-relaxed text-base mb-4">
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {/* Accordion Sections */}
                          <div className="space-y-3">
                            {/* Personal Attributes */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleSection('attributes')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <h3 className="text-lg font-semibold text-gold">Personal Attributes</h3>
                                {expandedSections.attributes ? (
                                  <ChevronDown size={20} className="text-gold" />
                                ) : (
                                  <ChevronRight size={20} className="text-gold" />
                                )}
                              </button>
                              {expandedSections.attributes && (
                                <div className="p-4 bg-white">
                                  <ul className="space-y-2">
                                    {visiberData[visiberNumber].personalAttributes.map((attr, index) => (
                                      <li key={index} className="flex items-start">
                                        <span className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className="text-black/90">{attr}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Strengths */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleSection('strengths')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                                {expandedSections.strengths ? (
                                  <ChevronDown size={20} className="text-green-600" />
                                ) : (
                                  <ChevronRight size={20} className="text-green-600" />
                                )}
                              </button>
                              {expandedSections.strengths && (
                                <div className="p-4 bg-white">
                                  <ul className="space-y-2">
                                    {visiberData[visiberNumber].strengths.map((strength, index) => (
                                      <li key={index} className="flex items-start">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className="text-black/90">{strength}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Weaknesses */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleSection('weaknesses')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <h3 className="text-lg font-semibold text-red-600">Areas for Growth</h3>
                                {expandedSections.weaknesses ? (
                                  <ChevronDown size={20} className="text-red-600" />
                                ) : (
                                  <ChevronRight size={20} className="text-red-600" />
                                )}
                              </button>
                              {expandedSections.weaknesses && (
                                <div className="p-4 bg-white">
                                  <ul className="space-y-2">
                                    {visiberData[visiberNumber].weaknesses.map((weakness, index) => (
                                      <li key={index} className="flex items-start">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className="text-black/90">{weakness}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Share Button */}
                          <div className="flex justify-center pt-4">

                          </div>
                        </>
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
		  {/* Related Resources - Internal Links Section */}
<section className="mt-12 mb-8">
  <h2 className="text-2xl font-bold text-gold mb-6">Explore More Numerology Tools</h2>
  
  <div className="grid md:grid-cols-3 gap-6">
    <Link 
      to="/numerology" 
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-semibold text-gold mb-2">
        All Numerology Tools
      </h3>
      <p className="text-sm text-gray-600">
        Explore our complete collection of numerology calculators and tools
      </p>
    </Link>

    <Link 
      to="/astrology" 
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-semibold text-gold mb-2">
        Astrology Tools
      </h3>
      <p className="text-sm text-gray-600">
        Discover your Chinese and Western zodiac signs
      </p>
    </Link>

    <Link 
      to="/meditation" 
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-semibold text-gold mb-2">
        Meditation Guide
      </h3>
      <p className="text-sm text-gray-600">
        Practice daily yoga and meditation for inner peace
      </p>
    </Link>
  </div>
</section>

{/* Understanding Visiber - Additional SEO Content */}
<section className="mt-12 mb-8 bg-gray-50 rounded-xl p-8 border border-gray-200">
  <h2 className="text-2xl font-bold text-gold mb-4">
    Understanding Visiber Numerology
  </h2>
  <div className="border-t-4 border-gold w-32 mb-6"></div>

  <p className="mb-6 text-black/80 leading-relaxed">
    <span className="font-semibold">Visiber numerology</span> is a comprehensive life philosophy system that combines ancient numerological wisdom with modern insights. Founded by Datuk Patrick Tan and Datuk David Hew, this unique approach analyzes your birth date to reveal your <span className="font-semibold">character number</span>, which serves as a blueprint for understanding your personality, destiny, and life path.
  </p>

  <p className="mb-6 text-black/80 leading-relaxed">
    Unlike traditional numerology systems, Visiber focuses specifically on the energetic patterns derived from your birth date. The name "Visiber" itself is a combination of "Vision" and "Number," reflecting the belief that with clear vision and understanding of your numbers, you can achieve extraordinary personal growth and success.
  </p>

  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">
    How Visiber Calculations Work
  </h3>
  
  <p className="mb-6 text-black/80 leading-relaxed">
    The Visiber calculator uses your complete birth date to derive your character number through a specific mathematical formula. This number, ranging from 1 to 9, reveals core aspects of your personality including your natural strengths, potential weaknesses, and the unique challenges you may face throughout life.
  </p>

  <p className="mb-6 text-black/80 leading-relaxed">
    Each character number carries distinct vibrations and meanings. For instance, Character Number 1 represents leadership and independence, while Character Number 2 symbolizes partnership and diplomacy. Understanding your character number helps you navigate relationships, make career decisions, and pursue personal development aligned with your true nature.
  </p>

  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">
    Benefits of Knowing Your Visiber Number
  </h3>

  <div className="grid md:grid-cols-2 gap-4 mt-4">
    <div className="bg-white p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-2">Self-Awareness</h4>
      <p className="text-sm text-gray-700">
        Gain deeper understanding of your natural tendencies and behavioral patterns
      </p>
    </div>

    <div className="bg-white p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-2">Relationship Insights</h4>
      <p className="text-sm text-gray-700">
        Understand compatibility and improve communication with others
      </p>
    </div>

    <div className="bg-white p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-2">Career Guidance</h4>
      <p className="text-sm text-gray-700">
        Identify career paths that align with your natural strengths
      </p>
    </div>

    <div className="bg-white p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-2">Personal Growth</h4>
      <p className="text-sm text-gray-700">
        Recognize challenges and develop strategies to overcome them
      </p>
    </div>
  </div>
</section>
        </div>
      </main>
    </div>
	</>
  );
};

export default VisiberCalculator;