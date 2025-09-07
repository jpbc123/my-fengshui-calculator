import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cookie } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ImageSwiper } from "@/components/ImageSwiper"; 

import visualizationImage from '../assets/meditate-visualization.jpg';
import affirmationImage from '../assets/meditate-affirmation.jpg';
import yogaImage from '../assets/meditate-yoga.jpg';
import morningImage from '../assets/meditate-morning.jpg';
import eveningImage from '../assets/meditate-evening.jpg';
import breathingImage from '../assets/meditate-breathing.jpg';
import closedCookieImage from "@/assets/fortune-cookie-closed.jpg";
import brokenCookieImage from "@/assets/fortune-cookie-broken.jpg";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Daily Fortune Cookie" },
];

// Meditation options data
const meditationOptions = [
  {
    title: "Yoga Pose for the Day",
    description: "Stretch and energize your body with a simple daily pose",
    image: yogaImage,
    link: "/meditate-yoga-pose",
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
    title: "Morning Mindfulness",
    description: "Start your day calm, centered, and ready for opportunities",
    image: morningImage,
    link: "/meditate-morning",
  },
  {
    title: "Evening Relaxation",
    description: "Unwind and release tension before sleep for a peaceful night",
    image: eveningImage,
    link: "/meditate-evening",
  },
];

const fortuneMessages: string[] = [
  "A beautiful, smart, and loving person will enter your life.",
  "Good things come to those who wait, but better things come to those who try.",
  "Your kindness is a light that guides others.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
  "The best way to predict the future is to create it.",
  "An unexpected opportunity will soon arrive.",
  "Love is on its way, bringing joy and warmth to your heart.",
  "Your creative energy is flowing. Unleash it!",
  "A journey of a thousand miles begins with a single step.",
  "The present moment is filled with joy and wonder if you allow it to be.",
  "Take a risk; it might just pay off beautifully.",
  "Patience is a virtue that will soon be rewarded.",
  "A loyal friend will offer invaluable advice.",
  "Embrace change, for it brings new beginnings.",
  "Your hard work will soon manifest into tangible success.",
  "Happiness is not a destination, it is a way of life.",
  "Share your wisdom; it will benefit many.",
  "The greatest adventure is yet to come.",
  "Your ability to adapt will lead you to new heights.",
  "A secret admirer is thinking of you.",
  "Listen to your intuition; it holds the answers you seek.",
  "Celebrate small victories on your path to greatness.",
  "A new perspective will bring clarity.",
  "Your charm and wit will open many doors.",
  "You will soon overcome a challenge with grace.",
  "Kindness begets kindness; sow it generously.",
  "Fortune favors the bold and the prepared.",
  "Take time for self-care; your well-being matters.",
  "A hidden talent will soon emerge.",
  "Your positive attitude is your greatest asset.",
  "Expect great news from an unexpected source.",
  "The road ahead is filled with opportunities.",
  "Your generosity inspires those around you.",
  "Learn from yesterday, live for today, hope for tomorrow.",
  "An exciting new chapter is about to begin.",
  "Trust the timing of your life.",
  "Your vision and determination will lead to triumph.",
  "A peaceful resolution is within reach.",
  "Embrace your unique qualities; they are your strength.",
  "Your wisdom shines brighter than any star.",
  "A moment of calm reflection will bring insight.",
  "Opportunities multiply as they are seized.",
  "Let your dreams be your guide.",
  "A comforting presence will bring you peace.",
  "The effort you put in now will pay off later.",
  "Your compassionate heart makes a difference.",
  "Explore new horizons; adventure awaits.",
  "Be open to receiving unexpected blessings.",
  "Your destiny is in your hands; sculpt it beautifully.",
   "Keep your entryway clear — energy enters with you.",
  "A bowl of fresh fruit in the kitchen attracts abundance.",
  "Mirrors that reflect beauty double your blessings.",
  "Place plants in your home to invite growth and vitality.",
  "Flowing water symbolizes wealth; keep it clean and moving.",
  "Declutter your desk to welcome new opportunities.",
  "A red front door attracts prosperity and protection.",
  "Keep your bed positioned where you can see the door.",
  "Broken items block chi — repair or release them.",
  "Fresh flowers uplift energy instantly.",
  "Balance yin and yang to create harmony in your home.",
  "Open windows often to let new energy in.",
  "A crystal near your window draws light and positivity.",
  "Avoid clutter under your bed to rest more peacefully.",
  "The wealth corner of your home is the far left from the entrance.",
  "Use round dining tables to encourage unity.",
  "Wind chimes can disperse stagnant chi.",
  "Soft lighting creates a calm and nurturing atmosphere.",
  "Keep bathrooms clean to prevent energy drains.",
  "Add earth tones for stability and grounding.",
  "Flowing curtains invite gentle movement of energy.",
  "Two bedside tables promote balance in relationships.",
  "Place family photos in the living room for support.",
  "Keep sharp objects stored away to reduce tension.",
  "Add splashes of red in the south for recognition and fame.",
  "Organize your closet to create mental clarity.",
  "A full rice jar is a symbol of abundance.",
  "Gold accents in the home enhance wealth energy.",
  "Avoid mirrors directly facing your bed.",
  "Keep your stove clean; it represents prosperity.",
  "Use green for growth and fresh beginnings.",
  "Add blue in the north to support your career path.",
  "Light a candle to attract warmth and passion.",
  "Keep hallways open for smooth energy flow.",
  "Repair leaks quickly — they symbolize money loss.",
  "Hang artwork that uplifts and inspires you.",
  "Display pairs of objects to enhance love energy.",
  "Avoid placing your bed under a window.",
  "A fountain at the entrance invites prosperity.",
  "Keep work and rest areas clearly separated.",
  "Place a jade plant near the entry for wealth luck.",
  "Use natural materials for stronger grounding energy.",
  "Avoid clutter behind doors; it blocks opportunity.",
  "A tidy kitchen invites health and nourishment.",
  "Place books neatly to support knowledge and wisdom.",
  "Hang a crystal in the window to scatter rainbows.",
  "Use earthy ceramics in the center of your home.",
  "Keep electronics out of the bedroom for restful sleep.",
  "Add plants with rounded leaves for softer energy.",
  "Hang art of open landscapes to invite possibilities.",
  "Keep shoes organized by the entrance to respect energy flow.",
  "Salt cleansing removes stagnant or negative chi.",
  "An aquarium with healthy fish enhances abundance.",
  "Avoid beams over your bed or desk — they create pressure.",
  "Use lavender to calm and purify the home.",
  "A smiling Buddha statue invites joy and protection.",
  "Balance all five elements — wood, fire, earth, metal, water.",
  "Clear your wallet of clutter to attract new wealth.",
  "Keep your front pathway open and welcoming.",
  "Invite natural light — it’s the best chi activator.",
  "Every item in your home should bring you joy or purpose."
];

