// src/pages/Index.tsx
import { useState } from "react";
import { Helmet } from "@/lib/helmet-shim";
import Header from "@/components/Header"; 
import { FengShuiCalculatorModal } from "@/components/FengShuiCalculatorModal";
import HeroSection from "@/components/HeroSection";
import ToolsSection from "@/components/ToolsSection";
import RightSidebar from "@/components/RightSidebar"; 
import DailyWisdomBanner from "@/components/DailyWisdomBanner";
import ChineseZodiacCompatibilityBanner from "@/components/ChineseZodiacCompatibilityBanner";
import RecentArticlesPreview from "@/components/RecentArticlesPreview";
import CombinedDailyInsightsBanner from "@/components/CombinedDailyInsightsBanner";
import FengShuiWeddingDatesBanner from "@/components/FengShuiWeddingDatesBanner";
import BirthChartBanner from "@/components/BirthChartBanner";
import ToolsShowcaseBanner from "@/components/ToolsShowcaseBanner";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Feng Shui & Beyond - Free Astrology & Feng Shui Tools</title>
        <meta name="description" content="Get your daily horoscope, birth chart analysis, feng shui tips, and numerology insights. Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment." />
        <meta name="keywords" content="feng shui, astrology, numerology, western zodiac, chinese zodiac, daily horoscope, chinese horoscope, western horoscope, birth chart analysis, auspicious wedding dates, kua number calculator, personal element calculator, visiber calculator" />
		<meta name="msvalidate.01" content="A97DD7D7079EF369574BA7ED9DBF53B1" />
        <meta name="author" content="Feng Shui & Beyond" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/" />
        <meta name="theme-color" content="#D4AF37" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/" />
        <meta property="og:title" content="Feng Shui & Beyond - Free Astrology & Feng Shui Tools" />
        <meta property="og:description" content="Get your daily horoscope, birth chart analysis, feng shui tips, and numerology insights. Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Feng Shui & Beyond" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://fengshuiandbeyond.com/" />
        <meta name="twitter:title" content="Feng Shui & Beyond - Free Astrology & Feng Shui Tools" />
        <meta name="twitter:description" content="Get your daily horoscope, birth chart analysis, feng shui tips, and numerology insights. Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment." />
        <meta name="twitter:image" content="https://fengshuiandbeyond.com/circle-logo.png" />

        {/* Schema.org Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Feng Shui & Beyond",
            "description": "Get your daily horoscope, birth chart analysis, feng shui tips, and numerology insights. Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment.",
            "url": "https://fengshuiandbeyond.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://fengshuiandbeyond.com/article?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Feng Shui & Beyond",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fengshuiandbeyond.com/circle-logo.png"
              }
            }
          })}
        </script>

        {/* Schema.org Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Feng Shui & Beyond",
            "url": "https://fengshuiandbeyond.com",
            "logo": "https://fengshuiandbeyond.com/circle-logo.png",
            "description": "Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment.",
            "sameAs": [
              "https://www.facebook.com/fengshuiandbeyond",
              "https://www.instagram.com/fengshuiandbeyond",
              "https://twitter.com/fengshuibeyond",
              "https://www.pinterest.com/fengshuiandbeyond"
            ]
          })}
        </script>

        {/* Schema.org Structured Data - ProfessionalService */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Feng Shui & Beyond",
            "image": "https://fengshuiandbeyond.com/circle-logo.png",
            "url": "https://fengshuiandbeyond.com",
            "description": "Professional Feng Shui consultations, numerology readings, astrology analysis, and horoscope forecasts.",
            "serviceType": [
              "Feng Shui Consultation",
              "Numerology Reading",
              "Birth Chart Analysis",
              "Daily Horoscope",
              "Chinese Zodiac Reading",
              "Kua Number Calculator",
              "Personal Element Calculator",
              "Auspicious Date Selection"
            ],
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "0",
                "longitude": "0"
              },
              "geoRadius": "20000000"
            }
          })}
        </script>

        {/* Schema.org Structured Data - ItemList for Services */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Spiritual Services & Tools",
            "description": "Explore our comprehensive spiritual guidance services and calculators",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Daily Horoscopes",
                "url": "https://fengshuiandbeyond.com/horoscopes",
                "description": "Get your daily Western and Chinese zodiac horoscope readings"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Birth Chart Analysis",
                "url": "https://fengshuiandbeyond.com/birth-chart",
                "description": "Comprehensive astrological birth chart interpretation"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Feng Shui Tips",
                "url": "https://fengshuiandbeyond.com/feng-shui",
                "description": "Authentic feng shui guidance for balance and harmony"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Numerology Insights",
                "url": "https://fengshuiandbeyond.com/numerology",
                "description": "Discover your life path and destiny numbers"
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": "Kua Number Calculator",
                "url": "https://fengshuiandbeyond.com/kua-calculator",
                "description": "Calculate your personal feng shui Kua number"
              },
              {
                "@type": "ListItem",
                "position": 6,
                "name": "Auspicious Wedding Dates",
                "url": "https://fengshuiandbeyond.com/wedding-dates",
                "description": "Find the most auspicious dates for your wedding"
              }
            ]
          })}
        </script>

        {/* Schema.org Structured Data - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Feng Shui?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Feng Shui is an ancient Chinese practice that harmonizes individuals with their surrounding environment through the strategic arrangement of spaces to promote health, wealth, and happiness. It uses principles like the five elements and energy flow (chi) to create balance."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate my Kua number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your Kua number is calculated using your birth year and gender. It determines your auspicious and inauspicious directions in feng shui. You can use our Kua number calculator to find your personal number and discover your favorable directions for wealth, health, and relationships."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between Western and Chinese zodiac?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Western zodiac is based on 12 signs determined by your birth month (Aries, Taurus, etc.), while Chinese zodiac uses a 12-year cycle with animal signs (Rat, Ox, Tiger, etc.) based on your birth year. Both provide insights into personality and fortune, but from different cultural and astronomical perspectives."
                }
              },
              {
                "@type": "Question",
                "name": "How can numerology help me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Numerology reveals insights about your personality, life path, and destiny through the analysis of numbers in your birth date and name. It can guide decision-making, help you understand your strengths and challenges, and provide clarity on your life's purpose and direction."
                }
              },
              {
                "@type": "Question",
                "name": "How do I find auspicious wedding dates?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Auspicious wedding dates are selected based on Chinese almanac (Tong Shu), considering the couple's birth charts, zodiac compatibility, and favorable cosmic energies. Our calculator helps identify the most harmonious dates that align with feng shui principles for a blessed marriage."
                }
              }
            ]
          })}
        </script>

        {/* Schema.org Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://fengshuiandbeyond.com/"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white text-foreground flex flex-col overflow-hidden">
        <Header />
        <main>
		<div className="sr-only">
			<h1>Feng Shui & Beyond - Free Chinese Zodiac, Numerology & Astrology Tools</h1>
		</div>
          {/* 1. Hero Section */}
          <HeroSection />
          
          {/* 2. Compatibility Banner */}
          <ChineseZodiacCompatibilityBanner />
          
          {/* 3. Premium Services Section - MOVED UP */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Premium Feng Shui & Astrological Services
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Unlock personalized insights through our premium feng shui and astrological services. 
                  Whether you're planning life's biggest moments or seeking cosmic guidance, our platform 
                  combines traditional wisdom with modern convenience.
                </p>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Professional-grade analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Based on authentic feng shui principles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Built on classical astrological foundations</span>
                  </div>
                </div>
              </div>
              
              {/* Service Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FengShuiWeddingDatesBanner />
                <BirthChartBanner />
              </div>
              
              {/* Bottom CTA */}
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-2">
                  Be among the first to experience our new platform
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Free access during launch period
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    Quality-assured platform
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    100% Secure & Private
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    Instant Results
                  </span>
                </div>
              </div>
            </div>
          </section>
          
          {/* 4. Tools Showcase Banner */}
          <ToolsShowcaseBanner />
          
          {/* 5. Articles + Daily Insights Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Articles (70% width) */}
              <div className="lg:col-span-2">
                <RecentArticlesPreview />
              </div>
              {/* Right Column: Combined Daily Insights (30% width) */}
              <div className="lg:col-span-1">
                <CombinedDailyInsightsBanner />
              </div>
            </div>
          </div>
          
                    {/* SEO CONTENT SECTION - Additional 800+ words for SEO */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gold mb-6 text-center">
                Your Gateway to Ancient Wisdom and Spiritual Growth
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6 leading-relaxed">
                  Welcome to <span className="font-semibold">Feng Shui and Beyond</span>, your comprehensive resource for <span className="font-semibold">ancient wisdom tools</span> and <span className="font-semibold">spiritual guidance</span>. We offer free calculators and insights for Chinese zodiac, Western astrology, numerology, and authentic feng shui principles to help you navigate life's journey with clarity and purpose.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Discover Your Chinese Zodiac Sign
                </h3>
                <p className="mb-6 leading-relaxed">
                  The <span className="font-semibold">Chinese zodiac</span> is a 12-year cycle where each year is represented by an animal sign: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. Your zodiac animal, determined by your birth year, reveals profound insights into your personality, strengths, challenges, and destiny. Our free Chinese zodiac calculator instantly determines your sign and provides detailed personality analysis, compatibility insights, and fortune predictions based on centuries of astrological wisdom.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Unlock the Power of Numerology
                </h3>
                <p className="mb-6 leading-relaxed">
                  <span className="font-semibold">Numerology</span> is the mystical study of numbers and their influence on human life. Through our comprehensive numerology tools, including the Visiber calculator and life path number analysis, you can decode the hidden meanings in your birth date and name. Each number carries unique vibrations that reveal your life purpose, natural talents, and the challenges you'll face. Whether you're seeking guidance on relationships, career decisions, or personal growth, numerology provides a roadmap to understanding your true self.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Harness Feng Shui for Harmony and Prosperity
                </h3>
                <p className="mb-6 leading-relaxed">
                  <span className="font-semibold">Feng Shui</span>, which translates to "wind and water," is an ancient Chinese metaphysical system that harmonizes individuals with their environment. Our Kua number calculator and personal element analysis tools help you identify your most auspicious directions for wealth, health, relationships, and personal growth. By understanding the flow of Qi (energy) and applying the Five Elements theory; Wood, Fire, Earth, Metal, and Water; you can optimize your living spaces and life choices for maximum prosperity and well-being.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Daily Horoscopes and Astrological Insights
                </h3>
                <p className="mb-6 leading-relaxed">
                  Stay connected to cosmic energies with our <span className="font-semibold">daily horoscopes</span> for both Western and Chinese zodiac signs. Our expert astrologers provide accurate forecasts that help you navigate daily challenges, seize opportunities, and make informed decisions. Whether you follow your Western sun sign (Aries, Taurus, Gemini, etc.) or your Chinese zodiac animal, our horoscopes offer timely guidance tailored to your astrological profile.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Find Your Perfect Wedding Date
                </h3>
                <p className="mb-6 leading-relaxed">
                  Planning a wedding? Our <span className="font-semibold">auspicious wedding date calculator</span> uses traditional Chinese almanac (Tong Shu) principles combined with feng shui wisdom to identify the most harmonious dates for your special day. We consider both partners' birth charts, zodiac compatibility, and favorable cosmic alignments to ensure your marriage begins under the most blessed circumstances.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Meditation and Spiritual Wellness
                </h3>
                <p className="mb-6 leading-relaxed">
                  Beyond calculations and predictions, we offer <span className="font-semibold">daily meditation guides</span> and <span className="font-semibold">yoga poses</span> to help you cultivate inner peace and spiritual balance. Our meditation resources combine ancient Eastern wisdom with modern mindfulness practices, providing you with tools for stress relief, mental clarity, and emotional well-being.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Why Choose Feng Shui and Beyond?
                </h3>
                <p className="mb-6 leading-relaxed">
                  What sets us apart is our commitment to <span className="font-semibold">authentic spiritual tools</span> grounded in centuries of Eastern wisdom. All our calculators and insights are based on traditional methodologies, carefully researched and verified by experts in feng shui, astrology, and numerology. We believe that ancient wisdom, when properly understood and applied, provides invaluable guidance for navigating modern life's complexities.
                </p>

                <p className="mb-6 leading-relaxed">
                  Our platform is designed to be accessible, user-friendly, and completely free. Whether you're new to spiritual practices or a seasoned practitioner, our tools provide instant, accurate results with detailed explanations that help you understand and apply the insights to your daily life. From <span className="font-semibold">zodiac compatibility</span> analysis to <span className="font-semibold">personal element balancing</span>, every tool is crafted to empower you on your journey of self-discovery and growth.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                  Start Your Journey Today
                </h3>
                <p className="mb-6 leading-relaxed">
                  Begin exploring your cosmic blueprint today with our comprehensive suite of free tools. Calculate your Chinese zodiac sign, discover your life path number, find your Kua number, check daily horoscopes, and unlock the secrets of feng shui, all in one place. Join thousands of users who have found clarity, balance, and empowerment through ancient wisdom combined with modern insights.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Index;