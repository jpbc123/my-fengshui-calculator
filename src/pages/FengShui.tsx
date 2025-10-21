// src/pages/FengShui.tsx
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import fengShuiImage from "@/assets/feng-shui.jpg";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowRight, Compass, Leaf } from "lucide-react";
import "./fengshui-background.css";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Feng Shui" },
];

export default function FengShui() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Feng Shui Calculator Tools - Kua Number & Personal Element Analysis</title>
        <meta name="description" content="Free Feng Shui calculators to discover your Kua number, lucky directions, and personal element balance. Learn how ancient Chinese Feng Shui principles can bring harmony, prosperity, and positive energy to your life." />
        <meta name="keywords" content="feng shui calculator, kua number calculator, personal element feng shui, feng shui lucky directions, five elements theory, feng shui energy, qi flow, bagua, yin yang balance, feng shui for home" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/feng-shui" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/feng-shui" />
        <meta property="og:title" content="Feng Shui Calculator Tools - Find Your Kua Number & Personal Element" />
        <meta property="og:description" content="Free Feng Shui calculators for Kua number and personal element analysis. Discover your lucky directions and achieve balance with ancient Chinese wisdom." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Feng Shui Calculator Tools - Kua Number & Personal Element" />
        <meta name="twitter:description" content="Free Feng Shui calculators to discover your Kua number and personal element balance for harmony and prosperity." />

        {/* Schema.org - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Feng Shui Calculator Tools",
            "description": "Free Feng Shui calculators including Kua number and personal element analysis tools",
            "url": "https://fengshuiandbeyond.com/feng-shui",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Kua Number Calculator",
                  "applicationCategory": "UtilitiesApplication",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Personal Element Calculator",
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
                "name": "Feng Shui",
                "item": "https://fengshuiandbeyond.com/feng-shui"
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
                "name": "What is Feng Shui?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Feng Shui is an ancient Chinese metaphysical system that seeks harmony and auspiciousness between individuals and their surrounding environment. It's about how energy (Qi) flows through spaces and how we can align ourselves for success, health, and balance."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate my Kua number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your Kua number is calculated using your birth year and gender according to Feng Shui principles. Our free Kua Number Calculator determines your personal number and reveals your most auspicious directions for wealth, health, relationships, and personal growth."
                }
              },
              {
                "@type": "Question",
                "name": "What are the Five Elements in Feng Shui?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Five Elements in Feng Shui are Wood, Fire, Earth, Metal, and Water. These elements interact in dynamic cycles, influencing everything from architecture and interior design to personal luck and energy flow. Understanding your personal element helps achieve balance and harmony."
                }
              },
              {
                "@type": "Question",
                "name": "How can Feng Shui improve my life?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Feng Shui can enhance prosperity, relationships, health, and overall well-being by optimizing the balance of Qi (energy) in your environment. By analyzing space orientation, furniture placement, and natural landscape, Feng Shui practitioners help create harmonious living and working spaces."
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
              <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Feng Shui Calculator Tools</h1>
              <p className="text-black/80 mb-6">
                Discover how <span className="font-semibold">Feng Shui</span> can guide <span className="font-semibold">harmony, balance, and positive energy</span> in your life.
                Start with our free tools below to explore your <span className="font-semibold">personal Feng Shui insights</span>, including your <span className="font-semibold">Kua number</span> and <span className="font-semibold">lucky directions</span>.
              </p>
            </div>

            {/* Tools Intro Section */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {/* Kua Number Calculator Card */}
              <Link
                to="/feng-shui/kua-number"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                  <Compass size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Kua Number Calculator</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Find your personal Kua Number and discover your best directions for luck and success based on your birth year and gender.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">Calculate Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Personal Element Calculator Card */}
              <Link
                to="/feng-shui/personal-element"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto group-hover:bg-green-200 transition-colors">
                  <Leaf size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Personal Element Analysis</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Explore your elemental balance and Feng Shui alignment based on your birthdate and Five Elements theory.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">Analyze Elements</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* "What is Feng Shui?" Section */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">What is Feng Shui?</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>

              <p className="mb-6 text-black/80 leading-relaxed">
                <span className="font-semibold">Feng Shui</span> is an <span className="font-semibold">ancient Chinese metaphysical system</span> that seeks harmony and <span className="font-semibold">auspiciousness</span> between individuals and their surrounding environment. It's about how
                <span className="font-semibold"> energy (Qi)</span> flows through spaces and how we can align ourselves for <span className="font-semibold">success, health, and balance</span>.
              </p>

              {/* Feng Shui Image */}
              <div className="mb-6">
                <img
                  src={fengShuiImage}
                  alt="feng shui bagua energy"
                  className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
                />
              </div>

              <p className="mb-6 text-black/80 leading-relaxed">
                <span className="font-semibold">Feng Shui principles</span> are deeply rooted in the <span className="font-semibold">Five Elements theory</span> —
                Wood, Fire, Earth, Metal, and Water — and the concept of <span className="font-semibold">Yin and Yang</span>. These elements interact in dynamic cycles, influencing everything from <span className="font-semibold">architecture and interior design</span> to personal luck and energy flow.
              </p>

              <p className="mb-6 text-black/80 leading-relaxed">
                By analyzing the orientation of a space, the placement of furniture,
                and even the surrounding natural landscape, <span className="font-semibold">Feng Shui practitioners</span> aim to optimize the balance of <span className="font-semibold">Qi</span>. This alignment is believed to enhance <span className="font-semibold">prosperity, relationships, health, and overall well-being</span>.
              </p>

              <p className="mb-10 text-black/80 leading-relaxed">
                Today, <span className="font-semibold">Feng Shui</span> is practiced worldwide, blending traditional wisdom
                with modern lifestyles. Whether you're designing your home, choosing a
                work desk location, or exploring your <span className="font-semibold">personal energy chart</span>, Feng Shui
                offers timeless guidance for living in harmony with the universe.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}