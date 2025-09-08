import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MoonStar, Sparkles } from "lucide-react";
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
  { label: "Chinese Zodiac Compatibility" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditate-evening",
  },
  {
    title: "Morning Mindfulness",
    description: "Start your day calm, centered, and ready for opportunities",
    image: morningImage,
    link: "/meditate-morning",
  },
  {
    title: "Daily Affirmations",
    description: "Repeat a daily phrase to boost confidence, luck, and clarity",
    image: affirmationImage,
    link: "/meditate-affirmation",
  },
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditate-visualization",
  },
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditate-yoga-pose",
  },
];

const chineseZodiacAnimals = [
  { name: "Rat", description: "Quick-witted, resourceful, versatile, kind" },
  { name: "Ox", description: "Diligent, dependable, strong, determined" },
  { name: "Tiger", description: "Brave, confident, competitive" },
  { name: "Rabbit", description: "Quiet, elegant, kind, responsible" },
  { name: "Dragon", description: "Confident, intelligent, enthusiastic" },
  { name: "Snake", description: "Enigmatic, intelligent, wise" },
  { name: "Horse", description: "Animated, active, energetic" },
  { name: "Goat", description: "Calm, gentle, sympathetic" },
  { name: "Monkey", description: "Sharp, smart, curious" },
  { name: "Rooster", description: "Observant, hardworking, courageous" },
  { name: "Dog", description: "Lovely, honest, prudent" },
  { name: "Pig", description: "Compassionate, generous, diligent" },
];

const compatibilityChart = {
  "Rat": { "Dragon": 90, "Monkey": 85, "Ox": 80, "Rabbit": 50, "Horse": 20, "Goat": 30, "Rooster": 40, "Dog": 60, "Pig": 70, "Snake": 75, "Tiger": 65, "Rat": 70 },
  "Ox": { "Snake": 90, "Rooster": 85, "Rat": 80, "Dog": 50, "Goat": 20, "Horse": 30, "Tiger": 40, "Rabbit": 60, "Dragon": 70, "Monkey": 75, "Pig": 65, "Ox": 70 },
  "Tiger": { "Horse": 90, "Dog": 85, "Pig": 80, "Monkey": 20, "Snake": 30, "Ox": 40, "Dragon": 60, "Rat": 65, "Rabbit": 70, "Goat": 75, "Rooster": 50, "Tiger": 70 },
  "Rabbit": { "Goat": 90, "Pig": 85, "Dog": 80, "Rooster": 20, "Rat": 30, "Dragon": 40, "Snake": 60, "Ox": 65, "Horse": 70, "Monkey": 75, "Tiger": 50, "Rabbit": 70 },
  "Dragon": { "Rat": 90, "Monkey": 85, "Rooster": 80, "Dog": 20, "Ox": 30, "Rabbit": 40, "Tiger": 60, "Goat": 65, "Horse": 70, "Pig": 75, "Snake": 50, "Dragon": 70 },
  "Snake": { "Ox": 90, "Rooster": 85, "Dragon": 80, "Pig": 20, "Tiger": 30, "Horse": 40, "Rabbit": 60, "Monkey": 65, "Rat": 70, "Dog": 75, "Goat": 50, "Snake": 70 },
  "Horse": { "Tiger": 90, "Dog": 85, "Goat": 80, "Rat": 20, "Ox": 30, "Snake": 40, "Dragon": 60, "Rabbit": 65, "Monkey": 70, "Rooster": 75, "Pig": 50, "Horse": 70 },
  "Goat": { "Rabbit": 90, "Pig": 85, "Horse": 80, "Ox": 20, "Rat": 30, "Tiger": 40, "Monkey": 60, "Dragon": 65, "Snake": 70, "Rooster": 75, "Dog": 50, "Goat": 70 },
  "Monkey": { "Rat": 90, "Dragon": 85, "Snake": 80, "Tiger": 20, "Pig": 30, "Rabbit": 40, "Ox": 60, "Horse": 65, "Goat": 70, "Dog": 75, "Rooster": 50, "Monkey": 70 },
  "Rooster": { "Ox": 90, "Snake": 85, "Dragon": 80, "Rabbit": 20, "Rat": 30, "Goat": 40, "Tiger": 60, "Horse": 65, "Pig": 70, "Dog": 75, "Monkey": 50, "Rooster": 70 },
  "Dog": { "Tiger": 90, "Horse": 85, "Rabbit": 80, "Dragon": 20, "Snake": 30, "Rooster": 40, "Rat": 60, "Ox": 65, "Monkey": 70, "Goat": 75, "Pig": 50, "Dog": 70 },
  "Pig": { "Rabbit": 90, "Goat": 85, "Tiger": 80, "Snake": 20, "Monkey": 30, "Horse": 40, "Ox": 60, "Dragon": 65, "Rat": 70, "Rooster": 75, "Dog": 50, "Pig": 70 },
};

