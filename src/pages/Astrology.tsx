import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import astrologyImage from "@/assets/astrology.jpg";
// Removed useEffect hook for the meteor effect and the background CSS file import.

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
            <Link
              to="/chinese-zodiac-calculator"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-gray-800 border border-gold/30 rounded-xl p-6 hover:from-purple-600 hover:via-indigo-600 hover:to-gray-700 transition shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">🐲</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Chinese Zodiac Calculator</h3>
              <p className="text-center text-black/70 text-sm">
                Find your Chinese zodiac animal and learn about its traits, compatibility, and meaning.
              </p>
            </Link>

            <Link
              to="/western-zodiac-calculator"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-gray-800 border border-gold/30 rounded-xl p-6 hover:from-purple-600 hover:via-indigo-600 hover:to-gray-700 transition shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">♊</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Western Zodiac Calculator</h3>
              <p className="text-center text-black/70 text-sm">
                Uncover your Western zodiac sign and explore the traits, strengths, and influences that shape your personality.
              </p>
            </Link>
          </div>

          {/* "What is Astrology" Section */}
          <div>
            <h2 className="text-2xl font-bold text-gold mb-4">What is Astrology?</h2>
            <div className="border-t-4 border-gold w-32 mb-4"></div>

            <p className="mb-6 text-black/80">
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

            <p className="mb-6 text-black/80">
              Across cultures and centuries, <span className="font-semibold">astrology</span> has taken many forms—from <span className="font-semibold">Western horoscopes</span> to the <span className="font-semibold">Chinese Zodiac</span> and <span className="font-semibold">Vedic astrology</span>. Each system offers its own unique way of reading the sky and interpreting its messages.
            </p>

            <p className="mb-10 text-black/80">
              Whether you’re exploring your <span className="font-semibold">zodiac sign</span>, seeking guidance for important decisions, or simply curious about the <span className="font-semibold">patterns of the universe</span>, astrology provides a timeless framework for understanding life’s rhythms and your place within them.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}