// src/components/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Menu, X, ChevronDown } from "lucide-react";

const megaMenuConfig = {
  main: [
    { label: "Wisdom", id: "wisdom" },
    { label: "Store", href: "/coming-store" },
    { label: "About", id: "about" },
  ],
  wisdom: {
    title: "Explore by Wisdom",
    items: [
      { name: "Feng Shui", href: "/feng-shui", description: "Align your space for harmony and prosperity." },
      { name: "Astrology", href: "/astrology", description: "Gain insights from the stars and cosmic energies." },
      { name: "Numerology", href: "/numerology", description: "Uncover the hidden meanings of numbers in your life." },
    ],
  },
  features: {
    title: "Featured Tools",
    items: [
      { name: "Chinese Horoscope", href: "/chinese-zodiac-landing", description: "Get daily forecasts for your Chinese Zodiac sign." },
      { name: "Western Horoscope", href: "/western-horoscope", description: "Navigate life with daily and weekly predictions." },
      { name: "Kua Number Calculator", href: "/kua-number-calculator", description: "Find your lucky directions for success and balance." },
      { name: "Visiber Numerology", href: "/visiber-calculator", description: "Explore personal insights through Visiber numbers." },
    ],
  },
  about: {
    title: "About Us",
    items: [
      { name: "About Us", href: "/about-us", description: "Learn about our mission and philosophy." },
      { name: "Contact Us", href: "/contact", description: "Get in touch with our support team." },
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
          {/* 1. Explore Mega Menu - Now Hover-based */}
          <div className="relative group">
            {/* The button is a link/trigger */}
            <Link to="#" className="flex items-center gap-1 cursor-pointer hover:text-gold transition-colors">
              Explore <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            {/* The mega menu dropdown */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded-xl shadow-2xl bg-gray-900 text-white p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="grid grid-cols-2 gap-8 w-full">
                {/* Wisdom Column */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                    {megaMenuConfig.wisdom.title}
                  </h3>
                  <ul className="space-y-2">
                    {megaMenuConfig.wisdom.items.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="block hover:text-gold transition-colors">
                          <span className="font-semibold">{item.name}</span>
                          <p className="text-xs text-white/70">{item.description}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Features Column */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/50 mb-2">
                    {megaMenuConfig.features.title}
                  </h3>
                  <ul className="space-y-2">
                    {megaMenuConfig.features.items.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="block hover:text-gold transition-colors">
                          <span className="font-semibold">{item.name}</span>
                          <p className="text-xs text-white/70">{item.description}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Other standalone links */}
          <Link to={megaMenuConfig.main[1].href} className="cursor-pointer hover:text-gold transition-colors">
            {megaMenuConfig.main[1].label}
          </Link>
          {/* 2. About Dropdown - Already Hover-based */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 cursor-pointer hover:text-gold transition-colors"
            >
              About <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </button>
            {/* About Dropdown - simpler style */}
            <div className="absolute top-full left-0 mt-2 min-w-40 rounded-md shadow-lg bg-gray-900 text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
              {megaMenuConfig.about.items.map((item) => (
                <Link key={item.name} to={item.href} className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-gold hover:text-black transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile hamburger icon */}
        <div className="md:hidden z-50 flex-shrink-0">
          <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gold/20 text-white px-4 pb-6 pt-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.wisdom.title}
            </h3>
            {megaMenuConfig.wisdom.items.map((item) => (
              <Link key={item.name} to={item.href} className="block text-sm text-white/90 hover:text-gold transition" onClick={() => setMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.features.title}
            </h3>
            {megaMenuConfig.features.items.map((item) => (
              <Link key={item.name} to={item.href} className="block text-sm text-white/90 hover:text-gold transition" onClick={() => setMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
          </div>
          <Link to={megaMenuConfig.main[1].href} className="block text-sm text-white/90 hover:text-gold transition" onClick={() => setMobileMenuOpen(false)}>
            {megaMenuConfig.main[1].label}
          </Link>
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mt-4 mb-1 select-none">
              {megaMenuConfig.about.title}
            </h3>
            {megaMenuConfig.about.items.map((item) => (
              <Link key={item.name} to={item.href} className="block text-sm text-white/90 hover:text-gold transition" onClick={() => setMobileMenuOpen(false)}>
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