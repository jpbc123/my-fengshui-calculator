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
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Breadcrumbs + title */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} className="text-black/80" />
            <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Feng Shui Calculator Tools</h1>
            <p className="text-black/80 mb-6">
              Discover how <span className="font-semibold">Feng Shui</span> can guide <span className="font-semibold">harmony, balance, and positive energy</span> in your life.
              Start with our free tools below to explore your <span className="font-semibold">personal Feng Shui insights</span>, including your <span className="font-semibold">Kua number</span> and <span className="font-semibold">lucky directions</span>.
            </p>
          </div>

          {/* Tools Intro Section */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {/* Tool Cards */}
            <Link
              to="/kua-number-calculator"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-gray-800 border border-gold/30 rounded-xl p-6 hover:from-purple-600 hover:via-indigo-600 hover:to-gray-700 transition shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">☯</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Kua Number Calculator</h3>
              <p className="text-center text-white/70 text-sm">
                Find your personal Kua Number and discover your best directions for luck and success.
              </p>
            </Link>
            <Link
              to="/personal-element"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-gray-800 border border-gold/30 rounded-xl p-6 hover:from-purple-600 hover:via-indigo-600 hover:to-gray-700 transition shadow-lg"
            >
              <div className="flex justify-center w-3xl mb-3">🔥</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Personal Element Analysis</h3>
              <p className="text-center text-white/70 text-sm">
                Explore your elemental balance and Feng Shui alignment based on your birthdate.
              </p>
            </Link>
          </div>

          {/* "What is Feng Shui?" Section */}
          <div>
            <h2 className="text-2xl font-bold text-gold mb-4">What is Feng Shui?</h2>
            <div className="border-t-4 border-gold w-32 mb-4"></div>

            <p className="mb-6 text-black/80">
              <span className="font-semibold">Feng Shui</span> is an <span className="font-semibold">ancient Chinese metaphysical system</span> that seeks harmony and <span className="font-semibold">auspiciousness</span> between individuals and their surrounding environment. It's about how
              <span className="font-semibold"> energy (Qi)</span> flows through spaces and how we can align ourselves for <span className="font-semibold">success, health, and balance</span>.
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
              <span className="font-semibold">Feng Shui principles</span> are deeply rooted in the <span className="font-semibold">Five Elements theory</span> —
              Wood, Fire, Earth, Metal, and Water — and the concept of <span className="font-semibold">Yin and Yang</span>. These elements interact in dynamic cycles, influencing everything from <span className="font-semibold">architecture and interior design</span> to personal luck and energy flow.
            </p>

            <p className="mb-6 text-black/80">
              By analyzing the orientation of a space, the placement of furniture,
              and even the surrounding natural landscape, <span className="font-semibold">Feng Shui practitioners</span> aim to optimize the balance of <span className="font-semibold">Qi</span>. This alignment is believed to enhance <span className="font-semibold">prosperity, relationships, health, and overall well-being</span>.
            </p>

            <p className="mb-10 text-black/80">
              Today, <span className="font-semibold">Feng Shui</span> is practiced worldwide, blending traditional wisdom
              with modern lifestyles. Whether you're designing your home, choosing a
              work desk location, or exploring your <span className="font-semibold">personal energy chart</span>, Feng Shui
              offers timeless guidance for living in harmony with the universe.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}