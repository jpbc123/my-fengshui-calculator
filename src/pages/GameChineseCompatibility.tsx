// src/pages/GameChineseCompatibility.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
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
  { label: "Games & Fun", path: "/games-fun" },
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

const detailedCompatibilityMessages = {
  // RAT COMBINATIONS
  "Rat-Ox": {
    score: 80,
    overview: "Rat's quick intelligence complements Ox's steady reliability perfectly. Rat provides strategic thinking and social connections, while Ox offers stability and methodical execution. This creates a balanced partnership where planning meets persistence, though Rat may sometimes feel constrained by Ox's cautious pace.",
    firstSignDetails: "As a Rat, you bring cleverness and adaptability to this partnership. Your ability to spot opportunities and navigate social situations provides valuable input for major decisions. You appreciate Ox's reliability but may occasionally feel impatient with their methodical approach to change.",
    secondSignDetails: "Your Ox partner provides the steady foundation your sometimes restless nature needs. They're dependable, hardworking, and committed to long-term goals. While they may not match your quick pace of thinking, their persistence ensures that good ideas actually get implemented and sustained."
  },
  "Rat-Tiger": {
    score: 65,
    overview: "Rat's calculated approach contrasts with Tiger's bold impulsiveness, creating both attraction and tension. Rat admires Tiger's courage while Tiger appreciates Rat's strategic mind. Success requires Rat to be more direct and Tiger to be more patient with planning and consideration of consequences.",
    firstSignDetails: "As a Rat, you may find Tiger's boldness both exciting and nerve-wracking. Your natural tendency to analyze and plan ahead can clash with Tiger's preference for immediate action. You bring valuable strategic thinking to balance Tiger's impulsive nature, though you may need to be more supportive of their risk-taking.",
    secondSignDetails: "Your Tiger partner brings passion and courage that can inspire you to take bigger risks. They're natural leaders who aren't afraid of challenges, though their impulsive nature may sometimes worry your security-conscious mind. They need your strategic input but may resist too much analysis or delay."
  },
  "Rat-Rabbit": {
    score: 50,
    overview: "Rat's ambitious drive can overwhelm Rabbit's preference for peace and stability. While both appreciate comfort and security, Rat's direct approach may seem harsh to sensitive Rabbit. Success requires Rat to be gentler and more patient, while Rabbit needs to communicate needs more directly.",
    firstSignDetails: "As a Rat, your natural directness and competitive edge may unintentionally upset your Rabbit partner. Your ambition and social maneuvering might seem calculating to their gentle nature. You'll need to soften your approach and be more considerate of their emotional sensitivity.",
    secondSignDetails: "Your Rabbit partner values harmony and avoids conflict, which can be both soothing and frustrating for your direct nature. They bring grace and diplomacy to situations, helping smooth over your sometimes sharp edges. However, their indirect communication style may leave you guessing about their true feelings."
  },
  "Rat-Dragon": {
    score: 90,
    overview: "This is a powerhouse combination where Rat's strategic intelligence perfectly supports Dragon's grand vision and charisma. Both are ambitious and confident, creating a dynamic partnership capable of achieving remarkable success. Rat provides the practical planning while Dragon supplies the inspiration and leadership.",
    firstSignDetails: "As a Rat, you excel at turning Dragon's big ideas into workable plans. Your strategic thinking and social connections provide the foundation for Dragon's ambitious projects. You appreciate their confidence and vision, though you may occasionally need to remind them of practical limitations.",
    secondSignDetails: "Your Dragon partner brings the charisma and vision that can elevate your careful plans to extraordinary heights. They're natural leaders who inspire others and aren't afraid to think big. Their optimism and energy complement your more cautious nature, creating a balanced approach to ambitious goals."
  },
  "Rat-Snake": {
    score: 75,
    overview: "Both are intelligent and strategic thinkers who value discretion and careful planning. Rat and Snake understand each other's need for privacy and calculated moves. This creates a deeply understanding partnership, though both may be overly suspicious or secretive, potentially limiting emotional intimacy.",
    firstSignDetails: "As a Rat, you appreciate Snake's wisdom and strategic mind. Your quick adaptability complements their deeper, more contemplative approach to problems. Both of you value privacy and understand the importance of timing, though you may need to work on being more open about your feelings.",
    secondSignDetails: "Your Snake partner shares your appreciation for intelligence and strategy. They bring depth and intuition that can enhance your quick-thinking nature. Both of you prefer to work behind the scenes, though their more mysterious nature might occasionally make you wonder what they're really thinking."
  },
  "Rat-Horse": {
    score: 20,
    overview: "This is traditionally considered a challenging match. Rat's need for security and planning conflicts with Horse's desire for freedom and spontaneity. Rat may see Horse as irresponsible, while Horse may view Rat as controlling. Success requires significant compromise and understanding from both sides.",
    firstSignDetails: "As a Rat, Horse's unpredictability and need for freedom may trigger your security concerns. Your preference for planning ahead clashes with their spontaneous nature. You may need to learn to trust more and control less, while appreciating the excitement they bring to your life.",
    secondSignDetails: "Your Horse partner values independence and variety, which can conflict with your desire for security and predictability. They bring adventure and optimism but may struggle with your need for detailed planning and financial security. Their restless nature may make you feel abandoned or insecure."
  },
  "Rat-Goat": {
    score: 30,
    overview: "Rat's practical, ambitious nature contrasts sharply with Goat's artistic, emotion-driven approach. Rat may find Goat too impractical or moody, while Goat may see Rat as too calculating or insensitive. This relationship requires significant patience and understanding from both parties.",
    firstSignDetails: "As a Rat, you may struggle to understand Goat's emotional complexity and artistic temperament. Your practical, goal-oriented approach may seem cold to their sensitive nature. You'll need to develop more patience and appreciation for their creative and intuitive contributions.",
    secondSignDetails: "Your Goat partner brings creativity and emotional depth that can enrich your more pragmatic worldview. However, their need for emotional support and tendency toward moodiness may frustrate your direct, problem-solving approach. They value harmony and beauty over efficiency and results."
  },
  "Rat-Monkey": {
    score: 85,
    overview: "Two quick-witted, adaptable minds create a lively and intellectually stimulating partnership. Both enjoy mental challenges and social interaction, leading to engaging conversations and shared adventures. However, both can be mischievous and may encourage each other's less responsible tendencies.",
    firstSignDetails: "As a Rat, you'll find a kindred spirit in Monkey's quick intelligence and adaptability. You both enjoy mental stimulation and social interaction, creating a lively dynamic. However, Monkey's playful nature might sometimes distract from serious goals, and you may need to be the more practical one.",
    secondSignDetails: "Your Monkey partner matches your intellectual curiosity and social savvy. They bring humor and creativity that can lighten your sometimes serious approach to life. Both of you are excellent problem-solvers, though Monkey's tendency toward mischief might occasionally complicate your carefully laid plans."
  },
  "Rat-Rooster": {
    score: 40,
    overview: "Rat's flexible, adaptive approach conflicts with Rooster's need for order and precision. Rooster's critical nature may wound Rat's pride, while Rat's shortcuts may frustrate Rooster's perfectionist tendencies. Success requires mutual respect for different working styles and communication approaches.",
    firstSignDetails: "As a Rat, you may find Rooster's perfectionism and criticism challenging to your more flexible approach. Your ability to find shortcuts and work around systems may clash with their need for proper procedures. You'll need to appreciate their attention to detail while maintaining your adaptive strengths.",
    secondSignDetails: "Your Rooster partner brings organization and high standards that can help refine your sometimes scattered approach. However, their critical nature and need for precision may feel restrictive to your adaptable style. They value consistency and quality over the quick solutions you often prefer."
  },
  "Rat-Dog": {
    score: 60,
    overview: "Rat appreciates Dog's loyalty and honesty, while Dog admires Rat's intelligence and resourcefulness. Both are practical and goal-oriented, but Dog's moral rigidity may clash with Rat's more flexible ethics. Success requires Dog to be less judgmental and Rat to be more transparent.",
    firstSignDetails: "As a Rat, you value Dog's reliability and straightforward nature, though their moral absolutism may sometimes conflict with your more pragmatic approach to problems. Your strategic thinking complements their loyal nature, but you may need to be more open about your methods and motivations.",
    secondSignDetails: "Your Dog partner brings unwavering loyalty and a strong moral compass to the relationship. They appreciate your intelligence but may sometimes question your methods or motivations. Their honest, direct approach provides a good balance to your more strategic and sometimes secretive nature."
  },
  "Rat-Pig": {
    score: 70,
    overview: "Rat's ambition combines well with Pig's generous, supportive nature. Pig appreciates Rat's intelligence and drive, while Rat values Pig's loyalty and emotional warmth. However, Rat's calculating nature may sometimes hurt Pig's feelings, and Pig's trusting nature may worry security-conscious Rat.",
    firstSignDetails: "As a Rat, you appreciate Pig's generous and supportive nature, though their trusting approach to others may concern your more cautious mindset. Your strategic thinking helps protect both of you, but you'll need to be gentler in your approach to avoid hurting their sensitive feelings.",
    secondSignDetails: "Your Pig partner offers the emotional warmth and stability that can balance your sometimes calculating approach. They're genuinely supportive of your goals and ambitions, though their trusting nature may occasionally clash with your more suspicious instincts about others' motivations."
  },

// TIGER COMBINATIONS
  "Tiger-Rabbit": {
    score: 70,
    overview: "Tiger's bold energy contrasts with Rabbit's gentle nature, creating both attraction and potential conflict. Tiger can inspire Rabbit to be more confident, while Rabbit can help Tiger develop patience and diplomacy. Success requires Tiger to be protective rather than overwhelming, and Rabbit to communicate needs directly.",
    firstSignDetails: "As a Tiger, your natural intensity and leadership can either inspire or overwhelm your Rabbit partner. Your protective instincts align well with their need for security, but you'll need to moderate your direct approach and be more gentle with their sensitive nature.",
    secondSignDetails: "Your Rabbit partner brings grace and harmony that can balance your sometimes aggressive approach. They appreciate your strength and protection but may retreat if you become too demanding or impatient. Their diplomatic skills can help smooth situations your directness might complicate."
  },
  "Tiger-Dragon": {
    score: 85,
    overview: "Two powerful personalities create a dynamic but potentially competitive partnership. Both are natural leaders with strong egos, leading to either magnificent collaboration or dramatic conflicts. Success requires sharing leadership roles and focusing competitive energy on external challenges rather than each other.",
    firstSignDetails: "As a Tiger, you'll find Dragon's confidence and vision inspiring, though their need for attention and recognition may clash with your own leadership instincts. Your courage and Dragon's charisma can create powerful partnerships when you work together rather than compete.",
    secondSignDetails: "Your Dragon partner shares your confidence and leadership abilities, creating exciting possibilities for grand achievements. However, their dramatic flair and need for recognition may conflict with your preference for action over show. Both of you need to share the spotlight and respect each other's authority."
  },
  "Tiger-Snake": {
    score: 60,
    overview: "Tiger's direct, impulsive approach contrasts sharply with Snake's calculated, mysterious nature. Tiger may find Snake too secretive or slow, while Snake may view Tiger as reckless and unpredictable. This relationship requires patience and respect for different approaches to life.",
    firstSignDetails: "As a Tiger, Snake's cautious, mysterious approach may frustrate your need for immediate action and transparency. Their wisdom and strategic thinking can actually complement your bold nature, but you'll need to develop patience for their more contemplative decision-making process.",
    secondSignDetails: "Your Snake partner brings strategic wisdom and careful planning that can help channel your impulsive energy more effectively. However, they may find your direct approach and need for immediate action unsettling to their preference for careful observation and timing."
  },
  "Tiger-Horse": {
    score: 90,
    overview: "This is an excellent match of two freedom-loving, adventurous spirits. Both value independence and excitement, creating a dynamic partnership full of shared adventures. You inspire each other to pursue bold goals while respecting each other's need for personal freedom.",
    firstSignDetails: "As a Tiger, you'll find Horse's adventurous spirit and love of freedom perfectly aligned with your own nature. Your leadership provides direction for their energy, while their optimism and enthusiasm fuel your ambitious projects. Both of you thrive on excitement and challenge.",
    secondSignDetails: "Your Horse partner shares your love of adventure and independence, creating natural harmony. They bring optimism and flexibility that complements your strength and determination. Together, you can pursue exciting goals while maintaining the freedom both of you value."
  },
  "Tiger-Goat": {
    score: 60,
    overview: "Tiger's intense energy can overwhelm Goat's gentle, sensitive nature. However, Tiger's protective instincts align well with Goat's need for security. Success requires Tiger to be patient and gentle, while Goat needs to communicate their needs clearly rather than withdrawing.",
    firstSignDetails: "As a Tiger, your natural intensity may be too overwhelming for Goat's sensitive nature. Your protective instincts can provide the security they crave, but you'll need to develop much more patience and gentleness in your approach to avoid causing emotional distress.",
    secondSignDetails: "Your Goat partner brings artistic sensitivity and emotional depth that can soften your sometimes harsh edges. They need gentle protection and understanding, which aligns with your natural protective instincts, though their indirect communication style may frustrate your preference for directness."
  },
  "Tiger-Monkey": {
    score: 45,
    overview: "This is traditionally a challenging combination. Tiger's serious intensity clashes with Monkey's playful, mischievous nature. Both are competitive and may engage in one-upmanship. Success requires mutual respect, with Tiger appreciating Monkey's intelligence and Monkey respecting Tiger's strength.",
    firstSignDetails: "As a Tiger, Monkey's playful teasing and competitive nature may trigger your pride and temper. Their intelligence and adaptability can actually complement your strength, but you'll need to develop humility and learn to laugh at yourself to avoid constant power struggles.",
    secondSignDetails: "Your Monkey partner's quick wit and adaptability can help you navigate complex situations more skillfully. However, their tendency toward mischief and competition may provoke your serious nature. They need to respect your dignity while you learn to appreciate their humor."
  },
  "Tiger-Rooster": {
    score: 60,
    overview: "Tiger's bold leadership may clash with Rooster's critical, perfectionist nature. Rooster's attention to detail can help Tiger avoid mistakes, but their criticism may wound Tiger's pride. Success requires Rooster to offer constructive feedback gently and Tiger to accept input gracefully.",
    firstSignDetails: "As a Tiger, Rooster's critical nature and attention to detail may feel like challenges to your authority and methods. Their organizational skills and high standards can actually improve your results, but you'll need to accept feedback without taking it as personal criticism.",
    secondSignDetails: "Your Rooster partner brings precision and attention to detail that can help refine your bold plans and avoid costly mistakes. However, their critical nature may clash with your pride and confidence. They need to offer feedback more diplomatically while appreciating your leadership."
  },
  "Tiger-Dog": {
    score: 95,
    overview: "This is one of the best matches in Chinese astrology. Both share strong moral principles, loyalty, and courage. Tiger's leadership combines perfectly with Dog's supportive nature, creating partnerships built on mutual respect, shared values, and unwavering loyalty.",
    firstSignDetails: "As a Tiger, you'll find Dog's unwavering loyalty and moral support invaluable for your ambitious pursuits. Their honest feedback and principled nature align perfectly with your sense of justice, creating a partnership where you feel truly understood and supported.",
    secondSignDetails: "Your Dog partner provides the loyal support and moral grounding that allows your leadership to flourish. They share your sense of justice and aren't afraid to stand by you through challenges. Their reliability balances your impulsive nature while supporting your bold dreams."
  },
  "Tiger-Pig": {
    score: 80,
    overview: "Tiger's strength provides protection that Pig values, while Pig's generous nature supports Tiger's ambitions. This caring partnership works well when Tiger appreciates Pig's emotional support and Pig accepts Tiger's need for leadership and independence.",
    firstSignDetails: "As a Tiger, you'll appreciate Pig's generous, supportive nature and their willingness to back your ambitious projects. Their emotional warmth and loyalty provide the stable foundation you need, though you must be careful not to take their support for granted or be too demanding.",
    secondSignDetails: "Your Pig partner offers genuine emotional support and generosity that can fuel your ambitions while keeping you grounded in what truly matters. They appreciate your strength and protection but need gentleness and consideration in return for their loyal support."
  },
  "Tiger-Rat": {
  score: 60,
  overview: "Tiger's bold leaps meet Rat's careful schemes; admiration grows when both temper pride and share the wheel. Rat prefers calculated moves while Tiger charges ahead. Success requires mutual respect for different approaches and compromise on timing and methods.",
  firstSignDetails: "As a Tiger, you may find Rat's cautious, analytical approach frustrating when you want immediate action. However, their strategic thinking and social connections can actually enhance your bold initiatives. You'll need to develop patience for their planning process while they learn to support your decisive leadership.",
  secondSignDetails: "Your Rat partner brings valuable strategic intelligence and social savvy that can help you avoid costly mistakes in your ambitious pursuits. They appreciate your courage and leadership but may worry about your impulsive decisions. Their careful planning complements your bold action when you work together."
},

"Tiger-Ox": {
  score: 55,
  overview: "Tiger's independence strains Ox's need for predictability while Ox's methodical approach frustrates Tiger's urgency. This challenging combination requires significant patience from both sides, with shared projects and clear communication helping reduce head-butting over pace and methods.",
  firstSignDetails: "As a Tiger, Ox's slow, methodical approach may feel restrictive to your need for quick action and immediate results. Their reliability provides valuable grounding for your projects, but you'll need to develop patience for their systematic methods and respect for their need for stability.",
  secondSignDetails: "Your Ox partner offers the steady foundation and persistent effort needed to turn your bold visions into lasting reality. However, your impulsive nature and need for constant change may conflict with their preference for routine and careful planning. They need reassurance about your commitment."
},

  // RABBIT COMBINATIONS  
  "Rabbit-Dragon": {
    score: 70,
    overview: "Dragon's dramatic confidence contrasts with Rabbit's gentle diplomacy. Dragon can inspire Rabbit to be more assertive, while Rabbit can teach Dragon the value of patience and tact. This relationship works when Dragon protects Rabbit's sensitivity and Rabbit supports Dragon's ambitions.",
    firstSignDetails: "As a Rabbit, Dragon's bold confidence and grand visions may seem overwhelming at times, but their protection and enthusiasm can help you feel more secure about pursuing your own goals. Your diplomatic skills can help temper their sometimes dramatic approach.",
    secondSignDetails: "Your Dragon partner brings excitement and confidence that can inspire you to pursue bigger dreams than you might attempt alone. However, their dramatic nature and need for attention may occasionally overwhelm your preference for peace and harmony."
  },
  "Rabbit-Snake": {
    score: 75,
    overview: "Both appreciate refinement, beauty, and peaceful environments. Snake's wisdom complements Rabbit's diplomacy, creating harmonious partnerships built on mutual understanding and shared aesthetic values. Both prefer indirect communication, which can enhance understanding or create confusion.",
    firstSignDetails: "As a Rabbit, you'll appreciate Snake's refined nature and wisdom. Both of you prefer subtle communication and peaceful environments, though this can sometimes lead to misunderstandings when direct communication is needed. Your diplomatic skills complement their strategic thinking.",
    secondSignDetails: "Your Snake partner shares your appreciation for beauty, refinement, and peaceful settings. Their wisdom and strategic insight can help guide your more intuitive decision-making, though both of you may sometimes avoid necessary but uncomfortable conversations."
  },
  "Rabbit-Horse": {
    score: 60,
    overview: "Horse's restless energy conflicts with Rabbit's need for stability and peace. Rabbit may find Horse too unpredictable, while Horse may see Rabbit as too cautious or clingy. Success requires Horse to provide reassurance and Rabbit to allow more freedom.",
    firstSignDetails: "As a Rabbit, Horse's unpredictable nature and need for constant movement may disrupt your desire for peace and stability. Their optimism can be inspiring, but you'll need to become more flexible and less anxious about their need for independence.",
    secondSignDetails: "Your Horse partner brings adventure and optimism that can expand your sometimes limited worldview. However, their restless nature and need for freedom may trigger your insecurities about abandonment. They need your understanding of their independent spirit."
  },
  "Rabbit-Goat": {
    score: 90,
    overview: "This is an excellent match of two gentle, artistic souls who value harmony and beauty. Both are sensitive and supportive of each other's emotional needs. Together you create peaceful, beautiful environments, though both may avoid dealing with harsh realities or conflicts.",
    firstSignDetails: "As a Rabbit, you'll find perfect understanding with Goat's gentle, artistic nature. Both of you value peace, beauty, and emotional harmony, creating a naturally supportive partnership. However, both of you may need to work on addressing practical concerns and conflicts more directly.",
    secondSignDetails: "Your Goat partner shares your sensitivity and appreciation for beauty and harmony. Together you create peaceful, aesthetically pleasing environments and provide mutual emotional support. Both of you understand the need for gentleness and emotional consideration."
  },
  "Rabbit-Monkey": {
    score: 60,
    overview: "Monkey's playful energy can either delight or overwhelm Rabbit's gentle nature. Rabbit appreciates Monkey's intelligence but may be hurt by their teasing. Success requires Monkey to be more considerate and Rabbit to develop a thicker skin and more direct communication.",
    firstSignDetails: "As a Rabbit, Monkey's quick wit and playful nature can be entertaining, but their tendency toward teasing or mischief may hurt your sensitive feelings. Their intelligence and adaptability can help you navigate challenges, but you'll need to communicate your boundaries clearly.",
    secondSignDetails: "Your Monkey partner brings intelligence and humor that can brighten your sometimes serious approach to life. However, their playful teasing may unintentionally hurt your sensitive nature. They need to be more considerate of your feelings while you develop resilience."
  },
  "Rabbit-Rooster": {
    score: 30,
    overview: "This is traditionally a difficult match. Rooster's critical, direct nature frequently hurts Rabbit's sensitive feelings, while Rabbit's indirect communication frustrates Rooster's need for clarity. Success requires significant effort from both sides to understand and accommodate each other.",
    firstSignDetails: "As a Rabbit, Rooster's critical nature and blunt communication style can be deeply hurtful to your sensitive feelings. Their high standards and attention to detail may feel like constant criticism. This relationship requires them to be much gentler and you to be more resilient.",
    secondSignDetails: "Your Rooster partner's direct, critical approach conflicts sharply with your gentle, diplomatic nature. While their attention to detail and high standards can be valuable, their communication style may consistently wound your sensitive feelings without meaning to."
  },
  "Rabbit-Dog": {
    score: 85,
    overview: "Dog's loyal protection perfectly complements Rabbit's gentle nature. Both value fairness, peace, and traditional values, creating stable partnerships built on mutual care and respect. Dog's honesty provides security while Rabbit's diplomacy smooths rough edges.",
    firstSignDetails: "As a Rabbit, you'll deeply appreciate Dog's loyal protection and honest, principled nature. Their reliability provides the security you crave, while your diplomatic skills help them navigate social situations more gracefully. Both of you value fairness and peace.",
    secondSignDetails: "Your Dog partner offers the loyal protection and moral support that allows your gentle nature to flourish. They share your values of fairness and harmony, though their more direct approach to problems complements your diplomatic style perfectly."
  },
  "Rabbit-Pig": {
    score: 95,
    overview: "This is one of the most harmonious matches possible. Both are gentle, caring, and value domestic happiness above material success. You create warm, loving partnerships built on mutual support, understanding, and shared appreciation for life's simple pleasures.",
    firstSignDetails: "As a Rabbit, you'll find perfect emotional harmony with Pig's generous, caring nature. Both of you value home, family, and emotional connection above external achievements. Your combined gentleness creates peaceful, loving relationships that nurture both partners.",
    secondSignDetails: "Your Pig partner shares your gentle nature and appreciation for domestic harmony. Both of you are naturally caring and supportive, creating relationships where emotional needs are understood and met. Together you build warm, secure homes filled with love."
  },
  "Rabbit-Rat": {
  score: 50,
  overview: "Rat's ambitious drive can overwhelm Rabbit's preference for peace and harmony. While both appreciate comfort and security, their different approaches to achieving goals can create tension. Success requires Rat to be more gentle and Rabbit to communicate needs more directly.",
  firstSignDetails: "As a Rabbit, Rat's direct, ambitious approach may sometimes feel overwhelming to your gentle, peace-loving nature. Their social maneuvering and competitive edge might seem calculating, though their intelligence and resourcefulness can actually help protect your interests when channeled supportively.",
  secondSignDetails: "Your Rat partner brings strategic intelligence and social connections that can help you navigate complex situations more effectively. They appreciate your diplomatic skills and refined nature, though they may sometimes feel frustrated by your indirect communication style and avoidance of conflict."
},

"Rabbit-Ox": {
  score: 75,
  overview: "Ox provides structure while Rabbit adds grace - a calm, caring match that grows through small steady acts. Both value peace, stability, and traditional approaches to life, creating gentle partnerships that work well in domestic settings.",
  firstSignDetails: "As a Rabbit, you deeply appreciate Ox's reliability and steady approach to life. Their strength provides the security you crave, though you may need to help them develop more sensitivity in communication to avoid occasional hurt feelings. Both of you prefer peaceful, traditional solutions.",
  secondSignDetails: "Your Ox partner offers the dependable foundation and consistent support that allows your gentle nature to flourish. They share your appreciation for home, family, and traditional values, though their sometimes blunt communication style may need softening to match your diplomatic preferences."
},

"Rabbit-Tiger": {
  score: 70,
  overview: "Tiger protects while Rabbit soothes - balancing excitement with tenderness keeps this sweet and sustainable. However, Tiger's intensity can sometimes overwhelm Rabbit's gentle nature, requiring careful balance between protection and overwhelming force.",
  firstSignDetails: "As a Rabbit, you appreciate Tiger's protective strength and passionate nature, though their intensity may sometimes feel overwhelming to your preference for peace and harmony. Their bold confidence can inspire you to be more assertive while your diplomacy helps temper their sometimes aggressive approach.",
  secondSignDetails: "Your Tiger partner brings strength and protection that aligns with your need for security, while your gentle, diplomatic nature can help soften their sometimes harsh edges. They value your grace and refinement but may need to moderate their directness to avoid causing emotional distress."
},

  // DRAGON COMBINATIONS
  "Dragon-Snake": {
    score: 90,
    overview: "Dragon's dynamic energy combines beautifully with Snake's wisdom and strategic insight. Dragon provides the vision and enthusiasm while Snake offers the careful planning and depth. This creates powerful partnerships capable of achieving remarkable success through balanced approach.",
    firstSignDetails: "As a Dragon, you'll find Snake's wisdom and strategic thinking invaluable for turning your grand visions into reality. Their careful planning and insight help you avoid pitfalls while their mysterious nature intrigues and challenges you in positive ways.",
    secondSignDetails: "Your Snake partner brings the strategic depth and careful consideration that can guide your enthusiastic energy toward optimal results. They appreciate your confidence and vision while providing the thoughtful planning needed to achieve lasting success."
  },
  "Dragon-Horse": {
    score: 75,
    overview: "Both are energetic and optimistic, creating dynamic partnerships full of excitement and adventure. Dragon's leadership combines well with Horse's enthusiasm, though both need attention and freedom. Success requires sharing the spotlight and respecting each other's independence.",
    firstSignDetails: "As a Dragon, you'll appreciate Horse's enthusiasm and adventurous spirit, though their need for freedom may sometimes conflict with your desire for loyalty and attention. Your leadership can provide direction for their energy while they bring fresh perspective to your ambitions.",
    secondSignDetails: "Your Horse partner shares your love of excitement and grand adventures. Their optimism and flexibility complement your confidence and vision, though both of you need recognition and freedom. Together you can pursue thrilling goals while maintaining individual identity."
  },
  "Dragon-Goat": {
    score: 70,
    overview: "Dragon's strong leadership can provide the protection and guidance that Goat needs, while Goat's artistic sensitivity can inspire Dragon's creative side. This relationship works when Dragon appreciates Goat's gentleness and Goat supports Dragon's ambitions without losing their identity.",
    firstSignDetails: "As a Dragon, you can provide the strength and protection that Goat needs to flourish, while their artistic sensitivity and emotional depth can inspire your creative ambitions. You'll need to be gentle with their feelings and appreciate their unique contributions.",
    secondSignDetails: "Your Goat partner brings artistic inspiration and emotional sensitivity that can enrich your bold ambitions. They need your strength and protection but also require gentleness and appreciation for their creative contributions to feel secure in the relationship."
  },
  "Dragon-Monkey": {
    score: 95,
    overview: "This is an outstanding combination of charisma and intelligence. Dragon's vision and leadership combine perfectly with Monkey's wit and adaptability. Both are confident and ambitious, creating exciting partnerships full of innovation, achievement, and mutual admiration.",
    firstSignDetails: "As a Dragon, you'll find Monkey's intelligence and adaptability perfect for implementing your grand visions. Their wit and creativity can enhance your ideas while their flexibility helps navigate obstacles. Together you can achieve remarkable success through combined charisma and intelligence.",
    secondSignDetails: "Your Monkey partner brings the intelligence and adaptability needed to turn your ambitious dreams into reality. They appreciate your confidence and vision while contributing creative solutions and strategic flexibility that makes your partnership both successful and exciting."
  },
  "Dragon-Rooster": {
    score: 80,
    overview: "Rooster's attention to detail and organizational skills perfectly support Dragon's grand visions and leadership. Dragon provides inspiration while Rooster ensures quality execution. This creates efficient, successful partnerships when both appreciate each other's contributions.",
    firstSignDetails: "As a Dragon, you'll benefit greatly from Rooster's attention to detail and organizational skills, which help turn your ambitious visions into well-executed realities. Their high standards and precision complement your natural leadership and charisma perfectly.",
    secondSignDetails: "Your Rooster partner brings the organizational skills and attention to detail needed to support your grand ambitions effectively. They appreciate your vision and leadership while ensuring that your projects meet high standards and achieve lasting success."
  },
  "Dragon-Dog": {
    score: 20,
    overview: "This is traditionally the most challenging combination. Dragon's pride and need for admiration clash with Dog's critical, egalitarian nature. Dog sees Dragon as arrogant while Dragon finds Dog pessimistic and limiting. Success requires significant compromise and understanding.",
    firstSignDetails: "As a Dragon, Dog's critical nature and tendency to question authority may feel like personal attacks on your confidence and leadership. Their honest, egalitarian values conflict with your need for recognition and admiration, requiring significant patience and humility.",
    secondSignDetails: "Your Dog partner's honest, principled nature may clash with your dramatic flair and need for recognition. They value equality and may see your confidence as arrogance, while their critical feedback may wound your pride. This requires exceptional understanding from both sides."
  },
  "Dragon-Pig": {
    score: 75,
    overview: "Pig's generous support and loyalty perfectly complement Dragon's ambitions and leadership. Dragon provides excitement and direction while Pig offers emotional stability and practical support. This caring partnership thrives when Dragon appreciates Pig's contributions.",
    firstSignDetails: "As a Dragon, you'll appreciate Pig's generous support and willingness to back your ambitious projects without competing for attention. Their loyalty and emotional warmth provide stable foundation while their practical support helps achieve your goals.",
    secondSignDetails: "Your Pig partner offers the generous emotional support and practical assistance that allows your ambitions to flourish. They appreciate your excitement and vision while providing the steady, caring foundation needed for long-term success and happiness."
  },
  "Dragon-Rat": {
  score: 95,
  overview: "A classic match where Rat's savvy supports Dragon's grand visions through shared confidence and momentum that creates dazzling results. This powerhouse combination perfectly balances strategic intelligence with charismatic leadership for remarkable achievements.",
  firstSignDetails: "As a Dragon, you'll find Rat's strategic intelligence and social connections invaluable for implementing your ambitious visions. Their practical planning and careful execution help turn your grand ideas into concrete achievements while their loyalty and admiration fuel your confidence.",
  secondSignDetails: "Your Rat partner brings the strategic thinking and practical skills needed to support your grand ambitions effectively. They appreciate your confidence and charisma while providing the detailed planning and social networking that helps transform your visions into successful realities."
},

"Dragon-Ox": {
  score: 65,
  overview: "Pride meets patience - honor each role of vision and execution to avoid stalemates. Dragon's flair meets Ox's restraint, creating potential for great success when ambition honors practicality and pride yields to teamwork.",
  firstSignDetails: "As a Dragon, you may find Ox's methodical, cautious approach limiting to your expansive visions and need for rapid progress. However, their steadfast determination and practical skills provide the solid foundation needed to make your grand dreams sustainable and lasting.",
  secondSignDetails: "Your Ox partner brings the steady persistence and practical execution skills that can turn your ambitious visions into concrete reality. They appreciate your leadership and vision but may need you to be more patient with their methodical approach and more realistic about timelines."
},

"Dragon-Tiger": {
  score: 85,
  overview: "Bold, heroic energy thrives when you share the spotlight and agree on aims to channel power well. Two natural leaders with charisma and vision can create magnificent partnerships when ego bends toward shared glory rather than competition.",
  firstSignDetails: "As a Dragon, you'll find Tiger's courage and leadership abilities both inspiring and potentially competitive. Your combined charisma and vision can achieve remarkable results when you focus on shared goals rather than competing for dominance. Both of you need recognition and respect.",
  secondSignDetails: "Your Tiger partner shares your confidence and bold nature, creating exciting possibilities for grand achievements together. However, both of your strong personalities may clash when deciding leadership roles. Success requires taking turns in the spotlight and channeling competitive energy toward external challenges."
},

"Dragon-Rabbit": {
  score: 70,
  overview: "Dragon brings momentum while Rabbit brings grace - success blooms when strength stays gentle. This relationship works when Dragon's confidence inspires Rabbit and Rabbit's diplomacy refines Dragon's sometimes overwhelming approach.",
  firstSignDetails: "As a Dragon, you can inspire Rabbit's more timid nature while learning to appreciate their diplomatic skills and refined approach to problems. Your confidence and energy can help them pursue bigger goals, but you'll need to moderate your intensity to avoid overwhelming their sensitive nature.",
  secondSignDetails: "Your Rabbit partner brings grace, diplomacy, and emotional sensitivity that can help refine your sometimes dramatic approach to life. They appreciate your strength and confidence but need gentleness and consideration. Their peaceful nature provides a calming balance to your high energy."
},

  // SNAKE COMBINATIONS
  "Snake-Horse": {
    score: 60,
    overview: "Snake's need for control and careful planning conflicts with Horse's desire for freedom and spontaneity. Snake may find Horse too unpredictable while Horse sees Snake as possessive. Success requires Snake to trust more and Horse to provide more reassurance.",
    firstSignDetails: "As a Snake, Horse's unpredictable nature and need for constant freedom may trigger your desire for control and security. Their optimistic, spontaneous approach can actually complement your careful planning, but you'll need to trust their loyalty despite their independent nature.",
    secondSignDetails: "Your Horse partner brings optimism and adventure that can expand your sometimes cautious worldview. However, their need for freedom and spontaneity may conflict with your preference for careful planning and control. They need your understanding of their independent spirit."
  },
  "Snake-Goat": {
    score: 80,
    overview: "Both appreciate beauty, refinement, and peaceful environments. Snake's wisdom guides Goat's artistic nature while Goat's sensitivity brings out Snake's protective instincts. This creates harmonious partnerships built on mutual appreciation for depth and beauty.",
    firstSignDetails: "As a Snake, you'll appreciate Goat's artistic sensitivity and emotional depth. Your wisdom and strategic thinking can provide the guidance and protection they need, while their creative inspiration and gentle nature bring out your more nurturing qualities.",
    secondSignDetails: "Your Goat partner brings artistic inspiration and emotional sensitivity that perfectly complement your wisdom and depth. They appreciate your protective guidance while inspiring your appreciation for beauty and creative expression."
  },
  "Snake-Monkey": {
    score: 85,
    overview: "Both are intelligent and strategic thinkers who appreciate wit and mental challenges. Snake's depth combines well with Monkey's adaptability, creating partnerships built on mutual intellectual respect. Both enjoy complex games of strategy and subtle communication.",
    firstSignDetails: "As a Snake, you'll find Monkey's intelligence and adaptability fascinating and challenging. Their quick wit matches your strategic thinking, creating engaging mental partnerships. However, their playful nature may sometimes clash with your more serious, mysterious approach.",
    secondSignDetails: "Your Monkey partner brings intelligence and adaptability that can match your strategic depth. They appreciate your wisdom and mystery while contributing creative flexibility and humor. Together you can navigate complex situations with both depth and agility."
  },
  "Snake-Rooster": {
    score: 90,
    overview: "This is an excellent match of complementary strengths. Snake's strategic wisdom combines perfectly with Rooster's attention to detail and organizational skills. Both value quality and precision, creating efficient partnerships that achieve lasting success through careful planning.",
    firstSignDetails: "As a Snake, you'll appreciate Rooster's attention to detail and high standards, which perfectly complement your strategic thinking and long-term planning. Their organizational skills help implement your wise insights effectively and efficiently.",
    secondSignDetails: "Your Rooster partner brings the precision and organizational skills needed to execute your strategic visions perfectly. They share your appreciation for quality and careful planning while providing the detailed attention needed for successful implementation."
  },
  "Snake-Dog": {
    score: 70,
    overview: "Snake's mysterious nature may initially puzzle straightforward Dog, but Dog's loyalty and honesty provide the security Snake needs. Both are intelligent and capable of deep loyalty, creating stable partnerships when trust is established and maintained.",
    firstSignDetails: "As a Snake, Dog's honest, straightforward nature provides the trustworthy foundation you need for deep commitment. Their loyalty and moral integrity align with your values, though you may need to be more open about your thoughts and feelings to maintain their trust.",
    secondSignDetails: "Your Dog partner offers the honest loyalty and moral support that allows you to feel secure enough to open up emotionally. They appreciate your depth and wisdom while providing the straightforward honesty that cuts through confusion and builds lasting trust."
  },
  "Snake-Pig": {
    score: 25,
    overview: "This is traditionally a very challenging combination. Snake's complex, sometimes manipulative nature conflicts with Pig's simple, trusting approach. Snake may see Pig as naive while Pig finds Snake too complicated. Success requires exceptional patience and understanding.",
    firstSignDetails: "As a Snake, Pig's trusting, straightforward nature may seem naive to your more complex understanding of human nature. Their generosity and simplicity can actually be refreshing, but you'll need to avoid taking advantage of their trusting nature.",
    secondSignDetails: "Your Pig partner's generous, trusting nature may conflict with your more complex and strategic approach to relationships. They value simplicity and honesty while you prefer depth and subtlety, creating potential for misunderstanding and hurt feelings."
  },
  "Snake-Rat": {
  score: 80,
  overview: "Subtle, strategic, and quietly affectionate - shared intuition builds strong, private trust. Both are intelligent thinkers who value discretion and careful planning, creating deeply understanding partnerships built on mutual respect for wisdom and strategy.",
  firstSignDetails: "As a Snake, you appreciate Rat's quick intelligence and strategic thinking, which complements your own deeper, more contemplative approach to problems. Both of you value privacy and understand the importance of timing, creating natural harmony in your methods and goals.",
  secondSignDetails: "Your Rat partner shares your appreciation for intelligence and careful planning, bringing quick adaptability that enhances your strategic depth. They understand your need for privacy and discretion while providing the social connections and practical implementation skills that complement your wisdom."
},

"Snake-Ox": {
  score: 95,
  overview: "Trine calm - Ox's patience and Snake's wisdom create a deeply secure sanctuary. This excellent match combines steadfast determination with strategic insight, creating stable partnerships built on mutual respect, loyalty, and shared appreciation for depth and quality.",
  firstSignDetails: "As a Snake, you deeply appreciate Ox's reliable, patient nature and their commitment to long-term goals. Their steadfast determination provides the stable foundation for your strategic visions while their loyalty and consistency align perfectly with your values of depth and lasting quality.",
  secondSignDetails: "Your Ox partner brings the steady persistence and reliable execution that perfectly supports your strategic wisdom and long-term planning. They share your appreciation for quality over quantity and understand that lasting success requires patient, consistent effort guided by careful thought."
},

"Snake-Tiger": {
  score: 60,
  overview: "Snake plans while Tiger pounces - curiosity and respect for different tempos keeps things aligned. This relationship requires patience and understanding as spontaneity contrasts with caution, but mutual respect for each other's strengths can create balance.",
  firstSignDetails: "As a Snake, Tiger's impulsive nature and need for immediate action may conflict with your preference for careful observation and strategic timing. However, their courage and leadership can inspire you to act on your insights more quickly while you provide valuable strategic guidance for their bold initiatives.",
  secondSignDetails: "Your Tiger partner brings the courage and immediate action that can help implement your strategic insights more quickly. They appreciate your wisdom and depth but may sometimes feel frustrated by your cautious approach. They need your strategic input while you benefit from their decisive leadership."
},

"Snake-Rabbit": {
  score: 75,
  overview: "Grace meets insight - gentle encouragement and emotional safety make this bond bloom. Both appreciate refinement and peaceful environments, creating harmonious partnerships built on mutual understanding and shared aesthetic values.",
  firstSignDetails: "As a Snake, you appreciate Rabbit's refined nature, diplomatic skills, and shared love of beauty and peaceful environments. Your wisdom and strategic thinking provide guidance while their gentle, empathetic nature brings out your more nurturing and protective qualities.",
  secondSignDetails: "Your Rabbit partner shares your appreciation for beauty, refinement, and harmony, bringing diplomatic skills and emotional sensitivity that complement your strategic depth. They understand your need for privacy and contemplation while providing the gentle emotional support that helps you feel secure."
},

"Snake-Dragon": {
  score: 95,
  overview: "Trine power - Snake's discernment refines Dragon's ambition into elegant achievements. Dragon's dynamic energy combines beautifully with Snake's wisdom and strategic insight, creating powerful partnerships capable of remarkable success through balanced approaches.",
  firstSignDetails: "As a Snake, you provide the strategic depth and careful consideration that can guide Dragon's enthusiastic energy toward optimal results. Your wisdom and insight help refine their grand visions while their confidence and charisma provide the dynamic force needed to achieve ambitious goals.",
  secondSignDetails: "Your Dragon partner brings the vision, enthusiasm, and leadership energy that can elevate your strategic insights to remarkable achievements. They appreciate your wisdom and strategic thinking while providing the confidence and charismatic force needed to turn careful plans into dynamic realities."
},

  // HORSE COMBINATIONS
  "Horse-Goat": {
    score: 85,
    overview: "Horse's energy and optimism perfectly complement Goat's artistic sensitivity and emotional depth. Horse provides adventure and excitement while Goat offers creative inspiration and emotional support. This creates balanced partnerships that combine freedom with caring.",
    firstSignDetails: "As a Horse, you'll find Goat's artistic nature and emotional sensitivity both inspiring and grounding. Their appreciation for beauty and harmony can enrich your adventures while their gentle support provides emotional stability without restricting your freedom.",
    secondSignDetails: "Your Goat partner brings artistic inspiration and emotional depth that can enrich your adventurous lifestyle. They appreciate your optimism and energy while providing the creative sensitivity and emotional support that makes your shared experiences more meaningful."
  },
  "Horse-Monkey": {
    score: 80,
    overview: "Both are energetic, social, and love variety and excitement. Horse's optimism combines well with Monkey's wit and adaptability, creating lively partnerships full of adventure and intellectual stimulation. Both need freedom and mental stimulation to thrive.",
    firstSignDetails: "As a Horse, you'll enjoy Monkey's wit, intelligence, and love of variety. Their adaptability matches your need for change and excitement, creating partnerships full of adventure and intellectual stimulation. Both of you value freedom and mental challenges.",
    secondSignDetails: "Your Monkey partner shares your love of excitement, variety, and social interaction. Their intelligence and humor complement your optimism and energy, creating dynamic partnerships where both freedom and companionship enhance each other rather than conflict."
  },
  "Horse-Rooster": {
    score: 60,
    overview: "Horse's free-spirited nature conflicts with Rooster's need for order and routine. Rooster's criticism may wound Horse's optimistic nature while Horse's unpredictability frustrates Rooster's need for planning. Success requires mutual respect for different approaches.",
    firstSignDetails: "As a Horse, Rooster's need for order and their critical nature may feel restrictive to your free-spirited approach to life. Their attention to detail can actually help you achieve better results, but you'll need patience with their systematic methods.",
    secondSignDetails: "Your Rooster partner brings organization and attention to detail that could help channel your energetic nature more effectively. However, their critical nature and need for routine may clash with your preference for freedom and spontaneous action."
  },
  "Horse-Dog": {
    score: 90,
    overview: "This is an excellent match of shared values and complementary strengths. Both value fairness, loyalty, and freedom, though express these differently. Dog's steadiness balances Horse's restlessness while Horse's optimism lifts Dog's sometimes pessimistic nature.",
    firstSignDetails: "As a Horse, you'll appreciate Dog's loyal, principled nature and their understanding of your need for freedom. Their honesty and reliability provide security without restriction, while your optimism helps balance their tendency toward worry or pessimism.",
    secondSignDetails: "Your Dog partner offers loyal support and moral grounding that doesn't restrict your freedom but provides emotional security. They share your values of fairness and honesty while appreciating your optimistic, adventurous spirit that brightens their sometimes serious nature."
  },
  "Horse-Pig": {
    score: 80,
    overview: "Horse's adventurous spirit combines well with Pig's generous, supportive nature. Pig provides emotional stability and practical support while Horse brings excitement and new experiences. This works when Horse appreciates Pig's loyalty and Pig accepts Horse's need for freedom.",
    firstSignDetails: "As a Horse, you'll appreciate Pig's generous support and understanding of your need for adventure and freedom. Their emotional warmth and practical help provide stable foundation while their trusting nature doesn't try to restrict your independent spirit.",
    secondSignDetails: "Your Pig partner offers generous emotional support and practical assistance that enables your adventurous lifestyle while providing the caring foundation you need. They appreciate your optimism and energy while offering the stability that balances your restless nature."
  },
  "Horse-Rat": {
  score: 45,
  overview: "A classic clash - Horse craves open range while Rat needs reassurance and security. This traditionally challenging match requires significant understanding, with Rat learning to give space without vanishing and Horse providing stability without feeling trapped.",
  firstSignDetails: "As a Horse, you may find Rat's need for security and detailed planning restrictive to your free-spirited nature. Their strategic approach and cautious mindset conflict with your preference for spontaneous action, though their intelligence can actually help you avoid costly mistakes when you're willing to listen.",
  secondSignDetails: "Your Rat partner brings strategic intelligence and practical planning that could help channel your energetic nature more effectively. However, they may feel insecure about your need for freedom and unpredictable nature. They need reassurance about your commitment while respecting your independent spirit."
},

"Horse-Ox": {
  score: 55,
  overview: "Horse's speed jars Ox's deliberation - sync goals and timelines to reduce frustration. This challenging combination requires patience from both sides as restless energy meets methodical persistence, needing compromise on pace and independence.",
  firstSignDetails: "As a Horse, you may find Ox's slow, methodical approach frustrating to your need for quick movement and immediate results. Their reliability provides valuable grounding, but you'll need to develop patience for their systematic methods while helping them understand your need for variety and freedom.",
  secondSignDetails: "Your Ox partner offers steady reliability and consistent support that can provide security for your adventurous lifestyle. However, their preference for routine and methodical progress may conflict with your restless nature and need for constant change. They need reassurance about your long-term commitment."
},

"Horse-Tiger": {
  score: 95,
  overview: "Trine thrill - adventure buddies with blazing chemistry and mutual independence. This excellent match of freedom-loving, adventurous spirits creates dynamic partnerships full of shared adventures where you inspire each other toward bolder horizons.",
  firstSignDetails: "As a Horse, you'll find perfect harmony with Tiger's adventurous spirit and love of independence. Your optimism and flexibility complement their strength and determination, creating exciting partnerships where both freedom and shared goals enhance rather than restrict each other.",
  secondSignDetails: "Your Tiger partner shares your love of adventure and bold pursuits, bringing leadership and courage that can inspire even bigger adventures. They understand your need for freedom while providing the strength and determination that helps turn exciting dreams into thrilling realities."
},

"Horse-Rabbit": {
  score: 60,
  overview: "Horse adds excitement while Rabbit seeks calm - set gentle rhythms and enjoy bursts of play. This relationship requires balance as restlessness meets peace-seeking, needing clear routines and gentle freedom to make it work harmoniously.",
  firstSignDetails: "As a Horse, you may find Rabbit's preference for peace and routine somewhat limiting to your adventurous spirit, though their diplomatic skills and gentle nature can provide emotional grounding. You'll need to be more considerate of their need for stability while they learn to embrace some spontaneity.",
  secondSignDetails: "Your Rabbit partner brings grace and emotional sensitivity that can enrich your adventures while providing the peaceful home base you need between exciting pursuits. They appreciate your optimism and energy but need reassurance and gentleness to feel secure with your independent nature."
},

"Horse-Dragon": {
  score: 75,
  overview: "Dramatic and spirited - pride and freedom can coexist with shared direction. Both energetic and optimistic, this creates dynamic partnerships full of excitement, though both need attention and recognition, requiring mutual respect for independence.",
  firstSignDetails: "As a Horse, you'll appreciate Dragon's confidence and grand visions, though their need for attention and recognition may sometimes conflict with your own desire for freedom and recognition. Your optimism and flexibility can complement their leadership when you share exciting goals and adventures.",
  secondSignDetails: "Your Dragon partner brings confidence and ambitious vision that can inspire exciting adventures and grand pursuits. They share your love of excitement but may need more attention and recognition than your independent nature naturally provides. Both of you need respect for your individual achievements."
},

"Horse-Snake": {
  score: 60,
  overview: "Snake's caution and Horse's spontaneity conflict - negotiate freedom with trust agreements to smooth the ride. This relationship requires patience as careful planning meets impulsive action, needing clear understanding about independence and security.",
  firstSignDetails: "As a Horse, you may find Snake's cautious, controlling approach restrictive to your free-spirited nature. Their strategic thinking can actually help you avoid mistakes, but you'll need to negotiate agreements that respect your need for freedom while providing the security they require.",
  secondSignDetails: "Your Snake partner brings strategic wisdom and careful planning that could help guide your impulsive energy more effectively. However, your unpredictable nature and need for constant freedom may trigger their desire for control and security. They need reassurance about your loyalty despite your independence."
},


  // GOAT COMBINATIONS  
  "Goat-Monkey": {
    score: 65,
    overview: "Monkey's playful intelligence can either delight or overwhelm Goat's sensitive nature. Goat appreciates Monkey's wit but may be hurt by their teasing. Success requires Monkey to be gentler and more consistent, while Goat needs to develop resilience and clearer communication.",
    firstSignDetails: "As a Goat, Monkey's quick wit and playful nature can be entertaining, but their tendency toward teasing may hurt your sensitive feelings. Their intelligence and problem-solving abilities can help you navigate challenges, but you'll need to communicate your emotional needs clearly.",
    secondSignDetails: "Your Monkey partner brings intelligence and humor that can brighten your sometimes moody disposition. However, their playful teasing may unintentionally wound your sensitive nature. They need to be more considerate while you work on developing emotional resilience."
  },
  "Goat-Rooster": {
    score: 55,
    overview: "Rooster's critical nature and high standards frequently clash with Goat's sensitive, artistic temperament. Rooster may see Goat as impractical while Goat finds Rooster too harsh and demanding. Success requires significant gentleness from Rooster and resilience from Goat.",
    firstSignDetails: "As a Goat, Rooster's critical nature and demanding standards may feel overwhelming to your sensitive disposition. Their attention to detail and organization could actually help you, but their direct communication style often hurts your feelings and dampens your creativity.",
    secondSignDetails: "Your Rooster partner's high standards and critical approach conflict with your gentle, artistic nature. While their organizational skills could be beneficial, their tendency toward criticism and perfectionism may consistently wound your sensitive feelings."
  },
  "Goat-Dog": {
    score: 75,
    overview: "Dog's protective loyalty perfectly complements Goat's gentle, sensitive nature. Both value fairness and harmony, creating caring partnerships. Dog provides security and support while Goat brings artistic inspiration and emotional depth to the relationship.",
    firstSignDetails: "As a Goat, you'll deeply appreciate Dog's protective, loyal nature and their commitment to fairness and justice. Their reliability provides the emotional security you need to express your creativity, while your sensitivity helps them connect with their gentler emotions.",
    secondSignDetails: "Your Dog partner offers the loyal protection and emotional support that allows your sensitive nature to flourish. They share your values of fairness and kindness while providing the stability and security that helps you feel safe to be vulnerable."
  },
  "Goat-Pig": {
    score: 95,
    overview: "This is one of the most harmonious combinations possible. Both are gentle, caring souls who value emotional connection and domestic happiness. You create warm, supportive partnerships built on mutual understanding, kindness, and shared appreciation for life's comforts.",
    firstSignDetails: "As a Goat, you'll find perfect emotional understanding with Pig's generous, caring nature. Both of you value harmony, beauty, and emotional connection, creating naturally supportive relationships where your sensitive nature is appreciated and nurtured.",
    secondSignDetails: "Your Pig partner shares your gentle disposition and appreciation for emotional harmony and domestic comfort. Both of you are naturally caring and understanding, creating relationships where sensitivity is valued and emotional needs are instinctively met."
  },
  "Goat-Rat": {
  score: 60,
  overview: "Rat's pace can stress sensitive Goat - reassurance and steady kindness make space for creativity. This relationship requires Rat to slow down and be more gentle while Goat needs to communicate needs more directly rather than withdrawing.",
  firstSignDetails: "As a Goat, you may find Rat's ambitious, fast-paced approach overwhelming to your sensitive, artistic nature. Their strategic thinking and social connections can help you navigate challenges, but you'll need to communicate your emotional needs clearly and ask for the gentleness you require.",
  secondSignDetails: "Your Rat partner brings intelligence and practical skills that can help you achieve your creative goals more effectively. However, their direct, ambitious approach may sometimes feel harsh to your gentle nature. They need to develop more patience and appreciation for your artistic sensibilities."
},

"Goat-Ox": {
  score: 45,
  overview: "A classic clash - Goat's feelings vs. Ox's bluntness requires gentle dialogue to prevent hurt and shutdowns. This challenging combination needs Ox to develop much more sensitivity while Goat builds resilience to direct communication.",
  firstSignDetails: "As a Goat, you may find Ox's direct, no-nonsense approach hurtful to your sensitive feelings and artistic nature. Their reliability could provide security, but their blunt communication style often wounds your gentle spirit. This relationship requires them to be much more considerate of your emotional needs.",
  secondSignDetails: "Your Ox partner offers dependability and practical support that could benefit your creative pursuits, but their naturally direct communication style may consistently hurt your sensitive feelings. They value results over emotions, which conflicts with your need for emotional understanding and gentle treatment."
},

"Goat-Tiger": {
  score: 60,
  overview: "Tiger's intensity can overwhelm Goat - protection, patience, and soft structure build trust. This relationship works when Tiger's protective instincts align with Goat's need for security, requiring much gentleness and emotional consideration.",
  firstSignDetails: "As a Goat, you appreciate Tiger's strength and protective nature, though their intensity and direct approach may sometimes feel overwhelming to your sensitive disposition. Their confidence can inspire you, but you need them to moderate their approach and provide gentle reassurance rather than demanding responses.",
  secondSignDetails: "Your Tiger partner brings strength and protection that can make you feel secure, while your artistic sensitivity and gentle nature can help soften their sometimes harsh edges. They need to learn patience and gentleness to avoid overwhelming your delicate emotional nature."
},

"Goat-Rabbit": {
  score: 95,
  overview: "Trine tenderness - two gentle hearts creating beauty, comfort, and mutual care. This excellent match of sensitive, artistic souls creates naturally harmonious partnerships where kindness and emotional understanding flow effortlessly.",
  firstSignDetails: "As a Goat, you'll find perfect emotional understanding with Rabbit's gentle, diplomatic nature. Both of you value harmony, beauty, and emotional connection, creating naturally supportive partnerships where your sensitive nature is appreciated and your creativity is encouraged.",
  secondSignDetails: "Your Rabbit partner shares your gentle disposition and appreciation for beauty and emotional harmony. Together you create peaceful, aesthetically pleasing environments where both of your sensitive natures are understood and nurtured, building relationships based on mutual care and artistic appreciation."
},

"Goat-Dragon": {
  score: 70,
  overview: "Dragon leads while Goat uplifts - celebrate sensitivity as a strength, not a hurdle. This relationship works when Dragon provides protection and inspiration while appreciating Goat's creative and emotional contributions.",
  firstSignDetails: "As a Goat, you can find inspiration in Dragon's confidence and grand visions, though their dramatic approach may sometimes feel overwhelming. Your artistic sensitivity and emotional depth can enrich their ambitious pursuits when they learn to value and protect your gentle contributions.",
  secondSignDetails: "Your Dragon partner brings excitement and confident leadership that can inspire your creative pursuits and help you feel more secure about your talents. They need to appreciate your sensitivity as a strength rather than a weakness while providing the encouragement and protection you need to flourish."
},

"Goat-Snake": {
  score: 80,
  overview: "Goat's artistry and Snake's insight blend into quiet, soulful stability. Both appreciate beauty and depth, creating harmonious partnerships built on mutual understanding of emotional complexity and refined sensibilities.",
  firstSignDetails: "As a Goat, you'll appreciate Snake's wisdom and strategic insight, which can provide guidance for your creative endeavors. Their calm, mysterious nature complements your emotional sensitivity, creating partnerships where both artistic expression and strategic thinking are valued and understood.",
  secondSignDetails: "Your Snake partner brings wisdom and strategic depth that can help guide and protect your sensitive nature. They understand emotional complexity and appreciate your artistic sensibilities while providing the thoughtful guidance and security that allows your creativity to flourish safely."
},

"Goat-Horse": {
  score: 90,
  overview: "Secret-friend ease - Horse brings sparkle while Goat brings warmth, where independence and affection dance well. This excellent balance creates relationships where adventure is enriched by emotional depth and caring support.",
  firstSignDetails: "As a Goat, you'll find Horse's optimism and adventurous spirit both exciting and inspiring, while your emotional warmth and artistic nature provide the caring foundation they need. This relationship balances freedom with emotional connection in naturally harmonious ways.",
  secondSignDetails: "Your Horse partner brings energy and adventure that can inspire and enliven your sometimes moody disposition, while your gentle, caring nature provides the emotional warmth and stability that makes their adventures more meaningful and their freedom feel secure."
},

  // MONKEY COMBINATIONS
  "Monkey-Rooster": {
    score: 65,
    overview: "Monkey's adaptability and quick thinking can complement Rooster's organization and attention to detail, but their different approaches to life can create friction. Monkey's flexibility clashes with Rooster's need for order, while Rooster's criticism may dampen Monkey's enthusiasm.",
    firstSignDetails: "As a Monkey, Rooster's systematic approach and attention to detail can help channel your quick intelligence more effectively, though their critical nature and need for perfect order may feel restrictive to your flexible, adaptive style.",
    secondSignDetails: "Your Rooster partner brings organization and high standards that could help focus your versatile abilities. However, their critical nature and need for routine may conflict with your preference for flexibility and spontaneous problem-solving."
  },
  "Monkey-Dog": {
    score: 70,
    overview: "Dog's honest loyalty provides stability for Monkey's changeable nature, while Monkey's wit and flexibility can help Dog adapt to new situations. Both are intelligent and capable, but Dog's serious nature may clash with Monkey's playful approach.",
    firstSignDetails: "As a Monkey, you'll appreciate Dog's honest, reliable nature, though their serious approach to life may sometimes feel limiting to your playful, experimental style. Their loyalty provides security while your adaptability helps them navigate change more easily.",
    secondSignDetails: "Your Dog partner offers the loyal stability and moral grounding that can balance your sometimes scattered energy. They appreciate your intelligence but may struggle with your playful, less serious approach to important matters."
  },
  "Monkey-Pig": {
    score: 55,
    overview: "Monkey's quick-changing interests and playful nature contrast sharply with Pig's steady, traditional values. Pig may find Monkey too unpredictable while Monkey sees Pig as too simple or slow. Success requires Monkey to be more consistent and Pig to be more adaptable.",
    firstSignDetails: "As a Monkey, Pig's steady, traditional approach may seem slow or boring to your quick-changing interests, though their loyalty and generosity provide valuable stability. You'll need to be more consistent and considerate of their need for security and routine.",
    secondSignDetails: "Your Pig partner brings generous support and emotional stability that can ground your sometimes scattered energy. However, their preference for routine and tradition may feel restrictive to your need for variety and intellectual stimulation."
  },
  "Monkey-Rat": {
  score: 95,
  overview: "Trine sparkle - fast minds and bold ideas mean you riff, adapt, and win together. This brilliant partnership combines quick intelligence with strategic thinking, creating lively, successful collaborations full of innovation and mutual intellectual stimulation.",
  firstSignDetails: "As a Monkey, you'll find perfect intellectual harmony with Rat's strategic intelligence and adaptability. Both of you enjoy mental challenges and quick problem-solving, creating dynamic partnerships where ideas flow freely and practical solutions emerge from creative collaboration.",
  secondSignDetails: "Your Rat partner brings strategic thinking and practical execution that can help turn your creative ideas into successful realities. They match your intellectual curiosity while providing the planning skills and social connections needed to implement your innovative concepts effectively."
},

"Monkey-Ox": {
  score: 65,
  overview: "Monkey adds flexibility while Ox adds follow-through - respect structure while keeping it playful. This relationship works when both appreciate different approaches, with Monkey bringing creativity to Ox's systematic methods.",
  firstSignDetails: "As a Monkey, you may find Ox's methodical, serious approach somewhat limiting to your flexible, creative style. However, their steady follow-through can help turn your quick ideas into lasting achievements. You'll need to respect their systematic approach while helping them embrace more flexibility.",
  secondSignDetails: "Your Ox partner provides the steady foundation and systematic execution that can help implement your creative ideas more effectively. They appreciate your intelligence but may struggle with your playful approach and tendency to change direction quickly. They need consistency while you need creative freedom."
},

"Monkey-Tiger": {
  score: 45,
  overview: "A classic clash - one-upmanship and pride flare as humility and empathy turn sparks into light. This challenging combination requires both to overcome competitive instincts and develop mutual respect for different strengths.",
  firstSignDetails: "As a Monkey, you may find Tiger's serious intensity and pride challenging to your playful, teasing nature. Your intelligence and adaptability can complement their strength, but you'll need to develop more respect for their dignity and avoid triggering their competitive instincts through mischievous behavior.",
  secondSignDetails: "Your Tiger partner brings courage and leadership that can inspire your cleverness toward more noble purposes. However, their pride and serious nature may clash with your playful, sometimes mischievous approach. They need respect for their authority while you need appreciation for your intelligence."
},

"Monkey-Rabbit": {
  score: 60,
  overview: "Monkey's mischief can ruffle Rabbit - slow down, reassure, and play gently. This relationship requires Monkey to be more considerate of sensitivity while Rabbit develops resilience to playful teasing.",
  firstSignDetails: "As a Monkey, you may find Rabbit's gentle, sensitive nature both endearing and occasionally frustrating when your playful humor hurts their feelings. Your intelligence and creativity can help them solve problems, but you'll need to be much more gentle and reassuring in your approach.",
  secondSignDetails: "Your Rabbit partner brings grace and emotional sensitivity that can help temper your sometimes mischievous nature. They appreciate your intelligence and humor but need gentleness and reassurance. Their diplomatic skills can help you navigate social situations more gracefully."
},

"Monkey-Dragon": {
  score: 95,
  overview: "Trine charge - charisma and cunning unite as ambitious dreams become lively realities. This outstanding combination creates exciting partnerships where Dragon's vision combines with Monkey's adaptability for remarkable achievements.",
  firstSignDetails: "As a Monkey, you'll find Dragon's confidence and grand visions inspiring and exciting, while your adaptability and creative intelligence help turn their ambitious dreams into practical realities. Together you can achieve remarkable success through combined charisma and strategic flexibility.",
  secondSignDetails: "Your Dragon partner brings the vision and leadership energy that can elevate your clever ideas to extraordinary heights. They appreciate your intelligence and adaptability while providing the confidence and direction needed to channel your versatile abilities toward ambitious goals."
},

"Monkey-Snake": {
  score: 90,
  overview: "Secret-friend finesse - clever, strategic, and quietly devoted when trust is earned. This excellent match combines intelligence with wisdom, creating partnerships built on mutual intellectual respect and strategic understanding.",
  firstSignDetails: "As a Monkey, you'll find Snake's wisdom and strategic thinking fascinating and challenging in positive ways. Their depth complements your quick intelligence, creating engaging partnerships where both surface brilliance and deeper wisdom are appreciated and utilized effectively.",
  secondSignDetails: "Your Snake partner brings strategic depth and wisdom that can help guide your quick intelligence toward more profound achievements. They appreciate your cleverness and adaptability while providing the thoughtful planning and deeper insight that gives your ideas more lasting impact."
},

"Monkey-Horse": {
  score: 80,
  overview: "Adventurous and social - keep commitments clear so fun fuels rather than derails the future. This lively combination creates exciting partnerships when both maintain focus on shared goals while enjoying variety and intellectual stimulation.",
  firstSignDetails: "As a Monkey, you'll enjoy Horse's adventurous spirit and social energy, creating exciting partnerships full of variety and stimulation. Your adaptability matches their need for freedom, but you'll both need to maintain focus on commitments to prevent your shared love of novelty from derailing important goals.",
  secondSignDetails: "Your Horse partner brings adventure and optimistic energy that matches your love of variety and excitement. Together you create dynamic, socially engaging partnerships, though both of you may struggle with sustained focus on long-term commitments without clear agreements and mutual accountability."
},

"Monkey-Goat": {
  score: 65,
  overview: "Monkey's jokes must be tender - Goat blossoms with reassurance and appreciation. This relationship works when playful intelligence is tempered with emotional sensitivity, requiring Monkey to be gentler while Goat develops confidence.",
  firstSignDetails: "As a Monkey, you need to be especially careful with Goat's sensitive feelings, ensuring your natural wit and playfulness remain kind rather than hurtful. Your intelligence can help them solve practical problems while your creativity can inspire their artistic nature when delivered with genuine appreciation.",
  secondSignDetails: "Your Goat partner brings artistic sensitivity and emotional depth that can enrich your intellectual approach to life. They need your reassurance and gentle humor rather than sharp wit, appreciating your cleverness when it's used supportively rather than teasingly."
},

  // ROOSTER COMBINATIONS
  "Rooster-Dog": {
    score: 70,
    overview: "Both value hard work, honesty, and high standards, creating partnerships built on mutual respect and shared principles. Rooster's attention to detail complements Dog's loyalty and integrity, though both can be overly critical and pessimistic.",
    firstSignDetails: "As a Rooster, you'll appreciate Dog's honest, principled nature and strong work ethic. Both of you value integrity and quality results, though you may need to soften your critical approach to avoid making your naturally serious partner even more pessimistic.",
    secondSignDetails: "Your Dog partner shares your values of honesty, hard work, and moral integrity. They appreciate your attention to detail and high standards while providing loyal support, though both of you may need to work on being less critical and more optimistic."
  },
  "Rooster-Pig": {
    score: 70,
    overview: "Rooster's high standards and organizational skills can help Pig achieve their goals more effectively, while Pig's generous nature and emotional warmth soften Rooster's sometimes harsh approach. Success requires Rooster to be gentler and Pig to accept constructive feedback.",
    firstSignDetails: "As a Rooster, you can help Pig organize their generous impulses and achieve better results through your attention to detail and high standards. However, you'll need to soften your critical approach and appreciate their emotional warmth and generous contributions.",
    secondSignDetails: "Your Pig partner brings generous emotional support and genuine warmth that can balance your sometimes critical nature. They appreciate your organizational skills and high standards but need gentler delivery of feedback to maintain their naturally supportive disposition."
  },
  "Rooster-Rat": {
  score: 60,
  overview: "Rat's flexibility vs. Rooster's standards - mix clever shortcuts with quality control for harmony. This relationship works when both appreciate different approaches to achieving excellence, balancing efficiency with thoroughness.",
  firstSignDetails: "As a Rooster, you may find Rat's flexible, shortcut-finding approach challenging to your need for proper procedures and high standards. However, their strategic intelligence and adaptability can actually enhance your systematic approach when you learn to appreciate their efficient methods.",
  secondSignDetails: "Your Rat partner brings strategic flexibility and efficient problem-solving that can complement your systematic approach. They appreciate your attention to detail and high standards but may sometimes feel constrained by your need for perfect order and established procedures."
},

"Rooster-Ox": {
  score: 95,
  overview: "Trine partners - precision and perseverance mean plans are thorough and execution is steady. This excellent match combines attention to detail with steadfast determination, creating highly effective partnerships built on shared commitment to quality.",
  firstSignDetails: "As a Rooster, you'll find perfect harmony with Ox's dedication to quality and systematic approach to work. Both of you value thoroughness and take pride in well-executed projects, creating partnerships where high standards and persistent effort combine for outstanding results.",
  secondSignDetails: "Your Ox partner shares your commitment to excellence and systematic approach to achieving goals. They provide the steady persistence needed to implement your detailed plans while appreciating your organizational skills and attention to quality in all endeavors."
},

"Rooster-Tiger": {
  score: 60,
  overview: "Rooster's critique can pinch Tiger's pride - frame feedback as teamwork and cheer bold efforts. This relationship requires careful communication, with Rooster learning diplomacy and Tiger accepting constructive input gracefully.",
  firstSignDetails: "As a Rooster, your natural tendency toward criticism and high standards may wound Tiger's pride and confidence. Your attention to detail can actually help improve their bold initiatives, but you'll need to frame feedback as supportive teamwork rather than critical judgment.",
  secondSignDetails: "Your Tiger partner brings courage and leadership that can inspire bigger, bolder projects that benefit from your organizational skills. However, their pride may be sensitive to your critical nature. They need encouragement and recognition along with constructive feedback."
},

"Rooster-Rabbit": {
  score: 45,
  overview: "A classic clash - too much bluntness wounds Rabbit, requiring you to lead with gentleness and protection. This challenging combination needs Rooster to develop much more sensitivity while maintaining their helpful standards.",
  firstSignDetails: "As a Rooster, your direct, critical approach may consistently hurt Rabbit's sensitive feelings, even when you intend to be helpful. Your high standards and attention to detail could benefit them, but only if delivered with exceptional gentleness and emotional consideration.",
  secondSignDetails: "Your Rabbit partner brings grace and diplomatic skills that could help soften your sometimes harsh approach to problems. However, their sensitive nature may be consistently wounded by your direct criticism and blunt communication style, requiring you to be much more gentle."
},

"Rooster-Dragon": {
  score: 90,
  overview: "Secret-friend alliance - Rooster's method uplifts Dragon's vision with loyal efficiency that seals the deal. This excellent partnership combines visionary leadership with systematic execution for remarkable achievements.",
  firstSignDetails: "As a Rooster, you can provide the detailed planning and systematic execution that helps turn Dragon's grand visions into successful realities. Your loyalty and attention to quality perfectly support their ambitious leadership while your efficiency helps achieve their goals.",
  secondSignDetails: "Your Dragon partner brings the vision and charismatic leadership that can elevate your systematic approach to extraordinary achievements. They appreciate your loyalty and organizational skills while providing the inspiration and direction that gives meaning to your detailed work."
},

"Rooster-Snake": {
  score: 95,
  overview: "Trine clarity - Snake's subtlety and Rooster's focus craft elegant, lasting results. This excellent match combines strategic wisdom with systematic execution, creating partnerships that achieve sophisticated, high-quality outcomes.",
  firstSignDetails: "As a Rooster, you appreciate Snake's strategic wisdom and attention to quality, which perfectly complements your systematic approach and high standards. Together you create sophisticated, well-executed projects that combine careful planning with thorough implementation.",
  secondSignDetails: "Your Snake partner brings strategic depth and refined judgment that can guide your systematic approach toward more elegant and lasting results. They share your appreciation for quality while providing the wisdom and insight that elevates your detailed work to higher levels."
},

"Rooster-Horse": {
  score: 60,
  overview: "Horse needs freedom while Rooster needs order - agree on lanes and timelines. This relationship requires clear agreements about independence and standards, with both respecting different approaches to life and work.",
  firstSignDetails: "As a Rooster, you may find Horse's free-spirited, unpredictable approach challenging to your need for order and systematic planning. Your organizational skills could help them achieve better results if delivered with respect for their need for freedom and variety.",
  secondSignDetails: "Your Horse partner brings energy and optimistic flexibility that can help you adapt to changing circumstances more easily. However, their restless nature and resistance to routine may conflict with your need for systematic approaches and consistent standards."
},

"Rooster-Goat": {
  score: 55,
  overview: "Directness meets sensitivity - soften tone and honor feelings to stay connected. This challenging relationship requires Rooster to develop much more emotional sensitivity while Goat builds resilience to constructive feedback.",
  firstSignDetails: "As a Rooster, your direct, critical approach may consistently hurt Goat's sensitive feelings, even when you're trying to be helpful. Your standards and organizational skills could benefit them, but only if delivered with exceptional gentleness and emotional consideration.",
  secondSignDetails: "Your Goat partner brings artistic sensitivity and emotional depth that could enrich your systematic approach to life. However, their gentle nature may be consistently wounded by your direct communication style, requiring you to soften your approach significantly."
},

"Rooster-Monkey": {
  score: 65,
  overview: "Play meets precision - enjoy banter but commit to plans so ideas land. This relationship works when intellectual stimulation is balanced with practical execution, requiring both focus and flexibility.",
  firstSignDetails: "As a Rooster, you may find Monkey's playful, adaptable approach both entertaining and frustrating when trying to maintain systematic plans. Your organizational skills can help focus their versatile abilities, but you'll need to appreciate their creative flexibility while they commit to following through on important plans.",
  secondSignDetails: "Your Monkey partner brings creative intelligence and adaptability that can help you find innovative solutions to systematic challenges. They appreciate your organizational skills but may feel constrained by your rigid approaches. Together you can balance structure with flexibility when both commit to shared goals."
},

  // DOG COMBINATIONS
  "Dog-Pig": {
    score: 85,
    overview: "This is an excellent match built on shared values of loyalty, honesty, and caring for others. Dog's protective nature combines beautifully with Pig's generous heart, creating stable partnerships based on mutual support, trust, and genuine affection.",
    firstSignDetails: "As a Dog, you'll deeply appreciate Pig's genuine generosity and emotional warmth. Their trusting nature and loyal support align perfectly with your protective instincts and moral values, creating relationships built on mutual care and unwavering loyalty.",
    secondSignDetails: "Your Pig partner offers the generous emotional support and genuine warmth that perfectly complements your loyal, protective nature. They share your values of caring for others while bringing optimism and trust that balances your sometimes pessimistic tendencies."
  },  
  "Dog-Rat": {
  score: 75,
  overview: "Rat adds sparkle to Dog's steady honesty while shared security and clear ethics build trust. This solid partnership combines loyalty with intelligence, creating stable relationships built on mutual respect and practical cooperation.",
  firstSignDetails: "As a Dog, you'll appreciate Rat's intelligence and strategic thinking, which can help you navigate complex social and practical situations more effectively. Their resourcefulness complements your loyalty while their quick thinking enhances your steady, principled approach to problems.",
  secondSignDetails: "Your Rat partner brings strategic intelligence and adaptability that can help you achieve your goals more efficiently. They appreciate your loyalty and moral integrity while providing the social connections and practical skills that complement your honest, straightforward nature."
},

"Dog-Ox": {
  score: 75,
  overview: "Practical and sincere - you thrive on reliability, service, and a sense of duty. Both value hard work and moral integrity, creating partnerships built on mutual respect for dedication and principled behavior.",
  firstSignDetails: "As a Dog, you deeply appreciate Ox's reliability and commitment to principled hard work. Both of you value loyalty and integrity, creating stable partnerships where mutual dependability and shared moral values form the foundation for lasting cooperation and trust.",
  secondSignDetails: "Your Ox partner shares your values of loyalty, hard work, and moral integrity. They provide the steady persistence that complements your protective nature while appreciating your honest feedback and principled approach to all endeavors."
},

"Dog-Tiger": {
  score: 95,
  overview: "Trine strength - Dog's loyalty and Tiger's courage align for a noble, passionate bond. This excellent match creates partnerships where moral principles combine with bold action for powerful, principled achievements.",
  firstSignDetails: "As a Dog, you'll find perfect harmony with Tiger's courage and sense of justice. Your loyalty provides the steady support they need for their bold initiatives while their passionate leadership inspires your own sense of moral purpose and protective instincts.",
  secondSignDetails: "Your Tiger partner brings the courage and passionate leadership that can elevate your steady loyalty to extraordinary achievements. They share your sense of justice and moral principles while providing the bold action that turns your faithful support into meaningful accomplishments."
},

"Dog-Rabbit": {
  score: 90,
  overview: "Secret-friend sweetness - Dog protects while Rabbit soothes, where fairness and care deepen love. This excellent match creates naturally supportive partnerships built on mutual care and understanding.",
  firstSignDetails: "As a Dog, you naturally provide the protection and loyal support that allows Rabbit's gentle nature to flourish. Your honesty and reliability create the security they need while their diplomatic grace helps you navigate social situations with more sensitivity and emotional intelligence.",
  secondSignDetails: "Your Rabbit partner brings grace and emotional sensitivity that can help soften your sometimes blunt approach while appreciating your protective loyalty. They provide the harmony and diplomatic skills that complement your honest, straightforward nature perfectly."
},

"Dog-Dragon": {
  score: 45,
  overview: "A classic clash - Dog's blunt truth confronts Dragon's pride, requiring gentleness and restraint as crucial elements. This challenging combination needs significant compromise and understanding from both sides.",
  firstSignDetails: "As a Dog, your honest, direct nature may consistently wound Dragon's pride and need for recognition. Your moral principles and egalitarian values conflict with their dramatic flair, requiring you to develop much more diplomatic communication while maintaining your integrity.",
  secondSignDetails: "Your Dragon partner brings confidence and ambitious vision that may clash with your tendency toward critical honesty and moral judgment. They need recognition and admiration while you value equality and honesty, creating fundamental conflicts that require exceptional understanding."
},

"Dog-Snake": {
  score: 70,
  overview: "Dog's candor and Snake's subtlety can mesh when clear ground rules ease misunderstandings. This relationship works when both appreciate different approaches to wisdom and problem-solving.",
  firstSignDetails: "As a Dog, you may find Snake's mysterious, indirect approach initially puzzling, but their wisdom and strategic thinking can complement your straightforward honesty when mutual trust is established through clear communication and consistent behavior.",
  secondSignDetails: "Your Snake partner brings strategic wisdom and careful consideration that can help guide your honest instincts toward more effective outcomes. They appreciate your loyalty and moral integrity while providing the thoughtful planning that enhances your protective capabilities."
},

"Dog-Horse": {
  score: 95,
  overview: "Trine harmony - Dog offers devotion while Horse offers adventure, where trust and freedom flourish together. This excellent match creates partnerships where loyalty enhances rather than restricts independence.",
  firstSignDetails: "As a Dog, you understand and support Horse's need for freedom and adventure while they appreciate your loyal, dependable nature. Your honesty provides security without restriction while their optimism helps balance your sometimes pessimistic tendencies.",
  secondSignDetails: "Your Horse partner brings adventure and optimistic energy that can inspire you to embrace more positive possibilities while respecting your need for loyalty and moral principles. They provide excitement while appreciating your steady, faithful support."
},

"Dog-Goat": {
  score: 75,
  overview: "Dog's steadiness comforts Goat while appreciation and soft words keep hearts open. This caring partnership works when protection is offered gently and emotional needs are understood and respected.",
  firstSignDetails: "As a Dog, your protective nature can provide the security Goat needs to flourish creatively, but you'll need to soften your direct communication style and develop more appreciation for their artistic sensitivity and emotional complexity.",
  secondSignDetails: "Your Goat partner brings artistic sensitivity and emotional depth that can help you connect with gentler aspects of life while appreciating your steady protection and moral support. They need your understanding delivered with emotional consideration."
},

"Dog-Monkey": {
  score: 70,
  overview: "Honesty and humor make a lively team - align on commitments to avoid friction. This partnership works when playful intelligence is grounded in reliable commitment and mutual respect.",
  firstSignDetails: "As a Dog, you can appreciate Monkey's intelligence and humor while they respect your need for honesty and commitment. Your moral principles provide grounding for their flexible nature when both focus on shared values and clear agreements.",
  secondSignDetails: "Your Monkey partner brings intelligence and adaptability that can help you navigate complex situations more skillfully while appreciating your loyalty and moral integrity. They need your steady support while you benefit from their creative problem-solving."
},

"Dog-Rooster": {
  score: 70,
  overview: "Shared respect for hard work requires softening criticism and highlighting wins to stay close. This partnership thrives on mutual dedication to quality and moral integrity when communication remains supportive.",
  firstSignDetails: "As a Dog, you share Rooster's commitment to high standards and hard work, creating partnerships built on mutual respect for dedication. However, both of you may need to soften critical tendencies and focus more on encouraging each other's efforts.",
  secondSignDetails: "Your Rooster partner shares your values of integrity and quality work while bringing organizational skills that complement your loyal support. Both of you appreciate dedication but may need to balance high standards with emotional encouragement."
},

  // Continue with OX combinations...
  "Ox-Rat": {
    score: 80,
    overview: "Ox's steady reliability provides the perfect foundation for Rat's quick intelligence and social connections. This complementary pairing balances planning with persistence, though Rat may sometimes feel constrained by Ox's methodical pace while Ox may find Rat's changeability unsettling.",
    firstSignDetails: "As an Ox, you provide the steady, reliable foundation that supports Rat's more dynamic approach to life. Your methodical nature helps turn their quick ideas into lasting achievements. However, you may sometimes feel frustrated by their need for constant stimulation and social interaction.",
    secondSignDetails: "Your Rat partner brings intelligence and adaptability that can help you navigate complex social and business situations. They appreciate your dependability but may occasionally feel restless with your measured pace. Their strategic thinking complements your steady execution perfectly."
  },
  "Ox-Tiger": {
    score: 40,
    overview: "Ox's cautious, methodical approach directly conflicts with Tiger's bold, impulsive nature. Ox sees Tiger as reckless, while Tiger views Ox as overly slow and rigid. This challenging combination requires significant compromise, with Ox learning to be more flexible and Tiger developing more patience.",
    firstSignDetails: "As an Ox, Tiger's impulsive nature and need for immediate action may feel threatening to your preference for careful planning. Their bold risks may seem reckless to your cautious mindset. You'll need to learn to support their leadership while helping them consider long-term consequences.",
    secondSignDetails: "Your Tiger partner brings excitement and courage that can inspire you to take calculated risks. However, their impatience with your methodical approach and need for immediate action may create frequent conflicts. They value freedom and quick decisions over your preferred stability and careful planning."
  },
  "Ox-Rabbit": {
    score: 60,
    overview: "Both value peace, stability, and traditional approaches to life. Ox provides security while Rabbit brings grace and diplomacy. This gentle pairing works well in domestic settings, though both may avoid necessary confrontations and Rabbit may find Ox's bluntness occasionally hurtful.",
    firstSignDetails: "As an Ox, you appreciate Rabbit's gentle nature and desire for harmony. Your stability provides the security they crave, though you may need to soften your direct communication style to avoid hurting their sensitive feelings. Both of you prefer peaceful, traditional approaches to problems.",
    secondSignDetails: "Your Rabbit partner brings grace and diplomacy that can smooth your sometimes rough edges. They appreciate your reliability and strength, though your direct manner may occasionally overwhelm their sensitive nature. Both of you value home, family, and traditional values."
  },
  "Ox-Dragon": {
    score: 50,
    overview: "Ox's methodical approach clashes with Dragon's need for drama and recognition. Dragon's grand visions may seem impractical to steady Ox, while Ox's cautious pace frustrates Dragon's urgency. Success requires Dragon to appreciate Ox's practical wisdom and Ox to support Dragon's ambitions.",
    firstSignDetails: "As an Ox, you may find Dragon's dramatic flair and need for attention exhausting or impractical. Your methodical approach provides valuable grounding for their grand schemes, but you'll need to be more supportive of their ambitions and less critical of their methods.",
    secondSignDetails: "Your Dragon partner brings vision and charisma that can elevate your steady efforts to new heights. However, their need for excitement and recognition may clash with your preference for quiet, consistent progress. They may find your cautious approach limiting to their expansive dreams."
  },
  "Ox-Snake": {
    score: 90,
    overview: "This is an excellent match of complementary strengths. Ox's steadfast determination combines beautifully with Snake's wisdom and strategic insight. Both value loyalty, depth, and long-term planning, creating a stable partnership built on mutual respect and shared goals.",
    firstSignDetails: "As an Ox, you deeply appreciate Snake's wisdom and strategic thinking. Their intuitive insights complement your practical approach, helping you make better long-term decisions. Both of you value loyalty and consistency, creating a stable foundation for lasting partnership.",
    secondSignDetails: "Your Snake partner brings the strategic wisdom and insight that can guide your steady efforts toward optimal results. They appreciate your reliability and determination, understanding that lasting success comes through patient, consistent effort rather than dramatic gestures."
  },
  "Ox-Horse": {
    score: 30,
    overview: "Ox's need for routine and stability directly conflicts with Horse's desire for freedom and variety. Ox may see Horse as irresponsible and unreliable, while Horse views Ox as boring and restrictive. This challenging match requires significant understanding and compromise from both sides.",
    firstSignDetails: "As an Ox, Horse's restless nature and need for constant change may feel threatening to your desire for stability and routine. Their independent spirit may seem like rejection of your steady support. You'll need to learn to give them space while maintaining your own need for security.",
    secondSignDetails: "Your Horse partner values freedom and variety, which can conflict with your preference for routine and predictability. They may feel constrained by your steady approach and need for commitment. Their optimistic, adventurous spirit can inspire you, but requires patience and understanding."
  },
  "Ox-Goat": {
    score: 25,
    overview: "This is traditionally one of the most challenging combinations. Ox's blunt, practical approach hurts Goat's sensitive feelings, while Goat's emotional needs and artistic temperament seem impractical to Ox. Success requires Ox to develop gentleness and Goat to develop resilience.",
    firstSignDetails: "As an Ox, Goat's emotional sensitivity and need for artistic expression may seem impractical or overly complicated to your straightforward approach. Your natural directness may unintentionally hurt their feelings. You'll need to develop much more patience and gentleness.",
    secondSignDetails: "Your Goat partner brings creativity and emotional depth that could enrich your practical worldview, but their sensitivity to criticism and need for emotional support may conflict with your direct, no-nonsense approach. They require gentleness and understanding that may not come naturally to you."
  },
  "Ox-Monkey": {
    score: 45,
    overview: "Ox's methodical, serious approach contrasts sharply with Monkey's playful, adaptable nature. Ox may see Monkey as unreliable or frivolous, while Monkey finds Ox too rigid and boring. This relationship works best when both appreciate what the other brings - stability and flexibility.",
    firstSignDetails: "As an Ox, Monkey's quick changes and playful nature may seem irresponsible or unreliable to your steady approach. Their ability to adapt quickly can actually complement your methodical nature, but you'll need to be more flexible and less critical of their unconventional methods.",
    secondSignDetails: "Your Monkey partner brings creativity and adaptability that can help you navigate changing circumstances more effectively. However, their playful nature and tendency to jump between interests may frustrate your preference for consistent, focused effort toward long-term goals."
  },
  "Ox-Rooster": {
    score: 85,
    overview: "This is an excellent partnership of shared values and complementary skills. Both are hardworking, detail-oriented, and value quality results. Ox provides steady execution while Rooster contributes planning and organization. Together, you create efficient, productive partnerships.",
    firstSignDetails: "As an Ox, you deeply appreciate Rooster's attention to detail and high standards. Their organizational skills complement your steady work ethic perfectly, creating efficient and productive partnerships. Both of you value quality over speed and take pride in thorough, well-executed work.",
    secondSignDetails: "Your Rooster partner shares your commitment to excellence and hard work. They bring organizational skills and attention to detail that help optimize your steady efforts. Both of you appreciate quality, consistency, and take pride in achieving high standards through dedicated effort."
  },
  "Ox-Dog": {
    score: 65,
    overview: "Both are loyal, honest, and hardworking, sharing similar values about duty and responsibility. Ox appreciates Dog's loyalty while Dog admires Ox's reliability. However, both can be stubborn and pessimistic, potentially creating a heavy or overly serious relationship dynamic.",
    firstSignDetails: "As an Ox, you appreciate Dog's unwavering loyalty and strong moral character. Their honest, straightforward approach aligns with your values, though both of you may tend toward pessimism or stubbornness. You'll need to work together to maintain optimism and flexibility.",
    secondSignDetails: "Your Dog partner shares your values of loyalty, hard work, and moral integrity. They appreciate your dependability and strength, though both of you may struggle with being overly serious or pessimistic. Together, you can build solid, trustworthy partnerships based on mutual respect."
  },
  "Ox-Pig": {
    score: 70,
    overview: "Ox's reliability combines well with Pig's generous, supportive nature. Both value home, family, and material security, creating a stable domestic partnership. However, Ox's bluntness may sometimes hurt Pig's feelings, and Pig's trusting nature may concern practical Ox.",
    firstSignDetails: "As an Ox, you appreciate Pig's generous and supportive nature, though their trusting approach to others may concern your more cautious mindset. Your practical reliability provides the security they value, but you'll need to be gentler in your communication to avoid hurting their feelings.",
    secondSignDetails: "Your Pig partner offers emotional warmth and generosity that complements your steady, reliable nature. They appreciate your dependability and share your values about home and family. However, your direct communication style may occasionally hurt their sensitive feelings."
  },
  
  // SAME SIGN COMBINATIONS
  "Pig-Pig": {
    score: 70,
    overview: "Two generous, caring souls who understand each other's need for emotional connection and domestic happiness. Both value loyalty, comfort, and supporting others, creating warm partnerships. However, both may avoid difficult decisions and need external motivation for practical matters.",
    firstSignDetails: "As a Pig, you'll find perfect understanding of each other's generous nature and need for emotional security. Both of you value loyalty and domestic happiness, though you may both need to work on addressing practical concerns and making difficult decisions when necessary.",
    secondSignDetails: "Your Pig partner shares your generous heart and appreciation for emotional connection and domestic comfort. Together you create warm, supportive relationships, though both of you may struggle with being too trusting or avoiding necessary but unpleasant practical decisions."
  },
  "Pig-Rat": {
  score: 80,
  overview: "Pig's warmth soothes Rat's intensity while balanced give-and-take lets ambition and comfort thrive. This caring partnership combines generous support with strategic intelligence for mutually beneficial relationships.",
  firstSignDetails: "As a Pig, you provide the emotional warmth and generous support that can help balance Rat's sometimes calculating approach to life. Your trusting nature and practical help create the stable foundation they need while their intelligence helps protect and guide your generous impulses.",
  secondSignDetails: "Your Rat partner brings strategic intelligence and practical skills that can help you navigate complex situations more effectively while appreciating your generous, supportive nature. They help protect your interests while you provide the emotional warmth they need."
},

"Pig-Ox": {
  score: 80,
  overview: "Kindness meets reliability - you build a peaceful, well-provisioned life through steady care. Both value home, family, and material security, creating stable domestic partnerships built on mutual support.",
  firstSignDetails: "As a Pig, you appreciate Ox's dependable nature and shared values about home and family security. Your generous warmth complements their steady reliability, creating partnerships where both practical needs and emotional comfort are consistently provided.",
  secondSignDetails: "Your Ox partner provides the steady reliability and practical support that perfectly complements your generous nature. They share your values about home and security while appreciating your emotional warmth and caring support."
},

"Pig-Tiger": {
  score: 90,
  overview: "Secret-friend glow - Pig's heart supports Tiger's daring where courage feels safer together. This excellent match creates partnerships where generous support enables bold achievements while strength provides security.",
  firstSignDetails: "As a Pig, you provide the generous emotional support and practical assistance that enables Tiger's bold pursuits while their strength and protection make you feel secure about being open and trusting. Your caring nature perfectly supports their ambitious courage.",
  secondSignDetails: "Your Tiger partner brings strength and passionate leadership that can inspire and protect your generous nature while appreciating your loyal support. They provide the courage and direction that makes your caring contributions feel meaningful and valued."
},

"Pig-Rabbit": {
  score: 95,
  overview: "Trine harmony - two gentle souls who treasure home, kindness, and simple joys. This excellent match creates naturally harmonious partnerships where mutual care and domestic happiness flourish effortlessly.",
  firstSignDetails: "As a Pig, you'll find perfect emotional harmony with Rabbit's gentle, caring nature. Both of you value home, emotional connection, and simple pleasures, creating naturally supportive relationships where kindness and mutual care flow effortlessly between you.",
  secondSignDetails: "Your Rabbit partner shares your gentle nature and appreciation for domestic harmony and emotional connection. Together you create warm, caring relationships where both sensitivity and generosity are understood, valued, and reciprocated naturally."
},

"Pig-Dragon": {
  score: 75,
  overview: "Dragon's drive finds refuge in Pig's generosity - share credit and celebrate tenderness. This partnership works when ambitious energy is balanced with generous support and mutual appreciation.",
  firstSignDetails: "As a Pig, you can provide the generous emotional support and practical assistance that helps fuel Dragon's ambitious pursuits while their confidence and leadership inspire you to pursue your own goals more boldly when supported properly.",
  secondSignDetails: "Your Dragon partner brings exciting vision and confident leadership that can inspire your generous nature toward bigger contributions while appreciating your loyal support and emotional warmth as essential to their success."
},

"Pig-Snake": {
  score: 45,
  overview: "A classic clash - Pig's openness vs. Snake's guarded intensity requires radical empathy to bridge the gap. This challenging combination needs exceptional understanding and patience from both sides.",
  firstSignDetails: "As a Pig, you may find Snake's complex, secretive nature confusing and sometimes hurtful to your open, trusting approach. Their strategic thinking can help protect you, but their indirect methods may feel manipulative to your straightforward, generous nature.",
  secondSignDetails: "Your Snake partner brings strategic wisdom and protective instincts that could benefit your trusting nature, but their complex approach to relationships may conflict with your preference for simple, honest emotional connection and straightforward communication."
},

"Pig-Horse": {
  score: 80,
  overview: "Adventure tastes sweeter with affection - Pig offers care while Horse offers horizons, but keep promises. This partnership combines emotional support with exciting experiences when commitment is maintained.",
  firstSignDetails: "As a Pig, you can provide the caring emotional support and stable foundation that makes Horse's adventures more meaningful while their optimism and exciting experiences help broaden your sometimes limited worldview in positive ways.",
  secondSignDetails: "Your Horse partner brings adventure and optimistic energy that can inspire you to embrace new experiences while appreciating your generous support and emotional warmth. They need your caring foundation but must honor commitments to maintain your trust."
},

"Pig-Goat": {
  score: 95,
  overview: "Trine sweetness - artistic, nurturing, and deeply supportive where love feels easy and safe. This excellent match creates naturally harmonious partnerships built on mutual care, creativity, and emotional understanding.",
  firstSignDetails: "As a Pig, you'll find perfect emotional harmony with Goat's gentle, artistic nature. Both of you value emotional connection and creative expression, creating naturally supportive relationships where caring and artistic appreciation flow effortlessly between you.",
  secondSignDetails: "Your Goat partner shares your gentle nature and appreciation for emotional harmony and creative beauty. Together you create warm, artistically enriched relationships where both generosity and sensitivity are naturally understood and reciprocated."
},

"Pig-Monkey": {
  score: 55,
  overview: "Different rhythms - Pig seeks steadfast warmth while Monkey seeks novelty, requiring meeting halfway with consistency and care. This relationship needs patience and understanding of different needs.",
  firstSignDetails: "As a Pig, you may find Monkey's constantly changing interests and playful nature somewhat unsettling to your preference for steady, consistent emotional connection. Their intelligence can help you, but you need more reliability and emotional consideration than they naturally provide.",
  secondSignDetails: "Your Monkey partner brings intelligence and creative variety that can help expand your worldview, but their restless nature and need for constant novelty may conflict with your desire for steady emotional connection and consistent, caring relationships."
},

"Pig-Rooster": {
  score: 70,
  overview: "Pig's big heart softens Rooster's edge - celebrate effort, not just outcomes, to stay warm. This partnership works when high standards are balanced with emotional appreciation and encouragement.",
  firstSignDetails: "As a Pig, you can help soften Rooster's critical approach with your generous warmth and emotional support while they help you organize your caring impulses more effectively. You need their criticism delivered with kindness and appreciation.",
  secondSignDetails: "Your Rooster partner brings organizational skills and high standards that can help you achieve your caring goals more effectively while your generous warmth helps balance their sometimes harsh approach to improvement and achievement."
},

"Pig-Dog": {
  score: 85,
  overview: "Generosity and integrity blend well - devotion and comfort anchor a secure, happy bond. This excellent match creates stable partnerships built on mutual loyalty, care, and shared values of helping others.",
  firstSignDetails: "As a Pig, you deeply appreciate Dog's loyal integrity and protective nature, which perfectly complements your generous caring. Both of you value helping others and creating secure, comfortable environments where mutual devotion and care flourish naturally.",
  secondSignDetails: "Your Dog partner shares your values of loyalty and caring for others while providing the honest protection and moral grounding that helps you feel secure about being open and generous. Together you create stable, caring relationships built on mutual devotion."
},
  
// Same-sign combinations (add these to your detailedCompatibilityMessages object)

"Ox-Ox": {
  score: 70,
  overview: "Two Oxen understand each other's methodical approach and appreciation for stability and hard work. You share similar values about patience, persistence, and traditional approaches to life. However, both can be stubborn and inflexible, potentially creating deadlocks when disagreements arise.",
  firstSignDetails: "As an Ox, you appreciate your partner's reliability and shared commitment to steady progress. Both of you value security and tradition, though you may need to work on flexibility and compromise when your stubborn natures clash over methods or decisions.",
  secondSignDetails: "Your Ox partner shares your methodical approach and appreciation for consistent effort toward long-term goals. They understand your need for stability and routine, though both of you may struggle with adapting to change or compromising when you have different opinions."
},

"Tiger-Tiger": {
  score: 70,
  overview: "Two Tigers create an intense, passionate partnership full of energy and ambition. Both understand each other's need for leadership and independence, but competition for dominance can create conflicts. Success requires taking turns leading and channeling competitive energy externally.",
  firstSignDetails: "As a Tiger, you understand your partner's need for leadership and independence, though both of your strong personalities may clash when deciding who takes charge. Your shared courage and passion can create exciting partnerships when you work together rather than compete.",
  secondSignDetails: "Your Tiger partner shares your bold nature and leadership instincts, creating natural understanding of each other's ambitious drive. However, both of you may struggle with sharing authority and may need to consciously take turns being the leader in different areas."
},

"Rabbit-Rabbit": {
  score: 70,
  overview: "Two Rabbits create peaceful, harmonious partnerships built on mutual understanding and shared appreciation for beauty and comfort. Both value diplomacy and gentle approaches to conflict. However, both may avoid necessary confrontations and difficult decisions.",
  firstSignDetails: "As a Rabbit, you'll find perfect understanding of each other's gentle nature and need for harmony. Both of you prefer peaceful environments and diplomatic solutions, though you may both need to work on addressing conflicts more directly when necessary.",
  secondSignDetails: "Your Rabbit partner shares your diplomatic nature and appreciation for peace and beauty. Together you create harmonious relationships, though both of you may struggle with making difficult decisions or confronting problems that require direct action."
},

"Dragon-Dragon": {
  score: 70,
  overview: "Two Dragons create dramatic, ambitious partnerships full of grand visions and mutual admiration. Both understand each other's need for recognition and achievement. However, competition for attention and leadership can create power struggles that overshadow cooperation.",
  firstSignDetails: "As a Dragon, you appreciate your partner's confidence and ambitious vision, though both of your needs for recognition and leadership may create competition. Your combined charisma and energy can achieve remarkable results when focused on shared goals.",
  secondSignDetails: "Your Dragon partner shares your confidence and grand ambitions, creating natural understanding of each other's drive for achievement. However, both of you may struggle with sharing the spotlight and may need to consciously support each other's individual successes."
},

"Snake-Snake": {
  score: 70,
  overview: "Two Snakes create deep, intuitive partnerships built on mutual understanding and shared appreciation for privacy and strategic thinking. Both value wisdom and careful planning. However, both may be overly secretive and suspicious, limiting emotional intimacy.",
  firstSignDetails: "As a Snake, you understand your partner's need for privacy and strategic approach to life. Both of you appreciate depth and careful consideration, though you may both need to work on being more open and trusting to achieve true intimacy.",
  secondSignDetails: "Your Snake partner shares your wisdom and strategic thinking, creating natural understanding of each other's complex nature. However, both of you may struggle with being too secretive or suspicious, potentially limiting the emotional closeness you both actually crave."
},

"Horse-Horse": {
  score: 70,
  overview: "Two Horses create energetic, adventurous partnerships full of excitement and shared love of freedom. Both understand each other's need for independence and variety. However, both may struggle with commitment and may lack the stability needed for long-term planning.",
  firstSignDetails: "As a Horse, you understand your partner's need for freedom and adventure, creating natural harmony around independence. Both of you love excitement and variety, though you may both need to work on building stability and commitment for long-term success.",
  secondSignDetails: "Your Horse partner shares your adventurous spirit and need for freedom, creating exciting partnerships full of shared adventures. However, both of you may struggle with routine commitments and may need external grounding to build lasting stability."
},

"Goat-Goat": {
  score: 70,
  overview: "Two Goats create gentle, artistic partnerships built on mutual sensitivity and shared appreciation for beauty and harmony. Both understand each other's emotional needs and creative nature. However, both may be overly dependent and avoid practical responsibilities.",
  firstSignDetails: "As a Goat, you'll find perfect understanding of each other's sensitive nature and artistic temperament. Both of you value harmony and beauty, though you may both need to work on developing more independence and handling practical matters more directly.",
  secondSignDetails: "Your Goat partner shares your gentle disposition and artistic sensitivity, creating naturally harmonious relationships. However, both of you may struggle with practical decisions and may need external support to handle life's more challenging aspects."
},

"Monkey-Monkey": {
  score: 70,
  overview: "Two Monkeys create lively, intellectually stimulating partnerships full of wit and shared adventures. Both understand each other's need for variety and mental stimulation. However, both may lack focus and consistency, potentially preventing long-term goal achievement.",
  firstSignDetails: "As a Monkey, you appreciate your partner's intelligence and adaptability, creating engaging partnerships full of intellectual stimulation. Both of you love variety and mental challenges, though you may both need to work on focus and follow-through for lasting success.",
  secondSignDetails: "Your Monkey partner shares your quick wit and love of variety, creating exciting relationships full of shared interests and adventures. However, both of you may struggle with sustained attention and may need to consciously build consistent habits and routines."
},

"Rooster-Rooster": {
  score: 70,
  overview: "Two Roosters create efficient, high-achieving partnerships built on shared standards and mutual respect for hard work. Both understand each other's need for order and quality. However, both can be overly critical and perfectionist, creating stressful environments.",
  firstSignDetails: "As a Rooster, you appreciate your partner's attention to detail and high standards, creating productive partnerships focused on quality results. Both of you value precision and hard work, though you may both need to practice gentleness and acceptance of imperfection.",
  secondSignDetails: "Your Rooster partner shares your commitment to excellence and attention to detail, creating efficient and successful collaborations. However, both of you may be overly critical of yourselves and each other, requiring conscious effort to be more accepting and supportive."
},

"Dog-Dog": {
  score: 70,
  overview: "Two Dogs create loyal, principled partnerships built on shared values and mutual trust. Both understand each other's need for honesty and justice. However, both can be overly pessimistic and cautious, potentially limiting growth and optimism in the relationship.",
  firstSignDetails: "As a Dog, you deeply appreciate your partner's loyalty and principled nature, creating relationships built on unwavering trust and shared moral values. Both of you value honesty and justice, though you may both need to work on maintaining optimism and taking calculated risks.",
  secondSignDetails: "Your Dog partner shares your commitment to loyalty and moral integrity, creating stable relationships based on mutual trust and respect. However, both of you may tend toward pessimism and overcaution, requiring conscious effort to maintain hope and embrace positive opportunities."
},

  "Rat-Rat": {
    score: 70,
    overview: "Two Rats understand each other's ambitions and resourceful nature. You share similar approaches to problem-solving and social navigation, creating mutual understanding. However, competition for resources or attention can create tension, and both may prioritize personal interests over the relationship during stressful times.",
    firstSignDetails: "As a Rat, you are intelligent, adaptable, and socially savvy. You excel at reading situations and people, using charm and wit to achieve your goals. Your resourcefulness helps you find opportunities others miss, though you can be overly cautious with trust and prone to anxiety about security.",
    secondSignDetails: "Your Rat partner shares your quick thinking and social intelligence. They understand your need for security and appreciate your strategic mind. However, they may also compete with you for social status or resources, and both of you might struggle with being overly critical of each other's methods."
  }
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
  const [searchParams] = useSearchParams();
  const [zodiacName1, setZodiacName1] = useState("");
  const [zodiacName2, setZodiacName2] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [compatibilityMessage, setCompatibilityMessage] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

// Auto-populate from URL parameters and calculate ONLY on initial load
useEffect(() => {
  const sign1FromUrl = searchParams.get('sign1');
  const sign2FromUrl = searchParams.get('sign2');
  
  if (sign1FromUrl && sign2FromUrl) {
    setZodiacName1(sign1FromUrl);
    setZodiacName2(sign2FromUrl);
    
    // Auto-calculate when coming from banner (only once)
    setTimeout(() => {
      handleCalculateFromUrl(sign1FromUrl, sign2FromUrl);
    }, 500);
  }
}, [searchParams]); // This only runs when URL params change, not when dropdowns change

// Add this new function after your existing handleCalculate function
const handleDropdownChange = (setter) => (value) => {
  setter(value);
  // Clear existing results when user manually changes dropdowns
  if (compatibilityScore !== null) {
    setCompatibilityScore(null);
    setCompatibilityMessage("");
  }
};

const handleCalculateFromUrl = (sign1, sign2) => {
  setIsCalculating(true);
  setCompatibilityScore(null);
  setCompatibilityMessage("");

  setTimeout(() => {
    const zodiac1 = getZodiacAnimalByName(sign1);
    const zodiac2 = getZodiacAnimalByName(sign2);

    if (zodiac1 && zodiac2) {
      const key = `${zodiac1.name}-${zodiac2.name}`;
      const reverseKey = `${zodiac2.name}-${zodiac1.name}`;
      
      let messageData;
      if (detailedCompatibilityMessages[key]) {
        messageData = detailedCompatibilityMessages[key];
      } else if (detailedCompatibilityMessages[reverseKey]) {
        messageData = detailedCompatibilityMessages[reverseKey];
      } else {
        // Fallback for any missing combinations
        let genericText = "A unique connection with its own special dynamics!";
        messageData = { score: 60, text: genericText };
      }
      
      setCompatibilityScore(messageData.score);
      setCompatibilityMessage(messageData.text);
    }
    setIsCalculating(false);
  }, 1000);
};

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
      if (detailedCompatibilityMessages[key]) {
        messageData = detailedCompatibilityMessages[key];
      } else if (detailedCompatibilityMessages[reverseKey]) {
        messageData = detailedCompatibilityMessages[reverseKey];
      } else {
        // Fallback for any missing combinations
        let genericText = "A unique connection with its own special dynamics!";
        messageData = { score: 60, text: genericText };
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
                <Select value={zodiacName1} onValueChange={handleDropdownChange(setZodiacName1)}>
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
                <Select value={zodiacName2} onValueChange={handleDropdownChange(setZodiacName2)}>
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
    className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-6"
  >
    <h2 className="text-2xl font-bold text-gold text-center">
      {zodiacName1} with {zodiacName2}
    </h2>
    
    {/* Score */}
    <div className="text-center">
      <div className={`text-5xl font-bold ${getScoreColor(compatibilityScore)}`}>
        {compatibilityScore}%
      </div>
    </div>

    {/* Check if detailed message exists */}
    {(() => {
      const detailedKey = `${zodiacName1}-${zodiacName2}`;
      const reverseDetailedKey = `${zodiacName2}-${zodiacName1}`;
      const detailedData = detailedCompatibilityMessages[detailedKey] || detailedCompatibilityMessages[reverseDetailedKey];
      
      if (detailedData) {
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Your Compatibility Overview</h3>
              <p className="text-gray-700">{detailedData.overview}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">You as a {zodiacName1}</h3>
              <p className="text-gray-700">{detailedData.firstSignDetails}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Your {zodiacName2} Partner</h3>
              <p className="text-gray-700">{detailedData.secondSignDetails}</p>
            </div>
          </div>
        );
      } else {
        // Fallback to original message
        return (
          <p className="text-lg text-black/80 text-center max-w-lg mx-auto">
            {compatibilityMessage}
          </p>
        );
      }
    })()}
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