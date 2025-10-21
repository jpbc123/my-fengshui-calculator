// src/components/PlanetaryOverviewPage.tsx 
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Sparkle, Info } from "lucide-react";

// Enable timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Planetary Overview" },
];

interface PlanetaryOverviewData {
    date: string;
    planetary_index: number;
    summary: string;
    article: string;
}

export default function PlanetaryOverviewPage() {
    const [data, setData] = useState<PlanetaryOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use current date for consistency
    const today = dayjs().format("YYYY-MM-DD");

    useEffect(() => {
        const fetchTodayData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log(`Fetching planetary overview for ${today}...`);
                
                // FIXED: Use Vercel API route instead of localhost:3001
                const response = await fetch('/api/planetary-overview');
                
                if (!response.ok) {
                    if (response.status === 202) {
                        // Request in progress, retry after delay
                        setTimeout(() => fetchTodayData(), 3000);
                        return;
                    }
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                console.log('Received planetary overview:', result);
                
                // Ensure we have the expected data structure
                if (result && (result.date || result.summary)) {
                    setData({
                        date: result.date || today,
                        planetary_index: result.planetary_index || 3,
                        summary: result.summary || "Planetary energies are in transition today.",
                        article: result.article || "Today brings a unique blend of cosmic energies. Take time to reflect and align with the universal flow."
                    });
                } else {
                    throw new Error("Invalid data format received");
                }
            } catch (error) {
                console.error("Failed to fetch planetary overview:", error);
                setError("Failed to load today's planetary overview. Please try again later.");
                
                // Set fallback data with current date
                setData({
                    date: today,
                    planetary_index: 3,
                    summary: "Universal energies are in transition today. Take time for reflection and avoid making hasty decisions.",
                    article: "Today brings a blend of practical and intuitive energies. The planetary alignments suggest focusing on balance and mindful decision-making. While some cosmic influences may feel challenging, they offer opportunities for growth and self-discovery. Pay attention to your inner wisdom and trust your instincts as you navigate the day's opportunities."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTodayData();
    }, [today]);

    return (
	<>
  <Helmet>
    <title>Daily Planetary Overview {dayjs().format('MMMM D, YYYY')} | Cosmic Energy Report | Feng Shui and Beyond</title>
    <meta name="description" content={`Today's planetary overview for ${dayjs().format('MMMM D, YYYY')}. Discover how cosmic alignments and planetary energies influence your day. Get your daily planetary index and astrological guidance.`} />
    <meta name="keywords" content="daily planetary overview, planetary alignment today, cosmic energy, daily astrology, planetary index, astrological forecast, today's planets, celestial energy" />
    
    {/* Open Graph */}
    <meta property="og:title" content={`Daily Planetary Overview - ${dayjs().format('MMMM D, YYYY')}`} />
    <meta property="og:description" content="Understand today's cosmic influences with our daily planetary overview. Real-time celestial alignment analysis and energy guidance." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://fengshuiandbeyond.com/planetary-overview" />
    <meta property="og:image" content="https://fengshuiandbeyond.com/images/planetary-overview-og.jpg" />
    
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`Planetary Overview - ${dayjs().format('MMM D')}`} />
    <meta name="twitter:description" content="Today's cosmic energy report and planetary alignment analysis." />
    <meta name="twitter:image" content="https://fengshuiandbeyond.com/images/planetary-twitter.jpg" />
    
    {/* Structured Data - Article */}
    {data && (
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `Daily Planetary Overview - ${dayjs(data.date).format('MMMM D, YYYY')}`,
          "description": data.summary,
          "datePublished": data.date,
          "dateModified": data.date,
          "author": {
            "@type": "Organization",
            "name": "Feng Shui and Beyond"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Feng Shui and Beyond",
            "logo": {
              "@type": "ImageObject",
              "url": "https://fengshuiandbeyond.com/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://fengshuiandbeyond.com/planetary-overview"
          }
        })}
      </script>
    )}
    
    {/* Structured Data - FAQPage for Planetary Index explanation */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": "What is the Planetary Index?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Planetary Index reflects the overall harmony and intensity of celestial alignments. It's a score from 1 to 5 that indicates how favorable the day's cosmic energies are for various activities. A higher score suggests better alignment and more positive energy flow."
          }
        }]
      })}
    </script>
    
    <link rel="canonical" href="https://fengshuiandbeyond.com/planetary-overview" />
  </Helmet>
        <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
            <Header />
            <main className="flex-grow pt-6 px-1 pb-10">
                <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
                    {/* 2-column layout */}
                    <div className="flex flex-col lg:flex-row lg:justify-between">
                        {/* Left side - Content */}
                        <div className="max-w-xl">
                            {/* Breadcrumbs + title */}
                            <div className="mb-8">
                                <Breadcrumb items={breadcrumbs} className="text-black/80" />
                                <h1 className="text-2xl font-bold text-gold mt-4 mb-6 flex items-center gap-2">
                                    Daily Planetary Overview
                                </h1>
                                <p className="text-black/80 mb-6">
                                    A detailed look at today's cosmic influences and how they affect your energy.
                                </p>
                            </div>

                            {/* Error message if any */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Summary Box */}
                            <div className="flex flex-col gap-2 mb-8">
                                <div className="flex items-start gap-2 text-black/80 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <Info size={20} className="text-gold mt-1 shrink-0" />
                                    <div className="text-left">
                                        <p>
                                            The <span className="font-semibold">Planetary Index</span> reflects the overall harmony and intensity of celestial alignments. A higher score indicates a favorable day for most activities.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                {loading ? (
                                    <div className="text-center text-black/90">Loading today's overview...</div>
                                ) : data ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-black/90 text-left"
                                    >
                                        <h2 className="text-xl font-bold text-gold mb-2">
                                            Overview for {dayjs(data.date).format('MMMM D, YYYY')}
                                        </h2>
                                        <p className="text-sm font-semibold mb-2">
                                            Planetary Index: {data.planetary_index}/5
                                        </p>
                                        <p className="mb-4 text-base leading-relaxed">{data.summary}</p>
                                        
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-gold mb-3">Detailed Analysis</h3>
                                            <div className="prose prose-sm prose-gold max-w-none text-black/90">
                                                {/* Handle both HTML content and plain text */}
                                                {data.article.includes('<') ? (
                                                    <div dangerouslySetInnerHTML={{ __html: data.article }} />
                                                ) : (
                                                    <div className="whitespace-pre-line leading-relaxed">
                                                        {data.article}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center text-black/90">No planetary overview available for today.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
		</>
    );
}