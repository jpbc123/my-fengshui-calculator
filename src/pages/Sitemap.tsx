// src/pages/Sitemap.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { Link } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Calculator, 
  Star, 
  Heart, 
  Gamepad2, 
  Flower, 
  Info, 
  Mail, 
  Shield, 
  FileText,
  Award,
  ExternalLink
} from "lucide-react";

const Sitemap = () => {
  const siteStructure = [
    {
      title: "Home",
      icon: <Home size={20} />,
      links: [
        { name: "Homepage", path: "/", description: "Daily horoscopes and main navigation" }
      ]
    },
    {
      title: "Articles & Content",
      icon: <BookOpen size={20} />,
      links: [
        { name: "All Articles", path: "/article", description: "Browse all our published articles" },
        { name: "Daily Wisdom", path: "/daily-wisdom-article", description: "Daily inspirational wisdom and quotes" },
        { name: "Planetary Overview", path: "/planetary-overview", description: "Daily cosmic energy readings" },
        { name: "Aura Analysis", path: "/aura-analysis", description: "Discover your spiritual energy" }
      ]
    },
    {
      title: "Calculators & Tools",
      icon: <Calculator size={20} />,
      links: [
        { name: "Feng Shui", path: "/feng-shui", description: "Feng Shui calculators and tools", subLinks: [
          { name: "Personal Element Calculator", path: "/personal-element" },
          { name: "Kua Number Calculator", path: "/kua-number-calculator" }
        ]},
        { name: "Numerology", path: "/numerology", description: "Number-based life insights", subLinks: [
          { name: "Visiber Calculator", path: "/visiber-calculator" }
        ]},
        { name: "Astrology", path: "/astrology", description: "Astrological calculations and charts", subLinks: [
          { name: "Chinese Zodiac Calculator", path: "/chinese-zodiac-calculator" },
          { name: "Western Zodiac Calculator", path: "/western-zodiac-calculator" }
        ]}
      ]
    },
    {
      title: "Horoscopes",
      icon: <Star size={20} />,
      links: [
        { name: "Horoscope Hub", path: "/horoscope", description: "Access to all horoscope types" },
        { name: "Chinese Zodiac Landing", path: "/chinese-zodiac-landing", description: "Chinese zodiac information and readings" },
        { name: "Western Daily Horoscope", path: "/western-horoscope", description: "Daily Western astrology readings" }
      ]
    },
    {
      title: "Premium Services",
      icon: <Award size={20} />,
      links: [
        { name: "Birth Chart Analysis", path: "/birth-chart", description: "Professional natal chart reading and analysis" },
        { name: "Auspicious Wedding Dates", path: "/auspicious-wedding-date", description: "Traditional feng shui wedding date selection" }
      ]
    },
    {
      title: "Games & Fun",
      icon: <Gamepad2 size={20} />,
      links: [
        { name: "Games Hub", path: "/games-fun", description: "Fun tools and compatibility games" },
        { name: "Lucky Numbers", path: "/lucky-numbers", description: "Generate your lucky numbers" },
        { name: "Name Compatibility", path: "/name-compatibility", description: "Check name-based compatibility" },
        { name: "Chinese Compatibility", path: "/chinese-compatibility", description: "Chinese zodiac relationship matching" },
        { name: "Western Compatibility", path: "/western-compatibility", description: "Western zodiac compatibility analysis" },
        { name: "Fortune Cookie", path: "/fortune-cookie", description: "Daily wisdom and guidance" }
      ]
    },
    {
      title: "Meditation & Wellness",
      icon: <Flower size={20} />,
      links: [
        { name: "Meditation Hub", path: "/meditation", description: "Mindfulness and wellness resources" },
        { name: "Visualization Exercises", path: "/meditate-visualization", description: "Guided visualization for relaxation" },
        { name: "Yoga Poses", path: "/meditate-yoga-pose", description: "Daily yoga pose guidance" },
        { name: "Daily Affirmations", path: "/meditate-affirmation", description: "Positive daily mantras" },
        { name: "Morning Mindfulness", path: "/meditate-morning", description: "Start your day with intention" },
        { name: "Evening Relaxation", path: "/meditate-evening", description: "Unwind peacefully" }
      ]
    },
    {
      title: "About & Legal",
      icon: <Info size={20} />,
      links: [
        { name: "About Us", path: "/about-us", description: "Learn about our mission and philosophy" },
        { name: "Contact Us", path: "/contact-us", description: "Get in touch with our support team" },
        { name: "Privacy Policy", path: "/privacy-policy", description: "Your data is safe with us" },
        { name: "Terms of Service", path: "/terms-of-service", description: "Our service terms and usage policies" },
        { name: "Credits", path: "/credits", description: "Image credits and attributions" }
      ]
    }
  ];

  return (
    <>
      <SplashCursor />
      <div className="relative min-h-screen bg-white text-black">
        <Header />
        <main className="container mx-auto max-w-6xl py-24 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gold mb-4">Site Map</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Navigate through all our pages and services. Find everything from daily horoscopes 
              to premium analysis tools, all organized for easy access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteStructure.map((section, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="group">
                      <Link 
                        to={link.path}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-gold transition-colors">
                              {link.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              {link.description}
                            </p>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 group-hover:text-gold transition-colors flex-shrink-0 ml-2 mt-0.5" />
                        </div>
                        
                        {link.subLinks && (
                          <div className="mt-3 ml-4 space-y-2">
                            {link.subLinks.map((subLink, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subLink.path}
                                className="block text-sm text-gray-500 hover:text-gold transition-colors py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                • {subLink.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Finding Something?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our navigation menu at the top of every page 
              provides quick access to all major sections, or you can contact us directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
              >
                <Mail size={18} />
                Contact Support
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Home size={18} />
                Back to Homepage
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
              <div className="text-sm text-blue-800">Pages & Tools</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">8</div>
              <div className="text-sm text-green-800">Main Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
              <div className="text-sm text-purple-800">Calculator Types</div>
            </div>
            <div className="text-center p-4 bg-gold/10 rounded-lg">
              <div className="text-2xl font-bold text-gold mb-1">2</div>
              <div className="text-sm text-gray-700">Premium Services</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Sitemap;