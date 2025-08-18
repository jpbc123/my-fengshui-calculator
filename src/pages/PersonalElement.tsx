import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DatePickerInput } from "@/components/DatePickerInput";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Solar, Lunar } from "lunar-typescript";
import Breadcrumb from "@/components/Breadcrumb";
import ReactMarkdown from 'react-markdown';
import ShareResult from "@/components/ShareResult";

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

const stemDescriptions: Record<string, string> = {
  Jia: `🌳 **Jia (甲) – Yang Wood**  
**Element:** Wood  

Jia is like a tall, sturdy tree — upright, dependable, and growth-oriented.  

**Those with Jia as their Heavenly Stem often:**  
- Are principled and dependable  
- Take initiative and lead with vision  
- Strive for steady growth and progress  

**They may also:**  
- Be stubborn or inflexible  
- Struggle with adapting quickly to change`,

  Yi: `🌱 **Yi (乙) – Yin Wood**  
**Element:** Wood  

Yi is like climbing vines or delicate flowers — flexible, adaptive, and diplomatic.  

**Those with Yi as their Heavenly Stem often:**  
- Are creative and adaptable  
- Build relationships through charm and empathy  
- Work well behind the scenes to influence outcomes  

**They may also:**  
- Be overly dependent on others  
- Avoid confrontation even when necessary`,

  Bing: `🔥 **Bing (丙) – Yang Fire**  
**Element:** Fire  

Bing is like the sun — warm, bright, and energizing.  

**Those with Bing as their Heavenly Stem often:**  
- Inspire others with optimism  
- Have a big presence and strong leadership  
- Thrive when motivating or teaching  

**They may also:**  
- Be impatient or restless  
- Overextend themselves trying to help everyone`,

  Ding: `🕯 **Ding (丁) – Yin Fire**  
**Element:** Fire  

Ding is like candlelight — subtle, nurturing, and refined.  

**Those with Ding as their Heavenly Stem often:**  
- Offer emotional warmth and comfort  
- Work quietly yet effectively  
- Have strong intuition and insight  

**They may also:**  
- Be overly sensitive or moody  
- Struggle with self-confidence`,

  Wu: `🏔 **Wu (戊) – Yang Earth**  
**Element:** Earth  

Wu is like a mountain — stable, protective, and reliable.  

**Those with Wu as their Heavenly Stem often:**  
- Are trustworthy and responsible  
- Provide security for others  
- Have great endurance and patience  

**They may also:**  
- Be overly cautious or resistant to change  
- Struggle with expressing emotions`,

  Ji: `🌾 **Ji (己) – Yin Earth**  
**Element:** Earth  

Ji is like fertile soil — nurturing, supportive, and grounded.  

**Those with Ji as their Heavenly Stem often:**  
- Care deeply for others’ well-being  
- Offer practical solutions and guidance  
- Are humble and approachable  

**They may also:**  
- Worry too much about small details  
- Be prone to self-doubt`,

  Geng: `⚔ **Geng (庚) – Yang Metal**  
**Element:** Metal  

Geng is like an axe or raw metal — strong, bold, and decisive.  

**Those with Geng as their Heavenly Stem often:**  
- Are courageous and ambitious  
- Excel in solving problems directly  
- Have a strong sense of justice  

**They may also:**  
- Be overly critical or harsh  
- Have a short temper`,

  Xin: `💎 **Xin (辛) – Yin Metal**  
**Element:** Metal  

Xin is like refined jewelry — elegant, sharp, and intelligent.  

**Those with Xin as their Heavenly Stem often:**  
- Possess great taste and attention to detail  
- Communicate with charm and diplomacy  
- Value refinement and etiquette  

**They may also:**  
- Be passive-aggressive when upset  
- Struggle with inner vulnerability`,

  Ren: `🌊 **Ren (壬) – Yang Water**  
**Element:** Water  

Ren is like the ocean — vast, deep, and adaptable.  

**Those with Ren as their Heavenly Stem often:**  
- Are resourceful and intelligent  
- Adapt quickly to changing situations  
- Inspire others with their vision  

**They may also:**  
- Be unpredictable or secretive  
- Struggle with commitment`,

  Gui: `💧 **Gui (癸) – Yin Water**  
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

export default function PersonalElement() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [result, setResult] = useState<{
    stem: string;
    element: string;
    description: string;
    stemDescription: string;
  } | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleCalculate = () => {
    if (!birthDate) return;

    try {
      const lunar = Lunar.fromDate(new Date(birthDate));
      const dayGanZhi = lunar.getDayInGanZhi(); // e.g., "甲子"
      const stemChineseChar = dayGanZhi.charAt(0);
      const dayHeavenlyStem = stemEnglishNames[stemChineseChar];

      if (!dayHeavenlyStem) throw new Error(`Unrecognized stem: ${stemChineseChar}`);

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
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Header />
	   <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">Personal Element Analysis</h1>
      </div>
		<div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Summary Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm text-white/80 bg-gold/10 p-4 rounded-xl border border-gold/30">
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
              <div className="bg-black/40 text-white/90 text-sm p-4 rounded-xl border border-gold/26 text-left">
                <p className="mb-2">The Five Elements (Wu Xing 五行) — Wood, Fire, Earth, Metal, and Water — are essential to Chinese metaphysics, philosophy, and medicine.</p>
                <p>• Each person is born under a heavenly stem tied to one of these five elements.</p>
                <p>• Your element affects your strengths, personality, and compatibility with others and spaces.</p>
                <p className="mb-2">Used in Four Pillars (BaZi), Feng Shui, and holistic wellness, your element can guide career, love, and lifestyle alignment.</p>
				<p className="mb-2">
				Use your Personal Element to choose colors, décor, and environments that strengthen your energy, and to balance relationships by understanding elemental harmony.</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bg-white/5 p-6 rounded-xl border border-gold/20">
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
                Calculate Personal Element
              </Button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <>
              <motion.div
                id="personalElementResult" // <-- this id is important for ShareResult
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-xl bg-gold/10 border border-gold/30 text-left space-y-4"
              >
                <h2 className="text-xl font-bold text-gold">Your Element: {result.element}</h2>
                <p><strong>Heavenly Stem:</strong> {result.stem}</p>
                <div className="prose prose-invert">
                  <strong>Stem Meaning:</strong>
                  <ReactMarkdown>{result.stemDescription}</ReactMarkdown>
                </div>
                <p><strong>Element Traits:</strong> {result.description}</p>
                <p><strong>Compatibility:</strong> {compatibilityInsights[result.element]}</p>
                <p><strong>Lucky Numbers:</strong> {luckyTips[result.element].numbers.join(", ")}</p>
                <p><strong>Lucky Colors:</strong> {luckyTips[result.element].colors.join(", ")}</p>
                <p><strong>Suggested Careers:</strong> {luckyTips[result.element].careers.join(", ")}</p>
                <p><strong>Feng Shui Tip:</strong> {fengShuiTips[result.element]}</p>
              </motion.div>

              {/* Share Buttons */}
              <ShareResult targetId="personalElementResult" />
            </>
          )}
        </div>
      </main>
	  <Footer />
    </div>
	
  );
}
