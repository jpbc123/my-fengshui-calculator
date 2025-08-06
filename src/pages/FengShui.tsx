// src/pages/FengShui.tsx
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import fengShuiImage from "@/assets/feng-shui.jpg";

export default function FengShui() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-28">
        <h1 className="text-3xl font-bold text-gold mb-2">What is Feng Shui?</h1>

        {/* Gold horizontal line */}
        <div className="border-t-4 border-gold w-32 mb-6"></div>

        <p className="mb-10 text-white/80">
          Feng Shui is an ancient Chinese metaphysical system that seeks harmony between individuals and their surrounding environment.
          It's about how energy (Qi) flows through spaces and how we can align ourselves for success, health, and balance.
        </p>
		
		{/* Feng Shui Image */}
        <div className="mb-10">
          <img
            src={fengShuiImage}
            alt="Feng Shui"
            className="w-full rounded-xl shadow-lg border border-gold/20"
          />
        </div>
        <p className="mb-10 text-white/80">
          Feng Shui principles are deeply rooted in the Five Elements theory — Wood, Fire, Earth, Metal, and Water — and the concept of Yin and Yang. These elements interact in dynamic cycles, influencing everything from architecture and interior design to personal luck and energy flow.
        </p>
		<p className="mb-10 text-white/80">
          By analyzing the orientation of a space, the placement of furniture, and even the surrounding natural landscape, Feng Shui practitioners aim to optimize the balance of Qi. This alignment is believed to enhance prosperity, relationships, health, and overall well-being.
        </p>
		
		<p className="mb-10 text-white/80">
          Today, Feng Shui is practiced worldwide, blending traditional wisdom with modern lifestyles. Whether you're designing your home, choosing a work desk location, or exploring your personal energy chart, Feng Shui offers timeless guidance for living in harmony with the universe.
        </p>
		
        <h2 className="text-2xl font-semibold mb-4">Chinese Feng Shui Calculation Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/personal-element">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Personal Element Analysis</h3>
              <p className="text-sm text-white/80">Discover your personal element and how it influences your energy and traits.</p>
            </div>
          </Link>

          <Link to="/kua-number-calculator">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Kua Number Calculator</h3>
              <p className="text-sm text-white/80">Find your Kua number and your lucky and unlucky directions based on Feng Shui.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
