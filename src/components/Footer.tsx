// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const Footer = () => {
  // The daily "Planetary Overview" lives at /articles/planetary-<date>. Send users to
  // TODAY's article, computed client-side so it's always current. Before hydration (and
  // for crawlers) fall back to the category listing so the link is never a dead dated URL.
  const [planetaryHref, setPlanetaryHref] = useState("/article?category=Planetary%20Overview");
  useEffect(() => {
    setPlanetaryHref(`/articles/planetary-${dayjs().format("YYYY-MM-DD")}`);
  }, []);

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
		  <Link to="/sitemap" className="hover:text-gold transition-colors">
			Sitemap
		  </Link>
		  <Link to="/credits" className="hover:text-gold transition-colors">
			Credits
		  </Link>
        </div>
		<div className="w-full flex flex-wrap justify-center gap-6 md:gap-8 mt-4 text-sm text-white/70">
		  <Link to="/daily-wisdom-article" className="hover:text-gold transition-colors">
			Daily Wisdom
		  </Link>
		  <Link to={planetaryHref} className="hover:text-gold transition-colors">
			Planetary Overview
		  </Link>
		  <Link to="/mercury-retrograde" className="hover:text-gold transition-colors">
			Mercury Retrograde
		  </Link>
		  <Link to="/full-moon-forecast" className="hover:text-gold transition-colors">
			Full Moon Forecast
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