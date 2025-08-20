// src/pages/HeroLanding.tsx
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./fengshui-background.css";

// Import zodiac images
import ratImage from "@/assets/chinese-zodiac/year-of-the-rat.png";
import oxImage from "@/assets/chinese-zodiac/year-of-the-ox.png";
import tigerImage from "@/assets/chinese-zodiac/year-of-the-tiger.png";
import rabbitImage from "@/assets/chinese-zodiac/year-of-the-rabbit.png";
import dragonImage from "@/assets/chinese-zodiac/year-of-the-dragon.png";
import snakeImage from "@/assets/chinese-zodiac/year-of-the-snake.png";
import horseImage from "@/assets/chinese-zodiac/year-of-the-horse.png";
import goatImage from "@/assets/chinese-zodiac/year-of-the-goat.png";
import monkeyImage from "@/assets/chinese-zodiac/year-of-the-monkey.png";
import roosterImage from "@/assets/chinese-zodiac/year-of-the-rooster.png";
import dogImage from "@/assets/chinese-zodiac/year-of-the-dog.png";
import pigImage from "@/assets/chinese-zodiac/year-of-the-pig.png";

type ZodiacKey =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

const zodiacData: Record<ZodiacKey, any> = {
  rat: {
    id: 1,
    name: "Rat",
    chineseName: "鼠",
    years: ["2020", "2008", "1996", "1984", "1972", "1960", "1948", "1936", "1924"],
    image: ratImage,
    color: "from-blue-500 to-blue-700",
    element: "Water",
    traits: ["Intelligent", "Adaptable", "Quick-witted", "Charming", "Honest", "Generous"],
    personality:
      "People born in the Year of the Rat are known for their intelligence and adaptability. They are quick-witted and can easily adjust to new environments. Rats are charming and sociable, making friends wherever they go. They possess strong intuition and are excellent at spotting opportunities.",
    strengths: [
      "Intelligent and clever",
      "Adaptable to change",
      "Strong survival instincts",
      "Charming personality",
      "Good with money",
      "Quick learner",
    ],
    weaknesses: [
      "Can be opportunistic",
      "Sometimes selfish",
      "May lack courage",
      "Can be critical",
      "Impatient at times",
    ],
    luckyNumbers: [2, 3],
    luckyColors: ["Blue", "Gold", "Green"],
    compatibleSigns: ["Dragon", "Monkey", "Ox"],
    career:
      "Rats excel in careers that require quick thinking and adaptability. They make excellent entrepreneurs, writers, critics, publicists, and politicians.",
    love:
      "In relationships, Rats are devoted and caring partners. They seek intellectual connection and appreciate partners who can match their wit and intelligence.",
  },
  ox: {
    id: 2,
    name: "Ox",
    chineseName: "牛",
    years: ["2021", "2009", "1997", "1985", "1973", "1961", "1949", "1937", "1925"],
    image: oxImage,
    color: "from-green-500 to-green-700",
    element: "Earth",
    traits: ["Reliable", "Patient", "Honest", "Methodical", "Strong", "Determined"],
    personality:
      "Those born in the Year of the Ox are known for their reliability and strong work ethic. They are patient, honest, and methodical in their approach to life. Oxen are natural leaders who inspire confidence through their dependability and determination.",
    strengths: [
      "Reliable and trustworthy",
      "Strong work ethic",
      "Patient and persistent",
      "Honest and straightforward",
      "Natural leadership qualities",
      "Good with finances",
    ],
    weaknesses: [
      "Can be stubborn",
      "Slow to adapt",
      "Sometimes inflexible",
      "May be too serious",
      "Can hold grudges",
    ],
    luckyNumbers: [1, 9],
    luckyColors: ["Yellow", "Blue", "Red"],
    compatibleSigns: ["Snake", "Rooster", "Rat"],
    career:
      "Oxen thrive in careers that require patience and attention to detail. They excel as doctors, lawyers, engineers, teachers, and in agriculture or real estate.",
    love:
      "In love, Oxen are loyal and committed partners. They prefer stable, long-term relationships and show love through practical actions and devotion.",
  },
  tiger: {
    id: 3,
    name: "Tiger",
    chineseName: "虎",
    years: ["2022", "2010", "1998", "1986", "1974", "1962", "1950", "1938", "1926"],
    image: tigerImage,
    color: "from-orange-500 to-orange-700",
    element: "Wood",
    traits: ["Brave", "Confident", "Competitive", "Unpredictable", "Independent", "Charismatic"],
    personality:
      "Tigers are natural born leaders with magnetic personalities. They are brave, competitive, and love challenges. Their confidence and charisma make them natural performers, though they can be unpredictable and rebellious at times.",
    strengths: [
      "Natural leadership abilities",
      "Brave and courageous",
      "Confident and charismatic",
      "Independent thinker",
      "Generous and warm-hearted",
      "Strong sense of justice",
    ],
    weaknesses: [
      "Can be impulsive",
      "Sometimes arrogant",
      "Short-tempered",
      "Restless nature",
      "May be too trusting",
    ],
    luckyNumbers: [1, 3, 4],
    luckyColors: ["Blue", "Gray", "Orange"],
    compatibleSigns: ["Horse", "Dog", "Pig"],
    career:
      "Tigers excel in leadership roles and creative fields. They make excellent managers, entrepreneurs, artists, actors, and in military or police work.",
    love:
      "Tigers are passionate and romantic partners who seek excitement in relationships. They need partners who can match their energy and give them space for independence.",
  },
  rabbit: {
    id: 4,
    name: "Rabbit",
    chineseName: "兔",
    years: ["2023", "2011", "1999", "1987", "1975", "1963", "1951", "1939", "1927"],
    image: rabbitImage,
    color: "from-pink-500 to-pink-700",
    element: "Wood",
    traits: ["Gentle", "Quiet", "Elegant", "Alert", "Kind", "Responsible"],
    personality:
      "Rabbits are known for their gentleness and refined nature. They are quiet observers who prefer harmony over conflict. Their elegance and kindness make them beloved by many, though they can be overly cautious at times.",
    strengths: [
      "Gentle and compassionate",
      "Good listener",
      "Artistic and creative",
      "Diplomatic",
      "Cautious and careful",
      "Refined taste",
    ],
    weaknesses: [
      "Can be too cautious",
      "Avoids confrontation",
      "Sometimes moody",
      "May lack assertiveness",
      "Overly sensitive",
    ],
    luckyNumbers: [3, 4, 6],
    luckyColors: ["Red", "Pink", "Purple"],
    compatibleSigns: ["Goat", "Pig", "Dog"],
    career:
      "Rabbits excel in creative and helping professions. They make excellent artists, counselors, diplomats, teachers, and work well in hospitality or healthcare.",
    love:
      "In relationships, Rabbits are gentle and caring partners who value emotional security. They seek peaceful, harmonious relationships with deep emotional connections.",
  },
  dragon: {
    id: 5,
    name: "Dragon",
    chineseName: "龙",
    years: ["2024", "2012", "2000", "1988", "1976", "1964", "1952", "1940", "1928"],
    image: dragonImage,
    color: "from-red-500 to-red-700",
    element: "Earth",
    traits: ["Strong", "Lucky", "Flexible", "Energetic", "Decisive", "Ambitious"],
    personality:
      "Dragons are the most powerful and lucky of all zodiac signs. They are energetic, decisive, and naturally ambitious. Dragons possess strong leadership qualities and are not afraid to take risks to achieve their goals.",
    strengths: [
      "Natural charisma",
      "Strong leadership",
      "Ambitious and driven",
      "Confident and energetic",
      "Lucky in life",
      "Innovative thinker",
    ],
    weaknesses: [
      "Can be arrogant",
      "Impatient",
      "Hot-tempered",
      "Sometimes tactless",
      "May be demanding",
    ],
    luckyNumbers: [1, 6, 7],
    luckyColors: ["Gold", "Silver", "Gray"],
    compatibleSigns: ["Rooster", "Rat", "Monkey"],
    career:
      "Dragons excel in high-profile careers and leadership positions. They make excellent CEOs, politicians, inventors, artists, and entrepreneurs.",
    love:
      "Dragons are passionate and generous lovers who seek partners who can appreciate their dynamic nature. They need intellectual stimulation and admiration in relationships.",
  },
  snake: {
    id: 6,
    name: "Snake",
    chineseName: "蛇",
    years: ["2025", "2013", "2001", "1989", "1977", "1965", "1953", "1941", "1929"],
    image: snakeImage,
    color: "from-purple-500 to-purple-700",
    element: "Fire",
    traits: ["Wise", "Intuitive", "Graceful", "Organized", "Elegant", "Mysterious"],
    personality:
      "Snakes are wise and intuitive creatures with a mysterious aura. They are highly organized and elegant in their approach to life. Their deep thinking and analytical nature make them excellent problem solvers.",
    strengths: [
      "Wise and intuitive",
      "Elegant and graceful",
      "Good with money",
      "Analytical mind",
      "Mysterious charm",
      "Strong determination",
    ],
    weaknesses: [
      "Can be jealous",
      "Sometimes suspicious",
      "May be too secretive",
      "Prone to stress",
      "Can be possessive",
    ],
    luckyNumbers: [2, 8, 9],
    luckyColors: ["Black", "Red", "Yellow"],
    compatibleSigns: ["Ox", "Rooster", "Monkey"],
    career:
      "Snakes excel in fields requiring analysis and intuition. They make excellent scientists, investigators, philosophers, psychologists, and astrologers.",
    love:
      "Snakes are deeply passionate and loyal partners who form intense emotional bonds. They can be possessive but are devoted once they commit to a relationship.",
  },
  horse: {
    id: 7,
    name: "Horse",
    chineseName: "马",
    years: ["2026", "2014", "2002", "1990", "1978", "1966", "1954", "1942", "1930"],
    image: horseImage,
    color: "from-yellow-500 to-yellow-700",
    element: "Fire",
    traits: ["Energetic", "Independent", "Impatient", "Cheerful", "Adventurous", "Free-spirited"],
    personality:
      "Horses are energetic and free-spirited individuals who love adventure and independence. They are cheerful optimists who inspire others with their enthusiasm, though they can be impatient when things don't move fast enough.",
    strengths: [
      "Energetic and enthusiastic",
      "Independent spirit",
      "Optimistic outlook",
      "Adventurous nature",
      "Good communicator",
      "Quick learner",
    ],
    weaknesses: [
      "Can be impatient",
      "Sometimes selfish",
      "Lacks perseverance",
      "May be too impulsive",
      "Struggles with routine",
    ],
    luckyNumbers: [2, 3, 7],
    luckyColors: ["Yellow", "Green", "Purple"],
    compatibleSigns: ["Tiger", "Goat", "Dog"],
    career:
      "Horses excel in dynamic, people-oriented careers. They make excellent sales representatives, tour guides, performers, journalists, and travel agents.",
    love:
      "Horses are romantic and passionate partners who need freedom in relationships. They seek adventurous partners who can keep up with their energetic lifestyle.",
  },
  goat: {
    id: 8,
    name: "Goat",
    chineseName: "羊",
    years: ["2027", "2015", "2003", "1991", "1979", "1967", "1955", "1943", "1931"],
    image: goatImage,
    color: "from-emerald-500 to-emerald-700",
    element: "Earth",
    traits: ["Calm", "Gentle", "Sympathetic", "Artistic", "Creative", "Peaceful"],
    personality:
      "Goats are calm, gentle souls with strong artistic inclinations. They are sympathetic and caring, always ready to help others. Their creative nature and peaceful demeanor make them wonderful companions and artists.",
    strengths: [
      "Gentle and compassionate",
      "Artistic and creative",
      "Sympathetic nature",
      "Good team player",
      "Intuitive",
      "Peaceful disposition",
    ],
    weaknesses: [
      "Can be pessimistic",
      "Indecisive at times",
      "May lack confidence",
      "Prone to worry",
      "Avoids responsibility",
    ],
    luckyNumbers: [2, 7, 8],
    luckyColors: ["Green", "Red", "Purple"],
    compatibleSigns: ["Rabbit", "Horse", "Pig"],
    career:
      "Goats excel in creative and caring professions. They make excellent artists, designers, writers, nurses, and work well in non-profit organizations.",
    love:
      "Goats are tender and romantic partners who seek emotional security. They need understanding partners who can provide stability and appreciation for their sensitive nature.",
  },
  monkey: {
    id: 9,
    name: "Monkey",
    chineseName: "猴",
    years: ["2028", "2016", "2004", "1992", "1980", "1968", "1956", "1944", "1932"],
    image: monkeyImage,
    color: "from-amber-500 to-amber-700",
    element: "Metal",
    traits: ["Clever", "Curious", "Mischievous", "Innovative", "Witty", "Sociable"],
    personality:
      "Monkeys are clever and curious individuals with a playful nature. They are innovative problem-solvers who love to learn new things. Their wit and sociability make them popular, though their mischievous side can sometimes get them into trouble.",
    strengths: [
      "Intelligent and clever",
      "Adaptable",
      "Innovative thinker",
      "Good sense of humor",
      "Sociable",
      "Quick problem solver",
    ],
    weaknesses: [
      "Can be mischievous",
      "Sometimes unreliable",
      "May be manipulative",
      "Restless nature",
      "Can be jealous",
    ],
    luckyNumbers: [4, 9, 14],
    luckyColors: ["White", "Blue", "Gold"],
    compatibleSigns: ["Dragon", "Rat", "Snake"],
    career:
      "Monkeys excel in fields requiring creativity and innovation. They make excellent inventors, entertainers, scientists, engineers, and in technology or media.",
    love:
      "Monkeys are charming and playful partners who bring excitement to relationships. They need intellectual stimulation and variety to stay engaged in love.",
  },
  rooster: {
    id: 10,
    name: "Rooster",
    chineseName: "鸡",
    years: ["2029", "2017", "2005", "1993", "1981", "1969", "1957", "1945", "1933"],
    image: roosterImage,
    color: "from-rose-500 to-rose-700",
    element: "Metal",
    traits: ["Observant", "Hardworking", "Courageous", "Honest", "Confident", "Flamboyant"],
    personality:
      "Roosters are observant and hardworking individuals who take pride in their appearance and achievements. They are honest, confident, and not afraid to speak their minds. Their flamboyant nature often makes them the center of attention.",
    strengths: [
      "Hardworking and diligent",
      "Honest and straightforward",
      "Confident",
      "Good organizer",
      "Loyal friend",
      "Attention to detail",
    ],
    weaknesses: [
      "Can be critical",
      "Sometimes boastful",
      "May be inflexible",
      "Prone to criticism",
      "Can be impatient",
    ],
    luckyNumbers: [5, 7, 8],
    luckyColors: ["Gold", "Brown", "Yellow"],
    compatibleSigns: ["Ox", "Dragon", "Snake"],
    career:
      "Roosters excel in detail-oriented and public-facing careers. They make excellent accountants, critics, military officers, public relations specialists, and surgeons.",
    love:
      "Roosters are loyal and devoted partners who take relationships seriously. They seek partners who appreciate their honesty and can handle their direct communication style.",
  },
  dog: {
    id: 11,
    name: "Dog",
    chineseName: "狗",
    years: ["2030", "2018", "2006", "1994", "1982", "1970", "1958", "1946", "1934"],
    image: dogImage,
    color: "from-indigo-500 to-indigo-700",
    element: "Earth",
    traits: ["Loyal", "Responsible", "Reliable", "Honest", "Friendly", "Fair"],
    personality:
      "Dogs are loyal and responsible individuals with a strong sense of justice. They are reliable friends who can always be counted on in times of need. Their honest and fair nature makes them excellent judges of character.",
    strengths: [
      "Loyal and faithful",
      "Strong sense of justice",
      "Reliable and responsible",
      "Honest",
      "Good listener",
      "Protective nature",
    ],
    weaknesses: [
      "Can be pessimistic",
      "Worries too much",
      "Sometimes stubborn",
      "May be overly critical",
      "Anxious nature",
    ],
    luckyNumbers: [3, 4, 9],
    luckyColors: ["Red", "Green", "Purple"],
    compatibleSigns: ["Tiger", "Rabbit", "Horse"],
    career:
      "Dogs excel in service-oriented and justice-related careers. They make excellent lawyers, social workers, teachers, doctors, and police officers.",
    love:
      "Dogs are faithful and caring partners who prioritize family and relationships. They seek stable, long-term partnerships based on trust and mutual respect.",
  },
  pig: {
    id: 12,
    name: "Pig",
    chineseName: "猪",
    years: ["2031", "2019", "2007", "1995", "1983", "1971", "1959", "1947", "1935"],
    image: pigImage,
    color: "from-teal-500 to-teal-700",
    element: "Water",
    traits: ["Honest", "Generous", "Reliable", "Optimistic", "Tolerant", "Peaceful"],
    personality:
      "Pigs are honest and generous individuals with optimistic outlooks on life. They are reliable friends who are always willing to help others. Their tolerant and peaceful nature makes them easy to get along with and popular in social circles.",
    strengths: [
      "Honest and sincere",
      "Generous spirit",
      "Optimistic outlook",
      "Good friend",
      "Tolerant",
      "Hardworking",
    ],
    weaknesses: [
      "Can be naive",
      "Sometimes materialistic",
      "May be gullible",
      "Prone to indulgence",
      "Can be lazy",
    ],
    luckyNumbers: [2, 5, 8],
    luckyColors: ["Yellow", "Gray", "Brown"],
    compatibleSigns: ["Tiger", "Rabbit", "Goat"],
    career:
      "Pigs excel in hospitality and creative fields. They make excellent chefs, entertainers, social workers, veterinarians, and in retail or hospitality industries.",
    love:
      "Pigs are warm and affectionate partners who value family life. They are generous lovers who seek harmony and happiness in their relationships.",
  },
};

