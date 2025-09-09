import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import astrologyImage from "@/assets/astrology.jpg";
import { ArrowRight, Moon, Star } from "lucide-react";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology" },
];

export default function Astrology() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Tools Intro Section */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} className="text-black/80" />
            <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Astrology Calculation Tools</h1>
            <p className="text-black/80 mb-6">
              Discover your cosmic blueprint with our <span className="font-semibold">free astrology tools</span>. Find your <span className="font-semibold">Chinese Zodiac animal</span> or <span className="font-semibold">Western zodiac sign</span> to explore the unique traits and celestial influences that shape your life's path.
            </p>
          </div>

          {/* Tool Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {/* Chinese Zodiac Calculator Card */}
            <Link
              to="/chinese-zodiac-calculator"
              className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto group-hover:bg-red-200 transition-colors">
                <Moon size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gold mb-3 text-center">Chinese Zodiac Calculator</h3>
              <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                Find your Chinese zodiac animal and learn about its traits, compatibility, and meaning based on your birth year.
              </p>
              <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                <span className="text-sm font-medium mr-2">Discover Your Animal</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Western Zodiac Calculator Card */}
            <Link
              to="/western-zodiac-calculator"
              className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                <Star size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gold mb-3 text-center">Western Zodiac Calculator</h3>
              <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                Uncover your Western zodiac sign and explore the traits, strengths, and influences that shape your personality.
              </p>
              <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                <span className="text-sm font-medium mr-2">Find Your Sign</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* "What is Astrology" Section */}
          <div>
            <h2 className="text-2xl font-bold text-gold mb-4">What is Astrology?</h2>
            <div className="border-t-4 border-gold w-32 mb-6"></div>

            <p className="mb-6 text-black/80 leading-relaxed">
              <span className="font-semibold">Astrology</span> is the ancient study of how the positions and movements of <span className="font-semibold">celestial bodies</span> influence life on Earth. From the alignment of the <span className="font-semibold">Sun, Moon, and planets</span> to the intricate patterns of the stars, astrology seeks to uncover the cosmic connections that shape our personalities, relationships, and destiny.
            </p>

            {/* Astrology Image */}
            <div className="mb-6">
              <img
                src={astrologyImage}
                alt="Astrology zodiac wheel"
                className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
              />
            </div>

            <p className="mb-6 text-black/80 leading-relaxed">
              Across cultures and centuries, <span className="font-semibold">astrology</span> has taken many forms—from <span className="font-semibold">Western horoscopes</span> to the <span className="font-semibold">Chinese Zodiac</span> and <span className="font-semibold">Vedic astrology</span>. Each system offers its own unique way of reading the sky and interpreting its messages.
            </p>

            <p className="mb-10 text-black/80 leading-relaxed">
              Whether you're exploring your <span className="font-semibold">zodiac sign</span>, seeking guidance for important decisions, or simply curious about the <span className="font-semibold">patterns of the universe</span>, astrology provides a timeless framework for understanding life's rhythms and your place within them.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}