const robustCompatibilityMessages = {
// --- Rat ---
"Rat-Rat": { score: 70, text: `Two sharp, resourceful minds join forces; great at planning and hustling, but must curb competitiveness and learn to share credit.` },
"Rat-Ox": { score: 90, text: `Rat’s quick wit pairs beautifully with Ox’s reliability; strategy meets steady effort for a loyal, prosperous partnership.` },
"Rat-Tiger": { score: 60, text: `Rat prefers calculated moves while Tiger charges ahead; admire each other’s courage and brains, but compromise is vital.` },
"Rat-Rabbit": { score: 70, text: `Both value comfort and harmony; Rat’s ambition needs to respect Rabbit’s sensitivity to keep the bond gentle and warm.` },
"Rat-Dragon": { score: 95, text: `A classic match—Rat’s savvy supports Dragon’s grand visions; shared confidence and momentum create dazzling results.` },
"Rat-Snake": { score: 80, text: `Strategic and perceptive, this pair thrives on subtle moves and mutual discretion; trust deepens through quiet victories.` },
"Rat-Horse": { score: 45, text: `A traditional clash—Rat seeks security while Horse needs freedom; stability vs. spontaneity requires patience to bridge.` },
"Rat-Goat": { score: 60, text: `Rat’s practicality can steady Goat’s moods, yet Goat may feel rushed; gentleness and reassurance keep things balanced.` },
"Rat-Monkey": { score: 95, text: `Brilliant and lively—ideas fly and plans stick; shared playfulness and hustle make this an electric, winning duo.` },
"Rat-Rooster": { score: 60, text: `Both hardworking yet stylistically different; Rat’s flexible approach can chafe Rooster’s exacting standards—meet in the middle.` },
"Rat-Dog": { score: 75, text: `Dog’s loyalty calms Rat’s nerves, and Rat adds sparkle to Dog’s world; honesty and shared goals build steady trust.` },
"Rat-Pig": { score: 80, text: `Pig’s warmth softens Rat’s intensity; appreciation and kindness let ambition and comfort coexist happily.` },

// --- Ox ---
"Ox-Rat": { score: 90, text: `Ox’s steadfast nature grounds Rat’s quick mind; patience plus strategy produces lasting success and trust.` },
"Ox-Ox": { score: 70, text: `Two dependable spirits building slow and strong; watch for stubborn standoffs—make room for small joys and flexibility.` },
"Ox-Tiger": { score: 55, text: `Ox values caution while Tiger craves risk; respect each other’s pace and find shared missions to reduce friction.` },
"Ox-Rabbit": { score: 75, text: `A gentle, home-loving match; Ox provides structure, Rabbit brings grace—quiet dedication sustains the bond.` },
"Ox-Dragon": { score: 65, text: `Dragon’s flair meets Ox’s restraint; success comes when ambition honors practicality and pride yields to teamwork.` },
"Ox-Snake": { score: 95, text: `Wise, loyal, and composed; Ox’s endurance and Snake’s insight create a serene, resilient partnership.` },
"Ox-Horse": { score: 55, text: `Horse’s need for movement jars Ox’s love of routine; compromise on pace and independence to flourish.` },
"Ox-Goat": { score: 45, text: `A classic clash—Ox’s blunt steadiness overwhelms Goat’s sensitivity; gentleness and appreciation are nonnegotiable.` },
"Ox-Monkey": { score: 65, text: `Monkey’s cleverness can lighten Ox’s seriousness; set clear boundaries so play and productivity coexist.` },
"Ox-Rooster": { score: 95, text: `Shared diligence and precision—Rooster’s planning and Ox’s execution make a powerhouse of order and results.` },
"Ox-Dog": { score: 75, text: `Honest, loyal, and practical; you build trust through steady acts of service and a clear moral compass.` },
"Ox-Pig": { score: 80, text: `Pig’s kindness softens Ox’s edges; security, comfort, and mutual generosity anchor a cozy life together.` },

// --- Tiger ---
"Tiger-Rat": { score: 60, text: `Tiger’s bold leaps meet Rat’s careful schemes; admiration grows when both temper pride and share the wheel.` },
"Tiger-Ox": { score: 55, text: `Tiger’s independence strains Ox’s need for predictability; shared projects and patience reduce head-butting.` },
"Tiger-Tiger": { score: 70, text: `Two wildfire hearts—passion and courage abound; give each other space to prevent rivalry and flare-ups.` },
"Tiger-Rabbit": { score: 70, text: `Tiger protects, Rabbit soothes; balancing excitement with tenderness keeps this sweet and sustainable.` },
"Tiger-Dragon": { score: 85, text: `Two natural leaders—charisma and vision; thrive when ego bends toward shared glory and fair turns at the helm.` },
"Tiger-Snake": { score: 60, text: `Tiger’s spontaneity contrasts Snake’s caution; curiosity and respect for different tempos keeps things aligned.` },
"Tiger-Horse": { score: 95, text: `A trine favorite—freedom-loving, adventurous, and spirited; you inspire big journeys and bolder horizons.` },
"Tiger-Goat": { score: 60, text: `Tiger may seem intense to gentle Goat; protection and patience nurture trust and melt anxiety.` },
"Tiger-Monkey": { score: 45, text: `A classic clash—spotlight battles and teasing can sting; humility and kindness are essential to avoid chaos.` },
"Tiger-Rooster": { score: 60, text: `Rooster’s critique rubs Tiger’s pride; channel feedback into action and celebrate wins together.` },
"Tiger-Dog": { score: 95, text: `A trine gem—Dog’s loyalty stabilizes Tiger’s fire; shared justice and courage forge unbreakable trust.` },
"Tiger-Pig": { score: 90, text: `Secret-friend harmony—Pig’s warmth supports Tiger’s daring; safety and play fuel lasting affection.` },

// --- Rabbit ---
"Rabbit-Rat": { score: 70, text: `Rat’s ambition and Rabbit’s gentleness can blend well; protect tenderness and slow the hustle when needed.` },
"Rabbit-Ox": { score: 75, text: `Ox provides structure, Rabbit adds grace; a calm, caring life grows through small steady acts.` },
"Rabbit-Tiger": { score: 70, text: `Opposites with potential—Tiger energizes, Rabbit soothes; boundaries and reassurance keep harmony.` },
"Rabbit-Rabbit": { score: 70, text: `Two peace-seekers creating comfort and beauty; face challenges together rather than retreating.` },
"Rabbit-Dragon": { score: 70, text: `Dragon dazzles, Rabbit refines; let confidence meet compassion for balanced momentum.` },
"Rabbit-Snake": { score: 75, text: `Quiet depth and elegance; Snake’s insight and Rabbit’s empathy form a careful, trusting bond.` },
"Rabbit-Horse": { score: 60, text: `Horse’s restlessness unsettles Rabbit; clear routines and gentle freedom make it work.` },
"Rabbit-Goat": { score: 95, text: `A trine treasure—shared sensitivity and artistry; kindness and care flow naturally between you.` },
"Rabbit-Monkey": { score: 60, text: `Monkey’s mischief can jar Rabbit’s calm; play is fine—just ground it with reassurance.` },
"Rabbit-Rooster": { score: 45, text: `A classic clash—Rooster’s blunt critique wounds Rabbit; choose tact and protection over perfectionism.` },
"Rabbit-Dog": { score: 90, text: `Secret-friend magic—Dog’s loyalty lets Rabbit bloom; gentleness and fairness sustain deep trust.` },
"Rabbit-Pig": { score: 95, text: `A trine favorite—two big hearts who cherish home, comfort, and sincere affection.` },

// --- Dragon ---
"Dragon-Rat": { score: 95, text: `Trine synergy—Dragon’s charisma soars with Rat’s strategy; ambition becomes reality through teamwork.` },
"Dragon-Ox": { score: 65, text: `Pride meets patience; honor each role—vision and execution—to avoid stalemates.` },
"Dragon-Tiger": { score: 85, text: `Bold, heroic energy; share the spotlight and agree on aims to channel power well.` },
"Dragon-Rabbit": { score: 70, text: `Dragon brings momentum, Rabbit brings grace; success blooms when strength stays gentle.` },
"Dragon-Dragon": { score: 70, text: `Two dynamos—grand plans and fierce will; cooperation beats competition for long-term peace.` },
"Dragon-Snake": { score: 95, text: `Trine brilliance—Snake’s insight and Dragon’s drive craft elegant victories.` },
"Dragon-Horse": { score: 75, text: `High-octane fun; Horse’s freedom and Dragon’s pride need mutual respect to last.` },
"Dragon-Goat": { score: 70, text: `Dragon leads, Goat uplifts; protect Goat’s sensitivity and appreciate Goat’s creative heart.` },
"Dragon-Monkey": { score: 95, text: `Trine fireworks—clever, daring, unstoppable when united around inspiring goals.` },
"Dragon-Rooster": { score: 90, text: `Secret-friend accord—Rooster’s precision supports Dragon’s vision with loyal efficiency.` },
"Dragon-Dog": { score: 45, text: `A classic clash—Dog’s blunt honesty punctures Dragon’s pride; practice humility and empathy to soften edges.` },
"Dragon-Pig": { score: 75, text: `Pig’s generosity steadies Dragon’s intensity; celebrate wins and share comforts equally.` },

// --- Snake ---
"Snake-Rat": { score: 80, text: `Subtle, strategic, and quietly affectionate; shared intuition builds strong, private trust.` },
"Snake-Ox": { score: 95, text: `Trine calm—Ox’s patience and Snake’s wisdom create a deeply secure sanctuary.` },
"Snake-Tiger": { score: 60, text: `Snake plans, Tiger pounces; curiosity about each style prevents misreading motives.` },
"Snake-Rabbit": { score: 75, text: `Grace meets insight; gentle encouragement and emotional safety make this bond bloom.` },
"Snake-Dragon": { score: 95, text: `Trine power—Snake’s discernment refines Dragon’s ambition into elegant achievements.` },
"Snake-Snake": { score: 70, text: `Two private souls—depth and devotion; avoid overthinking and keep communication open.` },
"Snake-Horse": { score: 60, text: `Horse’s spontaneity tests Snake’s need for control; negotiate freedom with trust.` },
"Snake-Goat": { score: 80, text: `Artistic and intuitive; Snake’s composure steadies Goat’s emotions with kindness.` },
"Snake-Monkey": { score: 90, text: `Secret-friend chemistry—mind games become teamwork; witty, strategic, and magnetic.` },
"Snake-Rooster": { score: 95, text: `Trine excellence—Rooster’s clarity and Snake’s subtlety align for precise, lasting results.` },
"Snake-Dog": { score: 70, text: `Dog’s honesty anchors Snake’s depth; loyalty and calm discussion resolve tensions.` },
"Snake-Pig": { score: 45, text: `A classic clash—Snake’s intensity overwhelms Pig’s softness; radical compassion is required.` },

// --- Horse ---
"Horse-Rat": { score: 45, text: `A classic clash—Horse craves open range while Rat needs reassurance; give space without vanishing.` },
"Horse-Ox": { score: 55, text: `Horse’s speed jars Ox’s deliberation; sync goals and timelines to reduce frustration.` },
"Horse-Tiger": { score: 95, text: `Trine thrill—adventure buddies with blazing chemistry and mutual independence.` },
"Horse-Rabbit": { score: 60, text: `Horse adds excitement, Rabbit seeks calm; set gentle rhythms and enjoy bursts of play.` },
"Horse-Dragon": { score: 75, text: `Dramatic and spirited; pride and freedom can coexist with shared direction.` },
"Horse-Snake": { score: 60, text: `Snake’s caution and Horse’s spontaneity conflict; trust agreements smooth the ride.` },
"Horse-Horse": { score: 70, text: `Two free spirits galloping fast; build anchors—shared values and rituals—to stay connected.` },
"Horse-Goat": { score: 90, text: `Secret-friend balance—Horse energizes, Goat nurtures; mutual appreciation keeps love expansive.` },
"Horse-Monkey": { score: 80, text: `Playful, curious, and social; focus and follow-through turn fun into a future.` },
"Horse-Rooster": { score: 60, text: `Rooster’s critique can cramp Horse’s style; agree on lanes and cheer each other on.` },
"Horse-Dog": { score: 95, text: `Trine harmony—Dog’s loyalty steadies Horse’s wanderlust; trust deepens through shared causes.` },
"Horse-Pig": { score: 80, text: `Pig’s warmth comforts Horse; adventure is sweeter when tenderness travels along.` },

// --- Goat ---
"Goat-Rat": { score: 60, text: `Rat’s pace can stress sensitive Goat; reassurance and steady kindness make space for creativity.` },
"Goat-Ox": { score: 45, text: `A classic clash—Goat’s feelings vs. Ox’s bluntness; gentle dialogue prevents hurt and shutdowns.` },
"Goat-Tiger": { score: 60, text: `Tiger’s intensity can overwhelm Goat; protection, patience, and soft structure build trust.` },
"Goat-Rabbit": { score: 95, text: `Trine tenderness—two gentle hearts creating beauty, comfort, and mutual care.` },
"Goat-Dragon": { score: 70, text: `Dragon leads, Goat inspires; celebrate sensitivity as a strength, not a hurdle.` },
"Goat-Snake": { score: 80, text: `Goat’s artistry and Snake’s insight blend into quiet, soulful stability.` },
"Goat-Horse": { score: 90, text: `Secret-friend ease—Horse brings sparkle, Goat brings warmth; independence and affection dance well.` },
"Goat-Goat": { score: 70, text: `Two tender souls—deep empathy and imagination; add practical routines to thrive.` },
"Goat-Monkey": { score: 65, text: `Monkey’s teasing can unsettle Goat; keep humor kind and validation frequent.` },
"Goat-Rooster": { score: 55, text: `Rooster’s bluntness stings; soften feedback and protect the shared peace.` },
"Goat-Dog": { score: 75, text: `Dog’s devotion shelters Goat; appreciation and gentle reassurance keep warmth flowing.` },
"Goat-Pig": { score: 95, text: `Trine sweetness—shared generosity, coziness, and loyal hearts make home feel like heaven.` },

// --- Monkey ---
"Monkey-Rat": { score: 95, text: `Trine sparkle—fast minds and bold ideas; you riff, adapt, and win together.` },
"Monkey-Ox": { score: 65, text: `Monkey adds flexibility, Ox adds follow-through; respect structure while keeping it playful.` },
"Monkey-Tiger": { score: 45, text: `A classic clash—one-upmanship and pride flare; humility and empathy turn sparks into light.` },
"Monkey-Rabbit": { score: 60, text: `Monkey’s mischief can ruffle Rabbit; slow down, reassure, and play gently.` },
"Monkey-Dragon": { score: 95, text: `Trine charge—charisma and cunning unite; ambitious dreams become lively realities.` },
"Monkey-Snake": { score: 90, text: `Secret-friend finesse—clever, strategic, and quietly devoted when trust is earned.` },
"Monkey-Horse": { score: 80, text: `Adventurous and social; keep commitments clear so fun fuels, not derails, the future.` },
"Monkey-Goat": { score: 65, text: `Monkey’s jokes must be tender; Goat blossoms with reassurance and appreciation.` },
"Monkey-Monkey": { score: 70, text: `Two pranksters—endless novelty; build rituals so the bond doesn’t drift.` },
"Monkey-Rooster": { score: 65, text: `Rooster’s exactness checks Monkey’s impulse; align on goals and celebrate both order and flair.` },
"Monkey-Dog": { score: 70, text: `Dog’s sincerity balances Monkey’s play; honesty plus humor keeps trust alive.` },
"Monkey-Pig": { score: 55, text: `Different values—Pig seeks steadfast warmth, Monkey seeks novelty; meet halfway with consistency and care.` },

// --- Rooster ---
"Rooster-Rat": { score: 60, text: `Rat’s flexibility vs. Rooster’s standards; mix clever shortcuts with quality control for harmony.` },
"Rooster-Ox": { score: 95, text: `Trine partners—precision and perseverance; plans are thorough and execution is steady.` },
"Rooster-Tiger": { score: 60, text: `Rooster’s critique can pinch Tiger’s pride; frame feedback as teamwork and cheer bold efforts.` },
"Rooster-Rabbit": { score: 45, text: `A classic clash—too much bluntness wounds Rabbit; lead with gentleness and protection.` },
"Rooster-Dragon": { score: 90, text: `Secret-friend alliance—Rooster’s method uplifts Dragon’s vision; loyalty seals the deal.` },
"Rooster-Snake": { score: 95, text: `Trine clarity—Snake’s subtlety and Rooster’s focus craft elegant, lasting results.` },
"Rooster-Horse": { score: 60, text: `Horse needs freedom, Rooster needs order; agree on lanes and timelines.` },
"Rooster-Goat": { score: 55, text: `Directness meets sensitivity; soften tone and honor feelings to stay connected.` },
"Rooster-Monkey": { score: 65, text: `Play meets precision; enjoy banter but commit to plans so ideas land.` },
"Rooster-Rooster": { score: 70, text: `Two diligent hearts—high standards and pride; remember kindness matters as much as results.` },
"Rooster-Dog": { score: 70, text: `Both value integrity; keep critique constructive and celebrate loyalty.` },
"Rooster-Pig": { score: 65, text: `Rooster admires Pig’s heart; Pig steadies Rooster with warmth—avoid nitpicking.` },

// --- Dog ---
"Dog-Rat": { score: 75, text: `Rat adds sparkle to Dog’s steady honesty; shared security and clear ethics build trust.` },
"Dog-Ox": { score: 75, text: `Practical and sincere; you thrive on reliability, service, and a sense of duty.` },
"Dog-Tiger": { score: 95, text: `Trine strength—Dog’s loyalty and Tiger’s courage align for a noble, passionate bond.` },
"Dog-Rabbit": { score: 90, text: `Secret-friend sweetness—Dog protects while Rabbit soothes; fairness and care deepen love.` },
"Dog-Dragon": { score: 45, text: `A classic clash—Dog’s blunt truth confronts Dragon’s pride; gentleness and restraint are crucial.` },
"Dog-Snake": { score: 70, text: `Dog’s candor and Snake’s subtlety can mesh; clear ground rules ease misunderstandings.` },
"Dog-Horse": { score: 95, text: `Trine harmony—Dog offers devotion, Horse offers adventure; trust and freedom flourish together.` },
"Dog-Goat": { score: 75, text: `Dog’s steadiness comforts Goat; appreciation and soft words keep hearts open.` },
"Dog-Monkey": { score: 70, text: `Honesty and humor make a lively team; align on commitments to avoid friction.` },
"Dog-Rooster": { score: 70, text: `Shared respect for hard work; soften criticism and highlight wins to stay close.` },
"Dog-Dog": { score: 70, text: `Two loyal hearts—dependable and principled; add fun to prevent solemnity.` },
"Dog-Pig": { score: 85, text: `Pig’s generosity meets Dog’s integrity; comfort and mutual devotion create a safe, loving home.` },

// --- Pig ---
"Pig-Rat": { score: 80, text: `Pig’s warmth soothes Rat’s intensity; balanced give-and-take lets ambition and comfort thrive.` },
"Pig-Ox": { score: 80, text: `Kindness meets reliability; you build a peaceful, well-provisioned life through steady care.` },
"Pig-Tiger": { score: 90, text: `Secret-friend glow—Pig’s heart supports Tiger’s daring; courage feels safer together.` },
"Pig-Rabbit": { score: 95, text: `Trine harmony—two gentle souls who treasure home, kindness, and simple joys.` },
"Pig-Dragon": { score: 75, text: `Dragon’s drive finds refuge in Pig’s generosity; share credit and celebrate tenderness.` },
"Pig-Snake": { score: 45, text: `A classic clash—Pig’s openness vs. Snake’s guarded intensity; only radical empathy bridges the gap.` },
"Pig-Horse": { score: 80, text: `Adventure tastes sweeter with affection; Pig offers care, Horse offers horizons—keep promises.` },
"Pig-Goat": { score: 95, text: `Trine tenderness—artistic, nurturing, and deeply supportive; love feels easy and safe.` },
"Pig-Monkey": { score: 55, text: `Different rhythms—Pig values steadiness, Monkey seeks novelty; consistency and reassurance help greatly.` },
"Pig-Rooster": { score: 70, text: `Pig’s big heart softens Rooster’s edge; celebrate effort, not just outcomes, to stay warm.` },
"Pig-Dog": { score: 85, text: `Generosity and integrity blend well; devotion and comfort anchor a secure, happy bond.` },
"Pig-Pig": { score: 70, text: `Two generous spirits—sweet, loyal, and cozy; add shared goals so life doesn’t drift.` },

};

