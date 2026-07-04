// src/pages/AuraAnalysisPage.tsx
import React, { useState } from 'react';
import { Helmet } from "@/lib/helmet-shim";
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const questions = [
  {
    id: 1,
    question: "When you walk into a room full of strangers, you typically:",
    options: [
      { text: "Scan the room quietly and observe the energy before engaging", value: "indigo" },
      { text: "Feel excited and look for interesting conversations to join", value: "orange" },
      { text: "Seek out someone who looks like they need comfort or support", value: "green" },
      { text: "Feel confident and naturally draw people toward you", value: "red" },
    ],
  },
  {
    id: 2,
    question: "Your ideal weekend would involve:",
    options: [
      { text: "Reading, learning something new, or solving puzzles", value: "yellow" },
      { text: "Outdoor adventures, sports, or physical activities", value: "red" },
      { text: "Creative projects, art, or exploring new experiences", value: "purple" },
      { text: "Quiet reflection, meditation, or spiritual practices", value: "blue" },
    ],
  },
  {
    id: 3,
    question: "When making important decisions, you primarily rely on:",
    options: [
      { text: "Logical analysis and careful research", value: "yellow" },
      { text: "Gut feelings and intuitive insights", value: "purple" },
      { text: "How it will affect others and create harmony", value: "green" },
      { text: "What feels authentic and true to your core self", value: "blue" },
    ],
  },
  {
    id: 4,
    question: "People often come to you for:",
    options: [
      { text: "Honest communication and clear perspective", value: "blue" },
      { text: "Energy, motivation, and getting things done", value: "red" },
      { text: "Creative ideas and fun social experiences", value: "orange" },
      { text: "Emotional support and understanding", value: "green" },
    ],
  },
  {
    id: 5,
    question: "In stressful situations, your natural response is to:",
    options: [
      { text: "Step back and analyze the situation calmly", value: "indigo" },
      { text: "Take immediate action to resolve the problem", value: "red" },
      { text: "Look for innovative or unconventional solutions", value: "yellow" },
      { text: "Focus on maintaining inner peace and balance", value: "purple" },
    ],
  },
  {
    id: 6,
    question: "Your communication style tends to be:",
    options: [
      { text: "Direct, honest, and focused on truth", value: "blue" },
      { text: "Enthusiastic, expressive, and engaging", value: "orange" },
      { text: "Gentle, supportive, and healing", value: "green" },
      { text: "Thoughtful, insightful, and deeply meaningful", value: "indigo" },
    ],
  },
  {
    id: 7,
    question: "You feel most fulfilled when you're:",
    options: [
      { text: "Learning, teaching, or sharing knowledge", value: "yellow" },
      { text: "Creating something beautiful or meaningful", value: "purple" },
      { text: "Helping others grow and heal", value: "green" },
      { text: "Leading projects and making things happen", value: "red" },
    ],
  },
  {
    id: 8,
    question: "Your relationship with nature is best described as:",
    options: [
      { text: "Deeply connected - you feel recharged in natural settings", value: "green" },
      { text: "Adventurous - you love outdoor activities and challenges", value: "red" },
      { text: "Contemplative - nature inspires your thoughts and creativity", value: "purple" },
      { text: "Peaceful - natural settings help you find clarity and calm", value: "blue" },
    ],
  },
  {
    id: 9,
    question: "When it comes to change in your life, you:",
    options: [
      { text: "Embrace it with curiosity and intellectual interest", value: "yellow" },
      { text: "Feel energized and ready to take on new challenges", value: "red" },
      { text: "Approach it with creativity and see new possibilities", value: "orange" },
      { text: "Trust your intuition to guide you through transitions", value: "indigo" },
    ],
  },
  {
    id: 10,
    question: "Your friends would describe your energy as:",
    options: [
      { text: "Calming and wise - you bring peace to any situation", value: "blue" },
      { text: "Dynamic and inspiring - you motivate others to action", value: "red" },
      { text: "Bright and uplifting - you bring joy and optimism", value: "yellow" },
      { text: "Mysterious and intuitive - you see what others miss", value: "indigo" },
    ],
  },
];

