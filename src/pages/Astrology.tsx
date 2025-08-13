import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import astrologyImage from "@/assets/astrology.jpg"; // You’ll need to add this image
import "./Astrology.css"; // Optional if you want background effects like Numerology

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology" },
];

export default function Astrology() {
  return (
    <div className="astrology-page min-h-screen bg-black text-white overflow-hidden">
      <Header />

      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">
          What is Astrology?
        </h1>
        {/* Gold horizontal line */}
        <div className="border-t-4 border-gold w-32 mb-4"></div>
      </div>

      <div className="max-w-4xl mx-auto p-6 pt-6">
        <p className="mb-6 text-white/80">
          Astrology is the ancient study of how the positions and movements of celestial bodies influence life on Earth.
          From the alignment of the Sun, Moon, and planets to the intricate patterns of the stars, astrology seeks to
          uncover the cosmic connections that shape our personalities, relationships, and destiny.
        </p>

        {/* Astrology Image */}
        <div className="mb-6">
          <img
            src={astrologyImage}
            alt="Astrology zodiac wheel"
            className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
          />
        </div>

        <p className="mb-6 text-white/80">
          Across cultures and centuries, astrology has taken many forms — from Western horoscopes to the Chinese
          zodiac and Vedic astrology. Each system offers its own unique way of reading the sky and interpreting
          its messages.
        </p>

        <p className="mb-10 text-white/80">
          Whether you’re exploring your zodiac sign, seeking guidance for important decisions, or simply curious
          about the patterns of the universe, astrology provides a timeless framework for understanding life’s
          rhythms and your place within them.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Astrology Calculation Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chinese Zodiac Calculator */}
          <Link to="/chinese-zodiac-calculator">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Chinese Zodiac Calculator</h3>
              <p className="text-sm text-white/80">
                Find your Chinese zodiac animal and learn about its traits, compatibility, and meaning.
              </p>
            </div>
          </Link>

          {/* Placeholder for future astrology tool */}
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 opacity-50 cursor-not-allowed">
            <h3 className="text-lg font-semibold text-gold mb-1">Coming Soon</h3>
            <p className="text-sm text-white/80">
              More astrology tools will be added here to expand your cosmic insights.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
