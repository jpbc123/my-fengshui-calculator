//src/pages/Astrology.tsx
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import astrologyImage from "@/assets/astrology.jpg";
import { ArrowRight, Moon, Star } from "lucide-react";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Astrology" },
];

export default function Astrology() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Astrology Calculator Tools - Chinese & Western Zodiac Signs</title>
        <meta name="description" content="Free astrology calculators to find your Chinese zodiac animal and Western zodiac sign. Discover your cosmic blueprint, personality traits, and celestial influences with expert astrological insights." />
        <meta name="keywords" content="astrology calculator, chinese zodiac calculator, western zodiac calculator, zodiac signs, birth chart, horoscope, chinese zodiac animals, sun sign, moon sign, astrological signs, celestial influence" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/astrology" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/astrology" />
        <meta property="og:title" content="Astrology Calculators - Find Your Chinese & Western Zodiac Signs" />
        <meta property="og:description" content="Discover your cosmic blueprint with free Chinese zodiac and Western zodiac calculators. Explore personality traits and celestial influences." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Astrology Calculator Tools - Chinese & Western Zodiac" />
        <meta name="twitter:description" content="Free astrology calculators for Chinese zodiac animals and Western zodiac signs. Discover your cosmic personality." />

        {/* Schema.org - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Astrology Calculator Tools",
            "description": "Free astrology calculators for Chinese and Western zodiac signs",
            "url": "https://fengshuiandbeyond.com/astrology",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Chinese Zodiac Calculator",
                  "applicationCategory": "UtilitiesApplication",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Western Zodiac Calculator",
                  "applicationCategory": "UtilitiesApplication",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                }
              ]
            }
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
                "name": "Astrology",
                "item": "https://fengshuiandbeyond.com/astrology"
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
                "name": "What is astrology?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Astrology is the ancient study of how the positions and movements of celestial bodies influence life on Earth. From the alignment of the Sun, Moon, and planets to the intricate patterns of the stars, astrology seeks to uncover the cosmic connections that shape our personalities, relationships, and destiny."
                }
              },
              {
                "@type": "Question",
                "name": "What is the Chinese zodiac?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Chinese zodiac is a 12-year cycle where each year is represented by an animal sign (Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig). Your Chinese zodiac animal is determined by your birth year and reveals personality traits, compatibility, and fortune."
                }
              },
              {
                "@type": "Question",
                "name": "What is the Western zodiac?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Western zodiac consists of 12 astrological signs based on the position of the Sun at your birth: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces. Each sign has unique traits, strengths, and influences that shape personality and life path."
                }
              },
              {
                "@type": "Question",
                "name": "How do I find my zodiac sign?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For Chinese zodiac, use your birth year to find your animal sign. For Western zodiac, use your birth date (month and day) to determine your sun sign. Our free calculators make it easy to discover both your Chinese and Western zodiac signs instantly."
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
            {/* Tools Intro Section */}
            <div className="mb-8">
              <Breadcrumb items={breadcrumbs} className="text-black/80" />
              <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Astrology Calculation Tools</h1>
              <p className="text-black/80 mb-6">
                Discover your cosmic blueprint with our <span className="font-semibold">free astrology tools</span>. Find your <span className="font-semibold">Chinese Zodiac animal</span> or <span className="font-semibold">Western zodiac sign</span> to explore the unique traits and celestial influences that shape your life's path.
              </p>
            </div>

            {/* Tool Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {/* Chinese Zodiac Calculator Card */}
              <Link
                to="/astrology/chinese-zodiac-calculator"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto group-hover:bg-red-200 transition-colors">
                  <Moon size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Chinese Zodiac Calculator</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Find your Chinese zodiac animal and learn about its traits, compatibility, and meaning based on your birth year.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">Discover Your Animal</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Western Zodiac Calculator Card */}
              <Link
                to="/astrology/western-zodiac-calculator"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Star size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Western Zodiac Calculator</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Uncover your Western zodiac sign and explore the traits, strengths, and influences that shape your personality.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">Find Your Sign</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* "What is Astrology" Section */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">What is Astrology?</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>

              <p className="mb-6 text-black/80 leading-relaxed">
                <span className="font-semibold">Astrology</span> is the ancient study of how the positions and movements of <span className="font-semibold">celestial bodies</span> influence life on Earth. From the alignment of the <span className="font-semibold">Sun, Moon, and planets</span> to the intricate patterns of the stars, astrology seeks to uncover the cosmic connections that shape our personalities, relationships, and destiny.
              </p>

              {/* Astrology Image */}
              <div className="mb-6">
                <img
                  src={astrologyImage}
                  alt="Astrology zodiac wheel"
                  className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
                />
              </div>

              <p className="mb-6 text-black/80 leading-relaxed">
                Across cultures and centuries, <span className="font-semibold">astrology</span> has taken many forms—from <span className="font-semibold">Western horoscopes</span> to the <span className="font-semibold">Chinese Zodiac</span> and <span className="font-semibold">Vedic astrology</span>. Each system offers its own unique way of reading the sky and interpreting its messages.
              </p>

              <p className="mb-10 text-black/80 leading-relaxed">
                Whether you're exploring your <span className="font-semibold">zodiac sign</span>, seeking guidance for important decisions, or simply curious about the <span className="font-semibold">patterns of the universe</span>, astrology provides a timeless framework for understanding life's rhythms and your place within them.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}