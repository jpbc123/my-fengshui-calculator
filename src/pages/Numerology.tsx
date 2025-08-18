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
    <div className="numerology-page min-h-screen text-white relative overflow-hidden bg-black overflow-hidden">
      {/* Effects */}
      <canvas id="particleCanvas" className="absolute inset-0 z-0 pointer-events-none"></canvas>
      <Header />
      <div className="pt-24 px-4 max-w-3xl mx-auto relative z-10">
        <Breadcrumb items={breadcrumbs} />
      </div>
	  
	  {/* Tools Intro Section */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-semibold text-gold mb-6">
          Numerology Tools
        </h2>
		<p className="text-white/80 mb-6">
        Unlock the hidden power of numbers and how they shape your destiny. 
		Begin with our free Numerology tools below to reveal your unique life path and personal insights.
        </p>
		
		{/* Tool Cards */}
        <div className="grid gap-6 md:grid-cols-2">
			<Link to="/visiber-calculator"
			className="bg-black/40 border border-gold/30 rounded-xl p-6 hover:bg-gold/10 transition shadow-lg">
			<div className="flex justify-center text-3xl mb-3">🔢</div>
			  <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Visiber Calculator</h3>
			  <p className="text-center text-white/70 text-sm">
			Explore your Visiber number and understand how it shapes your destiny, personality, and relationships.
			</p>
			</Link>
			
			<Link to="#"
			className="bg-black/40 border border-gold/30 rounded-xl p-6 opacity-50 cursor-not-allowed pointer-events-none shadow-lg">
			<div className="flex justify-center text-3xl mb-3">⏳</div>
			  <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Coming Soon</h3>
			  <p className="text-center text-white/70 text-sm">
			More numerology tools will be added here to deepen your insights.
			</p>
			</Link>
        </div>
      </div>
	  
	  {/* "What is Numerology" Section */}
      <div className="max-w-4xl mx-auto p-6 pt-6">
        <h2 className="text-2xl font-bold text-gold mb-4">What is Numerology?</h2>
        <div className="border-t-4 border-gold w-32 mb-4"></div>
      
        <p className="mb-6 text-white/80">
          Numerology is the study of the mystical significance of numbers and their influence on human life.
          It interprets patterns found in your name, birth date, and other personal details to reveal insights
          about your personality, strengths, challenges, and life path.
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
          At its core, numerology sees numbers as more than mere quantities — they are energetic symbols
          that carry meaning. By decoding these numbers, you can better understand yourself and make
          informed decisions in relationships, career, and personal growth.
        </p>

        <p className="mb-10 text-white/80">
          From ancient Pythagorean teachings to modern interpretations, numerology remains a powerful tool
          for self-discovery and guidance.
        </p>
        </div>
      <Footer />
    </div>
  );
}
