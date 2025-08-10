// src/pages/Numerology.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import "./Numerology.css"; // Still keeping this in case we want to mix effects later

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Numerology" },
];

export default function Numerology() {
  return (
    <div className="numerology-page min-h-screen text-white relative overflow-hidden">
      {/* Sacred Geometry Background */}
<svg
  className="absolute inset-0 w-full h-full z-0 opacity-20"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <pattern
      id="sacredPattern"
      x="0"
      y="0"
      width="200"
      height="200"
      patternUnits="userSpaceOnUse"
    >
      {/* Hexagon shape with glow */}
      <polygon
        points="100,0 200,50 200,150 100,200 0,150 0,50"
        stroke="rgba(212,175,55,0.3)"
        strokeWidth="1"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values="
            rgba(212,175,55,0.3);
            rgba(212,175,55,0.6);
            rgba(212,175,55,0.3)"
          dur="6s"
          repeatCount="indefinite"
        />
      </polygon>

      {/* Circle inside with glow */}
      <circle
        cx="100"
        cy="100"
        r="60"
        stroke="rgba(212,175,55,0.15)"
        strokeWidth="1"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values="
            rgba(212,175,55,0.15);
            rgba(212,175,55,0.5);
            rgba(212,175,55,0.15)"
          dur="6s"
          repeatCount="indefinite"
          begin="3s"
        />
      </circle>
    </pattern>
  </defs>

  <rect
    width="100%"
    height="100%"
    fill="url(#sacredPattern)"
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 400 400"
      to="360 400 400"
      dur="120s"
      repeatCount="indefinite"
    />
  </rect>
</svg>

      {/* Floating numbers */}
      <div className="absolute inset-0 z-0">
        {[3, 7, 9, 11, 22].map((num, i) => (
          <span
            key={i}
            className="absolute text-gold text-6xl font-bold opacity-10 animate-float"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              animationDelay: `${i * 3}s`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      <Header />

      <div className="pt-24 px-4 max-w-3xl mx-auto relative z-10">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-2xl font-bold text-gold mb-4">
          What is Numerology?
        </h1>
        <div className="border-t-4 border-gold w-32 mb-4"></div>
      </div>

      <div className="max-w-4xl mx-auto p-6 pt-6 relative z-10">
        <p className="mb-6 text-white/80">
          Numerology is the study of the mystical significance of numbers and their influence on human life.
          It interprets patterns found in your name, birth date, and other personal details to reveal insights
          about your personality, strengths, challenges, and life path.
        </p>

        <p className="mb-6 text-white/80">
          At its core, numerology sees numbers as more than mere quantities — they are energetic symbols
          that carry meaning. By decoding these numbers, you can better understand yourself and make
          informed decisions in relationships, career, and personal growth.
        </p>

        <p className="mb-10 text-white/80">
          From ancient Pythagorean teachings to modern interpretations, numerology remains a powerful tool
          for self-discovery and guidance.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Numerology Calculation Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/visiber-calculator">
            <div className="bg-gold/10 border border-gold/30 hover:border-gold rounded-xl p-5 cursor-pointer transition hover:shadow-md">
              <h3 className="text-lg font-semibold text-gold mb-1">Visiber Calculator</h3>
              <p className="text-sm text-white/80">
                Explore your Visiber number and understand how it shapes your destiny, personality, and relationships.
              </p>
            </div>
          </Link>

          <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 opacity-50 cursor-not-allowed">
            <h3 className="text-lg font-semibold text-gold mb-1">Coming Soon</h3>
            <p className="text-sm text-white/80">
              More numerology tools will be added here to deepen your insights.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
