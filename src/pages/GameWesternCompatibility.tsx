import { useState } from "react";
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
  { label: "Western Zodiac Compatibility" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Visualization Exercises",
    description: "Focus your mind and imagine positive energy flowing into your day",
    image: visualizationImage,
    link: "/meditate-visualization",
  },
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
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditate-yoga-pose",
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

const westernCompatibilityChart = {
  // Scores out of 100. These are simplified compatibility ratings.
  // Note: Compatibility is complex; these are general guidelines.
  "Aries": { "Leo": 90, "Sagittarius": 85, "Gemini": 80, "Aquarius": 75, "Libra": 40, "Cancer": 30, "Capricorn": 30, "Scorpio": 50, "Pisces": 60, "Virgo": 55, "Taurus": 50, "Aries": 70 },
  "Taurus": { "Virgo": 90, "Capricorn": 85, "Cancer": 80, "Pisces": 75, "Leo": 40, "Aquarius": 30, "Aries": 50, "Gemini": 55, "Libra": 60, "Scorpio": 65, "Sagittarius": 50, "Taurus": 70 },
  "Gemini": { "Libra": 90, "Aquarius": 85, "Aries": 80, "Leo": 75, "Virgo": 40, "Pisces": 30, "Sagittarius": 30, "Cancer": 50, "Scorpio": 55, "Capricorn": 60, "Taurus": 55, "Gemini": 70 },
  "Cancer": { "Scorpio": 90, "Pisces": 85, "Taurus": 80, "Virgo": 75, "Aries": 30, "Libra": 30, "Capricorn": 40, "Gemini": 50, "Leo": 55, "Sagittarius": 60, "Aquarius": 50, "Cancer": 70 },
  "Leo": { "Aries": 90, "Sagittarius": 85, "Gemini": 80, "Libra": 75, "Taurus": 40, "Scorpio": 30, "Aquarius": 30, "Cancer": 55, "Virgo": 60, "Capricorn": 50, "Pisces": 50, "Leo": 70 },
  "Virgo": { "Taurus": 90, "Capricorn": 85, "Cancer": 80, "Scorpio": 75, "Gemini": 40, "Sagittarius": 30, "Aries": 55, "Leo": 60, "Libra": 50, "Aquarius": 50, "Pisces": 65, "Virgo": 70 },
  "Libra": { "Gemini": 90, "Aquarius": 85, "Leo": 80, "Sagittarius": 75, "Cancer": 30, "Capricorn": 40, "Aries": 40, "Taurus": 60, "Virgo": 50, "Scorpio": 50, "Pisces": 55, "Libra": 70 },
  "Scorpio": { "Cancer": 90, "Pisces": 85, "Virgo": 80, "Capricorn": 75, "Leo": 30, "Aquarius": 30, "Aries": 50, "Gemini": 55, "Libra": 50, "Sagittarius": 60, "Taurus": 65, "Scorpio": 70 },
  "Sagittarius": { "Leo": 90, "Aries": 85, "Libra": 80, "Aquarius": 75, "Virgo": 30, "Pisces": 30, "Gemini": 30, "Cancer": 60, "Taurus": 50, "Scorpio": 60, "Capricorn": 55, "Sagittarius": 70 },
  "Capricorn": { "Taurus": 90, "Virgo": 85, "Scorpio": 80, "Pisces": 75, "Aries": 30, "Cancer": 40, "Leo": 50, "Gemini": 60, "Libra": 40, "Sagittarius": 55, "Aquarius": 50, "Capricorn": 70 },
  "Aquarius": { "Gemini": 90, "Libra": 85, "Aries": 80, "Sagittarius": 75, "Taurus": 30, "Cancer": 50, "Leo": 30, "Virgo": 50, "Scorpio": 30, "Capricorn": 50, "Pisces": 60, "Aquarius": 70 },
  "Pisces": { "Cancer": 90, "Scorpio": 85, "Taurus": 80, "Capricorn": 75, "Gemini": 30, "Sagittarius": 30, "Aries": 60, "Leo": 50, "Virgo": 65, "Libra": 55, "Aquarius": 60, "Pisces": 70 },
};