const auraResults = {
  blue: {
    color: "Blue",
    meaning: "Your aura radiates the serene energy of blue, indicating exceptional communication abilities and deep spiritual awareness. Blue aura individuals are natural truth-seekers with powerful intuitive gifts. You possess the rare ability to express complex thoughts with clarity and compassion, making you a natural counselor and peacemaker. Your calm presence soothes others, and your connection to higher wisdom allows you to see situations from elevated perspectives.",
    traits: ["Exceptional communication skills", "Strong intuition and psychic abilities", "Natural peacemaker and mediator", "Deep spiritual connection", "Calming influence on others"],
    challenges: ["May become overwhelmed by others' emotions", "Sometimes too trusting", "Can withdraw when overstimulated"],
    colorCode: "from-blue-400 to-blue-600",
    chakra: "Throat Chakra (Vishuddha)",
  },
  red: {
    color: "Red",
    meaning: "Your aura pulses with the powerful energy of red, signifying intense life force and unwavering determination. Red aura personalities are natural leaders with exceptional physical vitality and courage. You possess an infectious enthusiasm that motivates others and the strength to overcome any obstacle. Your grounded nature and passion for life make you a catalyst for positive change and achievement.",
    traits: ["Strong leadership abilities", "High physical energy and vitality", "Courage and determination", "Passion and enthusiasm", "Ability to motivate others"],
    challenges: ["May become impatient or aggressive", "Can be overwhelming to sensitive individuals", "Tendency toward impulsiveness"],
    colorCode: "from-red-400 to-red-600",
    chakra: "Root Chakra (Muladhara)",
  },
  orange: {
    color: "Orange",
    meaning: "Your aura glows with vibrant orange energy, revealing exceptional creativity and social magnetism. Orange aura individuals are natural innovators with an infectious zest for life. You possess remarkable adaptability and the ability to inspire others through your enthusiasm and original thinking. Your warm, approachable nature draws people to you, making you a natural connector and community builder.",
    traits: ["Exceptional creativity and innovation", "Natural social connector", "Adaptability and flexibility", "Enthusiasm and optimism", "Ability to inspire others"],
    challenges: ["May struggle with commitment", "Can become scattered or unfocused", "Sometimes avoids deeper emotional work"],
    colorCode: "from-orange-400 to-orange-600",
    chakra: "Sacral Chakra (Svadhisthana)",
  },
  green: {
    color: "Green",
    meaning: "Your aura emanates the healing energy of green, indicating profound compassion and natural healing abilities. Green aura personalities are the nurturers of the world, with an innate ability to sense and heal emotional wounds. You possess exceptional empathy and a deep connection to nature's wisdom. Your presence brings growth, renewal, and harmony wherever you go.",
    traits: ["Natural healing abilities", "Deep empathy and compassion", "Strong connection to nature", "Ability to promote growth in others", "Harmonizing influence"],
    challenges: ["May absorb others' negative emotions", "Can neglect own needs while helping others", "Sometimes becomes overwhelmed by world suffering"],
    colorCode: "from-green-400 to-green-600",
    chakra: "Heart Chakra (Anahata)",
  },
  yellow: {
    color: "Yellow",
    meaning: "Your aura radiates brilliant yellow energy, signifying exceptional intelligence and natural teaching abilities. Yellow aura individuals are intellectual powerhouses with an insatiable thirst for knowledge. You possess remarkable analytical skills and the ability to simplify complex concepts for others. Your optimistic outlook and mental clarity make you a natural problem-solver and inspiring educator.",
    traits: ["High intellectual capacity", "Natural teaching and mentoring abilities", "Analytical and logical thinking", "Optimistic and cheerful disposition", "Excellent problem-solving skills"],
    challenges: ["May overanalyze situations", "Can become impatient with slower thinkers", "Sometimes lacks emotional depth"],
    colorCode: "from-yellow-400 to-yellow-600",
    chakra: "Solar Plexus Chakra (Manipura)",
  },
  purple: {
    color: "Purple",
    meaning: "Your aura shimmers with mystical purple energy, revealing profound spiritual gifts and visionary abilities. Purple aura individuals are natural mystics with exceptional creative and psychic abilities. You possess a unique connection to higher dimensions and the ability to see beyond ordinary reality. Your artistic nature and spiritual wisdom inspire others to explore deeper truths about existence.",
    traits: ["Strong psychic and intuitive abilities", "Exceptional creativity and artistic talent", "Deep spiritual connection", "Visionary thinking", "Ability to inspire spiritual growth"],
    challenges: ["May feel disconnected from mundane reality", "Can be misunderstood by others", "Sometimes struggles with practical matters"],
    colorCode: "from-purple-400 to-purple-600",
    chakra: "Crown Chakra (Sahasrara)",
  },
  indigo: {
    color: "Indigo",
    meaning: "Your aura resonates with the profound energy of indigo, indicating exceptional intuitive wisdom and psychic sensitivity. Indigo aura personalities are old souls with remarkable ability to perceive hidden truths and understand complex human emotions. You possess deep empathic abilities and often serve as a bridge between the physical and spiritual worlds. Your insights and wisdom are far beyond your years.",
    traits: ["Exceptional psychic and empathic abilities", "Deep wisdom and spiritual insight", "Strong sense of justice and truth", "Ability to see through deception", "Natural counseling abilities"],
    challenges: ["May feel overwhelmed by psychic sensitivity", "Can become isolated due to deep sensitivity", "Sometimes struggles with emotional boundaries"],
    colorCode: "from-indigo-400 to-indigo-600",
    chakra: "Third Eye Chakra (Ajna)",
  },
};

