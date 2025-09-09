// src/pages/MeditateYogaPose.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, RotateCcw, Calendar, Target, Heart } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

import tadasanaPoseImage from "../assets/yoga-mountain.jpg";
import downwardDogPoseImage from "../assets/yoga-downwardDog.jpg";
import treePoseImage from "../assets/yoga-tree.jpg";
import balasanaPoseImage from "../assets/yoga-childPose.jpg";
import warrior1PoseImage from "../assets/yoga-warrior1.jpg";
import warrior2PoseImage from "../assets/yoga-warrior2.jpg";
import warrior3PoseImage from "../assets/yoga-warrior3.jpg";
import bridgePoseImage from "../assets/yoga-bridgePose.jpg";
import cobraPoseImage from "../assets/yoga-cobraPose.jpg";
import seatedForwardBendPoseImage from "../assets/yoga-seatForward.jpg";
import trianglePoseImage from "../assets/yoga-triangle.jpg";
import lotusPoseImage from "../assets/yoga-lotus.jpg";
import plankPoseImage from "../assets/yoga-phalakasana.jpg";
import boatPoseImage from "../assets/yoga-boatPose.jpg";
import pigeonPoseImage from "../assets/yoga-kapotasana.jpg";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Meditation", path: "/meditation" },
  { label: "Yoga Pose for the Day" },
];

const yogaPoses = [
  {
    name: "Mountain Pose",
    sanskrit: "Tadasana",
    image: tadasanaPoseImage,
    description: "A foundational standing pose that promotes grounding, posture, and balance.",
    difficulty: "Beginner",
    duration: "1-3 minutes",
    category: "Standing",
    benefits: [
      "Improves posture and alignment",
      "Strengthens legs and core",
      "Cultivates awareness and grounding",
    ],
  },
  {
    name: "Downward Dog",
    sanskrit: "Adho Mukha Svanasana",
    image: downwardDogPoseImage,
    description: "An energizing pose that stretches the entire body and calms the mind.",
    difficulty: "Beginner",
    duration: "1-3 minutes",
    category: "Inversion",
    benefits: [
      "Stretches hamstrings, calves, and spine",
      "Strengthens arms and shoulders",
      "Relieves stress and boosts circulation",
    ],
  },
  {
    name: "Tree Pose",
    sanskrit: "Vrikshasana",
    image: treePoseImage,
    description: "A balancing posture that fosters focus and stability.",
    difficulty: "Beginner",
    duration: "30 seconds - 1 minute each side",
    category: "Balance",
    benefits: [
      "Improves balance and concentration",
      "Strengthens ankles and legs",
      "Promotes calmness and focus",
    ],
  },
  {
    name: "Child's Pose",
    sanskrit: "Balasana",
    image: balasanaPoseImage,
    description: "A gentle resting pose that relaxes the body and soothes the nervous system.",
    difficulty: "Beginner",
    duration: "1-5 minutes",
    category: "Restorative",
    benefits: [
      "Releases tension in back and shoulders",
      "Calms the mind and reduces fatigue",
      "Gently stretches hips, thighs, and ankles",
    ],
  },
  {
    name: "Warrior I",
    sanskrit: "Virabhadrasana I",
    image: warrior1PoseImage,
    description: "A strong standing pose that builds stamina and confidence.",
    difficulty: "Beginner",
    duration: "30 seconds - 1 minute each side",
    category: "Standing",
    benefits: [
      "Strengthens legs, ankles, arms, and shoulders",
      "Opens chest and lungs, improving breathing",
      "Builds stamina, focus, and determination",
      "Stretches hips, abdomen, and back",
      "Encourages grounding and stability",
    ],
  },
  {
    name: "Warrior II",
    sanskrit: "Virabhadrasana II",
    image: warrior2PoseImage,
    description: "A strong standing pose that builds stamina and confidence.",
    difficulty: "Beginner",
    duration: "30 seconds - 1 minute each side",
    category: "Standing",
    benefits: [
      "Strengthens legs and arms",
      "Opens hips and chest",
      "Boosts stamina, focus, and energy",
    ],
  },
  {
    name: "Warrior III",
    sanskrit: "Virabhadrasana III",
    image: warrior3PoseImage,
    description: "A challenging balancing pose that cultivates focus.",
    difficulty: "Intermediate",
    duration: "15-30 seconds each side",
    category: "Balance",
    benefits: [
      "Strengthens legs, core, and back",
      "Improves balance and stability",
      "Develops concentration and determination",
    ],
  },
  {
    name: "Cobra Pose",
    sanskrit: "Bhujangasana",
    image: cobraPoseImage,
    description: "Gentle backbend that opens the chest and strengthens the spine.",
    difficulty: "Beginner",
    duration: "15-30 seconds",
    category: "Backbend",
    benefits: [
      "Improves flexibility of the spine",
      "Opens chest and lungs",
      "Stimulates abdominal organs",
    ],
  },
  {
    name: "Bridge Pose",
    sanskrit: "Setu Bandha Sarvangasana",
    image: bridgePoseImage,
    description: "A backbend and chest-opening pose performed lying on the back.",
    difficulty: "Beginner",
    duration: "30 seconds - 1 minute",
    category: "Backbend",
    benefits: [
      "Strengthens legs, glutes, and lower back",
      "Opens chest and shoulders",
      "Relieves stress and anxiety",
    ],
  },
  {
    name: "Seated Forward Bend",
    sanskrit: "Paschimottanasana",
    image: seatedForwardBendPoseImage,
    description: "Classic seated stretch reaching toward the toes.",
    difficulty: "Beginner",
    duration: "1-3 minutes",
    category: "Seated",
    benefits: [
      "Stretches spine, hamstrings, and shoulders",
      "Soothes the nervous system",
      "Relieves stress and mild depression",
    ],
  },
  {
    name: "Triangle Pose",
    sanskrit: "Trikonasana",
    image: trianglePoseImage,
    description: "A side-stretching pose that lengthens and energizes the body.",
    difficulty: "Beginner",
    duration: "30 seconds - 1 minute each side",
    category: "Standing",
    benefits: [
      "Stretches legs, hips, and spine",
      "Opens chest and shoulders",
      "Improves digestion and stability",
    ],
  },
  {
    name: "Lotus Pose",
    sanskrit: "Padmasana",
    image: lotusPoseImage,
    description: "Iconic seated meditation posture with crossed legs.",
    difficulty: "Advanced",
    duration: "1-5 minutes",
    category: "Seated",
    benefits: [
      "Promotes relaxation and inner calm",
      "Supports meditation and breathing",
      "Improves posture and spinal alignment",
    ],
  },
  {
    name: "Plank Pose",
    sanskrit: "Phalakasana",
    image: plankPoseImage,
    description: "A strength-building posture that engages the entire body.",
    difficulty: "Beginner",
    duration: "15 seconds - 1 minute",
    category: "Core",
    benefits: [
      "Strengthens core, arms, shoulders, and legs",
      "Builds endurance and stability",
      "Improves posture and body awareness",
    ],
  },
  {
    name: "Boat Pose",
    sanskrit: "Navasana",
    image: boatPoseImage,
    description: "A seated balance pose that fires up the abdominal muscles.",
    difficulty: "Intermediate",
    duration: "15-30 seconds",
    category: "Core",
    benefits: [
      "Strengthens abs, hip flexors, and spine",
      "Improves balance and focus",
      "Stimulates digestion and metabolism",
    ],
  },
  {
    name: "Pigeon Pose",
    sanskrit: "Kapotasana Variation",
    image: pigeonPoseImage,
    description: "A deep hip-opening posture that releases built-up tension.",
    difficulty: "Intermediate",
    duration: "1-3 minutes each side",
    category: "Hip Opener",
    benefits: [
      "Stretches hip flexors, glutes, and thighs",
      "Improves hip flexibility and mobility",
      "Relieves stress and calms the mind",
    ],
  }
];

