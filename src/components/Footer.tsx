// src/components/Footer.tsx
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black via-50% border-t border-purple-400/30 text-white">
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Brand - Left side */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <LogoIcon />
            <h2 className="text-2xl sm:text-3xl font-bold text-gold font-charity leading-snug">
              Feng Shui & Beyond
            </h2>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-sm">
            Harness the power of Feng Shui, Numerology, and Astrology to transform your home and life. Discover daily insights, personal horoscopes, and tools for positive energy and harmony.
          </p>
        </div>

        {/* Navigation Links - Right side, aligned with justify-self-end */}
        <div className="md:col-span-1 grid grid-cols-2 lg:grid-cols-3 gap-8 justify-self-end">
          {/* Explore by Wisdom */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Explore by Wisdom</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/feng-shui" className="hover:text-gold transition-colors">Feng Shui</Link></li>
              <li><Link to="/numerology" className="hover:text-gold transition-colors">Numerology</Link></li>
              <li><Link to="/astrology" className="hover:text-gold transition-colors">Astrology</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/coming-store" className="hover:text-gold transition-colors">Store</Link></li>
              <li><Link to="/community-chat" className="hover:text-gold transition-colors">Community Discussions</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about-us" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p className="order-2 md:order-1 mt-4 md:mt-0">© {new Date().getFullYear()} Feng Shui & Beyond. All rights reserved.</p>
          <div className="flex gap-4 order-1 md:order-2">
            <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;