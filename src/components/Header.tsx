import { useState } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Menu, X, ChevronDown } from "lucide-react";

const megaMenuConfig = {
  main: [
    { label: "Articles", href: "/article" },
    { label: "Explore", id: "explore" },
    { label: "Store", href: "/coming-store" },
    { label: "About", id: "about" },
  ],
  explore: {
    wisdom: {
      title: "Explore by Wisdom",
      items: [
        { name: "Feng Shui", href: "/feng-shui", description: "Align your space for harmony and prosperity." },
        { name: "Astrology", href: "/astrology", description: "Gain insights from the stars and cosmic energies." },
        { name: "Numerology", href: "/numerology", description: "Uncover the hidden meanings of numbers in your life." },
        { name: "Horoscope", href: "/horoscope", description: "Navigate your future with daily insights from both Chinese and Western horoscopes." },
      ],
    },
    meditation: {
      title: "Meditation",
      items: [
        { name: "Yoga Pose for the Day", href: "/meditate-yoga-pose" },
        { name: "Daily Affirmations", href: "/meditate-affirmation" },
        { name: "Visualization Exercises", href: "/meditate-visualization" },
		{ name: "Morning Mindfulness", href: "/meditate-morning" },
		{ name: "Evening Relaxation", href: "/meditate-evening" },
      ],
    },
    games: {
      title: "Games & Fun",
      items: [
        { name: "Lucky Numbers Generator", href: "/lucky-numbers" },
        { name: "Name Compatibility", href: "/name-compatibility" },
        { name: "Fortune Cookie", href: "/fortune-cookie" },
        { name: "Chinese Zodiac Compatibility", href: "/chinese-compatibility" },
        { name: "Western Zodiac Compatibility", href: "/western-compatibility" },
      ],
    },
  },
  about: {
    title: "About Us",
    items: [
      { name: "About Us", href: "/about-us", description: "Learn about our mission and philosophy." },
      { name: "Contact Us", href: "/contact-us", description: "Get in touch with our support team." },
      { name: "Privacy Policy", href: "/privacy-policy", description: "Your data is safe with us." },
    ],
  },
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-400 via-50% border-b border-purple-400/30 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0">
          <LogoIcon />
          <h1 className="text-2xl sm:text-3xl font-bold text-gold font-charity leading-snug break-words">
            Feng Shui & Beyond
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-white font-medium relative z-50">
          {/* Articles */}
          <Link to="/article" className="cursor-pointer hover:text-gold transition-colors">
            Articles
          </Link>

          {/* Explore Dropdown */}
          <div className="relative group">
            <Link to="#" className="flex items-center gap-1 cursor-pointer hover:text-gold transition-colors">
              Explore <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded-xl shadow-2xl bg-gray-900 text-white p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="grid grid-cols-3 gap-8 w-full">
                {/* Wisdom */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                    {megaMenuConfig.explore.wisdom.title}
                  </h3>
                  <ul className="space-y-2">
                    {megaMenuConfig.explore.wisdom.items.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="block hover:text-gold transition-colors">
                          <span className="font-semibold">{item.name}</span>
                          <p className="text-xs text-white/70">{item.description}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Meditation */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                    {megaMenuConfig.explore.meditation.title}
                  </h3>
                  <ul className="space-y-2">
                    {megaMenuConfig.explore.meditation.items.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="block hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Games */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                    {megaMenuConfig.explore.games.title}
                  </h3>
                  <ul className="space-y-2">
                    {megaMenuConfig.explore.games.items.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="block hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Store */}
          <Link to="/coming-store" className="cursor-pointer hover:text-gold transition-colors">
            Store
          </Link>

          {/* About Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 cursor-pointer hover:text-gold transition-colors">
              About <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-2 min-w-40 rounded-md shadow-lg bg-gray-900 text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
              {megaMenuConfig.about.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden z-50 flex-shrink-0">
          <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-indigo-900 border-t border-gold/20 text-white px-4 pb-6 pt-4 space-y-4">
          {/* Articles */}
          <Link
            to="/article"
            className="block text-sm text-white/90 hover:text-gold transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Articles
          </Link>

          {/* Explore Sections */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.explore.wisdom.title}
            </h3>
            {megaMenuConfig.explore.wisdom.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.explore.meditation.title}
            </h3>
            {megaMenuConfig.explore.meditation.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.explore.games.title}
            </h3>
            {megaMenuConfig.explore.games.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Store */}
          <Link
            to="/coming-store"
            className="block text-sm text-white/90 hover:text-gold transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Store
          </Link>

          {/* About */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.about.title}
            </h3>
            {megaMenuConfig.about.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
