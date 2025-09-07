// src/pages/MorningMindfulness.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Heart, Target, Sunrise } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Morning Mindfulness" },
];

const MorningMindfulness = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);
  const [dailyIntention, setDailyIntention] = useState('');
  const [completedSections, setCompletedSections] = useState([]);

  // Create gentle chime sound
  const createChimeSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Gentle, uplifting chime
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  const morningActivities = [
    {
      id: 'breathing',
      title: "Mindful Morning Breathing",
      icon: <Sunrise className="w-6 h-6" />,
      description: "Start with conscious breathing to awaken your body and mind gently.",
      steps: [
        { text: "Find a comfortable seated position. Close your eyes or soften your gaze.", duration: 5 },
        { text: "Take a deep breath in through your nose for 4 counts, feeling your chest rise.", duration: 20 },
        { text: "Hold your breath gently for 2 counts, feeling the stillness within.", duration: 20 },
        { text: "Exhale slowly through your mouth for 6 counts, releasing any tension.", duration: 20 },
        { text: "Continue this rhythm, letting each breath bring you into the present moment.", duration: 20 }
      ]
    },
    {
      id: 'gratitude',
      title: "Gratitude Practice",
      icon: <Heart className="w-6 h-6" />,
      description: "Acknowledge three things you're grateful for to cultivate positivity.",
      interactive: true,
      steps: [
        { text: "Take a moment to connect with your heart and think about what you appreciate in your life.", duration: 15 },
        { text: "Reflect on something simple that brings you joy - perhaps the morning light, a comfortable bed, or a loved one.", duration: 15 },
        { text: "Consider a recent experience or achievement you're thankful for.", duration: 15 },
        { text: "Think of a person who has positively impacted your life and feel gratitude for their presence.", duration: 15 },
        { text: "Let these feelings of appreciation fill your entire being, setting a positive tone for your day.", duration: 15 }
      ]
    },
    {
      id: 'intention',
      title: "Daily Intention Setting",
      icon: <Target className="w-6 h-6" />,
      description: "Set a clear, positive intention for how you want to show up today.",
      interactive: true,
      steps: [
        { text: "Take three deep breaths and connect with your inner wisdom.", duration: 10 },
        { text: "Ask yourself: 'How do I want to feel today?' Listen to what arises.", duration: 10 },
        { text: "Consider: 'What kind of energy do I want to bring to my interactions?'", duration: 10 },
        { text: "Reflect on: 'What would make today feel meaningful and fulfilling?'", duration: 15 },
        { text: "Formulate your intention as a simple, positive statement you can carry with you.", duration: 15 }
      ]
    },
    {
      id: 'body-scan',
      title: "Gentle Body Awareness",
      icon: <Sun className="w-6 h-6" />,
      description: "Wake up your body with gentle awareness and appreciation.",
      steps: [
        { text: "Sit or lie comfortably and take a few deep breaths to center yourself.", duration: 5 },
        { text: "Starting from the top of your head, gently notice any sensations without judgment.", duration: 15 },
        { text: "Move your attention down through your face, neck, and shoulders, releasing any tension.", duration: 15 },
        { text: "Continue through your arms, chest, and torso, appreciating your body's strength.", duration: 15 },
        { text: "Finish by noticing your legs and feet, feeling gratitude for carrying you through life.", duration: 15 },
        { text: "Take a moment to appreciate your entire body and set an intention to treat it with kindness today.", duration: 10 }
      ]
    }
  ];

  const currentActivityData = morningActivities[currentActivity];

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      createChimeSound();
      if (currentStep < currentActivityData.steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setTimeLeft(currentActivityData.steps[currentStep + 1].duration);
        }, 1000);
      } else {
        setTimeout(() => {
          setIsActive(false);
          setIsCompleted(true);
          if (!completedSections.includes(currentActivityData.id)) {
            setCompletedSections(prev => [...prev, currentActivityData.id]);
          }
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentStep, currentActivityData, createChimeSound, completedSections]);

  const startActivity = () => {
    setCurrentStep(0);
    setTimeLeft(currentActivityData.steps[0].duration);
    setIsActive(true);
    setIsCompleted(false);
  };

  const nextActivity = () => {
    setCurrentActivity((prev) => (prev + 1) % morningActivities.length);
    resetActivity();
  };

  const selectActivity = (index) => {
    setCurrentActivity(index);
    resetActivity();
  };

  const resetActivity = () => {
    setCurrentStep(0);
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGratitudeChange = (index, value) => {
    const newGratitudeItems = [...gratitudeItems];
    newGratitudeItems[index] = value;
    setGratitudeItems(newGratitudeItems);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! ☀️";
    if (hour < 17) return "Good Afternoon! 🌤️";
    return "Good Evening! 🌅";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">
            Morning Mindfulness
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {getGreeting()}
            </h2>
            <p className="text-black/80">
              Start your day with intention, gratitude, and mindful awareness. 
              Choose from our morning practices to center yourself and set a positive tone for the day ahead.
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-6 px-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Morning Practice Progress
              </span>
              <span className="text-sm text-gray-600">
                {completedSections.length} of {morningActivities.length} completed
              </span>
            </div>
            <div className="flex gap-2">
              {morningActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                    completedSections.includes(activity.id) 
                      ? 'bg-green-500' 
                      : index === currentActivity 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Activity Selector */}
        <div className="max-w-3xl mx-auto mb-6 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {morningActivities.map((activity, index) => (
              <button
                key={activity.id}
                onClick={() => selectActivity(index)}
                className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                  currentActivity === index
                    ? 'bg-yellow-50 border-yellow-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                } ${completedSections.includes(activity.id) ? 'ring-2 ring-green-200' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded ${
                    currentActivity === index ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {activity.icon}
                  </div>
                  {completedSections.includes(activity.id) && (
                    <div className="text-green-600 text-sm">✓</div>
                  )}
                </div>
                <h3 className={`font-semibold text-sm mb-1 ${
                  currentActivity === index ? 'text-yellow-700' : 'text-gray-700'
                }`}>
                  {activity.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {activity.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Activity Section */}
        <div className="max-w-3xl mx-auto text-center space-y-6 px-4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
            {/* Breathing Animation */}
            <div className="w-48 h-48 mx-auto flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.15, 1] : 1,
                }}
                transition={{
                  duration: 4,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="w-40 h-40 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 flex items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{
                    scale: isActive ? [0.7, 1, 0.7] : 0.7,
                  }}
                  transition={{
                    duration: 4,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 flex items-center justify-center"
                >
                  {currentActivityData.icon}
                </motion.div>
              </motion.div>
            </div>

            {/* Current Activity Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-yellow-600 mb-2">
                {currentActivityData.title}
              </h2>
              <p className="text-black/70 text-sm mb-4">
                {currentActivityData.description}
              </p>
            </div>

            {/* Interactive Elements for Gratitude and Intention */}
            {currentActivityData.interactive && currentActivityData.id === 'gratitude' && !isActive && (
              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-gray-700 text-center">Three Things I'm Grateful For:</h3>
                {gratitudeItems.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <label className="text-sm text-gray-600">Gratitude {index + 1}:</label>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleGratitudeChange(index, e.target.value)}
                      placeholder="I am grateful for..."
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}

            {currentActivityData.interactive && currentActivityData.id === 'intention' && !isActive && (
              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-gray-700 text-center">My Intention for Today:</h3>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Daily Intention:</label>
                  <textarea
                    value={dailyIntention}
                    onChange={(e) => setDailyIntention(e.target.value)}
                    placeholder="Today I intend to..."
                    rows="3"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-300 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* Activity Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 text-black/80 text-lg"
            >
              {currentActivityData.steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    index === currentStep && isActive
                      ? 'bg-yellow-50 border-2 border-yellow-300'
                      : index < currentStep && isActive
                        ? 'bg-green-50 border border-green-200 opacity-60'
                        : 'bg-white border border-gray-200 opacity-40'
                  }`}
                >
                  <p className="mb-2">
                    <strong>Step {index + 1}:</strong> {step.text}
                  </p>
                  {index === currentStep && isActive && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Time remaining:</span>
                        <span className="font-bold text-yellow-600 text-lg">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-yellow-500 h-2 rounded-full"
                          initial={{ width: '100%' }}
                          animate={{ width: `${(timeLeft / step.duration) * 100}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!isActive && !isCompleted && (
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-yellow-500"
                  onClick={startActivity}
                >
                  Begin {currentActivityData.title}
                </Button>
              )}

              {isActive && (
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-yellow-500 bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsActive(false)}
                >
                  Pause Practice
                </Button>
              )}

              {isCompleted && (
                <div className="text-center space-y-4">
                  <div className="text-green-600 text-xl font-semibold">
                    ✨ Practice Complete! ✨
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-6 h-12 text-base font-semibold border border-yellow-500"
                      onClick={startActivity}
                    >
                      Repeat Practice
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-6 h-12 text-base font-semibold border border-yellow-500"
                      onClick={nextActivity}
                    >
                      Next Practice
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Completion Summary */}
          {completedSections.length === morningActivities.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6"
            >
              <div className="text-green-700 text-2xl font-bold mb-4 text-center">
                🌅 Morning Practice Complete! 🌅
              </div>
              
              {/* Display user's reflections if they filled them out */}
              {(gratitudeItems.some(item => item.trim()) || dailyIntention.trim()) && (
                <div className="bg-white/80 rounded-lg p-4 mb-4 text-left">
                  <h3 className="font-bold text-gray-800 mb-3 text-center">Your Morning Reflections</h3>
                  
                  {gratitudeItems.some(item => item.trim()) && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-yellow-700 mb-2">Three Things I'm Grateful For:</h4>
                      <ul className="space-y-1">
                        {gratitudeItems.map((item, index) => 
                          item.trim() && (
                            <li key={index} className="text-gray-700">
                              <span className="font-medium">• </span>{item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {dailyIntention.trim() && (
                    <div>
                      <h4 className="font-semibold text-yellow-700 mb-2">My Intention for Today:</h4>
                      <p className="text-gray-700 italic">"{dailyIntention}"</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                    💡 Tip: Scroll up to see your input fields and take a screenshot of your reflections to keep them with you throughout the day
                  </div>
                </div>
              )}
              
              <p className="text-green-600 text-center">
                You've completed all morning mindfulness practices. 
                Take this positive energy with you throughout your day!
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MorningMindfulness;