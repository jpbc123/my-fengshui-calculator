// src/pages/MeditateYogaPose.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { label: "Yoga Pose for the Day" },
];

const yogaPoses = [
  {
    name: "Mountain Pose (Tadasana)",
    image: tadasanaPoseImage,
    description:
      "A foundational standing pose that promotes grounding, posture, and balance.",
    benefits: [
      "Improves posture and alignment",
      "Strengthens legs and core",
      "Cultivates awareness and grounding",
    ],
  },
  {
    name: "Downward Dog (Adho Mukha Svanasana)",
    image: downwardDogPoseImage,
    description:
      "An energizing pose that stretches the entire body and calms the mind.",
    benefits: [
      "Stretches hamstrings, calves, and spine",
      "Strengthens arms and shoulders",
      "Relieves stress and boosts circulation",
    ],
  },
  {
    name: "Tree Pose (Vrikshasana)",
    image: treePoseImage,
    description: "A balancing posture that fosters focus and stability.",
    benefits: [
      "Improves balance and concentration",
      "Strengthens ankles and legs",
      "Promotes calmness and focus",
    ],
  },
  {
    name: "Child’s Pose (Balasana)",
    image: balasanaPoseImage,
    description:
      "A gentle resting pose that relaxes the body and soothes the nervous system.",
    benefits: [
      "Releases tension in back and shoulders",
      "Calms the mind and reduces fatigue",
      "Gently stretches hips, thighs, and ankles",
    ],
  },
  {
    name: "Warrior I (Virabhadrasana I)",
    image: warrior1PoseImage,
    description: "A strong standing pose that builds stamina and confidence.",
    benefits: [
      "Strengthens legs, ankles, arms, and shoulders",
      "Opens chest and lungs, improving breathing",
      "Builds stamina, focus, and determination",
      "Stretches hips, abdomen, and back",
      "Encourages grounding and stability",
    ],
  },
  {
    name: "Warrior II (Virabhadrasana II)",
    image: warrior2PoseImage,
    description: "A strong standing pose that builds stamina and confidence.",
    benefits: [
      "Strengthens legs and arms",
      "Opens hips and chest",
      "Boosts stamina, focus, and energy",
    ],
  },
  {
    name: "Warrior III (Virabhadrasana III)",
    image: warrior3PoseImage,
    description: "A challenging balancing pose that cultivates focus.",
    benefits: [
      "Strengthens legs, core, and back",
      "Improves balance and stability",
      "Develops concentration and determination",
    ],
  },
  {
    name: "Cobra Pose (Bhujangasana)",
    image: cobraPoseImage,
    description: "Gentle backbend that opens the chest and strengthens the spine.",
    benefits: [
      "Improves flexibility of the spine",
      "Opens chest and lungs",
      "Stimulates abdominal organs",
    ],
  },
  {
    name: "Bridge Pose (Setu Bandha Sarvangasana)",
    image: bridgePoseImage,
    description:
      "A backbend and chest-opening pose performed lying on the back.",
    benefits: [
      "Strengthens legs, glutes, and lower back",
      "Opens chest and shoulders",
      "Relieves stress and anxiety",
    ],
  },
  {
    name: "Seated Forward Bend (Paschimottanasana)",
    image: seatedForwardBendPoseImage,
    description: "Classic seated stretch reaching toward the toes.",
    benefits: [
      "Stretches spine, hamstrings, and shoulders",
      "Soothes the nervous system",
      "Relieves stress and mild depression",
    ],
  },
  {
    name: "Triangle Pose (Trikonasana)",
    image: trianglePoseImage,
    description: "A side-stretching pose that lengthens and energizes the body.",
    benefits: [
      "Stretches legs, hips, and spine",
      "Opens chest and shoulders",
      "Improves digestion and stability",
    ],
  },
  {
    name: "Lotus Pose (Padmasana)",
    image: lotusPoseImage,
    description: "Iconic seated meditation posture with crossed legs.",
    benefits: [
      "Promotes relaxation and inner calm",
      "Supports meditation and breathing",
      "Improves posture and spinal alignment",
    ],
  },
  {
	name: "Plank Pose (Phalakasana)",
	image: plankPoseImage,
	description: "A strength-building posture that engages the entire body.",
	benefits: [
		"Strengthens core, arms, shoulders, and legs",
		"Builds endurance and stability",
		"Improves posture and body awareness",
	],
	},
	{
	name: "Boat Pose (Navasana)",
	image: boatPoseImage,
	description: "A seated balance pose that fires up the abdominal muscles.",
	benefits: [
		"Strengthens abs, hip flexors, and spine",
		"Improves balance and focus",
		"Stimulates digestion and metabolism",
	],
	},
	{
	name: "Pigeon Pose (Kapotasana Variation)",
	image: pigeonPoseImage,
	description: "A deep hip-opening posture that releases built-up tension.",
	benefits: [
		"Stretches hip flexors, glutes, and thighs",
		"Improves hip flexibility and mobility",
		"Relieves stress and calms the mind",
	],
  }
];

const YogaPose = () => {
const [poseIndex, setPoseIndex] = useState(0);

// Pick a "pose of the day" based on date
useEffect(() => {
  const today = new Date();
  const index = today.getDate() % yogaPoses.length;
  setPoseIndex(index);
}, []);

const handleNewPose = () => {
  setPoseIndex((prevIndex) => (prevIndex + 1) % yogaPoses.length);
};

const pose = yogaPoses[poseIndex];


  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <main className="flex-grow pt-6 px-4 pb-10">
        <div className="pt-24 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">
            Yoga Pose for the Day
          </h1>
          <p className="text-black/80 mb-6">
            Start your day with a yoga pose that energizes your body, improves
            flexibility, and brings calm to your mind.
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={pose.name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-lg"
            >
              <img
                src={pose.image}
                alt={pose.name}
                className="w-full rounded-lg mb-6 shadow-md object-cover"
              />
              <h2 className="text-xl font-bold text-yellow-600 mb-2">
                {pose.name}
              </h2>
              <p className="text-black/80 mb-3">{pose.description}</p>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Benefits:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {pose.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            <Button
              variant="gold"
              size="lg"
              className="px-8 h-14 text-lg font-semibold border border-yellow-500"
              onClick={handleNewPose}
            >
              Show Another Pose
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default YogaPose;