export default function AuraAnalysisPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (value) => {
    setSelectedAnswer(value);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setAnswers({ ...answers, [currentQuestionIndex]: value });
      setSelectedAnswer(null);
      setIsTransitioning(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateAura();
      }
    }, 500);
  };

  const calculateAura = () => {
    const counts = {};
    Object.values(answers).forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

    const mostCommonColor = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    setTimeout(() => {
      setResult(auraResults[mostCommonColor]);
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setSelectedAnswer(null);
    setIsTransitioning(false);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 text-black min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Aura Analysis - Discover Your Energy Color | Feng Shui & Beyond</title>
        <meta name="description" content="Take our free aura analysis quiz to discover your dominant energy color. Learn what your aura reveals about your personality, emotions, and spiritual energy." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/games-fun/aura-analysis" />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 sm:py-12 mt-12 max-w-6xl overflow-x-hidden">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 px-2"
        >
          <div className="flex items-center justify-center mb-4 flex-wrap">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mr-2" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent text-center">
              Discover Your Aura
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 ml-2" />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Explore the energy that surrounds you through our comprehensive aura analysis. 
            Answer 10 thoughtful questions to reveal your dominant aura color and its spiritual significance.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {result ? (
            // Result Display
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="max-w-4xl mx-auto px-2 sm:px-4"
            >
              <Card className={`bg-gradient-to-br ${result.colorCode} text-white shadow-2xl overflow-hidden relative mx-2 sm:mx-0`}>
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full blur-3xl"></div>
                </div>
                
                <CardHeader className="relative z-10 text-center pb-4 px-4 sm:px-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    Your Aura is {result.color}
                  </CardTitle>
                  <p className="text-base sm:text-lg opacity-90">{result.chakra}</p>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4 sm:space-y-6 px-4 sm:px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">Your Aura Meaning</h3>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
                      {result.meaning}
                    </p>
                  </motion.div>

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-3">Your Gifts & Traits</h3>
                      <ul className="space-y-2">
                        {result.traits.map((trait, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-300 mr-2 flex-shrink-0 mt-1">✦</span>
                            <span className="text-white/90 text-sm sm:text-base leading-relaxed">{trait}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-3">Growth Areas</h3>
                      <ul className="space-y-2">
                        {result.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-300 mr-2 flex-shrink-0 mt-1">◦</span>
                            <span className="text-white/90 text-sm sm:text-base leading-relaxed">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-center pt-4"
                  >
                    <Button 
                      onClick={resetQuiz} 
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Take Quiz Again
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Question Display
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto px-2 sm:px-4"
            >
              {/* Progress Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 mx-2 sm:mx-0">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                </CardHeader>
                
                <CardContent className="px-4 sm:px-6">
                  <motion.h3 
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8 text-center text-gray-800 leading-relaxed px-2"
                  >
                    {questions[currentQuestionIndex].question}
                  </motion.h3>
                  
                  <div className="grid gap-3 sm:gap-4">
                    {questions[currentQuestionIndex].options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full"
                      >
                        <Button
                          onClick={() => handleAnswer(option.value)}
                          disabled={isTransitioning}
                          className={`w-full p-4 sm:p-6 text-left bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-purple-300 transition-all duration-300 rounded-xl group text-sm sm:text-base md:text-lg min-h-0 h-auto whitespace-normal ${
                            selectedAnswer === option.value ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-400' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between w-full">
                            <span className="leading-relaxed text-left break-words pr-2 flex-1">
                              {option.text}
                            </span>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-1" />
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:mt-12 text-center max-w-2xl mx-auto px-2 sm:px-4"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 mx-2 sm:mx-0">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              <strong className="text-orange-600">Disclaimer:</strong> This aura analysis is based on spiritual and metaphysical traditions, not scientific evidence. The results are intended for entertainment and self-reflection purposes only. Individual experiences may vary, and this tool should not be used as a substitute for professional psychological or medical advice.
            </p>
          </div>
        </motion.div>

        {/* Evergreen SEO content — always rendered in the static HTML */}
        <section className="mt-16 max-w-4xl mx-auto px-2 sm:px-4 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            What Is an Aura?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            An <strong>aura</strong> is the subtle field of energy said to surround every living being. In many
            spiritual traditions, this energy radiates in colors that reflect your emotions, personality, and
            state of mind. Aura readers believe the dominant color of your aura reveals your core nature — how you
            think, love, communicate, and move through the world. Our free aura quiz asks ten questions about your
            instincts and preferences to estimate your <strong>dominant aura color</strong> and what it means.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-10 mb-6">
            The 7 Aura Colors and Their Meanings
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            {Object.values(auraResults).map((a) => (
              <div key={a.color} className={`rounded-xl p-5 text-white bg-gradient-to-br ${a.colorCode}`}>
                <h3 className="text-lg font-bold mb-1">{a.color} Aura</h3>
                <p className="text-xs font-semibold opacity-90 mb-2">{a.chakra}</p>
                <p className="text-sm leading-relaxed opacity-95">{a.meaning}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-10 mb-4">
            Auras and the Chakras
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            Each aura color is closely tied to one of the body's seven main <strong>chakras</strong> — the energy
            centers running from the base of the spine to the crown of the head. A red aura resonates with the Root
            Chakra (grounding and vitality), green with the Heart Chakra (love and healing), blue with the Throat
            Chakra (communication), and purple with the Crown Chakra (spiritual connection). Understanding which
            chakra your aura color relates to can guide your meditation, energy work, and self-care.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-10 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Can your aura color change?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes. Many believe your aura shifts with your mood, health, and life circumstances. You may have a
                stable "core" color while temporary colors come and go with your emotional state.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Can I have more than one aura color?</h3>
              <p className="text-gray-600 leading-relaxed">
                Often, yes. Most people have a dominant color plus secondary hues. This quiz highlights your
                strongest color, but you may recognise traits from several.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Is aura reading scientific?</h3>
              <p className="text-gray-600 leading-relaxed">
                No — aura reading is a spiritual and metaphysical practice, not a scientific one. This quiz is meant
                for entertainment, reflection, and a little self-discovery.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/meditation" className="text-purple-600 font-semibold hover:underline">
              Explore guided meditation →
            </Link>
            <Link to="/games-fun" className="text-purple-600 font-semibold hover:underline">
              More games &amp; fun tools →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}