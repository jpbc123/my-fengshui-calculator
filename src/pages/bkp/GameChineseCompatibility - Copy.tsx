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

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Games", path: "/games" },
  { label: "Friendship Compatibility (Chinese Zodiac)" },
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
  // --- Perfect Matches (Score 90+) ---
  "Rat-Dragon": { score: 90, text: `A magical connection! The Rat's quick wit and the Dragon's powerful presence create a dynamic duo. You both admire each other's talents and ambition, making for an unstoppable team in life and love.` },
  "Dragon-Rat": { score: 90, text: `A magical connection! The Dragon's power and the Rat's intelligence form an unstoppable duo. You inspire each other to great heights and share a profound, intuitive understanding.` },
  "Monkey-Rat": { score: 90, text: `A cosmic connection! The Monkey and the Rat are part of the same zodiac triangle, and their bond is strong and effortless. You share a common language of wit, intelligence, and playful energy, making you an unstoppable team.` },
  "Rat-Monkey": { score: 85, text: `An exceptionally clever pairing. The Rat and Monkey are both intelligent and playful, sharing a zest for life and a love for adventure. Your conversations are sharp, and your bond is built on mutual respect and endless fun.` },
  "Ox-Snake": { score: 90, text: `A deep and tranquil bond. The Snake finds security in the Ox's steadfast nature, while the Ox is captivated by the Snake's wisdom and quiet charm. You create a stable, peaceful sanctuary together.` },
  "Snake-Ox": { score: 90, text: `A deep and tranquil bond. The Ox's steady support provides a perfect foundation for the Snake's deep wisdom. You share a mutual desire for security and a quiet, profound understanding.` },
  "Rooster-Ox": { score: 90, text: `A match of profound respect and dedication. The Rooster's flair is grounded by the Ox's stability. You are a practical, goal-oriented couple who will build a strong, successful life together through loyalty and hard work.` },
  "Ox-Rooster": { score: 85, text: `A dedicated and hardworking pair. The Ox and Rooster appreciate hard work and a structured life. You both share a practical approach to challenges and a loyalty that is as strong as a rock. Your relationship is built to last.` },
  "Tiger-Horse": { score: 90, text: `An incredibly passionate and dynamic duo. The Horse's energy matches the Tiger's bravery and enthusiasm. You both love freedom and adventure, but when you unite, your journey together is full of excitement and profound joy.` },
  "Horse-Tiger": { score: 90, text: `An incredibly passionate and dynamic duo. The Horse's energy matches the Tiger's bravery and enthusiasm. You both love freedom and adventure, but when you unite, your journey together is full of excitement and profound joy.` },
  "Dog-Tiger": { score: 90, text: `A courageous and protective union. The Dog's loyalty provides a safe haven for the Tiger's wild spirit. Together, you form a powerful and trusting partnership, united by a deep sense of justice and mutual admiration.` },
  "Tiger-Dog": { score: 85, text: `A noble and loyal friendship. The Tiger's charisma is complemented by the Dog's unwavering loyalty and honesty. You both have a strong sense of justice and support each other's ideals, creating a bond based on trust and shared purpose.` },
  "Rabbit-Goat": { score: 90, text: `A gentle and loving union. Both the Rabbit and the Goat are sensitive and appreciate peace and harmony. You understand each other's emotional needs instinctively, creating a home that is a true haven of comfort and mutual adoration.` },
  "Goat-Rabbit": { score: 90, text: `A gentle and loving union. Both the Rabbit and the Goat are sensitive and appreciate peace and harmony. You understand each other's emotional needs instinctively, creating a home that is a true haven of comfort and mutual adoration.` },
  "Pig-Rabbit": { score: 90, text: `A deeply affectionate and peaceful match. The Pig's warm-hearted nature and the Rabbit's gentle spirit create a home of serenity and comfort. You both avoid conflict, opting for a life filled with kindness and mutual care.` },
  "Rabbit-Pig": { score: 85, text: `A truly blissful match. The Rabbit's elegance and the Pig's generosity create a compassionate and happy relationship. You both seek peace and security, and together, you find a world filled with kindness and simple pleasures.` },

  // --- Good Matches (Score 70-85) ---
  "Rat-Ox": { score: 80, text: `A well-balanced partnership. The Rat's quick thinking and the Ox's steady determination make for a great team. While you may have different approaches, you both seek stability and loyalty, which forms a strong foundation.` },
  "Ox-Rat": { score: 80, text: `A well-balanced partnership. The Ox's reliability provides a firm foundation for the Rat's ambition. You are a power couple of stability and wit, making your partnership both secure and dynamic.` },
  "Rat-Pig": { score: 70, text: `A harmonious and friendly match. The Rat is attracted to the Pig's warm and generous spirit, while the Pig is charmed by the Rat's intelligence. Your relationship is comfortable and filled with laughter.` },
  "Pig-Rat": { score: 70, text: `A harmonious and friendly match. The Pig's warm-hearted nature provides comfort for the Rat's ambitious mind. You share a mutual appreciation for life's simple pleasures, making your bond deeply satisfying.` },
  "Rat-Tiger": { score: 65, text: `An intriguing pairing with potential. The Rat's cautious nature can be a good counterbalance to the Tiger's impulsive spirit. You both need to learn to appreciate each other's very different approaches to life.` },
  "Tiger-Rat": { score: 65, text: `An intriguing pairing with potential. The Tiger's boldness can inspire the Rat to be more adventurous, while the Rat's wisdom can help guide the Tiger. Your different strengths can complement each other well.` },
  "Rat-Snake": { score: 75, text: `A clever and intuitive bond. The Rat's wit is matched by the Snake's wisdom. You both appreciate strategy and depth, and can form a relationship built on intellectual curiosity and shared secrets.` },
  "Snake-Rat": { score: 70, text: `A clever and intuitive bond. The Snake's calm wisdom provides a great anchor for the Rat's energetic mind. You both appreciate strategy and can build a relationship of deep trust and mutual understanding.` },
  "Rat-Rooster": { score: 40, text: `A mix of sparks and conflict. The Rat's quick-witted nature can clash with the Rooster's proud, direct style. While you may have disagreements, you share a strong social energy that can make things exciting.` },
  "Rooster-Rat": { score: 30, text: `A mix of sparks and conflict. The Rooster's need for attention can irritate the discreet Rat. You'll need to work on patience and communication, but you can find a common ground in your intelligence and social savvy.` },
  "Rat-Dog": { score: 60, text: `A loyal and friendly partnership. The Rat's social charm is appreciated by the honest Dog. You both value trust and security, creating a comfortable and safe environment for each other.` },
  "Dog-Rat": { score: 60, text: `A loyal and friendly partnership. The Dog's loyalty provides a safe haven for the Rat's ambitious nature. You both seek security and can build a strong bond based on sincerity and shared goals.` },
  "Ox-Rabbit": { score: 65, text: `A stable and gentle pairing. The Rabbit's peaceful nature can soften the Ox's stubbornness, while the Ox provides a stable, dependable home for the Rabbit. Your relationship is built on quiet strength and mutual respect.` },
  "Rabbit-Ox": { score: 65, text: `A stable and gentle pairing. The Rabbit's peaceful nature can soften the Ox's determined spirit. You both value loyalty and stability, creating a home that is secure and harmonious.` },
  "Ox-Monkey": { score: 75, text: `An interesting and beneficial partnership. The Ox provides the steady foundation that the curious Monkey needs to explore. You bring out each other's best qualities, with the Monkey offering humor and the Ox offering security.` },
  "Monkey-Ox": { score: 60, text: `An interesting and beneficial partnership. The Monkey's playful nature can teach the serious Ox to lighten up. While you have different methods, you can form a surprisingly strong bond through mutual trust and respect.` },
  "Ox-Pig": { score: 65, text: `A solid and supportive match. The Ox's reliability and the Pig's generosity create a comfortable and secure relationship. You both value family and home life, making your shared world a peaceful haven.` },
  "Pig-Ox": { score: 60, text: `A solid and supportive match. The Pig's gentle spirit is appreciated by the hardworking Ox. You both value stability and comfort, making your home a peaceful and well-managed place.` },
  "Tiger-Dragon": { score: 60, text: `A dynamic and powerful pair. The Tiger's courage and the Dragon's ambition create a high-energy relationship. You are both natural leaders, which can lead to conflict, but you also inspire each other to achieve great things.` },
  "Dragon-Tiger": { score: 60, text: `A dynamic and powerful pair. The Dragon's vision and the Tiger's charisma can lead to immense success. You are a couple of grand gestures and bold moves, but must learn to share the spotlight to avoid clashes.` },
  "Tiger-Goat": { score: 75, text: `A compassionate and understanding bond. The Goat's gentle nature can soothe the Tiger's restless spirit. The Tiger, in turn, provides a sense of security and protection for the sensitive Goat. You fill in each other's emotional gaps.` },
  "Goat-Tiger": { score: 40, text: `A compassionate and understanding bond. The Goat's gentle nature can be a calming force for the impulsive Tiger. You both need to be patient with each other's very different approaches to life and conflict.` },
  "Tiger-Rooster": { score: 50, text: `A fiery and spirited connection. The Tiger's bold energy can be both attracted to and annoyed by the Rooster's proud, assertive nature. You'll need to find a balance between the need for freedom and the desire for order.` },
  "Rooster-Tiger": { score: 60, text: `A fiery and spirited connection. The Rooster's diligence can help bring order to the Tiger's chaotic life. You both have strong personalities and must respect each other's space to find harmony.` },
  "Tiger-Pig": { score: 80, text: `A deeply loyal and warm-hearted match. The Pig's easygoing generosity can soothe the Tiger's intense nature, while the Tiger provides an exciting and adventurous life for the Pig. You form a powerful and trusting bond.` },
  "Pig-Tiger": { score: 80, text: `A deeply loyal and warm-hearted match. The Pig's easygoing generosity can soothe the Tiger's intense nature, while the Tiger provides an exciting and adventurous life for the Pig. You form a powerful and trusting bond.` },
  "Rabbit-Ox": { score: 65, text: `A stable and gentle pairing. The Rabbit's peaceful nature can soften the Ox's stubbornness, while the Ox provides a stable, dependable home for the Rabbit. Your relationship is built on quiet strength and mutual respect.` },
  "Ox-Rabbit": { score: 60, text: `A stable and gentle pairing. The Ox's reliability provides a secure foundation for the peaceful Rabbit. You both value a calm home life and a loving, dependable partnership.` },
  "Rabbit-Snake": { score: 60, text: `A thoughtful and cautious alliance. The Rabbit's gentle nature can be a calming influence on the secretive Snake. You both share a love for peace and can build a relationship of quiet understanding.` },
  "Snake-Rabbit": { score: 60, text: `A thoughtful and cautious alliance. The Snake's wisdom can provide a sense of security for the cautious Rabbit. You both appreciate a private, peaceful life and can form a bond of deep, silent trust.` },
  "Rabbit-Monkey": { score: 75, text: `A stimulating and fun dynamic. The Monkey's mischievous energy can bring excitement to the Rabbit's life, while the Rabbit provides a gentle and kind presence that the Monkey appreciates. You are a great mix of fun and stability.` },
  "Monkey-Rabbit": { score: 40, text: `A stimulating and fun dynamic. The Monkey's playful nature may feel unsettling to the peace-loving Rabbit. You can learn from each other, but it will require significant effort to find common ground.` },
  "Dragon-Horse": { score: 70, text: `A vibrant and active partnership. The Dragon's energy and the Horse's spirit are a great match for a life full of action. You both appreciate freedom and excitement, and can inspire each other to live life to the fullest.` },
  "Horse-Dragon": { score: 60, text: `A vibrant and active partnership. The Horse's energetic nature is a great match for the Dragon's ambition. You are a pair of adventurers who can achieve great things, but you must work on communicating your deeper feelings.` },
  "Dragon-Goat": { score: 65, text: `A gentle and inspiring bond. The Dragon's power can provide a sense of safety for the sensitive Goat. In return, the Goat's kindness and artistic spirit can soften the Dragon's ambition. You make a surprisingly balanced team.` },
  "Goat-Dragon": { score: 65, text: `A gentle and inspiring bond. The Goat's sensitive nature is often charmed by the Dragon's power and presence. You both can learn to appreciate each other's unique strengths, finding harmony in your differences.` },
  "Dragon-Pig": { score: 75, text: `A powerful and benevolent partnership. The Dragon's grand vision is supported by the Pig's generous and loyal nature. You can achieve great things together while building a warm, happy home.` },
  "Pig-Dragon": { score: 65, text: `A powerful and benevolent partnership. The Pig's kind-hearted nature can soften the Dragon's intense ambition. You form a team that is both powerful in the world and gentle at home.` },
  "Snake-Horse": { score: 40, text: `A match of cautious independence. The Snake's secretive nature is often at odds with the Horse's open and free-spirited lifestyle. You will need to build trust and find a balance between privacy and freedom to make this work.` },
  "Horse-Snake": { score: 40, text: `A match of cautious independence. The Horse's need for freedom can feel unsettling to the reserved Snake. Your different approaches to life will be a constant challenge, requiring a great deal of communication.` },
  "Snake-Goat": { score: 50, text: `A deep but complex connection. The Goat's emotional nature may struggle with the Snake's need for emotional distance. However, you are both intuitive and can form a bond of deep understanding if you work on open communication.` },
  "Goat-Snake": { score: 70, text: `A deep but complex connection. The Goat's sensitive nature can be a calming influence on the contemplative Snake. You both appreciate beauty and wisdom, and can build a relationship of deep, intuitive trust.` },
  "Snake-Dog": { score: 75, text: `A loyal and intriguing pairing. The Dog's sincerity is respected by the intelligent Snake. While the Snake may be private, the Dog's loyalty provides a sense of trust, creating a bond of quiet strength.` },
  "Dog-Snake": { score: 75, text: `A loyal and intriguing pairing. The Dog's directness can be a good counterbalance to the Snake's secretive nature. You both value intelligence and loyalty, making for a relationship built on a solid, trusting foundation.` },
  "Horse-Goat": { score: 80, text: `A creative and passionate alliance. The Goat’s artistic soul and the Horse’s spirited personality blend beautifully. Your relationship is full of emotional depth and mutual support, making you feel understood and inspired.` },
  "Goat-Horse": { score: 80, text: `A creative and passionate alliance. The Horse's energetic nature is balanced by the Goat's gentle soul. You inspire each other to explore new interests, building a bond that is both spirited and nurturing.` },
  "Horse-Monkey": { score: 65, text: `A spirited and playful match. The Horse's adventurous nature is a perfect fit for the Monkey's restless curiosity. You both love fun and excitement, but may need to work on building a stable, long-term commitment.` },
  "Monkey-Horse": { score: 65, text: `A spirited and playful match. The Monkey's cleverness is admired by the energetic Horse. You are both social and adventurous, making for a fun-filled relationship, but you will need to prioritize a deeper emotional bond.` },
  "Horse-Rooster": { score: 75, text: `A lively and dynamic pairing. The Horse's enthusiasm is a great match for the Rooster's bold personality. You are both social and confident, and can achieve great things together by balancing the Horse's free spirit with the Rooster's practicality.` },
  "Rooster-Horse": { score: 65, text: `A lively and dynamic pairing. The Rooster's attention to detail is a good counterbalance to the Horse's impulsive nature. You can learn a lot from each other, creating a relationship that is both exciting and well-managed.` },
  "Goat-Monkey": { score: 60, text: `A complex but rewarding dynamic. The Goat's sensitive nature is often charmed by the Monkey's clever wit. You bring different perspectives to life, and can learn to appreciate your distinct approaches.` },
  "Monkey-Goat": { score: 70, text: `A complex but rewarding dynamic. The Monkey's playful nature can bring joy to the Goat, while the Goat's sensitivity can teach the Monkey empathy. You are a mix of lighthearted fun and deep emotional connection.` },
  "Goat-Pig": { score: 85, text: `A match filled with compassion and understanding. The Goat's gentle nature is a perfect fit for the Pig's warm heart. You both prioritize kindness and support, creating a deeply nurturing and tender relationship.` },
  "Pig-Goat": { score: 85, text: `A match filled with compassion and understanding. The Pig's generosity and the Goat's artistic soul make for a creative and supportive relationship. You bring out the best in each other, finding joy in shared creativity and emotional warmth.` },
  "Monkey-Pig": { score: 30, text: `A challenging pairing with potential. The Pig's sincere and trusting nature may be hurt by the Monkey's mischievous tricks. You have very different values, but can build a bond if you prioritize open communication and honesty.` },
  "Pig-Monkey": { score: 30, text: `A challenging pairing with potential. The Pig's kind-hearted nature can feel overwhelmed by the Monkey's restless energy and love for fun. To find harmony, you must both learn to appreciate your differences and be patient.` },
  "Rooster-Pig": { score: 70, text: `A cooperative and practical partnership. The Rooster appreciates the Pig’s easygoing nature, and the Pig respects the Rooster’s diligence. You can form a stable home and a successful shared life.` },
  "Pig-Rooster": { score: 75, text: `A cooperative and practical partnership. The Pig's gentle nature brings peace to the Rooster's meticulous world. You share a mutual desire for a comfortable and orderly life, making you a strong, productive team.` },
  "Dog-Rat": { score: 60, text: `A loyal and friendly partnership. The Dog's loyalty provides a safe haven for the Rat's ambitious nature. You both seek security and can build a strong bond based on sincerity and shared goals.` },
  "Rat-Dog": { score: 60, text: `A loyal and friendly partnership. The Rat's social charm is appreciated by the honest Dog. You both value trust and security, creating a comfortable and safe environment for each other.` },

  // --- Same Sign Compatibility ---
  "Rat-Rat": { score: 70, text: `A strong and intelligent bond. Two Rats understand each other perfectly, sharing a love for social life and a keen eye for a good deal. Your similar outlooks make for a comfortable and dynamic partnership.` },
  "Ox-Ox": { score: 70, text: `A reliable and steadfast pair. Two Oxen find comfort in each other's unwavering loyalty and stability. Your relationship is built on a foundation of trust, practicality, and mutual hard work.` },
  "Tiger-Tiger": { score: 70, text: `A passionate but potentially volatile match. Two Tigers share a love for adventure and a powerful ambition. You will have to learn to share the spotlight to avoid conflict, but your bond is full of exciting energy.` },
  "Rabbit-Rabbit": { score: 70, text: `A peaceful and gentle union. Two Rabbits create a calm, harmonious life together, filled with comfort and beauty. You both avoid conflict, but you may need to rely on each other to face challenges head-on.` },
  "Dragon-Dragon": { score: 70, text: `A magnificent but challenging partnership. Two Dragons share a grand vision and an immense ego. You both inspire each other to great heights, but you must learn to compromise and share the leadership.` },
  "Snake-Snake": { score: 70, text: `A deeply mysterious and intuitive bond. Two Snakes understand each other's complex and enigmatic natures. Your relationship is built on a quiet, intellectual understanding and a shared need for privacy and security.` },
  "Horse-Horse": { score: 70, text: `An energetic and free-spirited pair. Two Horses love adventure and a fast-paced life. You'll never be bored, but you must make a conscious effort to build a stable home life and a deeper emotional connection.` },
  "Goat-Goat": { score: 70, text: `A compassionate and imaginative union. Two Goats understand each other's emotional needs and love for creativity. You create a gentle and nurturing world together, but you may need to find a practical anchor.` },
  "Monkey-Monkey": { score: 70, text: `A fun and mischievous pairing. Two Monkeys share a sharp wit and a love for a good challenge. Your relationship is full of humor and unexpected adventures, but you will need to learn to be serious when needed.` },
  "Rooster-Rooster": { score: 70, text: `A brilliant and meticulous match. Two Roosters are proud and hardworking, sharing a love for order and efficiency. You admire each other's confidence, and together, you can achieve remarkable things.` },
  "Dog-Dog": { score: 70, text: `A loyal and honest bond. Two Dogs share a strong sense of justice and a deep-seated loyalty. You provide a safe, trustworthy space for each other, and your relationship is built on a foundation of mutual respect.` },
  "Pig-Pig": { score: 70, text: `A warm and comfortable union. Two Pigs love peace, comfort, and good company. You share a generous and trusting nature, making your life together feel secure, happy, and full of mutual affection.` },
};

