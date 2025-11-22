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
              
              {/* H1 - CRITICAL FOR SEO - Improved */}
              <h1 className="text-3xl md:text-4xl font-bold text-gold mt-6 mb-6">
                Feng Shui Calculator Tools - Kua Number & Personal Element Analysis
              </h1>
              
              <p className="text-black/80 mb-6 text-lg leading-relaxed">
                Discover how <span className="font-semibold">Feng Shui</span> can guide <span className="font-semibold">harmony, balance, and positive energy</span> in your life.
                Start with our free tools below to explore your <span className="font-semibold">personal Feng Shui insights</span>, including your <span className="font-semibold">Kua number</span> and <span className="font-semibold">lucky directions</span>. Our authentic calculators use traditional Chinese Feng Shui principles to help you optimize your environment for prosperity, health, and success.
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
                  alt="Feng Shui bagua compass showing energy directions and five elements theory"
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

            {/* Understanding Kua Numbers - Additional SEO Content */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-4">Understanding Your Kua Number</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>

              <p className="mb-6 text-black/80 leading-relaxed">
                Your <span className="font-semibold">Kua number</span> is one of the most important calculations in Feng Shui practice. Based on your birth year and gender, this personal number reveals your most auspicious directions and helps you make strategic decisions about where to position your bed, desk, front door, and other important elements in your living and working spaces.
              </p>

              <p className="mb-6 text-black/80 leading-relaxed">
                There are nine possible Kua numbers (1, 2, 3, 4, 6, 7, 8, and 9—note that 5 is replaced by 2 for females and 8 for males in traditional Feng Shui). Each number corresponds to one of the eight directions (North, Northeast, East, Southeast, South, Southwest, West, Northwest) and determines your East or West group classification.
              </p>

              <p className="mb-6 text-black/80 leading-relaxed">
                Understanding your Kua number allows you to harness favorable energies by facing your lucky directions during important activities like sleeping, working, eating, and negotiating. The four favorable directions for each Kua number support different aspects of life: Sheng Qi (success and wealth), Tien Yi (health and well-being), Nien Yen (relationships and romance), and Fu Wei (personal growth and stability).
              </p>
            </section>

            {/* The Five Elements Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-4">The Five Elements in Feng Shui</h2>
              <div className="border-t-4 border-gold w-32 mb-6"></div>

              <p className="mb-6 text-black/80 leading-relaxed">
                The <span className="font-semibold">Five Elements theory</span> (Wu Xing) is fundamental to Feng Shui practice. These elements—Wood, Fire, Earth, Metal, and Water—represent different types of energy that interact through productive and destructive cycles. Understanding these relationships helps create balanced environments that support your goals and well-being.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Wood Element</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Represents growth, vitality, and expansion. Associated with creativity, flexibility, and new beginnings. Colors: Green, brown. Direction: East, Southeast.
                  </p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Fire Element</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Symbolizes passion, energy, and transformation. Associated with fame, recognition, and leadership. Colors: Red, orange, purple. Direction: South.
                  </p>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Earth Element</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Embodies stability, nourishment, and grounding. Associated with relationships, health, and reliability. Colors: Yellow, beige, earth tones. Direction: Center, Southwest, Northeast.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Metal Element</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Represents precision, efficiency, and clarity. Associated with wealth, helpful people, and organization. Colors: White, gold, silver. Direction: West, Northwest.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 md:col-span-2">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Water Element</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Symbolizes flow, wisdom, and emotional depth. Associated with career, opportunities, and spiritual connection. Colors: Black, blue. Direction: North.
                  </p>
                </div>
              </div>

              <p className="mb-6 text-black/80 leading-relaxed">
                In the productive cycle, Wood feeds Fire, Fire creates Earth (ash), Earth produces Metal, Metal holds Water, and Water nourishes Wood. Understanding these cycles helps you enhance or moderate energies in different areas of your space through colors, materials, and shapes.
              </p>
            </section>

            {/* Practical Feng Shui Tips Section */}
            <section className="mb-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gold mb-6">Practical Feng Shui Applications</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Your Home</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Position your bed with the headboard against a solid wall and avoid placing it directly under a window or beam. Face your favorable direction (based on your Kua number) when sleeping to maximize restorative energy and attract positive opportunities.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Your Office</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Arrange your desk to face one of your favorable directions, ideally with a solid wall behind you for support. Keep the area clutter-free to allow Qi to flow smoothly, promoting productivity and clear thinking.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Relationships</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Activate the Southwest sector of your home (representing love and relationships) with pairs of objects, Earth element colors like pink or terracotta, and avoid clutter in this area to enhance romance and partnership harmony.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Wealth and Prosperity</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Focus on the Southeast sector (wealth area) and your personal success direction. Add Water elements like fountains or aquariums, and Wood elements like plants to support financial growth and abundance.
                  </p>
                </div>
              </div>
            </section>

            {/* Related Resources - Internal Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gold mb-6">Explore More Spiritual Tools</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Link to="/astrology" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gold mb-2">Astrology Tools</h3>
                  <p className="text-sm text-gray-600">
                    Discover your Chinese and Western zodiac signs and cosmic influences
                  </p>
                </Link>

                <Link to="/numerology" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gold mb-2">Numerology Tools</h3>
                  <p className="text-sm text-gray-600">
                    Calculate your life path number and discover numerology insights
                  </p>
                </Link>

                <Link to="/meditation" className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gold mb-2">Meditation Guide</h3>
                  <p className="text-sm text-gray-600">
                    Practice daily yoga poses and meditation for inner balance
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}