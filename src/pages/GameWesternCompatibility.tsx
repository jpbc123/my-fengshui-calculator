import { useState } from "react";
import { Helmet } from "@/lib/helmet-shim";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Star } from "lucide-react"; // Changed Constellation to Star
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageSwiper } from "@/components/ImageSwiper"; 

import visualizationImage from '../assets/meditate-visualization.jpg';
import affirmationImage from '../assets/meditate-affirmation.jpg';
import yogaImage from '../assets/meditate-yoga.jpg';
import morningImage from '../assets/meditate-morning.jpg';
import eveningImage from '../assets/meditate-evening.jpg';
import breathingImage from '../assets/meditate-breathing.jpg';


const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Games & Fun", path: "/games-fun" },
  { label: "Western Zodiac Compatibility" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditation/visualization-exercises",
  },
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditation/evening-relaxation",
  },
  {
    title: "Morning Mindfulness",
    description: "Start your day calm, centered, and ready for opportunities",
    image: morningImage,
    link: "/meditation/morning-mindfulness",
  },
  {
    title: "Daily Affirmations",
    description: "Repeat a daily phrase to boost confidence, luck, and clarity",
    image: affirmationImage,
    link: "/meditation/daily-affirmation",
  },
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditation/yoga",
  },
];

const westernZodiacSigns = [
  { name: "Aries", description: "Brave, passionate, dynamic, quick-witted." },
  { name: "Taurus", description: "Strong, dependable, sensual, creative." },
  { name: "Gemini", description: "Versatile, expressive, curious, kind." },
  { name: "Cancer", description: "Intuitive, sentimental, compassionate, protective." },
  { name: "Leo", description: "Dramatic, warm, creative, dominant." },
  { name: "Virgo", description: "Analytical, kind, hardworking, practical." },
  { name: "Libra", description: "Social, fair-minded, diplomatic, gracious." },
  { name: "Scorpio", description: "Resourceful, brave, passionate, stubborn." },
  { name: "Sagittarius", description: "Generous, idealistic, great sense of humor." },
  { name: "Capricorn", description: "Responsible, disciplined, self-control, good managers." },
  { name: "Aquarius", description: "Progressive, original, independent, humanitarian." },
  { name: "Pisces", description: "Compassionate, artistic, intuitive, gentle." },
];

