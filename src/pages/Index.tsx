// src/pages/Index.tsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
        <title>Feng Shui & Beyond - Feng Shui, Horoscopes, Astrology, Numerology & More</title>
        <meta name="description" content="Get your daily horoscope, birth chart analysis, feng shui tips, and numerology insights. Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment." />
        <meta name="keywords" content="feng shui, astrology, numerology, western zodiac, chinese zodiac, daily horoscope, chinese horoscope, western horoscope, birth chart analysis, auspicious wedding dates, kua number calculator, personal element calculator, visiber calculator" />
        <meta name="author" content="Feng Shui & Beyond" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/" />
        <meta name="theme-color" content="#D4AF37" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/" />
        <meta property="og:title" content="Feng Shui & Beyond - Feng Shui, Horoscopes, Astrology, Numerology & More" />
        <meta property="og:description" content="Get your daily horoscope, birth chart analysis, feng shui tips, and numerology insights. Expert astrology readings, Chinese zodiac forecasts, and authentic feng shui guidance for balance and empowerment." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Feng Shui & Beyond" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://fengshuiandbeyond.com/" />
        <meta name="twitter:title" content="Feng Shui & Beyond - Feng Shui, Horoscopes, Astrology, Numerology & More" />
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
          
          {/* 6. End - No extra banner needed, removed MeditationBanner */}
        </main>
      </div>
    </>
  );
};

export default Index;