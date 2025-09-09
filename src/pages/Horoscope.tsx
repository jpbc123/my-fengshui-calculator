// src/pages/Horoscope.tsx
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
    <div className="flex flex-col min-h-screen bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-grow pt-6 px-1 pb-10">
        <div className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
          {/* Breadcrumbs + title */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} className="text-black/80" />
            <h1 className="text-2xl font-bold text-gold mt-4 mb-6">Horoscope Tools</h1>
            <p className="text-black/80 mb-6">
              Discover how <span className="font-semibold">horoscopes</span> can guide <span className="font-semibold">your daily life, relationships, and future endeavors</span>. Explore your personal cosmic insights with our free tools below, including your <span className="font-semibold">Western and Chinese zodiac</span> forecasts.
            </p>
          </div>

          {/* Tools Intro Section */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {/* Chinese Horoscope Card */}
            <Link 
              to="/chinese-zodiac-landing"
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
              to="/western-horoscope"
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
              The term comes from the Greek words Åra (time) and scopos (observer), translating to "observer of the hour".
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
        </div>
      </main>
    </div>
  );
}