import Header from "@/components/Header";
import { Link } from "react-router-dom";
import fengShuiImage from "@/assets/feng-shui.jpg";

export default function Numerology() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-6 pt-28">
        <h1 className="text-3xl font-bold text-gold mb-2">What is Numerology?</h1>

        {/* Gold horizontal line */}
        <div className="border-t-4 border-gold w-32 mb-6"></div>

        <p className="mb-10 text-white/80">
          Some random Numerology explanation here. Image below is also just a placeholder.
        </p>
		
		{/* Feng Shui Image */}
        <div className="mb-10">
          <img
            src={fengShuiImage}
            alt="Feng Shui"
            className="w-full rounded-xl shadow-lg border border-gold/20"
          />
        </div>

		
        <h2 className="text-2xl font-semibold mb-4">Numerology Calculation Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/visiber-calculator">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Visiber</h3>
              <p className="text-sm text-white/80">Discover your personal element and how it influences your energy and traits.</p>
            </div>
          </Link>

          <Link to="/kua-number-calculator">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Some other</h3>
              <p className="text-sm text-white/80">Find your Kua number and your lucky and unlucky directions based on Feng Shui.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
