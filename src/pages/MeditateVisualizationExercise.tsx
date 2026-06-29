// src/pages/MeditateVisualizationExercise.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from "@/lib/helmet-shim";
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Play, Pause, RotateCcw, Timer, Brain } from 'lucide-react';
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Meditation", path: "/meditation" },
  { label: "Visualization Exercise" },
];

const VisualizationExercise = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Create audio context for gentle gong sound
  const createGongSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a gentle, warm gong-like sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Fundamental frequency for a warm, low gong
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1.5);
      
      // Low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);
      
      // Envelope for natural decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  const exercises = [
    {
      id: 'sanctuary',
      title: "Peaceful Sanctuary",
      description: "Create your own sacred space of tranquility and inner peace.",
      icon: "🏔️",
      color: "from-blue-400 to-cyan-500",
      totalTime: 165,
      steps: [
        { text: "Take three deep, cleansing breaths. Feel your body settling into relaxation.", duration: 30 },
        { text: "Imagine yourself in a serene place — perhaps a beach, forest, or mountain top.", duration: 45 },
        { text: "Visualize a warm golden light surrounding you, filling you with peace and clarity.", duration: 60 },
        { text: "Feel this peaceful energy radiating throughout your entire being.", duration: 30 }
      ]
    },
    {
      id: 'healing',
      title: "Healing Light Meditation",
      description: "Channel healing energy through visualization and breathwork.",
      icon: "✨",
      color: "from-purple-400 to-indigo-500",
      totalTime: 205,
      steps: [
        { text: "Begin with slow, rhythmic breathing. In through the nose, out through the mouth.", duration: 40 },
        { text: "Visualize a brilliant white light entering through the crown of your head.", duration: 50 },
        { text: "See this healing light flowing through every cell, dissolving tension and stress.", duration: 70 },
        { text: "Allow the light to expand beyond your body, creating a protective aura around you.", duration: 45 }
      ]
    },
    {
      id: 'ocean',
      title: "Ocean of Calm",
      description: "Connect with the peaceful rhythm of ocean waves to find inner stillness.",
      icon: "🌊",
      color: "from-teal-400 to-blue-500",
      totalTime: 195,
      steps: [
        { text: "Feel your breath naturally synchronizing with gentle ocean waves.", duration: 35 },
        { text: "Picture yourself floating effortlessly on warm, crystal-clear water.", duration: 55 },
        { text: "With each wave, feel worries and tension washing away from your mind.", duration: 65 },
        { text: "Rest in this ocean of infinite calm and serenity.", duration: 40 }
      ]
    }
  ];

  const currentExerciseData = exercises[currentExercise];

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      createGongSound();
      
      if (currentStep < currentExerciseData.steps.length - 1) {
        // Move to next step
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setTimeLeft(currentExerciseData.steps[currentStep + 1].duration);
        }, 1000);
      } else {
        // Exercise completed
        setTimeout(() => {
          setIsActive(false);
          setIsCompleted(true);
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentStep, currentExerciseData, createGongSound]);

  const startExercise = () => {
    setCurrentStep(0);
    setTimeLeft(currentExerciseData.steps[0].duration);
    setIsActive(true);
    setIsCompleted(false);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const selectExercise = (index) => {
    setCurrentExercise(index);
    resetExercise();
  };

  const resetExercise = () => {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getProgressPercentage = () => {
    const totalStepTime = currentExerciseData.steps.reduce((sum, step) => sum + step.duration, 0);
    const completedTime = currentExerciseData.steps.slice(0, currentStep).reduce((sum, step) => sum + step.duration, 0);
    const currentStepProgress = currentExerciseData.steps[currentStep] ? 
      (currentExerciseData.steps[currentStep].duration - timeLeft) : 0;
    
    return ((completedTime + currentStepProgress) / totalStepTime) * 100;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-black overflow-hidden">
      <Helmet>
        <title>Guided Visualization Exercises - Meditation | Feng Shui & Beyond</title>
        <meta name="description" content="Practice guided visualization exercises for relaxation and mental clarity. Free meditation tool with timed sessions and calming visualizations." />
        <link rel="canonical" href="https://fengshuiandbeyond.com/meditation/visualization-exercises" />
      </Helmet>
      <Header />
      <main className="flex-grow pt-6 px-4 pb-10">
        <div className="pt-24 max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-indigo-500 mr-2" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visualization Exercises
              </h1>
              <Eye className="w-8 h-8 text-indigo-500 ml-2" />
            </div>
            <div className="mb-4">
              <span className="text-lg text-gray-600 font-medium">{getGreeting()}! </span>
              <span className="text-gray-500">Journey within through the power of guided imagery</span>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          {/* Exercise Selector */}
          <div className="mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {exercises.map((exercise, index) => (
                <motion.button
                  key={exercise.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectExercise(index)}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                    currentExercise === index
                      ? 'bg-white/80 border-indigo-300 shadow-lg'
                      : 'bg-white/50 border-gray-200 hover:bg-white/70'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${exercise.color} opacity-5`}></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">{exercise.icon}</div>
                    <h3 className={`font-semibold text-lg mb-2 ${
                      currentExercise === index ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      {exercise.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {exercise.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Timer className="w-4 h-4 mr-1" />
                      {Math.ceil(exercise.totalTime / 60)} minutes
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Exercise Section */}
          <div className="relative mb-8">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-200 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8">
              {/* Exercise Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${currentExerciseData.color} text-white text-2xl mb-4 shadow-lg`}>
                  {currentExerciseData.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {currentExerciseData.title}
                </h2>
                <p className="text-gray-600 text-lg">
                  {currentExerciseData.description}
                </p>
              </div>

              {/* Progress Indicator */}
              {(isActive || isCompleted) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Step {currentStep + 1} of {currentExerciseData.steps.length}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(getProgressPercentage())}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`bg-gradient-to-r ${currentExerciseData.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Breathing Animation */}
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.15, 1] : 1,
                    opacity: isActive ? [0.8, 1, 0.8] : 0.9,
                  }}
                  transition={{
                    duration: 4,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${currentExerciseData.color} flex items-center justify-center shadow-2xl`}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? [0.7, 1, 0.7] : 0.8,
                      rotate: isActive ? [0, 360] : 0,
                    }}
                    transition={{
                      scale: { duration: 4, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                      rotate: { duration: 20, repeat: isActive ? Infinity : 0, ease: "linear" }
                    }}
                    className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent"></div>
                </motion.div>
              </div>

              {/* Exercise Steps */}
              <div className="space-y-4 mb-8">
                {currentExerciseData.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      index === currentStep && isActive
                        ? 'bg-indigo-50/80 border-2 border-indigo-300 shadow-md'
                        : index < currentStep && isActive
                          ? 'bg-green-50/60 border border-green-200 opacity-60'
                          : 'bg-white/40 border border-gray-200 opacity-40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <p className="text-gray-800 leading-relaxed">
                          <span className="font-medium text-indigo-600">Step {index + 1}:</span> {step.text}
                        </p>
                      </div>
                      <div className="ml-4 text-sm text-gray-500 font-medium">
                        {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    {index === currentStep && isActive && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-indigo-600 font-medium">Time remaining:</span>
                          <span className="font-bold text-indigo-700 text-lg">
                            {formatTime(timeLeft)}
                          </span>
                        </div>
                        <div className="w-full bg-indigo-100 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            initial={{ width: '100%' }}
                            animate={{ width: `${(timeLeft / step.duration) * 100}%` }}
                            transition={{ duration: 1, ease: "linear" }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                {!isActive && !isCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startExercise}
                    className={`group relative px-8 py-4 bg-gradient-to-r ${currentExerciseData.color} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <span className="flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Begin Visualization</span>
                    </span>
                  </motion.button>
                )}

                {isActive && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseExercise}
                    className="group relative px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <Pause className="w-5 h-5" />
                      <span>Pause Exercise</span>
                    </span>
                  </motion.button>
                )}

                {isCompleted && (
                  <div className="text-center space-y-4">
                    <div className="text-indigo-600 text-xl font-semibold mb-4">
                      ✨ Visualization Complete! ✨
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startExercise}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span className="flex items-center space-x-2">
                          <RotateCcw className="w-4 h-4" />
                          <span>Repeat</span>
                        </span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectExercise((currentExercise + 1) % exercises.length)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span>Next Exercise</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-semibold text-gray-800 mb-2">Reduces Stress</h3>
              <p className="text-sm text-gray-600">
                Visualization activates your parasympathetic nervous system, naturally reducing cortisol levels.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Improves Focus</h3>
              <p className="text-sm text-gray-600">
                Regular visualization practice strengthens your ability to concentrate and stay present.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg text-center">
              <div className="text-4xl mb-3">💫</div>
              <h3 className="font-semibold text-gray-800 mb-2">Enhances Creativity</h3>
              <p className="text-sm text-gray-600">
                Guided imagery opens neural pathways that boost creative thinking and problem-solving.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VisualizationExercise;