// src/pages/FengShui.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import fengShuiImage from "@/assets/feng-shui.jpg";
import Breadcrumb from "@/components/Breadcrumb";
import "./fengshui-background.css";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Feng Shui" },
];

export default function FengShui() {
  return (
    <div className="fengshui-bg min-h-screen bg-white text-white overflow-hidden">
      <Header />
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Tools Intro Section */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-semibold text-gold mb-6">
          Feng Shui Tools
        </h2>
		<p className="text-black/80 mb-6">
          Discover how Feng Shui can guide harmony, balance, and energy in your life. 
          Start with our free tools below to explore your personal Feng Shui insights.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tool Cards */}
			<Link
			to="/kua-number-calculator"
			className="bg-gradient-to-r from-purple-700 via-gray-800 to-indigo-700 border border-gold/30 rounded-xl p-6 
           hover:from-purple-600 hover:via-gray-700 hover:to-indigo-600 transition shadow-lg"
			>
			<div className="flex justify-center text-3xl mb-3">☯</div>
			<h3 className="flex justify-center text-xl font-bold text-gold mb-2">Kua Number Calculator</h3>
			<p className="text-center text-white/70 text-sm">
				Find your personal Kua Number and discover your best directions for luck and success.
			</p>
			</Link>
			
			<Link
			to="/personal-element"
			className="bg-gradient-to-r from-purple-700 via-gray-800 to-indigo-700 border border-gold/30 rounded-xl p-6 
           hover:from-purple-600 hover:via-gray-700 hover:to-indigo-600 transition shadow-lg"
			>
			<div className="flex justify-center w-3xl mb-3">🔥</div>
			<h3 className="flex justify-center text-xl font-bold text-gold mb-2">Personal Element Analysis</h3>
			<p className="text-center text-white/70 text-sm">
				Explore your elemental balance and Feng Shui alignment based on your birthdate.
			</p>
			</Link>
        </div>
      </div>

      {/* "What is Feng Shui?" Section */}
      <div className="max-w-4xl mx-auto p-6 pt-6">
        <h2 className="text-2xl font-bold text-gold mb-4">What is Feng Shui?</h2>
        <div className="border-t-4 border-gold w-32 mb-4"></div>

        <p className="mb-6 text-black/80">
          Feng Shui is an ancient Chinese metaphysical system that seeks harmony 
          between individuals and their surrounding environment. It's about how 
          energy (Qi) flows through spaces and how we can align ourselves for 
          success, health, and balance.
        </p>

        {/* Feng Shui Image */}
        <div className="mb-6">
          <img
            src={fengShuiImage}
            alt="feng shui bagua energy"
            className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
          />
        </div>

        <p className="mb-6 text-black/80">
          Feng Shui principles are deeply rooted in the Five Elements theory — 
          Wood, Fire, Earth, Metal, and Water — and the concept of Yin and Yang. 
          These elements interact in dynamic cycles, influencing everything from 
          architecture and interior design to personal luck and energy flow.
        </p>

        <p className="mb-6 text-black/80">
          By analyzing the orientation of a space, the placement of furniture, 
          and even the surrounding natural landscape, Feng Shui practitioners aim 
          to optimize the balance of Qi. This alignment is believed to enhance 
          prosperity, relationships, health, and overall well-being.
        </p>

        <p className="mb-10 text-black/80">
          Today, Feng Shui is practiced worldwide, blending traditional wisdom 
          with modern lifestyles. Whether you're designing your home, choosing a 
          work desk location, or exploring your personal energy chart, Feng Shui 
          offers timeless guidance for living in harmony with the universe.
        </p>
      </div>

      <Footer />
    </div>
  );
}