const getZodiacAnimalByName = (name) => {
  return chineseZodiacAnimals.find(animal => animal.name === name);
};

const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"; // Excellent
    if (score >= 60) return "text-yellow-500"; // Good
    return "text-red-500"; // Challenging
  };

const ChineseZodiacCompatibility = () => {
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
      const zodiac1 = getZodiacAnimalByName(zodiacName1);
      const zodiac2 = getZodiacAnimalByName(zodiacName2);

      if (zodiac1 && zodiac2) {
        const key = `${zodiac1.name}-${zodiac2.name}`;
        const reverseKey = `${zodiac2.name}-${zodiac1.name}`;
        
        let messageData;
        if (robustCompatibilityMessages[key]) {
          messageData = robustCompatibilityMessages[key];
        } else if (robustCompatibilityMessages[reverseKey]) {
          messageData = robustCompatibilityMessages[reverseKey];
        } else {
          // Fallback in case a message is somehow missing (highly unlikely now)
          const score = compatibilityChart[zodiac1.name]?.[zodiac2.name] || 50;
          let genericText = "No specific message found, but your score indicates a unique connection!";
          messageData = { score, text: genericText };
        }
        
        setCompatibilityScore(messageData.score);
        setCompatibilityMessage(messageData.text);
      } else {
        setCompatibilityMessage("Please select zodiac signs for both individuals.");
      }
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mb-4">Chinese Zodiac Compatibility</h1>
          <p className="text-black/80 mb-6">
            Uncover the ancient secrets of Chinese Zodiac compatibility! Select the signs for two individuals to see how they align.
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
                    {chineseZodiacAnimals.map((animal) => (
                      <SelectItem key={animal.name} value={animal.name}>
                        {animal.name}
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
                    <p className="font-semibold text-gold">{getZodiacAnimalByName(zodiacName1).name}</p>
                    <p className="text-xs text-black/60">{getZodiacAnimalByName(zodiacName1).description}</p>
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
                    {chineseZodiacAnimals.map((animal) => (
                      <SelectItem key={animal.name} value={animal.name}>
                        {animal.name}
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
                    <p className="font-semibold text-gold">{getZodiacAnimalByName(zodiacName2).name}</p>
                    <p className="text-xs text-black/60">{getZodiacAnimalByName(zodiacName2).description}</p>
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
              {isCalculating ? "Calculating..." : "Calculate Compatibility"}
              <Sparkles size={20} className="ml-2" />
            </Button>

            {/* Added Link to Zodiac Calculator */}
            <div className="text-center text-sm text-black/60 mt-4">
              <p>
                Not sure of your Chinese Zodiac sign? Check out our{" "}
                <Link to="/chinese-zodiac-calculator" 
				className="text-gold font-semibold cursor-pointer hover:underline hover:text-yellow-500 transition-colors">
                  Chinese Zodiac Calculator →
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
					Your Chinese Zodiac Compatibility
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
					Understanding Your Chinese Zodiac Compatibility
				  </h2>
				  <p className="text-black/80">
					This tool provides a simplified Chinese Zodiac compatibility score for entertainment purposes. It matches the zodiac animals corresponding to the selected birth years against a predefined compatibility chart.
				  </p>
				  <ul className="list-disc list-inside text-black/80">
					<li>Each birth year is mapped to one of the 12 Chinese Zodiac animals (Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig).</li>
					<li>A compatibility score is then retrieved from a preset chart, reflecting a general sense of harmony or potential challenges between the two animals.</li>
				  </ul>
				  <p className="text-xs text-black/60 text-center">
					*Please remember, true Chinese Zodiac astrology is complex and involves many factors beyond just the birth year animal. This tool is for fun exploration!*
				  </p>
				</motion.div>
			  )}
		  
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

export default ChineseZodiacCompatibility;