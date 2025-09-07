// src/pages/FengShui.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import horoscopeImage from "@/assets/horoscope.jpg";
import Breadcrumb from "@/components/Breadcrumb";

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
            {/* Tool Cards */}
            <Link to="/chinese-zodiac-landing"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-gray-800 border border-gold/30 rounded-xl p-6 hover:from-purple-600 hover:via-indigo-600 hover:to-gray-700 transition shadow-lg"
            >
              <div className="flex justify-center text-3xl mb-3">🏮</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Chinese Horoscope</h3>
              <p className="text-center text-white/70 text-sm">
                Find your personal Chinese Zodiac sign and discover your destiny for the year.
              </p>
            </Link>
            <Link to="/western-horoscope"
              className="bg-gradient-to-r from-purple-700 via-indigo-700 to-gray-800 border border-gold/30 rounded-xl p-6 hover:from-purple-600 hover:via-indigo-600 hover:to-gray-700 transition shadow-lg"
            >
              <div className="flex justify-center w-3xl mb-3 text-3xl">🌠</div>
              <h3 className="flex justify-center text-xl font-bold text-gold mb-2">Western Horoscope</h3>
              <p className="text-center text-white/70 text-sm">
                Explore your astrological profile and cosmic influences based on your birthdate.
              </p>
            </Link>
          </div>

          {/* "What is Horoscope */}
			<div>
			<h2 className="text-2xl font-bold text-gold mb-4">What is Horoscope?</h2>
			<div className="border-t-4 border-gold w-32 mb-4"></div>
			
			<p className="mb-6 text-black/80">
				A horoscope is an <span className="font-semibold">astrological chart or diagram showing the position of the Sun, Moon, planets, and zodiac signs at a specific moment in time</span>. While the word can refer to this chart, it is <span className="font-semibold">more commonly used to describe the forecasts based on that chart</span>, such as the generalized <span className="font-semibold">daily or weekly predictions</span> found in newspapers.
				The term comes from the Greek words ōra (time) and scopos (observer), translating to "observer of the hour".
			</p>
			
			{/* Horoscope Image */}
			<div className="mb-6">
				<img
				src={horoscopeImage}
				alt="A constellation chart with zodiac signs"
				className="w-full object-cover rounded-xl shadow-lg border border-gold/20"
				/>
			</div>
			
			<h3 className="text-1xl font-bold text-gold mb-4">The Elements of a Horoscope</h3>
			<p className="mb-6 text-black/80">
				According to the astrological belief system, the position of <span className="font-semibold">celestial bodies</span> at the moment of an event—most often a person's birth—provides insight into their character, life events, and future. A detailed, personalized horoscope is also known as a birth chart or natal chart. 
			</p>
			<p className="mb-6 text-black/80">
 				The key components of a horoscope include: 
			</p>
			<p className="mb-6 text-black/80">
				• <span className="font-semibold">The Zodiac Signs</span>: A belt of 12 constellations through which the Sun, Moon, and planets appear to pass. Each sign (Aries, Taurus, Gemini, etc.) is associated with different attributes.
			</p>
			<p className="mb-6 text-black/80">
				• <span className="font-semibold">The Planets</span>: The Sun, Moon, and other planets are said to have mythological characters that influence human life, with their specific placement determining where that energy shows up.
			</p>
			<p className="mb-6 text-black/80">
				• <span className="font-semibold">The Houses</span>: The chart is divided into 12 "houses," each representing a different area of life, such as career, relationships, and finance.
			</p>
			<p className="mb-6 text-black/80">
				• <span className="font-semibold">The Aspects</span>: These are the angular relationships between the planets. The angles are believed to indicate the harmony or challenges in a person's life. 
			</p>
			<h3 className="text-1xl font-bold text-gold mb-4">Horoscope vs. Astrology</h3>
			<p className="mb-6 text-black/80">
				While often used interchangeably, there is a distinction between the terms: 
			</p>
			<p className="mb-6 text-black/80">
			⇨ <span className="font-semibold">Astrology</span> is the overarching system of belief that celestial positions and movements influence earthly events and human lives.
			</p>
			<p className="mb-6 text-black/80">
			⇨ A <span className="font-semibold">horoscope</span> is a practical tool or forecast used within the practice of astrology. 
			</p>
			</div>
        </div>
      </main>
    </div>
  );
}