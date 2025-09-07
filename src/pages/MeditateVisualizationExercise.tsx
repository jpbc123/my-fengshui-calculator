// src/pages/MeditateVisualizationExercise.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Visualization Exercise" },
];

const Button = ({ variant, size, className, children, onClick }) => {
  const baseClasses = "font-semibold rounded transition-colors duration-300";
  const variantClasses = variant === "gold" 
    ? "bg-yellow-500 text-white hover:bg-yellow-600" 
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  const sizeClasses = size === "lg" ? "px-8 py-4 text-lg" : "px-4 py-2";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

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
      title: "Peaceful Sanctuary",
      description: "Create your own sacred space of tranquility and inner peace.",
      steps: [
        { text: "Take three deep, cleansing breaths. Feel your body settling into relaxation.", duration: 30 },
        { text: "Imagine yourself in a serene place — perhaps a beach, forest, or mountain top.", duration: 45 },
        { text: "Visualize a warm golden light surrounding you, filling you with peace and clarity.", duration: 60 },
        { text: "Feel this peaceful energy radiating throughout your entire being.", duration: 30 }
      ]
    },
    {
      title: "Healing Light Meditation",
      description: "Channel healing energy through visualization and breathwork.",
      steps: [
        { text: "Begin with slow, rhythmic breathing. In through the nose, out through the mouth.", duration: 40 },
        { text: "Visualize a brilliant white light entering through the crown of your head.", duration: 50 },
        { text: "See this healing light flowing through every cell, dissolving tension and stress.", duration: 70 },
        { text: "Allow the light to expand beyond your body, creating a protective aura around you.", duration: 45 }
      ]
    },
    {
      title: "Ocean of Calm",
      description: "Connect with the peaceful rhythm of ocean waves to find inner stillness.",
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

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % exercises.length);
    setCurrentStep(0);
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(0);
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

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Visualization Exercise" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">
            Visualization Exercise
          </h1>
          <p className="text-black/80 mb-6">
            Close your eyes and imagine a calm, peaceful place. Visualization
            exercises help reduce stress, increase focus, and attract positive
            energy into your life.
          </p>
        </div>

        {/* Exercise Selector */}
        <div className="max-w-3xl mx-auto mb-6 px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {exercises.map((exercise, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentExercise(index);
                  resetExercise();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  currentExercise === index
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {exercise.title}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization Section */}
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center space-y-6">
            {/* Breathing Animation */}
            <div className="w-64 h-64 mx-auto flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 4,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="w-48 h-48 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-300 flex items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{
                    scale: isActive ? [0.8, 1, 0.8] : 0.8,
                  }}
                  transition={{
                    duration: 4,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400"
                />
              </motion.div>
            </div>

            {/* Current Exercise Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-yellow-600 mb-2">
                {currentExerciseData.title}
              </h2>
              <p className="text-black/70 text-sm mb-4">
                {currentExerciseData.description}
              </p>
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 text-black/80 text-lg w-full"
            >
              {currentExerciseData.steps.map((step, index) => (
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

            {/* Call-to-action */}
            <div className="space-y-4">
              {!isActive && !isCompleted && (
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-yellow-500"
                  onClick={startExercise}
                >
                  Begin {currentExerciseData.title}
                </Button>
              )}
              
              {isActive && (
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8 h-14 text-lg font-semibold whitespace-nowrap border border-yellow-500 bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsActive(false)}
                >
                  Pause Exercise
                </Button>
              )}

              {isCompleted && (
                <div className="text-center space-y-4">
                  <div className="text-green-600 text-xl font-semibold">
                    ✨ Exercise Complete! ✨
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-6 h-12 text-base font-semibold border border-yellow-500"
                      onClick={startExercise}
                    >
                      Repeat Exercise
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-6 h-12 text-base font-semibold border border-yellow-500"
                      onClick={nextExercise}
                    >
                      Start Another Exercise
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisualizationExercise;