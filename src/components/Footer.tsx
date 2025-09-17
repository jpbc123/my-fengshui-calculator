// src/components/Footer.tsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black via-50% border-t border-purple-400/30 text-white">
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
          <Link to="/article" className="hover:text-gold transition-colors">
            Articles
          </Link>
          <Link to="/feng-shui" className="hover:text-gold transition-colors">
            Feng Shui
          </Link>
          <Link to="/astrology" className="hover:text-gold transition-colors">
            Astrology
          </Link>
          <Link to="/numerology" className="hover:text-gold transition-colors">
            Numerology
          </Link>
          <Link to="/horoscope" className="hover:text-gold transition-colors">
            Horoscope
          </Link>
          <Link to="/meditation" className="hover:text-gold transition-colors">
            Meditation
          </Link>
          <Link to="/games-fun" className="hover:text-gold transition-colors">
            Games & Fun
          </Link>
        </div>
		<div className="w-full flex justify-center gap-6 md:gap-8 mt-2 text-sm">
			<Link to="/sitemap" className="hover:text-gold transition-colors">
				Sitemap
			</Link>
			<Link to="/credits" className="hover:text-gold transition-colors">
				Credits
			</Link>
		</div>
      </div>
	  



      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} Feng Shui & Beyond. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;