const YogaPose = () => {
  const [poseIndex, setPoseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Pick a "pose of the day" based on date
  useEffect(() => {
    const today = new Date();
    const index = today.getDate() % yogaPoses.length;
    setPoseIndex(index);
  }, []);

  const handleNewPose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPoseIndex((prevIndex) => (prevIndex + 1) % yogaPoses.length);
      setIsAnimating(false);
    }, 300);
  };

  const pose = yogaPoses[poseIndex];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-400 to-green-500';
      case 'Intermediate': return 'from-yellow-400 to-orange-500';
      case 'Advanced': return 'from-red-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Standing': return '🧘‍♀️';
      case 'Balance': return '⚖️';
      case 'Backbend': return '🌙';
      case 'Core': return '💪';
      case 'Seated': return '🪷';
      case 'Inversion': return '🔄';
      case 'Hip Opener': return '🦋';
      case 'Restorative': return '😌';
      default: return '✨';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-4 pb-10">
        <div className="pt-24 max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Flower2 className="w-8 h-8 text-emerald-500 mr-2" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                Yoga Pose for the Day
              </h1>
              <Flower2 className="w-8 h-8 text-emerald-500 ml-2" />
            </div>
            <div className="mb-4">
              <span className="text-lg text-gray-600 font-medium">{getGreeting()}! </span>
              <span className="text-gray-500">Move your body with intention and grace</span>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
          </div>

          {/* Main Pose Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pose.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-8"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-200 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-200 to-transparent rounded-full blur-3xl"></div>
              </div>

              <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={pose.image}
                    alt={`${pose.name} - ${pose.sanskrit} yoga pose demonstration`}
                    className="w-full object-contain bg-gradient-to-br from-gray-50 to-gray-100"
                    style={{ aspectRatio: 'auto', minHeight: '300px', maxHeight: '600px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  
                  {/* Floating pose info */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getDifficultyColor(pose.difficulty)} text-white text-sm font-medium rounded-full shadow-lg`}>
                      {pose.difficulty}
                    </div>
                    <div className="px-3 py-1 bg-black/30 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                      {pose.category} {getCategoryIcon(pose.category)}
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full shadow-lg flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {pose.duration}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {pose.name}
                    </h2>
                    <p className="text-emerald-600 font-medium text-lg italic">
                      {pose.sanskrit}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed text-center">
                      {pose.description}
                    </p>
                  </div>

                  {/* Benefits Grid */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-500 mr-2" />
                      Benefits of This Pose
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {pose.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors duration-200"
                        >
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Button */}
          <div className="flex justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewPose}
              disabled={isAnimating}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
            >
              <span className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Try Another Pose</span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/30 to-teal-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </motion.button>
          </div>

          {/* Yoga Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Focus on Form</h3>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Quality over quantity. Hold poses mindfully and listen to your body's limits.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">🫁</span>
                </div>
                <h3 className="font-semibold text-gray-800">Breathe Deeply</h3>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Coordinate your movement with your breath for a more meditative practice.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Be Patient</h3>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Yoga is a journey, not a destination. Embrace progress over perfection.
              </p>
            </div>
          </motion.div>

          {/* Daily Practice Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-3">
                Daily Yoga Practice
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Pose #{(poseIndex + 1)} of {yogaPoses.length} • Today's Date: {new Date().toLocaleDateString()}
              </p>
              <div className="flex justify-center">
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${((poseIndex + 1) / yogaPoses.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default YogaPose;