// Sun-sign compatibility, one entry per unordered pair (78 total); lookup tries both orders.
// Scores follow the traditional aspect between the two signs (their distance around the zodiac):
//   trine (same element)                         88–95  — easiest flow
//   sextile (Fire–Air or Earth–Water)            80–86  — friendly, complementary
//   conjunction (same sign)                      70–78  — familiar, but doubles the flaws
//   opposition (complementary elements, same modality) 70–75 — magnetic but needs balance
//   semi-sextile (neighbouring signs)            50–56  — little in common
//   square (clashing elements, same modality)    40–48  — friction and growth
//   quincunx / inconjunct (nothing shared)       40–50  — awkward, needs adjusting
// Small differences within a band reflect traditional rulerships and well-known pairings.
const compatibilityMessages: Record<string, { score: number; text: string }> = {
  // Aries
  "Aries-Aries": { score: 70, text: `Two Aries make a fast, fiery, fearless pair. You share drive and a love of action, but you both want to lead — learn to take turns and the sparks stay fun instead of fierce.` },
  "Aries-Taurus": { score: 55, text: `Neighbouring signs with very different speeds: Aries charges ahead while Taurus moves steadily. Aries brings excitement and Taurus brings staying power, but patience is needed on both sides.` },
  "Aries-Gemini": { score: 83, text: `A lively Fire–Air pairing. Gemini's wit and curiosity keep Aries entertained, and Aries' boldness turns Gemini's ideas into action. Expect plenty of adventure and banter.` },
  "Aries-Cancer": { score: 45, text: `Both are cardinal signs who like to take charge, but in opposite ways — Aries leads with action, Cancer with feeling. Aries' bluntness can hurt sensitive Cancer, so gentleness is key.` },
  "Aries-Leo": { score: 93, text: `A classic Fire trine. Two warm, confident, passionate signs who admire each other's courage. Just leave room for both egos to shine and this is one of the zodiac's most exciting matches.` },
  "Aries-Virgo": { score: 45, text: `Aries acts on instinct while Virgo analyses every detail. Virgo can feel rushed and Aries can feel criticised. The relationship works when Aries values Virgo's care and Virgo enjoys Aries' energy.` },
  "Aries-Libra": { score: 72, text: `Opposite signs that attract strongly. Aries is direct and self-driven, Libra is diplomatic and partnership-minded. Each has what the other lacks — balance "me" and "we" and it can be a great match.` },
  "Aries-Scorpio": { score: 48, text: `Both signs are traditionally ruled by Mars, so the passion is intense — and so are the power struggles. Aries is open and impulsive, Scorpio private and strategic. Trust has to be earned.` },
  "Aries-Sagittarius": { score: 92, text: `A Fire trine full of optimism and adventure. Both love freedom, honesty, and new experiences, so this pair rarely gets bored. A fun, energetic match that thrives on shared goals.` },
  "Aries-Capricorn": { score: 47, text: `Two ambitious cardinal signs with clashing styles: Aries wants speed, Capricorn wants a plan. If they respect each other's methods, Aries' drive and Capricorn's discipline can achieve a lot together.` },
  "Aries-Aquarius": { score: 84, text: `A stimulating Fire–Air match. Aquarius' original ideas and Aries' enthusiasm feed each other, and both value independence. A friendship-first pairing with lots of energy.` },
  "Aries-Pisces": { score: 55, text: `Neighbouring signs that are worlds apart: bold Aries and dreamy, sensitive Pisces. Aries can protect and inspire Pisces, and Pisces can soften Aries — if Aries slows down enough to listen.` },

  // Taurus
  "Taurus-Taurus": { score: 78, text: `Two Taurus share a love of comfort, loyalty, and the good things in life. This is a stable, sensual, dependable pairing — though when both dig their heels in, nobody moves.` },
  "Taurus-Gemini": { score: 52, text: `Neighbouring signs with different needs: Taurus wants routine and security, Gemini wants variety and conversation. Taurus grounds Gemini, Gemini lightens Taurus — if both are willing to adapt.` },
  "Taurus-Cancer": { score: 86, text: `A nurturing Earth–Water match. Both value home, security, and loyalty, and Taurus' steadiness makes Cancer feel safe. A warm, affectionate pairing built to last.` },
  "Taurus-Leo": { score: 46, text: `Two fixed signs who both love luxury and loyalty — and both refuse to back down. Leo wants attention, Taurus wants calm. Shared stubbornness is the main hurdle in an otherwise devoted pair.` },
  "Taurus-Virgo": { score: 92, text: `A grounded Earth trine. Both are practical, reliable, and quietly affectionate, and they understand each other's need for order and security. A steady, trusting match.` },
  "Taurus-Libra": { score: 50, text: `Both signs are ruled by Venus, so they share a love of beauty, art, and pleasure. Taurus is possessive and home-loving, though, while Libra is social and indecisive, which can create friction.` },
  "Taurus-Scorpio": { score: 75, text: `Opposite signs with powerful chemistry. Both are loyal, determined, and sensual, and they can build a deep bond — as long as possessiveness and stubbornness on both sides don't take over.` },
  "Taurus-Sagittarius": { score: 42, text: `Taurus wants security and routine, Sagittarius wants freedom and travel. They have little in common naturally, but Sagittarius can broaden Taurus' world and Taurus can give Sagittarius a home base.` },
  "Taurus-Capricorn": { score: 95, text: `One of the zodiac's strongest Earth trines. Both are loyal, hardworking, and focused on building a secure future. Capricorn's ambition and Taurus' steadiness make a dependable, long-lasting team.` },
  "Taurus-Aquarius": { score: 40, text: `Two fixed signs with opposite values: Taurus loves tradition and comfort, Aquarius loves change and ideas. It's a challenging match that needs a lot of respect for each other's differences.` },
  "Taurus-Pisces": { score: 85, text: `A gentle Earth–Water pairing. Taurus offers Pisces stability and comfort, and Pisces brings imagination and tenderness. Both are romantic and devoted, making this a soft, caring match.` },

  // Gemini
  "Gemini-Gemini": { score: 74, text: `Two Geminis never run out of things to talk about. This is a playful, curious, fast-moving pair — the challenge is follow-through, since neither wants to handle the practical details.` },
  "Gemini-Cancer": { score: 52, text: `Neighbouring signs with different languages: Gemini lives in the head, Cancer in the heart. Gemini can find Cancer too sensitive, and Cancer can find Gemini too detached, without effort on both sides.` },
  "Gemini-Leo": { score: 84, text: `A fun Fire–Air pairing. Gemini's humour and Leo's warmth make for a social, playful couple who love an audience. Gemini keeps Leo entertained, and Leo gives Gemini confidence.` },
  "Gemini-Virgo": { score: 48, text: `Both are ruled by Mercury, so they love to think and talk, but in different ways — Gemini skims widely, Virgo analyses deeply. Virgo's criticism and Gemini's restlessness can clash.` },
  "Gemini-Libra": { score: 92, text: `An easy Air trine. Both are social, charming, and love good conversation, ideas, and culture. A light, harmonious, intellectually lively match.` },
  "Gemini-Scorpio": { score: 42, text: `Gemini is light, flirty, and changeable; Scorpio is intense, private, and wants total commitment. Scorpio may distrust Gemini's restlessness, so honesty matters more than usual here.` },
  "Gemini-Sagittarius": { score: 74, text: `Opposite signs that share a love of learning, travel, and freedom. Gemini gathers facts, Sagittarius seeks meaning. An adventurous, talkative pair that needs someone to handle commitment.` },
  "Gemini-Capricorn": { score: 44, text: `Capricorn is serious and goal-focused, Gemini is playful and spontaneous. They have little in common naturally, but Capricorn can ground Gemini and Gemini can help Capricorn relax.` },
  "Gemini-Aquarius": { score: 93, text: `A brilliant Air trine. Both are curious, independent, and love new ideas, so this pair connects mind first. Plenty of freedom and conversation keep this match fresh.` },
  "Gemini-Pisces": { score: 45, text: `Two mutable signs who are both adaptable, but Gemini is logical and Pisces is emotional. Pisces may feel misunderstood and Gemini confused. Kindness and patience bridge the gap.` },

  // Cancer
  "Cancer-Cancer": { score: 76, text: `Two Cancers understand each other's feelings instinctively and create a cosy, loving home. The risk is mood swings feeding off each other — someone has to be the calm one.` },
  "Cancer-Leo": { score: 56, text: `Neighbouring signs who are both warm-hearted and loyal. Leo wants admiration, Cancer wants emotional security. When Leo is generous with attention and Cancer with praise, it works well.` },
  "Cancer-Virgo": { score: 82, text: `A caring Earth–Water pairing. Both show love by looking after each other — Cancer through emotional support, Virgo through practical help. A gentle, dependable match.` },
  "Cancer-Libra": { score: 44, text: `Two cardinal signs with different needs: Cancer wants deep emotional closeness, Libra wants harmony and social life. Both dislike conflict, so issues can go unspoken.` },
  "Cancer-Scorpio": { score: 94, text: `A deep Water trine. Both are loyal, emotional, and protective, and they understand each other's need for trust and intimacy. One of the most devoted pairings in the zodiac.` },
  "Cancer-Sagittarius": { score: 42, text: `Cancer wants a secure home, Sagittarius wants the open road. Sagittarius' blunt honesty can wound Cancer, and Cancer's need for closeness can feel limiting. A match that needs compromise.` },
  "Cancer-Capricorn": { score: 72, text: `Opposite signs that complete each other. Cancer brings emotional warmth, Capricorn brings structure and security. Both value family and tradition, making this a strong partnership if both open up.` },
  "Cancer-Aquarius": { score: 41, text: `Cancer is emotional and home-focused, Aquarius is detached and community-focused. They see the world very differently, so this pair needs extra effort to meet each other's needs.` },
  "Cancer-Pisces": { score: 93, text: `A tender Water trine. Both are intuitive, romantic, and caring, and they understand each other almost without words. A soulful, nurturing match.` },

  // Leo
  "Leo-Leo": { score: 72, text: `Two Leos make a glamorous, generous, fun-loving pair. There's lots of warmth and loyalty, but both want the spotlight — sharing it is the secret to success.` },
  "Leo-Virgo": { score: 54, text: `Neighbouring signs with different styles: Leo is bold and expressive, Virgo is modest and critical. Virgo helps Leo with the details, and Leo helps Virgo shine — if Virgo's critiques stay kind.` },
  "Leo-Libra": { score: 84, text: `A charming Fire–Air pairing. Both love beauty, romance, and socialising, and Libra's grace complements Leo's warmth. A stylish, affectionate, sociable match.` },
  "Leo-Scorpio": { score: 45, text: `Two fixed signs with powerful personalities and strong pride. The attraction can be intense, but so can the power struggles. Loyalty is strong on both sides if they learn to yield.` },
  "Leo-Sagittarius": { score: 93, text: `A joyful Fire trine. Both are warm, optimistic, and adventurous, and they bring out each other's playful side. A generous, fun, and lively match.` },
  "Leo-Capricorn": { score: 44, text: `Leo is expressive and fun-loving, Capricorn is reserved and work-focused. They share ambition and a love of status, but need to appreciate each other's very different styles.` },
  "Leo-Aquarius": { score: 71, text: `Opposite signs with strong attraction. Leo is warm and personal, Aquarius is cool and idealistic. Both are loyal and stubborn — they balance each other well when neither insists on being right.` },
  "Leo-Pisces": { score: 46, text: `Leo is bold and attention-loving, Pisces is gentle and private. Leo can be a protector and Pisces a devoted admirer, but their different emotional styles need understanding.` },

  // Virgo
  "Virgo-Virgo": { score: 74, text: `Two Virgos share high standards, practical minds, and quiet devotion. This pair runs a tidy, efficient life together, as long as they don't turn their critical eye on each other.` },
  "Virgo-Libra": { score: 54, text: `Neighbouring signs who both love order and refinement. Virgo is practical and private, Libra is social and romantic. Virgo's critiques can upset Libra's need for harmony.` },
  "Virgo-Scorpio": { score: 84, text: `A loyal Earth–Water pairing. Both are perceptive, private, and dedicated, and they trust each other deeply once they connect. A quiet, intense, and supportive match.` },
  "Virgo-Sagittarius": { score: 44, text: `Two mutable signs with opposite approaches: Virgo focuses on details, Sagittarius on the big picture. Virgo may find Sagittarius careless, and Sagittarius may find Virgo too fussy.` },
  "Virgo-Capricorn": { score: 93, text: `A dependable Earth trine. Both are responsible, hardworking, and practical, and they share long-term goals. A steady, respectful match that builds a solid life together.` },
  "Virgo-Aquarius": { score: 45, text: `Both are thoughtful and like to help others, but Virgo prefers proven methods while Aquarius prefers radical ideas. They make good friends and collaborators, but romance needs effort.` },
  "Virgo-Pisces": { score: 73, text: `Opposite signs that heal and help each other. Virgo is practical and grounded, Pisces is intuitive and imaginative. Together they balance logic with compassion.` },

  // Libra
  "Libra-Libra": { score: 74, text: `Two Libras create a beautiful, harmonious, sociable partnership. Romance and good taste come easily — but with both avoiding conflict and decisions, things can stall.` },
  "Libra-Scorpio": { score: 53, text: `Neighbouring signs with strong attraction but different depths: Libra wants lightness and harmony, Scorpio wants intensity and total honesty. Scorpio's jealousy can unsettle Libra.` },
  "Libra-Sagittarius": { score: 85, text: `A lively Fire–Air pairing. Both are sociable, optimistic, and love fun and travel. Sagittarius brings adventure, Libra brings charm. A light-hearted, easy-going match.` },
  "Libra-Capricorn": { score: 46, text: `Two cardinal signs who both like to lead in their own way. Libra values romance and social life, Capricorn values work and status. They can build an elegant partnership if they align their priorities.` },
  "Libra-Aquarius": { score: 92, text: `A harmonious Air trine. Both are idealistic, social, and love ideas and fairness. Aquarius' originality and Libra's charm make a friendly, intellectually rich partnership.` },
  "Libra-Pisces": { score: 47, text: `Both are romantic, gentle, and idealistic, but Libra uses the head and Pisces the heart. They can drift into a dreamy relationship that struggles with practical decisions.` },

  // Scorpio
  "Scorpio-Scorpio": { score: 70, text: `Two Scorpios share an intense, loyal, and deeply passionate bond. They understand each other completely — which makes jealousy and power struggles intense too. Trust is everything.` },
  "Scorpio-Sagittarius": { score: 50, text: `Neighbouring signs with opposite instincts: Scorpio wants depth and privacy, Sagittarius wants freedom and openness. Sagittarius' bluntness and Scorpio's secrecy can clash.` },
  "Scorpio-Capricorn": { score: 86, text: `A powerful Earth–Water pairing. Both are ambitious, loyal, and serious about commitment. Scorpio's intensity and Capricorn's steadiness make a strong, focused team.` },
  "Scorpio-Aquarius": { score: 40, text: `Two fixed signs with very different natures: Scorpio is emotional and private, Aquarius is detached and open. Both are stubborn, so this match needs a lot of give and take.` },
  "Scorpio-Pisces": { score: 94, text: `A soulful Water trine. Scorpio's protectiveness and Pisces' devotion create a deep emotional and spiritual bond. An intuitive, romantic, and intensely loyal match.` },

  // Sagittarius
  "Sagittarius-Sagittarius": { score: 76, text: `Two Sagittarians share a love of freedom, travel, and big ideas. This is an adventurous, honest, fun-loving pair — the challenge is settling down and dealing with practical matters.` },
  "Sagittarius-Capricorn": { score: 52, text: `Neighbouring signs with different outlooks: Sagittarius is optimistic and spontaneous, Capricorn is cautious and goal-driven. Each can learn from the other if they respect their differences.` },
  "Sagittarius-Aquarius": { score: 86, text: `A free-spirited Fire–Air pairing. Both love independence, ideas, and adventure, and neither feels smothered. A friendly, open-minded, and exciting match.` },
  "Sagittarius-Pisces": { score: 47, text: `Both are traditionally ruled by Jupiter, so they share idealism, generosity, and spiritual curiosity. But Sagittarius is blunt and restless, and Pisces is sensitive and needs closeness.` },

  // Capricorn
  "Capricorn-Capricorn": { score: 74, text: `Two Capricorns share ambition, discipline, and a serious approach to commitment. A powerful, dependable team — though they need to remember to have fun, not just work.` },
  "Capricorn-Aquarius": { score: 53, text: `Neighbouring signs that are both traditionally ruled by Saturn. Capricorn respects tradition, Aquarius challenges it. They share determination, but have different visions of the future.` },
  "Capricorn-Pisces": { score: 84, text: `A complementary Earth–Water pairing. Capricorn gives Pisces stability and direction, and Pisces brings Capricorn compassion and imagination. A gentle, supportive match.` },

  // Aquarius
  "Aquarius-Aquarius": { score: 75, text: `Two Aquarians share a love of freedom, ideas, and causes. This pair connects as friends first and gives each other plenty of space — sometimes too much, so remember to show affection.` },
  "Aquarius-Pisces": { score: 54, text: `Neighbouring signs who are both idealistic and humanitarian. Aquarius is cool and logical, Pisces is emotional and intuitive. Pisces may want more warmth than Aquarius naturally shows.` },

  // Pisces
  "Pisces-Pisces": { score: 74, text: `Two Pisces create a dreamy, romantic, deeply empathetic bond. They understand each other without words — but someone has to keep a foot on the ground and handle everyday life.` },
};

const getZodiacSignByName = (name) => {
  return westernZodiacSigns.find(sign => sign.name === name);
};

const WesternZodiacCompatibility = () => {
  const [zodiacName1, setZodiacName1] = useState("");
  const [zodiacName2, setZodiacName2] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [compatibilityMessage, setCompatibilityMessage] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setCompatibilityScore(null);
    setCompatibilityMessage("");

    setTimeout(() => {
      const zodiac1 = getZodiacSignByName(zodiacName1);
      const zodiac2 = getZodiacSignByName(zodiacName2);

      if (zodiac1 && zodiac2) {
        const key = `${zodiac1.name}-${zodiac2.name}`;
        const reverseKey = `${zodiac2.name}-${zodiac1.name}`;
        
        // Each pair is stored once, so try both orders.
        const messageData = compatibilityMessages[key] ?? compatibilityMessages[reverseKey];

        setCompatibilityScore(messageData.score);
        setCompatibilityMessage(messageData.text);
      } else {
        setCompatibilityMessage("Please select zodiac signs for both individuals.");
      }
      setIsCalculating(false);
    }, 1000); // Simulate network delay
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"; // Excellent
    if (score >= 60) return "text-yellow-500"; // Good
    return "text-red-500"; // Challenging
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Helmet>
        <title>Western Zodiac Compatibility - Star Sign Love Match | Feng Shui & Beyond</title>
        <meta name="description" content="Check your Western zodiac compatibility. See how your star sign pairs with others for love, romance, and friendship based on astrology." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/games-fun/western-zodiac-compatibility" />
      </Helmet>
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mb-4">Western Zodiac Compatibility</h1>
          <p className="text-black/80 mb-6">
            Explore the cosmic connections! Select the Western zodiac signs for two individuals to reveal their friendship compatibility.
          </p>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-10">
          
          {/* Input Box */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-6 items-stretch justify-center">
              {/* Person 1 Input */}
              <div className="flex flex-col items-start w-full space-y-2">
                <Label htmlFor="zodiac1" className="text-sm font-semibold text-gold">
                  Person 1 Zodiac Sign
                </Label>
                <Select value={zodiacName1} onValueChange={setZodiacName1}>
                  <SelectTrigger id="zodiac1" className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg text-center focus:outline-none focus:ring-2 focus:ring-gold transition">
                    <SelectValue placeholder="Select sign..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {westernZodiacSigns.map((sign) => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {zodiacName1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-black/70 mt-2 text-left"
                  >
                    <p className="font-semibold text-gold">{getZodiacSignByName(zodiacName1).name}</p>
                    <p className="text-xs text-black/60">{getZodiacSignByName(zodiacName1).description}</p>
                  </motion.div>
                )}
              </div>

              {/* Person 2 Input */}
              <div className="flex flex-col items-start w-full space-y-2">
                <Label htmlFor="zodiac2" className="text-sm font-semibold text-gold">
                  Person 2 Zodiac Sign
                </Label>
                <Select value={zodiacName2} onValueChange={setZodiacName2}>
                  <SelectTrigger id="zodiac2" className="w-full h-14 p-3 rounded-lg border border-gray-300 bg-white text-black/80 text-lg text-center focus:outline-none focus:ring-2 focus:ring-gold transition">
                    <SelectValue placeholder="Select sign..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {westernZodiacSigns.map((sign) => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {zodiacName2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-black/70 mt-2 text-left"
                  >
                    <p className="font-semibold text-gold">{getZodiacSignByName(zodiacName2).name}</p>
                    <p className="text-xs text-black/60">{getZodiacSignByName(zodiacName2).description}</p>
                  </motion.div>
                )}
              </div>
            </div>

            <Button
			  variant="gold"
              onClick={handleCalculate}
              disabled={isCalculating || !zodiacName1 || !zodiacName2}
              className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
            >
              {isCalculating ? (
                <>
                  <Sparkles size={20} className="animate-spin mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  {isCalculating ? "Calculating..." : "Calculate Compatibility"}
				  <Star size={20} className="mr-2" />
                </>
              )}
            </Button>
			
            {/* Added Link to Zodiac Calculator */}
            <div className="text-center text-sm text-black/60 mt-4">
              <p>
                Not sure of your Western Zodiac sign? Check out our{" "}
                <Link to="/astrology/western-zodiac-calculator"
				className="text-gold font-semibold cursor-pointer hover:underline hover:text-yellow-500 transition-colors">
                  Western Zodiac Calculator →
                </Link>
              </p>
            </div>
          </div>

          {/* Result Display */}
          <AnimatePresence mode="wait">
            {compatibilityScore !== null && (
              <motion.div
                key="compatibility-result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-4"
              >
                <h2 className="text-2xl font-bold text-gold text-center">
                  Your Western Zodiac Compatibility
                </h2>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div
                    className={`text-5xl font-bold ${getScoreColor(compatibilityScore)}`}
                  >
                    {compatibilityScore}%
                  </div>
                  <p className="text-lg text-black/80 text-center max-w-lg">
                    {compatibilityMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
		  
		{/* Calculation Explanation Block */}
		{compatibilityScore !== null && (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.5 }}
			className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-4"
		>
			<h2 className="text-xl font-bold text-gold text-center">
			Understanding Your Western Zodiac Compatibility
			</h2>
			<p className="text-black/80">
			This tool gives a simplified Western Zodiac compatibility score for entertainment. It compares the two Sun signs you select using the traditional relationship between them on the zodiac wheel.
			</p>
			<ul className="list-disc list-inside text-black/80">
			<li>
				Signs of the same element (a <em>trine</em>, such as Aries and Leo) score highest, followed by Fire–Air and Earth–Water pairs (a <em>sextile</em>).
			</li>
			<li>
				Opposite signs and two people of the same sign score in the middle: strong attraction or familiarity, but a need for balance.
			</li>
			<li>
				Neighbouring signs and signs that clash in element (a <em>square</em> or <em>quincunx</em>) score lower, as they traditionally need more adjustment.
			</li>
			</ul>
			<p className="text-xs text-black/60 text-center">
			*Sun-sign compatibility is a tradition, not a science — a 2007 study of around 10 million marriages in England and Wales found no sign pairing married more often than chance. Real astrology also weighs Moon, Venus, Mars, and rising signs. Enjoy this as lighthearted exploration!*
			</p>
		</motion.div>
		)}

		  
          {/* Evergreen SEO content — always rendered in the static HTML */}
          <section className="text-left mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gold mb-4">
              Western Zodiac Compatibility Explained
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              Zodiac compatibility looks at how two <strong>sun signs</strong> interact in love, friendship, and
              partnership. Select any two of the twelve signs — Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra,
              Scorpio, Sagittarius, Capricorn, Aquarius, or Pisces — to see a compatibility score and a description
              of your cosmic connection. It is a fun way to explore the natural harmony (or spark) between two
              people based on astrology.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Compatibility by Element
            </h2>
            <p className="text-black/80 leading-relaxed mb-4">
              The biggest clue to zodiac compatibility is the four elements. Signs of the same element usually feel
              instantly comfortable together, while complementary elements can balance each other beautifully:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-10">
              {[
                { el: "🔥 Fire (Aries, Leo, Sagittarius)", desc: "Best with fellow Fire and with Air signs, which fan their flames. Passionate, energetic pairings." },
                { el: "🌍 Earth (Taurus, Virgo, Capricorn)", desc: "Thrive with other Earth signs and with Water signs, which help them grow. Stable, grounded bonds." },
                { el: "💨 Air (Gemini, Libra, Aquarius)", desc: "Click with other Air signs and with Fire signs. Intellectual, social, communicative matches." },
                { el: "🌊 Water (Cancer, Scorpio, Pisces)", desc: "Flow best with other Water signs and with Earth signs. Deep, emotional, intuitive connections." },
              ].map((e) => (
                <div key={e.el} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-bold text-black mb-1">{e.el}</h3>
                  <p className="text-sm text-black/70 leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-4">
              What the Score Means
            </h2>
            <p className="text-black/80 leading-relaxed mb-8">
              A high score (80%+) points to natural, easy chemistry; a mid-range score (60–79%) suggests a good
              match that grows with understanding; and a lower score simply means two signs are more different —
              which can be challenging <em>or</em> excitingly complementary. Remember that real astrological
              compatibility considers far more than sun signs alone, including Moon signs, rising signs, and the
              positions of Venus and Mars. Treat this as a lighthearted starting point.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gold mt-10 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Which zodiac signs are most compatible?</h3>
                <p className="text-black/70 leading-relaxed">
                  Classic strong matches include Aries &amp; Leo, Taurus &amp; Cancer, Gemini &amp; Libra, and
                  Scorpio &amp; Pisces. In general, same-element and Fire–Air or Earth–Water pairings flow most
                  easily.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Can incompatible signs still work?</h3>
                <p className="text-black/70 leading-relaxed">
                  Yes. A lower compatibility score is not a dealbreaker — many lasting relationships thrive on
                  contrast. Communication, shared values, and full birth charts matter far more than sun signs
                  alone.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Do I need my exact birth time?</h3>
                <p className="text-black/70 leading-relaxed">
                  Not for this tool — it uses sun signs only. For a deeper reading, a full birth chart using your
                  exact time and place reveals Moon, rising, and planetary compatibility.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/astrology/western-zodiac-calculator" className="text-gold font-semibold hover:underline">
                Find your zodiac sign →
              </Link>
              <Link to="/games-fun/chinese-zodiac-compatibility" className="text-gold font-semibold hover:underline">
                Try Chinese zodiac compatibility →
              </Link>
            </div>
          </section>

          {/* Explore More Features Section using ImageSwiper */}
          <div className="mt-16 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-3">
              Explore Our Meditation Page
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Swipe through our meditation options to find your perfect practice
            </p>
            <div className="w-full max-w-2xl mx-auto">
              <ImageSwiper 
                meditationOptions={meditationOptions}
                className="shadow-lg"
              />
            </div>
          </div>
		  
        </div>
      </main>
    </div>
  );
};

export default WesternZodiacCompatibility;