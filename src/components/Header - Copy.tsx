// src/components/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Menu, X } from "lucide-react";

const megaMenuConfig = {
  main: [
    { label: "Articles", href: "/article" },
    { label: "Calculators", id: "calculators" },
    { label: "Horoscope", id: "horoscope" },
    { label: "Meditation", id: "meditation" },
    { label: "Services", id: "services" },
    { label: "Games & Fun", id: "games" },
    { label: "Store", href: "/coming-store" },
    { label: "About", id: "about" },
  ],
  calculators: {
    title: "Calculators & Tools",
    items: [
      { name: "Feng Shui", href: "/feng-shui", description: "Align your space for harmony and prosperity." },
      { name: "Astrology", href: "/astrology", description: "Gain insights from the stars and cosmic energies." },
      { name: "Numerology", href: "/numerology", description: "Uncover the hidden meanings of numbers in your life." },
    ],
  },
  horoscope: {
    title: "Horoscope Readings",
    items: [
      { name: "Chinese Horoscope", href: "/chinese-zodiac-landing", description: "Navigate your future with ancient Chinese zodiac wisdom." },
      { name: "Western Horoscope", href: "/western-horoscope", description: "Daily, weekly, and yearly Western astrology readings." },
    ],
  },
  meditation: {
    title: "Wellness & Mindfulness",
    items: [
	  { name: "Daily Affirmations", href: "/meditate-affirmation", description: "Positive daily mantras" },
	  { name: "Morning Mindfulness", href: "/meditate-morning", description: "Start your day with intention" },
	  { name: "Yoga Poses", href: "/meditate-yoga-pose", description: "Daily physical practice" },
      { name: "Visualization Exercises", href: "/meditate-visualization", description: "Create peaceful mental imagery to reduce stress" },
      { name: "Evening Relaxation", href: "/meditate-evening", description: "Unwind peacefully" },
    ],
  },
  services: {
    title: "Professional Services",
    items: [
      { name: "Birth Chart Analysis", href: "/birth-chart", description: "Professional natal chart reading and detailed analysis." },
	  { name: "Wedding Date Selector", href: "/auspicious-wedding-date", description: "Professional natal chart reading and detailed analysis." },
    ],
  },
  games: {
    title: "Games & Fun",
    items: [
	  { name: "Aura Analysis", href: "/aura-analysis", description: "Discover your spiritual energy" },
      { name: "Name Compatibility", href: "/name-compatibility", description: "Cosmic bond between names" },      
      { name: "Western Zodiac Compatibility", href: "/western-compatibility", description: "Western astrology matches" },
      { name: "Chinese Zodiac Compatibility", href: "/chinese-compatibility", description: "Eastern zodiac insights" },
      { name: "Fortune Cookie", href: "/fortune-cookie", description: "Daily wisdom and guidance" },
	  { name: "Lucky Numbers Generator", href: "/lucky-numbers", description: "Try your luck with our lucky number generator" },
    ],
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

  const renderDropdownMenu = (menuKey, position = 'center') => {
    const menuData = megaMenuConfig[menuKey];
    if (!menuData) return null;

    const positionClasses = {
      center: 'left-1/2 -translate-x-1/2',
      left: 'left-0',
      right: 'right-0'
    };

    return (
      <div className={`absolute ${positionClasses[position]} mt-2 min-w-64 rounded-xl shadow-2xl bg-gray-900 text-white p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50`}>
        <h3 className="text-xs uppercase tracking-wider text-gold mb-4 font-semibold border-b border-gold/20 pb-2">
          {menuData.title}
        </h3>
        <ul className="space-y-3">
          {menuData.items.map((item) => (
            <li key={item.name}>
              <Link to={item.href} className="block hover:text-gold transition-colors group/item">
                <span className="font-semibold text-sm group-hover/item:text-gold">{item.name}</span>
                <p className="text-xs text-white/70 leading-tight mt-1 group-hover/item:text-white/90">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-400 via-50% border-b border-purple-400/30 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0">
          <LogoIcon />
          <h1 className="text-3xl sm:text-3xl font-bold text-gold font-charity leading-snug break-words">
            Feng Shui & Beyond
          </h1>
        </Link>

        {/* Desktop Navigation - Added more space from logo */}
        <nav className="hidden lg:flex items-center gap-6 text-white font-medium ml-16">
          {/* Articles */}
          <Link to="/article" className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
            Articles
          </Link>

          {/* Calculators Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              Calculators
            </button>
            {renderDropdownMenu('calculators', 'left')}
          </div>

          {/* Horoscope Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              Horoscope
            </button>
            {renderDropdownMenu('horoscope', 'left')}
          </div>

          {/* Meditation Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              Meditation
            </button>
            {renderDropdownMenu('meditation', 'center')}
          </div>

          {/* Services Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              Services
            </button>
            {renderDropdownMenu('services', 'center')}
          </div>

          {/* Games & Fun Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              Games & Fun
            </button>
            {renderDropdownMenu('games', 'right')}
          </div>

          {/* Store */}
          <Link to="/coming-store" className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
            Store
          </Link>

          {/* About Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              About
            </button>
            {renderDropdownMenu('about', 'right')}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <div className="lg:hidden z-50 flex-shrink-0">
          <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-indigo-900 border-t border-gold/20 text-white px-4 pb-6 pt-4 space-y-4 overflow-y-auto z-40">
          
          {/* Articles */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              Articles
            </h3>
            <Link
              to="/article"
              className="block text-sm text-white/90 hover:text-gold transition pl-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Articles
            </Link>
          </div>

          {/* Calculators Section */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              {megaMenuConfig.calculators.title}
            </h3>
            {megaMenuConfig.calculators.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition pl-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Horoscope Section */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              {megaMenuConfig.horoscope.title}
            </h3>
            {megaMenuConfig.horoscope.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition pl-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Meditation Section */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              {megaMenuConfig.meditation.title}
            </h3>
            {megaMenuConfig.meditation.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition pl-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Services Section */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              {megaMenuConfig.services.title}
            </h3>
            {megaMenuConfig.services.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition pl-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Games & Fun Section */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              {megaMenuConfig.games.title}
            </h3>
            {megaMenuConfig.games.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition pl-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Store */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              Store
            </h3>
            <Link
              to="/coming-store"
              className="block text-sm text-white/90 hover:text-gold transition pl-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Store
            </Link>
          </div>

          {/* About */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-gold font-semibold mt-4 mb-2 select-none border-b border-gold/20 pb-1">
              {megaMenuConfig.about.title}
            </h3>
            {megaMenuConfig.about.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-sm text-white/90 hover:text-gold transition pl-2"
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