const HeroLanding: React.FC = () => {
  const { zodiac } = useParams<{ zodiac: string }>();
  const key = (zodiac?.toLowerCase() as ZodiacKey) || "dragon";
  const currentZodiac = zodiacData[key] ?? zodiacData.dragon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // optionally set document title
    document.title = `Year of the ${currentZodiac.name} | Feng Shui & Beyond`;
  }, [key, currentZodiac.name]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gold/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-32 right-20 w-16 h-16 bg-red-500/10 rounded-full blur-lg animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-16 w-24 h-24 bg-gold/10 rounded-full blur-xl animate-pulse delay-2000" />

      <Header />

      <div className="pt-24 px-4 max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-8">
          <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${currentZodiac.color} mb-6 shadow-2xl`}>
            <img
              src={currentZodiac.image}
              alt={currentZodiac.name}
              className="w-24 h-24 mx-auto object-contain filter drop-shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-bold text-gold mb-4">
            Year of the {currentZodiac.name}
          </h1>
          <div className="text-6xl mb-4 opacity-80">{currentZodiac.chineseName}</div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {currentZodiac.personality}
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl mb-3">🗓️</div>
            <h3 className="text-xl font-bold text-gold mb-2">Birth Years</h3>
            <p className="text-white/80">{currentZodiac.years.join(", ")}</p>
          </div>

          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="text-xl font-bold text-gold mb-2">Element</h3>
            <p className="text-white/80">{currentZodiac.element}</p>
          </div>

          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl mb-3">🍀</div>
            <h3 className="text-xl font-bold text-gold mb-2">Lucky Numbers</h3>
            <p className="text-white/80">{currentZodiac.luckyNumbers.join(", ")}</p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Personality & Traits */}
          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gold mb-4">Key Traits</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentZodiac.traits.map((trait: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
            <p className="text-white/80 leading-relaxed">{currentZodiac.personality}</p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gold mb-4">Strengths & Challenges</h2>
            <div className="mb-4">
              <h3 className="text-green-400 font-semibold mb-2">💪 Strengths</h3>
              <ul className="text-white/80 text-sm space-y-1">
                {currentZodiac.strengths.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-orange-400 font-semibold mb-2">⚠️ Areas for Growth</h3>
              <ul className="text-white/80 text-sm space-y-1">
                {currentZodiac.weaknesses.map((w: string, i: number) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Love & Career */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gold mb-4">💕 Love & Relationships</h2>
            <p className="text-white/80 leading-relaxed mb-4">{currentZodiac.love}</p>
            <h3 className="text-lg font-semibold text-gold mb-2">Compatible Signs</h3>
            <div className="flex flex-wrap gap-2">
              {currentZodiac.compatibleSigns.map((sign: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm"
                >
                  {sign}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-black/40 border border-gold/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gold mb-4">💼 Career & Success</h2>
            <p className="text-white/80 leading-relaxed mb-4">{currentZodiac.career}</p>
            <h3 className="text-lg font-semibold text-gold mb-2">Lucky Colors</h3>
            <div className="flex flex-wrap gap-2">
              {currentZodiac.luckyColors.map((color: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-black/40 border border-gold/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gold mb-6 text-center">
            Discover More About Your Destiny
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 rounded-xl p-6 hover:bg-gold/20 transition-all duration-300 text-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🧮</div>
              <h3 className="text-lg font-bold text-gold mb-2">Zodiac Calculator</h3>
              <p className="text-white/70 text-sm">
                Find your exact Chinese zodiac and element
              </p>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-400/30 rounded-xl p-6 hover:bg-purple-500/20 transition-all duration-300 text-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">☯️</div>
              <h3 className="text-lg font-bold text-purple-300 mb-2">Feng Shui</h3>
              <p className="text-white/70 text-sm">
                Harmonize your environment with ancient wisdom
              </p>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-400/30 rounded-xl p-6 hover:bg-red-500/20 transition-all duration-300 text-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🌙</div>
              <h3 className="text-lg font-bold text-red-300 mb-2">Full Chart Reading</h3>
              <p className="text-white/70 text-sm">
                Get your complete Chinese astrology profile
              </p>
            </a>
          </div>
        </div>

        {/* Back to All Zodiacs */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-2">←</span>
            Explore All Chinese Zodiacs
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HeroLanding;
