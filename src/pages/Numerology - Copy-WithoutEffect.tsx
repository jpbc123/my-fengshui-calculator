import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import numerologyImage from "@/assets/numerology.jpg";
// The useEffect hook and background CSS for particle effects have been removed to align with the FengShui page style.

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Numerology" },
];

export default function Numerology() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Tools Intro Section */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} className="text-black/80" />
            <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Numerology Calculation Tools</h1>
            <p className="text-black/80 mb-6">
              Unlock the hidden power of numbers and how they shape your destiny. Begin with our <span className="font-semibold">free Numerology tools</span> below to reveal your unique <span className="font-semibold">life path and personal insights</span>.
            </p>
          </div>

          {/* Tool Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Link
              to="/visiber-calculator"
              className="bg-gray-50 border border-gold/30 rounded-xl p-6 hover:bg-gray-100 transition shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">🔢</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Visiber Calculator</h3>
              <p className="text-center text-black/70 text-sm">
                Explore your Visiber number and understand how it shapes your destiny, personality, and relationships.
              </p>
            </Link>

            <Link
              to="#"
              className="bg-gray-50 border border-gold/30 rounded-xl p-6 opacity-50 cursor-not-allowed pointer-events-none shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">⏳</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Coming Soon</h3>
              <p className="text-center text-black/70 text-sm">
                More numerology tools will be added here to deepen your insights.
              </p>
            </Link>
          </div>

          {/* "What is Numerology" Section */}
          <div>
            <h2 className="text-2xl font-bold text-gold mb-4">What is Numerology?</h2>
            <div className="border-t-4 border-gold w-32 mb-4"></div>

            <p className="mb-6 text-black/80">
              <span className="font-semibold">Numerology</span> is the study of the mystical significance of <span className="font-semibold">numbers and their influence on human life</span>. It interprets patterns found in your name, birth date, and other personal details to reveal insights about your <span className="font-semibold">personality, strengths, challenges, and life path</span>.
            </p>

            {/* Numerology Image */}
            <div className="mb-6">
              <img
                src={numerologyImage}
                alt="Numerology"
                className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
              />
            </div>

            <p className="mb-6 text-black/80">
              At its core, numerology sees numbers as more than mere quantities—they are <span className="font-semibold">energetic symbols</span> that carry meaning. By decoding these numbers, you can better understand yourself and make informed decisions in relationships, career, and personal growth.
            </p>

            <p className="mb-10 text-black/80">
              From ancient <span className="font-semibold">Pythagorean teachings</span> to modern interpretations, <span className="font-semibold">numerology</span> remains a powerful tool for self-discovery and guidance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}