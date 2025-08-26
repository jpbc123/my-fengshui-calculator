// src/pages/AuraAnalysisPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Assuming you have these components
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const questions = [
  {
    id: 1,
    question: "When faced with a challenge, your natural tendency is to:",
    options: [
      { text: "Take a calm, strategic approach.", value: "blue" },
      { text: "Tackle it head-on with passion.", value: "red" },
      { text: "Look for a creative and unique solution.", value: "orange" },
      { text: "Seek guidance from your intuition.", value: "purple" },
    ],
  },
  {
    id: 2,
    question: "You feel most energized when:",
    options: [
      { text: "Spending time in nature or healing others.", value: "green" },
      { text: "Learning something new or engaging in debate.", value: "yellow" },
      { text: "Socializing and connecting with friends.", value: "orange" },
      { text: "Meditating or reflecting on life's mysteries.", value: "indigo" },
    ],
  },
  {
    id: 3,
    question: "Which word best describes your inner state right now?",
    options: [
      { text: "Peaceful", value: "blue" },
      { text: "Excited", value: "red" },
      { text: "Curious", value: "yellow" },
      { text: "Spiritual", value: "purple" },
    ],
  },
  {
    id: 4,
    question: "In a group setting, you tend to be the one who:",
    options: [
      { text: "Listens attentively and offers comfort.", value: "green" },
      { text: "Leads the conversation and inspires action.", value: "red" },
      { text: "Generates new ideas and sparks creativity.", value: "orange" },
      { text: "Observes quietly and offers insightful comments.", value: "indigo" },
    ],
  },
  {
    id: 5,
    question: "Your ideal way to unwind is by:",
    options: [
      { text: "Engaging in deep conversations or meditation.", value: "blue" },
      { text: "Pursuing an active hobby or physical activity.", value: "red" },
      { text: "Diving into a challenging book or puzzle.", value: "yellow" },
      { text: "Exploring your artistic side or trying new things.", value: "purple" },
    ],
  },
];

const auraResults = {
  blue: {
    color: "Blue",
    meaning: "Your aura is a beautiful shade of blue, indicating a calm, intuitive, and communicative nature. You possess a deep sense of peace and a natural ability to express yourself and connect with others on a profound level. You are a natural peacemaker.",
    colorCode: "bg-blue-500",
  },
  red: {
    color: "Red",
    meaning: "Your aura radiates with a strong red hue, signifying passion, high energy, and a connection to the physical world. You are driven, grounded, and fearless in the pursuit of your goals. You have a powerful life force and a desire for action.",
    colorCode: "bg-red-500",
  },
  orange: {
    color: "Orange",
    meaning: "Your aura shines with vibrant orange, a color of creativity, enthusiasm, and social connection. You are a natural creator who loves to have fun and inspire others. You are adaptable, charming, and always seek new adventures.",
    colorCode: "bg-orange-500",
  },
  green: {
    color: "Green",
    meaning: "Your aura is a nurturing green, which represents healing, growth, and compassion. You are a natural caregiver who feels deeply connected to nature and the well-being of others. You are a force for positive change and harmony.",
    colorCode: "bg-green-500",
  },
  yellow: {
    color: "Yellow",
    meaning: "Your aura glows with a brilliant yellow, symbolizing joy, intellect, and optimism. You are a bright and energetic individual with a thirst for knowledge. Your positive outlook is contagious, and you inspire those around you.",
    colorCode: "bg-yellow-500",
  },
  purple: {
    color: "Purple",
    meaning: "Your aura is a mystical purple, indicating a deep spiritual connection and high intuition. You are a visionary who is often drawn to the mysteries of the universe. You are creative, compassionate, and possess a unique perspective on life.",
    colorCode: "bg-purple-500",
  },
  indigo: {
    color: "Indigo",
    meaning: "Your aura holds the deep wisdom of indigo, signifying strong intuition and a powerful sense of empathy. You are a natural psychic and a deep thinker who feels the emotions of others acutely. You are drawn to spiritual knowledge and truth.",
    colorCode: "bg-indigo-500",
  },
};

export default function AuraAnalysisPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestionIndex]: value });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, calculate result
      calculateAura();
    }
  };

  const calculateAura = () => {
    const counts = {};
    Object.values(answers).forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

    const mostCommonColor = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    setResult(auraResults[mostCommonColor]);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12 mt-2">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">Discover Your Aura</h1>
          <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
            Take a short quiz to reveal your current aura color and what it says about your energy.
          </p>
        </div>

        {result ? (
          // Result Display
          <Card className="bg-gradient-to-br from-indigo-950 to-gray-900 text-white shadow-xl max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-gold text-2xl">
                Your Aura is <span className={`font-bold ${result.colorCode} px-2 py-1 rounded-md`}>{result.color}</span>!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white text-lg md:text-xl italic mb-6">
                {result.meaning}
              </p>
              <Button onClick={resetQuiz} className="bg-gold text-black hover:bg-gold/80 font-semibold px-8 py-2 rounded-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Question Display
          <Card className="bg-gray-100 text-black shadow-xl max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-gold text-2xl">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-6 text-center text-black"> {/* Ensured text-black for question */}
                {questions[currentQuestionIndex].question}
              </h3>
              <div className="flex flex-col space-y-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="bg-gray-200 text-gray-800 hover:bg-gold hover:text-black transition-colors duration-200 py-3 rounded-lg" // Added hover:bg-gold and hover:text-black
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-center text-gray-500 text-sm max-w-2xl mx-auto">
          <p>
            <strong className="text-red-500">Disclaimer:</strong> It's important to clarify that the "legitimacy" of the results would be based on the principles of new-age spirituality and not on scientific or medical evidence. This tool is for entertainment and self-reflection purposes only.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}