const FortuneCookie = () => {
  const [isCookieBroken, setIsCookieBroken] = useState(false);
  const [currentFortune, setCurrentFortune] = useState("");
  const [isRevealing, setIsRevealing] = useState(false); // State to manage animation flow

  const handleGetFortune = () => {
    setIsRevealing(true); // Start revealing animation
    setCurrentFortune(""); // Clear previous fortune immediately

    // Simulate the cookie breaking animation
    setTimeout(() => {
      setIsCookieBroken(true);
      const randomIndex = Math.floor(Math.random() * fortuneMessages.length);
      setCurrentFortune(fortuneMessages[randomIndex]);
    }, 800); // Allow time for cookie image transition

    // Reset revealing state after full animation
    setTimeout(() => {
      setIsRevealing(false);
    }, 2000); // Adjust based on your desired total animation time
  };

  const handleGetAnotherFortune = () => {
    setIsCookieBroken(false); // Reset to closed cookie
    setCurrentFortune(""); // Clear fortune
    setIsRevealing(false); // Reset revealing state
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <Breadcrumb items={breadcrumbs} className="text-black/80" />
          <h1 className="text-2xl font-bold text-gold mb-4">Daily Fortune Cookie</h1>
          <p className="text-black/80 mb-6">
            Click the button to reveal your daily fortune! Let the universe guide you with a message of wisdom, luck, or inspiration.
          </p>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-10">

          {/* Cookie and Fortune Display */}
          <div className="relative w-full max-w-sm mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {!isCookieBroken && (
                <motion.img
                  key="closed-cookie"
                  src={closedCookieImage}
                  alt="Closed Fortune Cookie"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
                  transition={{ duration: 0.7 }}
                  className="w-full max-w-[300px] h-auto object-contain mb-8"
                />
              )}

              {isCookieBroken && (
                <motion.div
                  key="broken-cookie-and-fortune"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <img
                    src={brokenCookieImage}
                    alt="Broken Fortune Cookie"
                    className="w-full max-w-[300px] h-auto object-contain mb-4"
                  />
                  <motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
					// Edited className below for a scroll-like appearance
					className="text-lg font-semibold text-amber-900 mt-4 px-4 py-2 bg-amber-100 border border-amber-300 transform -rotate-1"
					>
					{currentFortune}
					</motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Button */}
          <div className="w-full max-w-sm mx-auto">
            {!isCookieBroken ? (
              <Button
				variant="gold"
                onClick={handleGetFortune}
                disabled={isRevealing}
                className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
              >
                {isRevealing ? (
                  <>
                    <Sparkles size={20} className="animate-spin mr-2" />
                    Opening...
                  </>
                ) : (
                  <>
                    <Cookie size={20} className="mr-2" />
                    Get My Fortune Cookie!
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleGetAnotherFortune}
                className="px-8 h-14 text-lg font-semibold whitespace-nowrap"
              >
                Get Another Fortune Cookie
              </Button>
            )}
          </div>

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

export default FortuneCookie;