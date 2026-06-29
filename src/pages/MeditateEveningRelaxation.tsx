// src/pages/EveningRelaxation.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from "@/lib/helmet-shim";
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Heart, BookOpen, Sunset } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Meditation", path: "/meditation" },
  { label: "Evening Relaxation" },
];

const EveningRelaxation = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reflectionItems, setReflectionItems] = useState(['', '', '']);
  const [gratefulMoments, setGratefulMoments] = useState(['', '', '']);
  const [tomorrowIntentions, setTomorrowIntentions] = useState('');
  const [completedSections, setCompletedSections] = useState([]);

  // Create gentle evening chime sound
  const createEveningChime = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Gentle, descending evening chime
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(330, audioContext.currentTime + 0.3); // E4
      oscillator.frequency.exponentialRampToValueAtTime(262, audioContext.currentTime + 0.6); // C4
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  const eveningActivities = [
    {
      id: 'unwind',
      title: "Gentle Unwinding",
      icon: <Sunset className="w-6 h-6" />,
      description: "Release the tension from your day with calming breathwork.",
      steps: [
        { text: "Find a comfortable position and allow your eyes to close gently. Let your shoulders drop.", duration: 5 },
        { text: "Take a deep breath in, then exhale slowly while mentally saying 'I release the day.'", duration: 10 },
        { text: "Continue breathing naturally, letting each exhale carry away any stress or worry.", duration: 10 },
        { text: "Feel your body becoming heavier and more relaxed with each breath.", duration: 10 },
        { text: "Allow yourself to fully arrive in this peaceful moment of transition.", duration: 10 }
      ]
    },
    {
      id: 'reflection',
      title: "Day Reflection",
      icon: <BookOpen className="w-6 h-6" />,
      description: "Reflect on your day with kindness and acknowledge your experiences.",
      interactive: true,
      steps: [
        { text: "Take a moment to gently look back at your day without judgment.", duration: 10 },
        { text: "What moments brought you joy or satisfaction today? Honor these experiences.", duration: 10 },
        { text: "Were there any challenges? Acknowledge them with compassion for yourself.", duration: 15 },
        { text: "What did you learn about yourself or others today? Every experience teaches us something.", duration: 15 },
        { text: "Send yourself appreciation for navigating another day of life with awareness.", duration: 10 }
      ]
    },
    {
      id: 'gratitude',
      title: "Evening Gratitude",
      icon: <Heart className="w-6 h-6" />,
      description: "End your day by acknowledging the gifts and positive moments.",
      interactive: true,
      steps: [
        { text: "Place your hand on your heart and take three deep, appreciative breaths.", duration: 15 },
        { text: "Think of a person who made your day a little brighter, even in a small way.", duration: 10 },
        { text: "Recall a moment of beauty you witnessed - perhaps nature, art, or human kindness.", duration: 10 },
        { text: "Appreciate something about your body that served you well today.", duration: 10 },
        { text: "Feel gratitude for having another day to experience life in all its forms.", duration: 10 }
      ]
    },
    {
      id: 'preparation',
      title: "Sleep Preparation",
      icon: <Moon className="w-6 h-6" />,
      description: "Prepare your mind and body for peaceful, restorative sleep.",
      interactive: true,
      steps: [
        { text: "Begin to slow down your breathing, making each breath deeper and more relaxed.", duration: 20 },
        { text: "Starting from your toes, consciously relax each part of your body, working upward.", duration: 10 },
        { text: "Let go of any thoughts about tomorrow - trust that you'll handle what comes with wisdom.", duration: 10 },
        { text: "Imagine yourself surrounded by a soft, protective bubble of peace and safety.", duration: 10 },
        { text: "Set an intention for restful sleep and dreams that nourish your soul.", duration: 10 },
        { text: "Allow yourself to drift into a state of complete relaxation and trust.", duration: 10 }
      ]
    }
  ];

  const currentActivityData = eveningActivities[currentActivity];

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      createEveningChime();
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
  }, [isActive, timeLeft, currentStep, currentActivityData, createEveningChime, completedSections]);

  const startActivity = () => {
    setCurrentStep(0);
    setTimeLeft(currentActivityData.steps[0].duration);
    setIsActive(true);
    setIsCompleted(false);
  };

  const nextActivity = () => {
    setCurrentActivity((prev) => (prev + 1) % eveningActivities.length);
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

  const handleReflectionChange = (index, value) => {
    const newReflectionItems = [...reflectionItems];
    newReflectionItems[index] = value;
    setReflectionItems(newReflectionItems);
  };

  const handleGratefulMomentsChange = (index, value) => {
    const newGratefulMoments = [...gratefulMoments];
    newGratefulMoments[index] = value;
    setGratefulMoments(newGratefulMoments);
  };

  const getEveningGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 18) return "Good Afternoon 🌅";
    if (hour < 21) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-black overflow-hidden">
      <Helmet>
        <title>Evening Relaxation - Wind Down Meditation | Feng Shui & Beyond</title>
        <meta name="description" content="Unwind with guided evening relaxation exercises. Free nighttime meditation for stress relief, better sleep, and peaceful reflection." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/meditation/evening-relaxation" />
      </Helmet>
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-purple-600 mb-4">
            Evening Relaxation
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {getEveningGreeting()}
            </h2>
            <p className="text-black/80">
              Wind down from your day with gentle practices designed to help you relax, reflect, 
              and prepare for peaceful sleep. Let go of the day's stress and embrace tranquility.
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-6 px-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Evening Wind-Down Progress
              </span>
              <span className="text-sm text-gray-600">
                {completedSections.length} of {eveningActivities.length} completed
              </span>
            </div>
            <div className="flex gap-2">
              {eveningActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                    completedSections.includes(activity.id) 
                      ? 'bg-green-500' 
                      : index === currentActivity 
                        ? 'bg-purple-500' 
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
            {eveningActivities.map((activity, index) => (
              <button
                key={activity.id}
                onClick={() => selectActivity(index)}
                className={`p-4 rounded-lg border transition-all duration-300 text-left backdrop-blur-sm ${
                  currentActivity === index
                    ? 'bg-purple-50/80 border-purple-300 shadow-md'
                    : 'bg-white/60 border-gray-200 hover:bg-white/80'
                } ${completedSections.includes(activity.id) ? 'ring-2 ring-green-200' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded ${
                    currentActivity === index ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {activity.icon}
                  </div>
                  {completedSections.includes(activity.id) && (
                    <div className="text-green-600 text-sm">✓</div>
                  )}
                </div>
                <h3 className={`font-semibold text-sm mb-1 ${
                  currentActivity === index ? 'text-purple-700' : 'text-gray-700'
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
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg space-y-6">
            {/* Moonlight Animation */}
            <div className="w-48 h-48 mx-auto flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  opacity: isActive ? [0.7, 1, 0.7] : 0.8,
                }}
                transition={{
                  duration: 5,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 flex items-center justify-center shadow-2xl relative"
              >
                <motion.div
                  animate={{
                    scale: isActive ? [0.6, 0.9, 0.6] : 0.7,
                    rotate: isActive ? [0, 360] : 0,
                  }}
                  transition={{
                    scale: { duration: 5, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                    rotate: { duration: 20, repeat: isActive ? Infinity : 0, ease: "linear" }
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-300 via-indigo-300 to-blue-300 flex items-center justify-center text-white"
                >
                  {currentActivityData.icon}
                </motion.div>
                {/* Subtle sparkle effects */}
                <motion.div
                  animate={{
                    opacity: isActive ? [0, 1, 0] : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </motion.div>
            </div>

            {/* Current Activity Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-purple-600 mb-2">
                {currentActivityData.title}
              </h2>
              <p className="text-black/70 text-sm mb-4">
                {currentActivityData.description}
              </p>
            </div>

            {/* Interactive Elements */}
            {currentActivityData.interactive && currentActivityData.id === 'reflection' && !isActive && (
              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-gray-700 text-center">Today's Reflections:</h3>
                {reflectionItems.map((item, index) => {
                  const prompts = [
                    "What brought me joy today?",
                    "What challenged me and how did I grow?",
                    "What am I most proud of today?"
                  ];
                  return (
                    <div key={index} className="space-y-1">
                      <label className="text-sm text-gray-600">{prompts[index]}</label>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleReflectionChange(index, e.target.value)}
                        placeholder="Reflect on your day..."
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/80"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {currentActivityData.interactive && currentActivityData.id === 'gratitude' && !isActive && (
              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-gray-700 text-center">Evening Gratitudes:</h3>
                {gratefulMoments.map((item, index) => {
                  const prompts = [
                    "Someone who brightened my day:",
                    "A moment of beauty I witnessed:",
                    "Something my body did well today:"
                  ];
                  return (
                    <div key={index} className="space-y-1">
                      <label className="text-sm text-gray-600">{prompts[index]}</label>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleGratefulMomentsChange(index, e.target.value)}
                        placeholder="I'm grateful for..."
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/80"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {currentActivityData.interactive && currentActivityData.id === 'preparation' && !isActive && (
              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-gray-700 text-center">Sleep Intention:</h3>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">What do you wish for in your sleep and dreams?</label>
                  <textarea
                    value={tomorrowIntentions}
                    onChange={(e) => setTomorrowIntentions(e.target.value)}
                    placeholder="I wish for peaceful sleep and..."
                    rows="3"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none bg-white/80"
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
                      ? 'bg-purple-50/80 border-2 border-purple-300 backdrop-blur-sm'
                      : index < currentStep && isActive
                        ? 'bg-green-50/60 border border-green-200 opacity-60'
                        : 'bg-white/60 border border-gray-200 opacity-40'
                  }`}
                >
                  <p className="mb-2">
                    <strong>Step {index + 1}:</strong> {step.text}
                  </p>
                  {index === currentStep && isActive && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Time remaining:</span>
                        <span className="font-bold text-purple-600 text-lg">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
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
                  className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-purple-500 bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={startActivity}
                >
                  Begin {currentActivityData.title}
                </Button>
              )}

              {isActive && (
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-purple-500 bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => setIsActive(false)}
                >
                  Pause Practice
                </Button>
              )}

              {isCompleted && (
                <div className="text-center space-y-4">
                  <div className="text-purple-600 text-xl font-semibold">
                    🌙 Practice Complete! 🌙
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-6 h-12 text-base font-semibold border border-purple-500 bg-purple-500 hover:bg-purple-600 text-white"
                      onClick={startActivity}
                    >
                      Repeat Practice
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-6 h-12 text-base font-semibold border border-purple-500 bg-purple-500 hover:bg-purple-600 text-white"
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
          {completedSections.length === eveningActivities.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-purple-700 text-2xl font-bold mb-4 text-center">
                🌌 Evening Wind-Down Complete! 🌌
              </div>
              
              {/* Display user's evening reflections if they filled them out */}
              {(reflectionItems.some(item => item.trim()) || gratefulMoments.some(item => item.trim()) || tomorrowIntentions.trim()) && (
                <div className="bg-white/90 rounded-lg p-4 mb-4 text-left backdrop-blur-sm">
                  <h3 className="font-bold text-gray-800 mb-3 text-center">Your Evening Reflections</h3>
                  
                  {reflectionItems.some(item => item.trim()) && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-700 mb-2">Today's Reflections:</h4>
                      <div className="space-y-2">
                        {reflectionItems.map((item, index) => {
                          const prompts = [
                            "What brought me joy today:",
                            "What challenged me and how did I grow:",
                            "What am I most proud of today:"
                          ];
                          return item.trim() && (
                            <div key={index} className="text-gray-700">
                              <span className="font-medium text-purple-600">{prompts[index]}</span>
                              <br />
                              <span className="ml-2">"{item}"</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {gratefulMoments.some(item => item.trim()) && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-700 mb-2">Evening Gratitudes:</h4>
                      <div className="space-y-2">
                        {gratefulMoments.map((item, index) => {
                          const prompts = [
                            "Someone who brightened my day:",
                            "A moment of beauty I witnessed:",
                            "Something my body did well today:"
                          ];
                          return item.trim() && (
                            <div key={index} className="text-gray-700">
                              <span className="font-medium text-purple-600">{prompts[index]}</span>
                              <br />
                              <span className="ml-2">"{item}"</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {tomorrowIntentions.trim() && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-700 mb-2">Sleep Intention:</h4>
                      <p className="text-gray-700 italic ml-2">"{tomorrowIntentions}"</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-purple-200 text-xs text-gray-500 text-center">
                    💡 Tip: Scroll up to see your input fields and take a screenshot of your reflections to preserve their wisdom
                  </div>
                </div>
              )}
              
              <p className="text-purple-600 text-center">
                You've completed all evening relaxation practices. 
                May you enjoy peaceful, restorative sleep and sweet dreams.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EveningRelaxation;