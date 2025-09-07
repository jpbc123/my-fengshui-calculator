// src/components/Footer.tsx
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black via-50% border-t border-purple-400/30 text-white">
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row md:items-start md:justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 mb-8 md:mb-0 flex-shrink-0">
          <LogoIcon />
          <h2 className="text-2xl sm:text-3xl font-bold text-gold font-charity leading-snug">
            Feng Shui & Beyond
          </h2>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-wrap gap-12">
          {/* Articles */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Articles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/article" className="hover:text-gold transition-colors">
                  All Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore by Wisdom */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Explore by Wisdom</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/feng-shui" className="hover:text-gold transition-colors">Feng Shui</Link></li>
              <li><Link to="/astrology" className="hover:text-gold transition-colors">Astrology</Link></li>
              <li><Link to="/numerology" className="hover:text-gold transition-colors">Numerology</Link></li>
              <li><Link to="/horoscope" className="hover:text-gold transition-colors">Horoscope</Link></li>
            </ul>
          </div>

          {/* Meditation */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Meditation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/meditate-yoga-pose" className="hover:text-gold transition-colors">Yoga Pose for the Day</Link></li>
              <li><Link to="/meditate-affirmation" className="hover:text-gold transition-colors">Daily Affirmations</Link></li>
              <li><Link to="/meditate-visualization" className="hover:text-gold transition-colors">Visualization Exercises</Link></li>
			  <li><Link to="/meditate-morning" className="hover:text-gold transition-colors">Morning Mindfulness</Link></li>
			  <li><Link to="/meditate-evening" className="hover:text-gold transition-colors">Evening Relaxation</Link></li>
            </ul>
          </div>

          {/* Games & Fun */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Games & Fun</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/lucky-numbers" className="hover:text-gold transition-colors">Lucky Numbers</Link></li>
              <li><Link to="/name-compatibility" className="hover:text-gold transition-colors">Name Compatibility</Link></li>
              <li><Link to="/fortune-cookie" className="hover:text-gold transition-colors">Fortune Cookie</Link></li>
              <li><Link to="/chinese-compatibility" className="hover:text-gold transition-colors">Chinese Compatibility</Link></li>
              <li><Link to="/western-compatibility" className="hover:text-gold transition-colors">Western Compatibility</Link></li>
            </ul>
          </div>

          {/* Store */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">Store</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/coming-store" className="hover:text-gold transition-colors">Coming Soon</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-gold font-semibold mb-3 tracking-wider">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about-us" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p className="order-2 md:order-1 mt-4 md:mt-0">
            © {new Date().getFullYear()} Feng Shui & Beyond. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
