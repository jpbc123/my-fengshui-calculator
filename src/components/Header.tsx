// src/components/Header.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "@/components/LogoIcon";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

const megaMenuConfig = {
  main: [
    { label: "Articles", id: "articles" },
    { label: "Calculators", id: "calculators" },
    { label: "Horoscope", id: "horoscope" },
    { label: "Meditation", id: "meditation" },
    { label: "Services", id: "services" },
    { label: "Games & Fun", id: "games" },
    { label: "Store", href: "/coming-store" },
    { label: "About", id: "about" },
  ],
  articles: {
    title: "Articles",
    items: [
      { name: "All Articles", href: "/article", description: "Explore expert insights on Feng Shui, astrology, numerology, and more in our curated collection of articles." },
      { name: "Feng Shui", href: "/article?category=Feng Shui", description: "Articles on home energy, harmony, and Feng Shui best practices." },
      { name: "Astrology", href: "/article?category=Astrology", description: "Discover celestial insights and astrology-based life guidance." },
      { name: "Numerology", href: "/article?category=Numerology", description: "Discover the power of numbers in shaping your destiny." },
      { name: "Celebrity", href: "/article?category=Celebrity", description: "Astrological insights into famous personalities." },
    ],
  },
  calculators: {
    title: "Calculators & Tools",
    items: [
      { name: "Feng Shui", href: "/feng-shui", description: "Calculate your Kua number, personal element, and Feng Shui insights." },
      { name: "Astrology", href: "/astrology", description: "Gain insights from the stars and cosmic energies." },
      { name: "Numerology", href: "/numerology", description: "Uncover the hidden meanings of numbers in your life." },
    ],
  },
  horoscope: {
    title: "Horoscope Readings",
    items: [
      { name: "Chinese Horoscope", href: "/horoscope/chinese-zodiac", description: "Navigate your future with ancient Chinese zodiac wisdom." },
      { name: "Western Horoscope", href: "/horoscope/western-zodiac", description: "Detailed daily, weekly, and yearly readings for love, career and life guidance based on Western astrology readings." },
    ],
  },
  meditation: {
    title: "Wellness & Mindfulness",
    items: [
      { name: "Daily Affirmations", href: "/meditation/daily-affirmation", description: "Positive mantras to boost confidence and mindfulness." },
      { name: "Morning Mindfulness", href: "/meditation/morning-mindfulness", description: "Start your day with clarity and inner peace." },
      { name: "Yoga Poses", href: "/meditation/yoga", description: "Simple yoga practices to improve health and energy flow." },
      { name: "Visualization Exercises", href: "/meditation/visualization-exercises", description: "Guided imagery to relax your mind and reduce stress." },
      { name: "Evening Relaxation", href: "/meditation/evening-relaxation", description: "Unwind peacefully, end your day with calmness and restorative energy." },
    ],
  },
  services: {
    title: "Professional Services",
    items: [
      { name: "Birth Chart Analysis", href: "/birth-chart", description: "Professional natal chart reading and detailed interpretation for self-discovery." },
      { name: "Wedding Date Planner", href: "/auspicious-wedding-date-planner", description: "Choose auspicious wedding dates with Feng Shui precision." },
    ],
  },
  games: {
    title: "Games & Fun",
    items: [
      { name: "Aura Analysis", href: "/games-fun/aura-analysis", description: "Discover your spiritual energy." },
      { name: "Name Compatibility", href: "/games-fun/name-compatibility", description: "Explore compatibility through name numerology." },      
      { name: "Western Zodiac Compatibility", href: "/games-fun/western-zodiac-compatibility", description: "Compare Western zodiac signs for love and relationships." },
      { name: "Chinese Zodiac Compatibility", href: "/games-fun/chinese-zodiac-compatibility", description: "Match Chinese zodiac signs for harmony and love." },
      { name: "Fortune Cookie", href: "/games-fun/fortune-cookie", description: "Get daily wisdom and fun fortunes instantly." },
      { name: "Lucky Numbers Generator", href: "/games-fun/lucky-numbers-generator", description: "Try your luck with our lucky number generator." },
    ],
  },
  about: {
    title: "About",
    items: [
      { name: "About Us", href: "/about-us", description: "Learn about our mission and philosophy." },
      { name: "Contact Us", href: "/contact-us", description: "Get in touch with our support team." },
      { name: "Privacy Policy", href: "/privacy-policy", description: "Your data is safe with us." },
	  { name: "Terms of Service", href: "/terms-of-service", description: "Our service terms and usage policies." },
    ],
  },
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle article category navigation
  const handleArticleCategoryClick = (href: string) => {
    // Extract category from URL params
    const url = new URL(href, window.location.origin);
    const category = url.searchParams.get('category');
    
    if (category) {
      // Navigate to articles page and set the category
      navigate(`/article?category=${encodeURIComponent(category)}`);
    } else {
      // Navigate to all articles
      navigate('/article');
    }
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  const toggleAccordion = (menuKey: string) => {
    setOpenAccordion(openAccordion === menuKey ? null : menuKey);
  };

  const renderDropdownMenu = (menuKey: string, position = 'center') => {
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
              {menuKey === 'articles' ? (
                <button
                  onClick={() => handleArticleCategoryClick(item.href)}
                  className="block w-full text-left hover:text-gold transition-colors group/item"
                >
                  <span className="font-semibold text-sm group-hover/item:text-gold">{item.name}</span>
                  <p className="text-xs text-white/70 leading-tight mt-1 group-hover/item:text-white/90">{item.description}</p>
                </button>
              ) : (
                <Link to={item.href} className="block hover:text-gold transition-colors group/item">
                  <span className="font-semibold text-sm group-hover/item:text-gold">{item.name}</span>
                  <p className="text-xs text-white/70 leading-tight mt-1 group-hover/item:text-white/90">{item.description}</p>
                </Link>
              )}
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
          {/* Articles Dropdown */}
          <div className="relative group">
            <button className="cursor-pointer hover:text-gold transition-colors whitespace-nowrap">
              Articles
            </button>
            {renderDropdownMenu('articles', 'left')}
          </div>

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

      {/* Mobile Menu - Full Screen with Accordion */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-indigo-900 border-t border-gold/20 text-white px-4 pb-6 pt-4 space-y-2 overflow-y-auto z-40">
          
          {/* Articles Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('articles')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.articles.title}</span>
              {openAccordion === 'articles' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'articles' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.articles.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleArticleCategoryClick(item.href)}
                    className="block w-full text-left text-sm text-white/90 hover:text-gold transition py-2"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calculators Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('calculators')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.calculators.title}</span>
              {openAccordion === 'calculators' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'calculators' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.calculators.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-white/90 hover:text-gold transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Horoscope Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('horoscope')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.horoscope.title}</span>
              {openAccordion === 'horoscope' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'horoscope' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.horoscope.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-white/90 hover:text-gold transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Meditation Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('meditation')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.meditation.title}</span>
              {openAccordion === 'meditation' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'meditation' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.meditation.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-white/90 hover:text-gold transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Services Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('services')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.services.title}</span>
              {openAccordion === 'services' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'services' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.services.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-white/90 hover:text-gold transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Games & Fun Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('games')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.games.title}</span>
              {openAccordion === 'games' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'games' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.games.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-white/90 hover:text-gold transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Store - Simple Link */}
          <div className="border-b border-gold/10 pb-2">
            <Link
              to="/coming-store"
              className="block text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Store
            </Link>
          </div>

          {/* About Accordion */}
          <div className="border-b border-gold/10 pb-2">
            <button
              onClick={() => toggleAccordion('about')}
              className="flex items-center justify-between w-full text-left text-gold font-semibold py-3 hover:text-yellow-400 transition-colors"
            >
              <span>{megaMenuConfig.about.title}</span>
              {openAccordion === 'about' ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openAccordion === 'about' && (
              <div className="pl-4 space-y-2 mt-2 border-l border-gold/20">
                {megaMenuConfig.about.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-white/90 hover:text-gold transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;