const getZodiacAnimalByName = (name) => {
  return chineseZodiacAnimals.find(animal => animal.name === name);
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
              onClick={handleCalculate}
              disabled={isCalculating || !zodiacName1 || !zodiacName2}
              className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-gold bg-gold hover:bg-yellow-400"
            >
              {isCalculating ? "Calculating..." : "Calculate Compatibility"}
              <Sparkles size={20} className="ml-2" />
            </Button>

            {/* Added Link to Zodiac Calculator */}
            <div className="text-center text-sm text-black/60 mt-4">
              <p>
                Not sure of your Chinese Zodiac sign? Check out our{" "}
                <Link to="/chinese-zodiac-calculator" className="underline text-gold font-semibold hover:text-yellow-500 transition-colors">
                  Chinese Zodiac Calculator
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {compatibilityScore !== null && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-6"
              >
                <h2 className="text-2xl font-bold text-gold text-center">
                  Your Chinese Zodiac Compatibility
                </h2>
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Centered Result Number */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-yellow-300 text-black text-5xl font-bold shadow-xl border-2 border-gold"
                  >
                    {compatibilityScore} / 100
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-lg text-black/80 font-medium text-center whitespace-pre-line"
                  >
                    {compatibilityMessage}
                  </motion.p>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChineseZodiacCompatibility;