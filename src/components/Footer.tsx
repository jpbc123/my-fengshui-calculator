// src/components/Footer.tsx
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-gold/20 text-white mt-16">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <LogoIcon />
            <h2 className="text-lg font-bold text-gold">Destiny in Numbers</h2>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Unlock the wisdom of Feng Shui, Numerology, and Astrology to align your life with the flow of energy.
          </p>
        </div>

        {/* Explore by Wisdom */}
        <div>
          <h3 className="text-gold font-semibold mb-3">Explore by Wisdom</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/feng-shui" className="hover:text-gold">Feng Shui</Link></li>
            <li><Link to="/numerology" className="hover:text-gold">Numerology</Link></li>
            <li><Link to="/astrology" className="hover:text-gold">Astrology</Link></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="text-gold font-semibold mb-3">Community</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-gold">Store</Link></li>
            <li><Link to="#" className="hover:text-gold">Community Chat</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-gold font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-gold">Terms & Conditions</Link></li>
            <li><Link to="#" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Destiny in Numbers. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-gold"><Facebook size={18} /></a>
            <a href="#" className="hover:text-gold"><Instagram size={18} /></a>
            <a href="#" className="hover:text-gold"><Youtube size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
