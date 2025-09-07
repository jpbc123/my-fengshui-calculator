import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect } from "react";
import numerologyImage from "@/assets/numerology.jpg";
import "./Numerology.css";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Numerology" },
];

export default function Numerology() {
  useEffect(() => {
    // Particle generation
    const canvas = document.getElementById("particleCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; opacity: number; speedX: number; speedY: number }[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          opacity: Math.random() * 0.6,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(212,175,55,1)"; // gold color

      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="numerology-page min-h-screen text-white relative overflow-hidden bg-black">
      {/* Effects */}
      <canvas id="particleCanvas" className="absolute inset-0 z-0 pointer-events-none"></canvas>
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10 relative z-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Tools Intro Section */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} className="text-white/80" />
            <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Numerology Calculation Tools</h1>
            <p className="text-white/80 mb-6">
              Unlock the hidden power of numbers and how they shape your destiny. Begin with our <span className="font-semibold">free Numerology tools</span> below to reveal your unique <span className="font-semibold">life path and personal insights</span>.
            </p>
          </div>

          {/* Tool Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Link
              to="/visiber-calculator"
              className="bg-black/40 border border-gold/30 rounded-xl p-6 hover:bg-gold/10 transition shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">🔢</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Visiber Calculator</h3>
              <p className="text-center text-white/70 text-sm">
                Explore your Visiber number and understand how it shapes your destiny, personality, and relationships.
              </p>
            </Link>

            <Link
              to="#"
              className="bg-black/40 border border-gold/30 rounded-xl p-6 opacity-50 cursor-not-allowed pointer-events-none shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">⏳</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Coming Soon</h3>
              <p className="text-center text-white/70 text-sm">
                More numerology tools will be added here to deepen your insights.
              </p>
            </Link>
          </div>

          {/* "What is Numerology" Section */}
          <div>
            <h2 className="text-2xl font-bold text-gold mb-4">What is Numerology?</h2>
            <div className="border-t-4 border-gold w-32 mb-4"></div>

            <p className="mb-6 text-white/80">
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

            <p className="mb-6 text-white/80">
              At its core, numerology sees numbers as more than mere quantities—they are <span className="font-semibold">energetic symbols</span> that carry meaning. By decoding these numbers, you can better understand yourself and make informed decisions in relationships, career, and personal growth.
            </p>

            <p className="mb-10 text-white/80">
              From ancient <span className="font-semibold">Pythagorean teachings</span> to modern interpretations, <span className="font-semibold">numerology</span> remains a powerful tool for self-discovery and guidance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}