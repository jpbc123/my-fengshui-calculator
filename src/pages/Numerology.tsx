//src/pages/Numerology.tsx
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import numerologyImage from "@/assets/numerology.jpg";
import { ArrowRight, Calculator, Clock } from "lucide-react";

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Numerology" },
];

export default function Numerology() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Numerology Calculator Tools - Life Path Number & Visiber Analysis</title>
        <meta name="description" content="Free numerology calculators to discover your life path number, destiny number, and Visiber insights. Unlock the hidden power of numbers and reveal your unique personality traits through ancient numerology wisdom." />
        <meta name="keywords" content="numerology calculator, life path number, visiber calculator, destiny number, numerology reading, pythagorean numerology, personal numerology, birth date numerology, name numerology, numerology meanings" />
        <link rel="canonical" href="https://fengshuiandbeyond.com/numerology" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fengshuiandbeyond.com/numerology" />
        <meta property="og:title" content="Numerology Calculator Tools - Discover Your Life Path Number" />
        <meta property="og:description" content="Free numerology calculators including Visiber analysis. Unlock the mystical power of numbers and discover your destiny." />
        <meta property="og:image" content="https://fengshuiandbeyond.com/circle-logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Numerology Calculator Tools - Life Path & Visiber" />
        <meta name="twitter:description" content="Free numerology calculators to reveal your life path number and personal insights through ancient number wisdom." />

        {/* Schema.org - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Numerology Calculator Tools",
            "description": "Free numerology calculators for life path numbers and Visiber analysis",
            "url": "https://fengshuiandbeyond.com/numerology",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Visiber Calculator",
                  "applicationCategory": "UtilitiesApplication",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "Calculate your Visiber number to understand your destiny and personality"
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
                "name": "Numerology",
                "item": "https://fengshuiandbeyond.com/numerology"
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
                "name": "What is numerology?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Numerology is the study of the mystical significance of numbers and their influence on human life. It interprets patterns found in your name, birth date, and other personal details to reveal insights about your personality, strengths, challenges, and life path."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate my life path number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your life path number is calculated by adding all the digits of your birth date together and reducing them to a single digit (unless you get 11, 22, or 33, which are master numbers). For example, if born on July 14, 1990: 7 + 1 + 4 + 1 + 9 + 9 + 0 = 31, then 3 + 1 = 4."
                }
              },
              {
                "@type": "Question",
                "name": "What is a Visiber number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Visiber number is a numerological calculation that reveals insights about your destiny, personality, and relationships through ancient wisdom. Our Visiber calculator helps you discover how this number shapes your life path."
                }
              },
              {
                "@type": "Question",
                "name": "How can numerology help me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Numerology reveals insights about your personality, life path, and destiny through number analysis. It can guide decision-making, help you understand your strengths and challenges, and provide clarity on your life's purpose and direction in relationships, career, and personal growth."
                }
              },
              {
                "@type": "Question",
                "name": "What is Pythagorean numerology?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pythagorean numerology is based on the ancient Greek mathematician Pythagoras's teachings. It assigns numerical values to letters and uses these to calculate various numbers that reveal personality traits, life purpose, and destiny patterns."
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
              
              {/* H1 - CRITICAL FOR SEO - Improved */}
              <h1 className="text-3xl md:text-4xl font-bold text-gold mt-6 mb-6">
                Numerology Calculator Tools - Discover Your Life Path Number
              </h1>
              
              <p className="text-black/80 mb-6 text-lg leading-relaxed">
                Unlock the hidden power of numbers and how they shape your destiny. Begin with our <span className="font-semibold">free Numerology tools</span> below to reveal your unique <span className="font-semibold">life path and personal insights</span>. Whether you're seeking guidance on relationships, career decisions, or personal growth, our numerology calculators provide ancient wisdom combined with modern insights to help you understand your true potential and life purpose.
              </p>
            </div>

            {/* Tool Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {/* Visiber Calculator Card */}
              <Link
                to="/numerology/visiber-calculator"
                className="group bg-gray-50 border border-gray-200 hover:border-gold/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                  <Calculator size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gold mb-3 text-center">Visiber Calculator</h3>
                <p className="text-black/80 text-sm mb-4 text-center leading-relaxed">
                  Explore your Visiber number and understand how it shapes your destiny, personality, and relationships through ancient wisdom.
                </p>
                <div className="flex items-center justify-center text-gold group-hover:text-gold/80 transition-colors">
                  <span className="text-sm font-medium mr-2">Calculate Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Coming Soon Card */}
              <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4 mx-auto">
                  <Clock size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-500 mb-3 text-center">Coming Soon</h3>
                <p className="text-gray-500 text-sm mb-4 text-center leading-relaxed">
                  More numerology tools will be added here to deepen your insights into the mystical world of numbers.
                </p>
                <div className="flex items-center justify-center text-gray-400">
                  <span className="text-sm font-medium">Stay Tuned</span>
                </div>
              </div>
            </div>

            {/* "What is Numerology" Section */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-4">What is Numerology?</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>

              <p className="mb-6 text-black/80 leading-relaxed">
                <span className="font-semibold">Numerology</span> is the study of the mystical significance of <span className="font-semibold">numbers and their influence on human life</span>. It interprets patterns found in your name, birth date, and other personal details to reveal insights about your <span className="font-semibold">personality, strengths, challenges, and life path</span>.
              </p>

              {/* Numerology Image */}
              <div className="mb-6">
                <img
                  src={numerologyImage}
                  alt="Numerology symbols and sacred geometry patterns representing the mystical significance of numbers"
                  className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
                />
              </div>

              <p className="mb-6 text-black/80 leading-relaxed">
                At its core, numerology sees numbers as more than mere quantities—they are <span className="font-semibold">energetic symbols</span> that carry meaning. By decoding these numbers, you can better understand yourself and make informed decisions in relationships, career, and personal growth.
              </p>

              <p className="mb-10 text-black/80 leading-relaxed">
                From ancient <span className="font-semibold">Pythagorean teachings</span> to modern interpretations, <span className="font-semibold">numerology</span> remains a powerful tool for self-discovery and guidance.
              </p>
            </div>

            {/* How Numerology Works - Additional SEO Content */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-4">How Numerology Calculator Works</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>

              <p className="mb-6 text-black/80 leading-relaxed">
                Our <span className="font-semibold">numerology calculator tools</span> use proven mathematical formulas based on <span className="font-semibold">Pythagorean numerology</span> principles. By analyzing your birth date and name, these calculators reduce numbers to single digits (1-9) or master numbers (11, 22, 33) that reveal specific personality traits and life patterns.
              </p>

              <p className="mb-6 text-black/80 leading-relaxed">
                The <span className="font-semibold">life path number</span> is perhaps the most important number in your numerology chart. It represents your core identity, natural talents, and the challenges you'll face throughout life. This number is calculated by reducing your complete birth date to a single digit or master number.
              </p>

              <p className="mb-6 text-black/80 leading-relaxed">
                Each number from 1 to 9, plus the master numbers, carries unique vibrations and meanings. For example, the number 1 represents leadership and independence, while 2 signifies partnership and diplomacy. Understanding these numbers helps you navigate life with greater awareness and purpose.
              </p>
            </section>

            {/* Benefits Section */}
            <section className="mb-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gold mb-6">Benefits of Using Numerology</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Growth</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Gain deeper self-awareness and understand your natural strengths, weaknesses, and life purpose through number analysis.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Relationship Insights</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Discover compatibility patterns and understand relationship dynamics through numerology compatibility analysis.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Career Guidance</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Identify career paths that align with your life path number and natural talents for greater professional fulfillment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Decision Making</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Use numerology insights to make important life decisions with greater confidence and clarity.
                  </p>
                </div>
              </div>
            </section>

            {/* Related Resources - Internal Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-6">Explore More Spiritual Tools</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Link to="/feng-shui" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gold mb-2">Feng Shui Tools</h3>
                  <p className="text-sm text-gray-600">
                    Discover your personal element and kua numbers
                  </p>
                </Link>

                <Link to="/meditation" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gold mb-2">Meditation Guide</h3>
                  <p className="text-sm text-gray-600">
                    Practice daily yoga poses and meditation techniques for inner peace
                  </p>
                </Link>

                <Link to="/games-fun" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gold mb-2">Fun Tools</h3>
                  <p className="text-sm text-gray-600">
                    Try lucky number generators and interactive spiritual games
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