const robustCompatibilityMessages = {
  // --- Perfect Matches (Score 90+) ---
  // Aries with all 12 signs
"Aries-Aries": {score: 70, text: `Two Aries together create an intense and fiery bond, full of passion and competition. While they share drive and ambition, clashes can arise from both wanting to lead. Balance comes when they learn cooperation and respect.`},
"Aries-Taurus": {score: 50, text: `Aries thrives on speed and risk, while Taurus prefers stability and patience. Aries may see Taurus as too slow, while Taurus may find Aries reckless. With compromise, Aries brings excitement and Taurus provides grounding.`},
"Aries-Gemini": {score: 85, text: `This lively pairing thrives on adventure, curiosity, and fun. Aries’s boldness blends well with Gemini’s adaptability, creating an energetic and dynamic bond. With shared enthusiasm, they inspire each other and rarely get bored together.`},
"Aries-Cancer": {score: 30, text: `Aries is fiery and direct, while Cancer is sensitive and emotional. Aries may come off as too blunt, and Cancer may feel overwhelmed. Patience and empathy are key if they wish to turn friction into growth and protection.`},
"Aries-Leo": {score: 90, text: `A fiery and magnetic duo, Aries and Leo share passion, charisma, and enthusiasm. Both love adventure and attention, creating a dynamic power couple. Minor ego clashes may happen, but admiration for each other keeps them strong.`},
"Aries-Virgo": {score: 40, text: `Aries is impulsive and bold, while Virgo is practical and detail-oriented. Aries may find Virgo critical, while Virgo may find Aries reckless. Growth happens when Aries learns patience and Virgo embraces spontaneity.`},
"Aries-Libra": {score: 75, text: `Aries brings fire and decisiveness, while Libra seeks harmony and balance. They are opposites that can attract strongly, with Aries driving action and Libra smoothing conflicts. Together, they balance passion and diplomacy.`},
"Aries-Scorpio": {score: 55, text: `Both are intense and strong-willed, but in different ways. Aries is direct and fiery, while Scorpio is deep and strategic. Power struggles are common, but if they unite, they form a formidable and passionate pair.`},
"Aries-Sagittarius": {score: 95, text: `This adventurous match is full of energy, optimism, and shared love for freedom. Aries and Sagittarius thrive on excitement and exploration, inspiring each other constantly. They understand each other’s need for independence and fun.`},
"Aries-Capricorn": {score: 45, text: `Aries is impulsive and fiery, while Capricorn is disciplined and grounded. Aries may find Capricorn too serious, while Capricorn may see Aries as careless. Success comes when Aries learns focus and Capricorn embraces spontaneity.`},
"Aries-Aquarius": {score: 80, text: `Both love independence, innovation, and pushing boundaries. Aries brings passion, while Aquarius adds visionary ideas. Their relationship thrives on excitement and shared ideals, though stubbornness can create clashes.`},
"Aries-Pisces": {score: 35, text: `Aries is bold and assertive, while Pisces is gentle and sensitive. Aries may unintentionally hurt Pisces with bluntness, and Pisces may feel too passive for Aries. With compassion and patience, they can balance action with empathy.`},

//Taurus
"Taurus-Aries": {score: 60, text: `This pair blends Aries’s fiery drive with Taurus’s grounded nature. Aries pushes for action, while Taurus prefers stability. If they learn patience and compromise, they can balance passion with persistence.`},
"Taurus-Taurus": {score: 70, text: `Two Bulls together create loyalty, stability, and devotion. However, both can be stubborn, leading to stand-offs. With patience and shared values, they build an unshakable bond.`},
"Taurus-Gemini": {score: 40, text: `Taurus craves security and consistency, while Gemini seeks variety and stimulation. Taurus may see Gemini as flighty, and Gemini may see Taurus as too rigid. They need flexibility and open-mindedness to grow together.`},
"Taurus-Cancer": {score: 90, text: `This is a natural match filled with nurturing and devotion. Taurus provides grounding, while Cancer offers emotional warmth. Together they create a safe, supportive, and affectionate partnership.`},
"Taurus-Leo": {score: 50, text: `Both are strong-willed and love luxury, but Taurus is steady while Leo is flamboyant. Their stubbornness can lead to power struggles, though mutual respect and admiration for beauty can bond them.`},
"Taurus-Virgo": {score: 85, text: `Both earth signs, they share practicality, loyalty, and a love for stability. Virgo appreciates Taurus’s dependability, while Taurus admires Virgo’s diligence. This pairing creates a reliable and harmonious connection.`},
"Taurus-Libra": {score: 65, text: `Both ruled by Venus, they value beauty, harmony, and love. Taurus seeks security while Libra seeks balance, which may cause misunderstandings. With effort, they can blend sensuality with elegance.`},
"Taurus-Scorpio": {score: 75, text: `Opposites attract here. Taurus is steady and grounded, while Scorpio is intense and transformative. Passion and loyalty bind them, but power struggles can also create friction.`},
"Taurus-Sagittarius": {score: 35, text: `Taurus values security and consistency, while Sagittarius craves freedom and adventure. Their differences can frustrate each other unless they respect their unique needs.`},
"Taurus-Capricorn": {score: 95, text: `A powerhouse pairing. Both earth signs are ambitious, dependable, and value hard work. They support each other’s goals while building a secure and lasting foundation.`},
"Taurus-Aquarius": {score: 40, text: `Taurus is traditional and grounded, while Aquarius is innovative and future-oriented. Taurus may see Aquarius as too detached, while Aquarius may find Taurus too rigid. They need openness to bridge their differences.`},
"Taurus-Pisces": {score: 80, text: `This pairing is gentle and affectionate. Taurus provides grounding, while Pisces offers imagination and compassion. Together, they create a supportive and deeply loving relationship.`},

//Gemini
"Gemini-Aries": {score: 85, text: `This is a lively and adventurous match. Aries’s boldness excites Gemini, while Gemini’s wit keeps Aries engaged. They thrive on activity, though they must guard against impulsiveness.`},
"Gemini-Taurus": {score: 40, text: `Taurus craves stability while Gemini seeks variety. Taurus may see Gemini as unreliable, and Gemini may find Taurus too predictable. Compromise is essential for growth.`},
"Gemini-Gemini": {score: 70, text: `Two Geminis create a whirlwind of energy, curiosity, and fun. They love conversation and adventure, but both may struggle with consistency and long-term commitment.`},
"Gemini-Cancer": {score: 55, text: `Gemini is playful and detached, while Cancer is emotional and nurturing. Cancer may feel insecure with Gemini’s changeability, while Gemini may feel restricted by Cancer’s depth.`},
"Gemini-Leo": {score: 90, text: `A dynamic and vibrant pairing. Gemini’s wit and curiosity pair beautifully with Leo’s charisma and passion. They share fun, adventure, and mutual admiration.`},
"Gemini-Virgo": {score: 60, text: `Both ruled by Mercury, they share intellectual curiosity. Gemini is spontaneous, while Virgo is detail-oriented. Sometimes Virgo may criticize Gemini’s scattered ways.`},
"Gemini-Libra": {score: 95, text: `Both are air signs, valuing communication, charm, and variety. They connect effortlessly and enjoy a lively, balanced relationship filled with fun and mutual understanding.`},
"Gemini-Scorpio": {score: 45, text: `Gemini is light and playful, while Scorpio is deep and intense. Scorpio may find Gemini superficial, while Gemini may see Scorpio as overly controlling. This is a challenging match.`},
"Gemini-Sagittarius": {score: 85, text: `Opposite signs that share love for freedom, exploration, and learning. They balance each other well, though commitment may be an issue for both.`},
"Gemini-Capricorn": {score: 50, text: `Gemini thrives on curiosity and change, while Capricorn values structure and stability. They may frustrate each other unless they respect their very different approaches to life.`},
"Gemini-Aquarius": {score: 95, text: `A highly compatible pairing. Both love freedom, innovation, and conversation. They share ideas effortlessly and inspire each other’s creativity.`},
"Gemini-Pisces": {score: 55, text: `Gemini is witty and restless, while Pisces is dreamy and sensitive. Pisces may feel overwhelmed by Gemini’s pace, while Gemini may find Pisces too emotional.`},

//Cancer
"Cancer-Aries": {score: 60, text: `Cancer is sensitive and nurturing, while Aries is bold and independent. Aries may unintentionally hurt Cancer’s feelings, but Cancer can teach Aries emotional depth.`},
"Cancer-Taurus": {score: 90, text: `A harmonious match. Taurus provides stability and comfort, while Cancer offers warmth and care. They share values of loyalty, home, and security.`},
"Cancer-Gemini": {score: 55, text: `Gemini is playful and detached, while Cancer is emotional and caring. Cancer may feel insecure with Gemini’s unpredictability, while Gemini may feel restricted by Cancer’s needs.`},
"Cancer-Cancer": {score: 85, text: `Two Cancers create a deeply nurturing and emotional bond. They understand each other’s moods but may become overly dependent or sensitive.`},
"Cancer-Leo": {score: 70, text: `Cancer seeks security, while Leo seeks admiration. Their emotional needs differ, but with effort they can create a warm and loving family life.`},
"Cancer-Virgo": {score: 88, text: `A strong, supportive match. Virgo’s practicality balances Cancer’s emotions, while Cancer provides warmth and understanding to Virgo’s reserved nature.`},
"Cancer-Libra": {score: 65, text: `Cancer is nurturing, while Libra is social and lighthearted. Cancer may find Libra superficial, while Libra may feel weighed down by Cancer’s moods.`},
"Cancer-Scorpio": {score: 95, text: `A passionate and intuitive bond. Both are deeply emotional and loyal, with a natural understanding of each other’s unspoken feelings.`},
"Cancer-Sagittarius": {score: 50, text: `Cancer craves security, while Sagittarius values freedom. Sagittarius may see Cancer as clingy, while Cancer may find Sagittarius unreliable.`},
"Cancer-Capricorn": {score: 85, text: `Opposites that attract. Cancer is emotional, Capricorn is practical. Together they balance sensitivity with stability, building a strong foundation.`},
"Cancer-Aquarius": {score: 45, text: `Cancer seeks closeness and tradition, while Aquarius craves freedom and innovation. Their lifestyles and values may clash unless they compromise deeply.`},
"Cancer-Pisces": {score: 92, text: `A dreamy and emotional pairing. Both are sensitive, intuitive, and caring. They connect on a spiritual level and nurture each other deeply.`},

//Leo
"Leo-Aries": {score: 90, text: `Both are fiery, bold, and adventurous. They share passion and excitement, though clashes may arise over ego and dominance.`},
"Leo-Taurus": {score: 70, text: `Taurus is steady and grounded, while Leo is vibrant and attention-seeking. Taurus may find Leo dramatic, but both enjoy loyalty and luxury.`},
"Leo-Gemini": {score: 85, text: `Leo loves to shine, and Gemini keeps things lively with curiosity. This pair thrives on fun, social energy, and adventure.`},
"Leo-Cancer": {score: 70, text: `Leo craves admiration, while Cancer seeks emotional security. With effort, they can balance Leo’s boldness with Cancer’s nurturing side.`},
"Leo-Leo": {score: 80, text: `Two Leos create a dynamic, passionate match filled with excitement. However, ego clashes and competition for the spotlight may cause friction.`},
"Leo-Virgo": {score: 60, text: `Leo seeks attention and glamour, while Virgo values humility and order. Their differences may cause tension, though Virgo admires Leo’s confidence.`},
"Leo-Libra": {score: 88, text: `Both love beauty, charm, and social life. Leo’s boldness pairs well with Libra’s diplomacy, creating a balanced and stylish duo.`},
"Leo-Scorpio": {score: 65, text: `Both are strong-willed and intense. Leo craves admiration, while Scorpio seeks control and depth, leading to power struggles but also passion.`},
"Leo-Sagittarius": {score: 95, text: `A fiery, adventurous pair. Both love excitement, freedom, and optimism. Together, they inspire and energize each other.`},
"Leo-Capricorn": {score: 68, text: `Leo is bold and expressive, while Capricorn is reserved and disciplined. They respect each other but may clash in lifestyle and priorities.`},
"Leo-Aquarius": {score: 75, text: `Opposites that attract. Leo is warm and dramatic, Aquarius is cool and independent. Their differences can spark inspiration or friction.`},
"Leo-Pisces": {score: 60, text: `Leo seeks recognition, while Pisces is sensitive and dreamy. Leo may overpower Pisces, but Pisces can soften Leo’s ego with compassion.`},

//Virgo
"Virgo-Aries": {score: 65, text: `Virgo is practical and detail-focused, while Aries is impulsive and bold. They may struggle with pace, but can balance caution with action.`},
"Virgo-Taurus": {score: 90, text: `Both are grounded and practical. Virgo’s precision complements Taurus’s stability, creating a reliable and harmonious match.`},
"Virgo-Gemini": {score: 70, text: `Both ruled by Mercury, they connect through communication. Gemini is playful and scattered, while Virgo is organized and methodical.`},
"Virgo-Cancer": {score: 88, text: `Both value security and care deeply. Cancer brings emotional warmth, while Virgo provides steady support, forming a nurturing bond.`},
"Virgo-Leo": {score: 60, text: `Virgo is modest and detail-driven, while Leo craves attention and flair. Their differences can clash unless both respect each other’s strengths.`},
"Virgo-Virgo": {score: 85, text: `Two Virgos create a thoughtful and reliable match, though they risk overanalyzing and being overly critical of each other.`},
"Virgo-Libra": {score: 72, text: `Virgo is practical, Libra is social and idealistic. They differ in style, but both value balance and harmony in relationships.`},
"Virgo-Scorpio": {score: 80, text: `Virgo’s careful nature blends with Scorpio’s depth and intensity. They connect on trust and loyalty, though Scorpio’s passion may overwhelm Virgo.`},
"Virgo-Sagittarius": {score: 55, text: `Virgo seeks order and routine, while Sagittarius craves freedom and adventure. Their approaches to life may clash unless compromise is made.`},
"Virgo-Capricorn": {score: 95, text: `A strong earth sign match. Both are disciplined, practical, and ambitious. They respect each other’s work ethic and build lasting stability.`},
"Virgo-Aquarius": {score: 62, text: `Virgo focuses on details and tradition, while Aquarius is innovative and unconventional. They may struggle to see eye-to-eye.`},
"Virgo-Pisces": {score: 85, text: `Opposites on the zodiac wheel. Virgo offers grounding, while Pisces brings imagination. Together, they balance dreams with reality.`},

//Libra
"Libra-Aries": {score: 75, text: `Opposites on the zodiac wheel. Libra seeks harmony, while Aries is bold and assertive. They balance charm with drive, though sparks can fly.`},
"Libra-Taurus": {score: 70, text: `Both ruled by Venus, they share a love for beauty and comfort. Taurus is steady while Libra is social, which may cause pace differences.`},
"Libra-Gemini": {score: 92, text: `An airy and lively match. Both love socializing, ideas, and charm. Their connection is fun, intellectual, and full of shared interests.`},
"Libra-Cancer": {score: 68, text: `Libra is outgoing and diplomatic, while Cancer is private and emotional. They may struggle with different needs in security vs. socializing.`},
"Libra-Leo": {score: 90, text: `Both adore romance, fun, and creativity. Libra brings charm, Leo brings passion — a vibrant and magnetic partnership.`},
"Libra-Virgo": {score: 72, text: `Virgo is practical and detail-oriented, while Libra is idealistic and people-focused. They need patience to align their values.`},
"Libra-Libra": {score: 85, text: `Two Libras create a graceful, balanced bond filled with beauty and charm. But indecision may slow progress if both avoid tough choices.`},
"Libra-Scorpio": {score: 70, text: `Libra seeks peace, Scorpio seeks depth. Their styles differ, but attraction is strong. Scorpio’s intensity may challenge Libra’s diplomacy.`},
"Libra-Sagittarius": {score: 88, text: `Both love adventure, fun, and new experiences. Sagittarius adds energy, Libra adds charm, creating a playful and exciting bond.`},
"Libra-Capricorn": {score: 65, text: `Libra seeks harmony and ease, while Capricorn is disciplined and serious. They may clash in priorities, but balance is possible with effort.`},
"Libra-Aquarius": {score: 93, text: `A great intellectual match. Both are social, curious, and love exploring ideas. Their connection is easy, stimulating, and future-focused.`},
"Libra-Pisces": {score: 78, text: `Both are gentle, romantic, and idealistic. Libra’s charm pairs well with Pisces’ compassion, though indecision may be an issue.`},

//Scorpio
"Scorpio-Aries": {score: 72, text: `Both strong-willed and passionate, this duo can be magnetic yet volatile. Aries is bold, Scorpio is intense — sparks are guaranteed.`},
"Scorpio-Taurus": {score: 85, text: `Opposite signs with a magnetic pull. Taurus offers stability, Scorpio brings depth. Together, they form a powerful and sensual bond.`},
"Scorpio-Gemini": {score: 60, text: `Scorpio craves intensity, while Gemini prefers lightness and variety. They may struggle to find middle ground unless curiosity bridges the gap.`},
"Scorpio-Cancer": {score: 92, text: `A deeply emotional and intuitive pair. Both are sensitive, loyal, and protective. Their bond is nurturing, strong, and long-lasting.`},
"Scorpio-Leo": {score: 70, text: `Both are powerful personalities. Scorpio is intense, Leo is proud. Attraction is strong but ego clashes may challenge the relationship.`},
"Scorpio-Virgo": {score: 83, text: `Both are thoughtful and loyal. Virgo’s practicality grounds Scorpio’s intensity, while Scorpio brings emotional depth to Virgo’s world.`},
"Scorpio-Libra": {score: 70, text: `Libra seeks peace, Scorpio seeks passion. While opposites in approach, attraction can be magnetic if they learn to appreciate differences.`},
"Scorpio-Scorpio": {score: 80, text: `Two Scorpios together create an intense and transformative relationship. Deep loyalty and passion bind them, but power struggles are likely.`},
"Scorpio-Sagittarius": {score: 65, text: `Scorpio wants depth, Sagittarius craves freedom. Their needs may clash unless they respect each other’s differences.`},
"Scorpio-Capricorn": {score: 90, text: `A strong, ambitious, and resilient match. Both value loyalty, determination, and depth. This pairing builds lasting foundations.`},
"Scorpio-Aquarius": {score: 68, text: `Scorpio is private and emotional, Aquarius is detached and social. Their approaches differ greatly, but mutual fascination can exist.`},
"Scorpio-Pisces": {score: 95, text: `A soulful and intuitive connection. Both are water signs, deeply emotional and compassionate. This bond is spiritual, healing, and enduring.`},

//Sagittarius
"Sagittarius-Aries": {score: 90, text: `An adventurous and fiery match. Both love excitement, freedom, and new experiences. A dynamic and fun-loving duo.`},
"Sagittarius-Taurus": {score: 68, text: `Sagittarius seeks freedom and adventure, Taurus prefers stability and routine. They may struggle to align unless they compromise.`},
"Sagittarius-Gemini": {score: 88, text: `Opposite signs with strong attraction. Both are curious, social, and adventurous. A lively and stimulating match.`},
"Sagittarius-Cancer": {score: 65, text: `Sagittarius craves exploration, while Cancer desires security. Their needs may conflict unless mutual respect is built.`},
"Sagittarius-Leo": {score: 92, text: `A fiery and passionate bond. Both love adventure, fun, and living life boldly. Their shared optimism fuels the relationship.`},
"Sagittarius-Virgo": {score: 70, text: `Virgo is practical and detail-oriented, while Sagittarius is spontaneous and free-spirited. They must work to appreciate each other’s strengths.`},
"Sagittarius-Libra": {score: 87, text: `Both love socializing, adventure, and harmony. This pairing enjoys fun, exploration, and intellectual conversations.`},
"Sagittarius-Scorpio": {score: 65, text: `Sagittarius wants freedom, Scorpio seeks intensity. Their needs may clash unless they allow each other space and understanding.`},
"Sagittarius-Sagittarius": {score: 95, text: `Two free spirits together make for endless adventures. Their relationship thrives on exploration, fun, and shared optimism.`},
"Sagittarius-Capricorn": {score: 72, text: `Sagittarius is adventurous, Capricorn is disciplined. Their approaches differ, but they can balance each other if aligned.`},
"Sagittarius-Aquarius": {score: 93, text: `A highly compatible pair. Both are independent, adventurous, and open-minded. They inspire each other to dream big and explore.`},
"Sagittarius-Pisces": {score: 75, text: `Both are dreamers but in different ways. Sagittarius seeks adventure, Pisces seeks emotional depth. They connect through inspiration.`},

//Capricorn
"Capricorn-Aries": {score: 70, text: `Capricorn is disciplined and goal-oriented, while Aries is impulsive and energetic. They can clash but also push each other to grow.`},
"Capricorn-Taurus": {score: 90, text: `Both are practical, grounded, and value stability. A dependable and loyal match with shared long-term goals.`},
"Capricorn-Gemini": {score: 65, text: `Capricorn seeks structure, Gemini craves variety. Their differences may cause friction unless they learn to appreciate each other’s strengths.`},
"Capricorn-Cancer": {score: 88, text: `Opposite signs that balance each other. Capricorn provides security, Cancer provides emotional warmth. A strong, supportive bond.`},
"Capricorn-Leo": {score: 68, text: `Capricorn values discipline and modesty, while Leo thrives on attention and flair. They may struggle to meet each other’s needs.`},
"Capricorn-Virgo": {score: 92, text: `Both are practical, hardworking, and detail-oriented. This pairing is steady, supportive, and highly compatible.`},
"Capricorn-Libra": {score: 72, text: `Capricorn is serious and ambitious, Libra is social and charming. Their priorities differ, but balance is possible with effort.`},
"Capricorn-Scorpio": {score: 89, text: `Both are determined, loyal, and intense. This pairing creates a strong and lasting connection based on trust and ambition.`},
"Capricorn-Sagittarius": {score: 72, text: `Capricorn is disciplined and cautious, while Sagittarius is adventurous. Their approaches differ but can complement each other with compromise.`},
"Capricorn-Capricorn": {score: 95, text: `Two ambitious and disciplined souls. They work hard toward goals, build a solid foundation, and thrive in loyalty and responsibility.`},
"Capricorn-Aquarius": {score: 70, text: `Capricorn values tradition, Aquarius seeks innovation. Their differences may cause friction, but they can inspire each other’s growth.`},
"Capricorn-Pisces": {score: 85, text: `Capricorn provides structure, Pisces provides creativity and emotional depth. Together, they balance realism with imagination.`},

//Aquarius
"Aquarius-Aries": {score: 85, text: `Both are energetic, adventurous, and open to new ideas. Aries brings drive while Aquarius brings vision, making this an exciting match.`},
"Aquarius-Taurus": {score: 68, text: `Taurus prefers routine and stability, while Aquarius craves innovation and freedom. Their differences may lead to misunderstandings.`},
"Aquarius-Gemini": {score: 90, text: `Both are intellectual, curious, and love variety. This is a stimulating partnership with shared love for adventure and new experiences.`},
"Aquarius-Cancer": {score: 70, text: `Cancer values security and tradition, while Aquarius seeks freedom and change. They must work hard to understand each other’s needs.`},
"Aquarius-Leo": {score: 80, text: `Opposites that attract. Leo seeks admiration, Aquarius values individuality. Their differences can spark both attraction and conflict.`},
"Aquarius-Virgo": {score: 72, text: `Virgo is practical and detail-oriented, while Aquarius is visionary and unconventional. They may struggle to align priorities but can complement each other.`},
"Aquarius-Libra": {score: 88, text: `Both are social, intellectual, and enjoy harmony. This pairing thrives on mutual respect, communication, and shared ideals.`},
"Aquarius-Scorpio": {score: 74, text: `Scorpio is intense and private, while Aquarius is free-spirited and social. They approach life differently but can learn from each other.`},
"Aquarius-Sagittarius": {score: 92, text: `Both love freedom, adventure, and exploration. This is a dynamic and exciting match with shared enthusiasm for life.`},
"Aquarius-Capricorn": {score: 70, text: `Capricorn values tradition, Aquarius craves change. They may clash in priorities but can balance each other with effort.`},
"Aquarius-Aquarius": {score: 95, text: `Two visionaries who thrive on independence and innovation. They understand each other deeply and share a unique bond.`},
"Aquarius-Pisces": {score: 78, text: `Pisces is dreamy and sensitive, Aquarius is innovative and rational. Their approaches differ, but they can create a compassionate and inspiring union.`},

//Pisces
"Aquarius-Aries": {score: 85, text: `Both are energetic, adventurous, and open to new ideas. Aries brings drive while Aquarius brings vision, making this an exciting match.`},
"Aquarius-Taurus": {score: 68, text: `Taurus prefers routine and stability, while Aquarius craves innovation and freedom. Their differences may lead to misunderstandings.`},
"Aquarius-Gemini": {score: 90, text: `Both are intellectual, curious, and love variety. This is a stimulating partnership with shared love for adventure and new experiences.`},
"Aquarius-Cancer": {score: 70, text: `Cancer values security and tradition, while Aquarius seeks freedom and change. They must work hard to understand each other’s needs.`},
"Aquarius-Leo": {score: 80, text: `Opposites that attract. Leo seeks admiration, Aquarius values individuality. Their differences can spark both attraction and conflict.`},
"Aquarius-Virgo": {score: 72, text: `Virgo is practical and detail-oriented, while Aquarius is visionary and unconventional. They may struggle to align priorities but can complement each other.`},
"Aquarius-Libra": {score: 88, text: `Both are social, intellectual, and enjoy harmony. This pairing thrives on mutual respect, communication, and shared ideals.`},
"Aquarius-Scorpio": {score: 74, text: `Scorpio is intense and private, while Aquarius is free-spirited and social. They approach life differently but can learn from each other.`},
"Aquarius-Sagittarius": {score: 92, text: `Both love freedom, adventure, and exploration. This is a dynamic and exciting match with shared enthusiasm for life.`},
"Aquarius-Capricorn": {score: 70, text: `Capricorn values tradition, Aquarius craves change. They may clash in priorities but can balance each other with effort.`},
"Aquarius-Aquarius": {score: 95, text: `Two visionaries who thrive on independence and innovation. They understand each other deeply and share a unique bond.`},
"Aquarius-Pisces": {score: 78, text: `Pisces is dreamy and sensitive, Aquarius is innovative and rational. Their approaches differ, but they can create a compassionate and inspiring union.`},


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
        
        let messageData;
        if (robustCompatibilityMessages[key]) {
          messageData = robustCompatibilityMessages[key];
        } else if (robustCompatibilityMessages[reverseKey]) {
          messageData = robustCompatibilityMessages[reverseKey];
        } else {
          // Fallback in case a message is somehow missing
          const score = westernCompatibilityChart[zodiac1.name]?.[zodiac2.name] || 50;
          let genericText = "No specific message found, but your score indicates a unique connection!";
          messageData = { score, text: genericText };
        }
        
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
                <Link to="/western-zodiac-calculator" 
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
			This tool provides a simplified Western Zodiac compatibility score for entertainment purposes. It compares the Sun signs (Aries, Taurus, Gemini, etc.) associated with your birth dates against a general compatibility chart.
			</p>
			<ul className="list-disc list-inside text-black/80">
			<li>
				Each birth date is matched to one of the 12 Western Zodiac signs, based on the month and day of birth.
			</li>
			<li>
				A compatibility score is then drawn from a preset chart that considers the natural harmony or tension between signs (for example, fire signs with air signs, or earth signs with water signs).
			</li>
			</ul>
			<p className="text-xs text-black/60 text-center">
			*Please remember, true Western astrology is far more detailed and considers planetary positions, aspects, and houses — not just Sun signs. This tool is meant for lighthearted exploration!*
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

export default WesternZodiacCompatibility;