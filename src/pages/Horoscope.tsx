// src/pages/Horoscope.tsx
import { Helmet } from "@/lib/helmet-shim";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import horoscopeImage from "@/assets/horoscope.jpg";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowRight, Calendar, Globe } from "lucide-react";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Horoscope" },
];

export default function Horoscope() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Daily Horoscope - Free Western & Chinese Zodiac Readings</title>
        <meta name="description" content="Get your free daily horoscope for Western and Chinese zodiac signs. Discover cosmic insights, relationship guidance, and fortune forecasts based on astrological chart positions and celestial movements." />
        <meta name="keywords" content="daily horoscope, horoscope today, western zodiac horoscope, chinese zodiac horoscope, zodiac forecast, astrology reading, daily zodiac, horoscope signs, free horoscope, astrological predictions" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/horoscope" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/horoscope" />
        <meta property="og:title" content="Daily Horoscope - Free Western & Chinese Zodiac Readings" />
        <meta property="og:description" content="Free daily horoscope readings for all Western and Chinese zodiac signs. Get cosmic guidance for your day." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daily Horoscope - Free Zodiac Readings" />
        <meta name="twitter:description" content="Get your free daily horoscope for Western and Chinese zodiac signs with cosmic guidance." />

        {/* Schema.org - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Daily Horoscope Tools",
            "description": "Free daily horoscope readings for Western and Chinese zodiac signs",
            "url": "https://fengshuiandbeyond.com/horoscope"
          })}
        </script>

        {/* Schema.org - BreadcrumbList */}
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
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Horoscope",
                "item": "https://fengshuiandbeyond.com/horoscope"
              }
            ]
          })}
        </script>

        {/* Schema.org - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a horoscope?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A horoscope is an astrological chart or diagram showing the position of the Sun, Moon, planets, and zodiac signs at a specific moment in time. It's commonly used to describe daily or weekly predictions based on zodiac signs. The term comes from Greek words meaning 'observer of the hour'."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between Western and Chinese horoscopes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Western horoscopes are based on 12 zodiac signs determined by your birth month (Aries through Pisces), while Chinese horoscopes use a 12-year cycle with animal signs based on your birth year (Rat, Ox, Tiger, etc.). Both provide personality insights and forecasts from different cultural and astronomical perspectives."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are daily horoscopes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Daily horoscopes provide general guidance based on astrological principles and planetary movements. While not predictive certainties, they offer valuable insights for self-reflection and decision-making. Personal birth chart readings provide more specific and accurate astrological guidance."
                }
              },
              {
                "@type": "Question",
                "name": "What are the elements in horoscope readings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Horoscopes include zodiac signs (12 constellations), planets (Sun, Moon, and others with specific influences), houses (12 divisions representing life areas like career and relationships), and aspects (angular relationships between planets indicating harmony or challenges)."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
        <Header />
        <main className="flex-grow pt-6 px-1 pb-10">
          <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
            {/* Breadcrumbs + title */}
            <div className="mb-8">
              <Breadcrumb items={breadcrumbs} className="text-black/80" />
              <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Daily Horoscope - Free Western & Chinese Zodiac Readings</h1>
              <p className="text-black/80 mb-6">
                Discover how <span className="font-semibold">horoscopes</span> can guide <span className="font-semibold">your daily life, relationships, and future endeavors</span>. Explore your personal cosmic insights with our free tools below, including your <span className="font-semibold">Western and Chinese zodiac</span> forecasts.
              </p>
            </div>

            {/* Tools Intro Section */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {/* Chinese Horoscope Card */}
              <Link 
                to="/horoscope/chinese-zodiac"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto group-hover:bg-red-200 transition-colors">
                  <Calendar size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Chinese Horoscope</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Find your personal Chinese Zodiac sign and discover your destiny for the year based on ancient wisdom.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">Read Your Forecast</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Western Horoscope Card */}
              <Link 
                to="/horoscope/western-zodiac"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                  <Globe size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Western Horoscope</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Explore your astrological profile and cosmic influences based on your birthdate and zodiac sign.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">View Your Reading</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* "What is Horoscope" Section */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">What is Horoscope?</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>
              
              <p className="mb-6 text-black/80 leading-relaxed">
                A horoscope is an <span className="font-semibold">astrological chart or diagram showing the position of the Sun, Moon, planets, and zodiac signs at a specific moment in time</span>. While the word can refer to this chart, it is <span className="font-semibold">more commonly used to describe the forecasts based on that chart</span>, such as the generalized <span className="font-semibold">daily or weekly predictions</span> found in newspapers.
                The term comes from the Greek words hōra (time) and scopos (observer), translating to "observer of the hour".
              </p>
              
              {/* Horoscope Image */}
              <div className="mb-6">
                <img
                  src={horoscopeImage}
                  alt="A constellation chart with zodiac signs"
                  className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
                />
              </div>
              
              <h3 className="text-xl font-bold text-gold mb-4">The Elements of a Horoscope</h3>
              <p className="mb-6 text-black/80 leading-relaxed">
                According to the astrological belief system, the position of <span className="font-semibold">celestial bodies</span> at the moment of an event—most often a person's birth—provides insight into their character, life events, and future. A detailed, personalized horoscope is also known as a birth chart or natal chart. 
              </p>
              <p className="mb-4 text-black/80 leading-relaxed">
                The key components of a horoscope include: 
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gold mb-2">The Zodiac Signs</h4>
                  <p className="text-black/80 text-sm">A belt of 12 constellations through which the Sun, Moon, and planets appear to pass. Each sign (Aries, Taurus, Gemini, etc.) is associated with different attributes.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gold mb-2">The Planets</h4>
                  <p className="text-black/80 text-sm">The Sun, Moon, and other planets are said to have mythological characters that influence human life, with their specific placement determining where that energy shows up.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gold mb-2">The Houses</h4>
                  <p className="text-black/80 text-sm">The chart is divided into 12 "houses," each representing a different area of life, such as career, relationships, and finance.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gold mb-2">The Aspects</h4>
                  <p className="text-black/80 text-sm">These are the angular relationships between the planets. The angles are believed to indicate the harmony or challenges in a person's life.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gold mb-4">Horoscope vs. Astrology</h3>
              <p className="mb-4 text-black/80 leading-relaxed">
                While often used interchangeably, there is a distinction between the terms: 
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gold mb-2">Astrology</h4>
                  <p className="text-black/80 text-sm">The overarching system of belief that celestial positions and movements influence earthly events and human lives.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gold mb-2">Horoscope</h4>
                  <p className="text-black/80 text-sm">A practical tool or forecast used within the practice of astrology.</p>
                </div>
              </div>
            </div>
			{/* SEO Content Section */}
		<section className="mt-12 mb-12">
		<h2 className="text-2xl font-bold text-gold mb-6">How to Use Your Daily Horoscope</h2>
		<div className="border-t-4 border-gold w-32 mb-6"></div>
		
		<p className="mb-6 text-black/80 leading-relaxed">
			Reading your <span className="font-semibold">daily horoscope</span> is a powerful practice for gaining cosmic guidance and clarity. Whether you follow your Western zodiac sign based on your birth month or your Chinese zodiac animal from your birth year, these forecasts provide valuable insights into the energies affecting your day.
		</p>
		
		<h3 className="text-xl font-semibold text-gray-800 mb-4">Making the Most of Your Horoscope Reading</h3>
		
		<p className="mb-6 text-black/80 leading-relaxed">
			To get the most from your horoscope, read it in the morning to set intentions for the day. Pay attention to the areas of focus mentioned—whether career, relationships, health, or personal growth. Use the guidance as a framework for self-reflection rather than absolute predictions.
		</p>
		
		<p className="mb-6 text-black/80 leading-relaxed">
			For deeper insights, combine both your Western and Chinese horoscopes. The Western forecast provides daily cosmic influences based on planetary movements, while the Chinese horoscope offers broader yearly themes and monthly guidance. Together, they create a comprehensive view of your astrological landscape.
		</p>
		</section>
		
		{/* Related Resources - Internal Links */}
		<section className="mb-12">
		<h2 className="text-2xl font-bold text-gold mb-6">Explore More Spiritual Tools</h2>
		
		<div className="grid md:grid-cols-3 gap-6">
			<Link to="/astrology" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
			<h3 className="text-lg font-semibold text-gold mb-2">Astrology Calculators</h3>
			<p className="text-sm text-gray-600">
				Find your Chinese and Western zodiac signs with our free calculators
			</p>
			</Link>
		
			<Link to="/numerology" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
			<h3 className="text-lg font-semibold text-gold mb-2">Numerology Tools</h3>
			<p className="text-sm text-gray-600">
				Calculate your life path number and discover numerology insights
			</p>
			</Link>
		
			<Link to="/birth-chart" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
			<h3 className="text-lg font-semibold text-gold mb-2">Birth Chart Analysis</h3>
			<p className="text-sm text-gray-600">
				Get your complete astrological birth chart reading
			</p>
			</Link>
		</div>
		</section>
          </div>
        </main>
      </div>
    </>
  );
}