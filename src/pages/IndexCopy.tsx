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
import { Calculator, Heart, Star, Calendar, TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Feng Shui & Beyond - Free Kua Number Calculator, Birth Chart Analysis & Daily Horoscopes</title>
        <meta name="description" content="Free feng shui kua number calculator online, auspicious wedding dates calculator, birth chart analysis, and daily western and chinese horoscope combined. Get instant feng shui tips, numerology insights, and zodiac compatibility readings." />
        <meta name="keywords" content="kua number calculator, feng shui calculator online free, auspicious wedding dates calculator, chinese zodiac compatibility calculator, daily horoscope western and chinese, birth chart analysis free, feng shui birth chart, numerology calculator, personal element calculator" />
        <meta name="author" content="Feng Shui & Beyond" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/" />
        <meta name="theme-color" content="#D4AF37" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/" />
        <meta property="og:title" content="Free Feng Shui Kua Number Calculator & Daily Horoscopes" />
        <meta property="og:description" content="Free feng shui kua number calculator online, auspicious wedding dates calculator, birth chart analysis, and daily western and chinese horoscope combined." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Feng Shui & Beyond" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://fengshuiandbeyond.com/" />
        <meta name="twitter:title" content="Free Feng Shui Kua Number Calculator & Daily Horoscopes" />
        <meta property="twitter:description" content="Free feng shui kua number calculator online, auspicious wedding dates calculator, and daily western chinese horoscope combined." />
        <meta name="twitter:image" content="https://fengshuiandbeyond.com/circle-logo.png" />

        {/* Schema.org Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Feng Shui & Beyond",
            "description": "Free feng shui kua number calculator online, auspicious wedding dates calculator, birth chart analysis, and daily western and chinese horoscope combined.",
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
            "description": "Free feng shui kua number calculator, auspicious wedding dates finder, birth chart analysis, and daily horoscope readings.",
            "sameAs": [
              "https://www.facebook.com/fengshuiandbeyond",
              "https://www.instagram.com/fengshuiandbeyond",
              "https://twitter.com/fengshuibeyond",
              "https://www.pinterest.com/fengshuiandbeyond"
            ]
          })}
        </script>

        {/* Schema.org Structured Data - SoftwareApplication for Calculator Tools */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Feng Shui Kua Number Calculator",
            "applicationCategory": "LifestyleApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free online feng shui kua number calculator to find your personal kua number and auspicious directions for wealth, health, and relationships."
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
                "name": "How do I use a feng shui kua number calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A feng shui kua number calculator uses your birth year and gender to determine your personal kua number (1-9). Simply enter your birth date and gender, and the calculator instantly reveals your kua number along with your auspicious and inauspicious directions for arranging your living space."
                }
              },
              {
                "@type": "Question",
                "name": "How do I find auspicious wedding dates using feng shui?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To find auspicious wedding dates feng shui style, use our wedding date calculator that analyzes the Chinese almanac (Tong Shu), considers both partners' birth charts and zodiac signs, and identifies dates with favorable cosmic energies. The calculator shows you the most harmonious dates for a blessed marriage based on authentic feng shui principles."
                }
              },
              {
                "@type": "Question",
                "name": "Can I get daily horoscopes for both Western and Chinese zodiac?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Our platform provides daily western and chinese horoscope combined readings. You can check your Western zodiac sign (Aries, Taurus, etc.) and Chinese zodiac animal (Rat, Ox, Tiger, etc.) horoscopes all in one place for comprehensive daily guidance."
                }
              },
              {
                "@type": "Question",
                "name": "Is the feng shui calculator online free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all our feng shui calculators are completely free to use online. This includes the kua number calculator, personal element calculator, auspicious wedding dates finder, and chinese zodiac compatibility calculator. No registration or payment required for instant results."
                }
              },
              {
                "@type": "Question",
                "name": "What is chinese zodiac compatibility?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Chinese zodiac compatibility analyzes how well two zodiac animals work together in relationships, friendships, or business partnerships. Our chinese zodiac compatibility calculator compares birth years to reveal compatibility scores, strengths, challenges, and guidance for harmonious relationships based on the 12 animal signs."
                }
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
          
          {/* 2. BEAUTIFUL SEO-RICH SECTION - REDESIGNED */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-200/30 to-transparent rounded-full blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              {/* Main Heading */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-amber-700 mb-6 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  100% Free Forever • No Sign Up Required
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Free Feng Shui Kua Number Calculator<br />
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    & Astrology Tools Online
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                  Your complete source for <strong className="font-semibold text-gray-900">free feng shui calculators online</strong>, 
                  daily horoscopes, and authentic Chinese astrology guidance. Get instant professional insights based on traditional wisdom.
                </p>
              </div>

              {/* Calculator Grid - Modern Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {/* Kua Calculator Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Calculator className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Kua Number Calculator
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our <strong>feng shui kua number calculator online free</strong> instantly determines 
                    your personal kua number based on your birth year and gender. Discover your auspicious 
                    directions for wealth, health, relationships, and personal growth.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-amber-600 group-hover:text-amber-700">
                    Try Calculator →
                  </div>
                </div>

                {/* Wedding Dates Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-rose-200 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Auspicious Wedding Dates
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use our <strong>auspicious wedding dates calculator</strong> to find the most harmonious 
                    dates based on Chinese almanac principles. Learn <strong>how to find auspicious wedding 
                    dates feng shui</strong> style for a blessed marriage.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-rose-600 group-hover:text-rose-700">
                    Find Your Date →
                  </div>
                </div>

                {/* Daily Horoscope Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Daily Horoscope Combined
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get comprehensive guidance with our <strong>daily western and chinese horoscope 
                    combined</strong> readings. Check both your Western zodiac sign and Chinese animal 
                    sign in one place for complete cosmic insights.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                    Read Today's Horoscope →
                  </div>
                </div>

                {/* Zodiac Compatibility Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Zodiac Compatibility
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our <strong>chinese zodiac compatibility calculator</strong> analyzes how well two 
                    zodiac animals work together. Perfect for romantic relationships, friendships, or 
                    business partnerships based on the 12 animal signs.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-pink-600 group-hover:text-pink-700">
                    Check Compatibility →
                  </div>
                </div>

                {/* Birth Chart Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Birth Chart Analysis
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Unlock deeper self-understanding with our comprehensive <strong>feng shui birth 
                    chart</strong> analysis tool. Generate detailed reports including your personal 
                    element, lucky numbers, favorable colors, and life path insights.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Get Your Chart →
                  </div>
                </div>

                {/* Numerology Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Numerology Calculators
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explore the power of numbers with our free numerology tools. Calculate your life path 
                    number, destiny number, soul urge number, and more. Discover how numerology insights 
                    complement your feng shui and astrology readings.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                    Calculate Numbers →
                  </div>
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  Why Choose Our Free Feng Shui Calculator Online?
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">100% Free Forever</h3>
                      <p className="text-gray-600 text-sm">All calculators and tools are completely free with no hidden costs or required signups</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Authentic Methods</h3>
                      <p className="text-gray-600 text-sm">Based on classical feng shui principles, Chinese almanac, and genuine astrological systems</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Instant Results</h3>
                      <p className="text-gray-600 text-sm">Get your kua number, auspicious dates, and horoscope readings in seconds</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Comprehensive Guidance</h3>
                      <p className="text-gray-600 text-sm">Detailed explanations and actionable advice with every calculation</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Mobile-Friendly</h3>
                      <p className="text-gray-600 text-sm">Access all tools on any device, anywhere, anytime</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Privacy Protected</h3>
                      <p className="text-gray-600 text-sm">Your personal information stays private and secure</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                  <p className="text-xl text-gray-700 mb-4 font-medium">
                    Start Your Feng Shui Journey Today
                  </p>
                  <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Whether you're new to feng shui or a seasoned practitioner, our free online calculators 
                    provide the insights you need to harmonize your life with cosmic energies. From finding 
                    your kua number to selecting auspicious wedding dates, from daily horoscope readings to 
                    zodiac compatibility analysis – everything you need is right here, completely free.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* 3. Compatibility Banner */}
          <ChineseZodiacCompatibilityBanner />
          
          {/* 4. Premium Services Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Premium Feng Shui & Astrological Services
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Unlock personalized insights through our premium feng shui and astrological services. 
                  Whether you're planning life's biggest moments or seeking cosmic guidance, our platform 
                  combines traditional wisdom with modern convenience.
                </p>
                
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FengShuiWeddingDatesBanner />
                <BirthChartBanner />
              </div>
              
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
          
          {/* 5. Tools Showcase Banner */}
          <ToolsShowcaseBanner />
          
          {/* 6. Articles + Daily Insights Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RecentArticlesPreview />
              </div>
              <div className="lg:col-span-1">
                <CombinedDailyInsightsBanner />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;