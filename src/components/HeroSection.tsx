// src/components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useZodiacPreviews } from '../hooks/useZodiacPreviews'; // Add this import

// Import zodiac images (keep your existing imports)
import ratImage from '../assets/chinese-zodiac/year-of-the-rat.png';
import oxImage from '../assets/chinese-zodiac/year-of-the-ox.png';
import tigerImage from '../assets/chinese-zodiac/year-of-the-tiger.png';
import rabbitImage from '../assets/chinese-zodiac/year-of-the-rabbit.png';
import dragonImage from '../assets/chinese-zodiac/year-of-the-dragon.png';
import snakeImage from '../assets/chinese-zodiac/year-of-the-snake.png';
import horseImage from '../assets/chinese-zodiac/year-of-the-horse.png';
import goatImage from '../assets/chinese-zodiac/year-of-the-goat.png';
import monkeyImage from '../assets/chinese-zodiac/year-of-the-monkey.png';
import roosterImage from '../assets/chinese-zodiac/year-of-the-rooster.png';
import dogImage from '../assets/chinese-zodiac/year-of-the-dog.png';
import pigImage from '../assets/chinese-zodiac/year-of-the-pig.png';

// Define type for zodiac object (keep your existing interface)
interface Zodiac {
  id: number;
  name: string;
  displayYears: string;
  image: string;
  color: string;
  traits: string;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const { previews, loading: previewsLoading } = useZodiacPreviews(); // Add this hook
  const [showPreviews, setShowPreviews] = useState(false); // Add state for toggling previews

  // Your existing zodiac data
  const chineseZodiacs: Zodiac[] = [
    {
      id: 1,
      name: "Rat",
      displayYears: "2020, 2008, 1996, 1984",
      image: ratImage,
      color: "from-blue-500 to-blue-700",
      traits: "Intelligent, Adaptable, Quick-witted"
    },
    {
      id: 2,
      name: "Ox",
      displayYears: "2021, 2009, 1997, 1985",
      image: oxImage,
      color: "from-green-500 to-green-700",
      traits: "Reliable, Patient, Honest"
    },
    {
      id: 3,
      name: "Tiger",
      displayYears: "2022, 2010, 1998, 1986",
      image: tigerImage,
      color: "from-orange-500 to-orange-700",
      traits: "Brave, Confident, Competitive"
    },
    {
      id: 4,
      name: "Rabbit",
      displayYears: "2023, 2011, 1999, 1987",
      image: rabbitImage,
      color: "from-pink-500 to-pink-700",
      traits: "Gentle, Quiet, Elegant"
    },
    {
      id: 5,
      name: "Dragon",
      displayYears: "2024, 2012, 2000, 1988",
      image: dragonImage,
      color: "from-red-500 to-red-700",
      traits: "Strong, Lucky, Flexible"
    },
    {
      id: 6,
      name: "Snake",
      displayYears: "2025, 2013, 2001, 1989",
      image: snakeImage,
      color: "from-purple-500 to-purple-700",
      traits: "Wise, Intuitive, Graceful"
    },
    {
      id: 7,
      name: "Horse",
      displayYears: "2026, 2014, 2002, 1990",
      image: horseImage,
      color: "from-yellow-500 to-yellow-700",
      traits: "Energetic, Independent, Impatient"
    },
    {
      id: 8,
      name: "Goat",
      displayYears: "2027, 2015, 2003, 1991",
      image: goatImage,
      color: "from-emerald-500 to-emerald-700",
      traits: "Calm, Gentle, Sympathetic"
    },
    {
      id: 9,
      name: "Monkey",
      displayYears: "2028, 2016, 2004, 1992",
      image: monkeyImage,
      color: "from-amber-500 to-amber-700",
      traits: "Clever, Curious, Mischievous"
    },
    {
      id: 10,
      name: "Rooster",
      displayYears: "2029, 2017, 2005, 1993",
      image: roosterImage,
      color: "from-rose-500 to-rose-700",
      traits: "Observant, Hardworking, Courageous"
    },
    {
      id: 11,
      name: "Dog",
      displayYears: "2030, 2018, 2006, 1994",
      image: dogImage,
      color: "from-indigo-500 to-indigo-700",
      traits: "Loyal, Responsible, Reliable"
    },
    {
      id: 12,
      name: "Pig",
      displayYears: "2031, 2019, 2007, 1995",
      image: pigImage,
      color: "from-teal-500 to-teal-700",
      traits: "Honest, Generous, Reliable"
    }
  ];

  const handleZodiacClick = (zodiac: Zodiac) => {
    navigate(`/zodiac/${zodiac.name.toLowerCase()}`);
  };

  // Auto-show previews after they load
  useEffect(() => {
    if (!previewsLoading && Object.keys(previews).length > 0) {
      const timer = setTimeout(() => setShowPreviews(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [previewsLoading, previews]);

  return (
    <section className="relative bg-white text-black min-h-[90vh] py-28 overflow-hidden">
      {/* Your existing floating elements */}
      <div className="absolute top-10 left-10 w-6 h-6 bg-gold/30 rounded-full blur-lg animate-pulse" />
      <div className="absolute top-16 right-80 w-10 h-10 bg-gold/30 rounded-full blur-md animate-pulse delay-1500" />
      <div className="absolute top-45 left-16 w-20 h-20 bg-gold/30 rounded-full blur-md animate-pulse delay-1500" />
      <div className="absolute bottom-16 right-20 w-20 h-20 bg-gold/30 rounded-full blur-md animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-8 h-8 bg-gold/20 rounded-full blur-md animate-pulse delay-2000" />
      
      <div className="relative z-10 container mx-auto px-4 text-center max-w-6xl pt-1">
        {/* Chinese Zodiac Selection */}
        <div className="mt-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gold mb-4">
            Today's Chinese Zodiac Horoscope
          </h1>
          
          {/* Add current date */}
          <p className="text-gray-600 mb-4 text-lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          {/* Add preview toggle */}
          <div className="mb-6">
            <button 
              onClick={() => setShowPreviews(!showPreviews)}
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 border border-indigo-300 rounded-full hover:bg-indigo-50"
              disabled={previewsLoading}
            >
              {previewsLoading ? "Loading previews..." : 
               showPreviews ? "Hide Today's Previews" : "Show Today's Previews"}
            </button>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto items-stretch">
            {chineseZodiacs.map((zodiac) => {
              const preview = previews[zodiac.name.toLowerCase()];
              
              return (
                <div
                  key={zodiac.id}
                  onClick={() => handleZodiacClick(zodiac)}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 h-full flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleZodiacClick(zodiac);
                    }
                  }}
                  aria-label={`View ${zodiac.name} horoscope for today`}
                >
                  {/* The Base Button: Always visible */}
                  <div className={`relative bg-gray-100 rounded-xl p-4 text-center text-black shadow-md border-2 border-gray-200 transition-all duration-300 h-full flex flex-col ${
                    showPreviews && preview ? 'min-h-[200px]' : 'min-h-[120px]'
                  }`}>
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent rounded-xl"></div>
                    
                    <div className="relative mb-2 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={zodiac.image}
                        alt={`Year of the ${zodiac.name} Chinese Zodiac`}
                        className="w-10 h-10 md:w-16 md:h-16 mx-auto object-contain"
                      />
                    </div>
                    
                    <h3 className="relative text-sm md:text-base font-bold mb-2">
                      {zodiac.name}
                    </h3>

                    {/* Today's Preview - Show only when previews are enabled */}
                    {showPreviews && (
                      <div className="mt-auto">
                        {previewsLoading ? (
                          <div className="text-xs text-gray-500 italic">
                            Loading...
                          </div>
                        ) : preview ? (
                          <div className="text-xs text-gray-600 leading-tight italic border-t border-gray-300 pt-2 mt-2">
                            <span className="font-medium text-indigo-600">Today:</span> "{preview.preview}"
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic border-t border-gray-300 pt-2 mt-2">
                            Click for today's guidance
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* The Hover Overlay: Becomes visible on hover */}
					<div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-indigo-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 text-white shadow-xl hover:shadow-2xl h-full">
					<div className="mb-1">
						<img
						src={zodiac.image}
						alt={zodiac.name}
						className="w-8 h-8 mx-auto object-contain" // Made smaller for better fit
						/>
					</div>
					<h4 className="font-bold text-sm mb-1">{zodiac.name}</h4>
					
					{preview && showPreviews ? (
						// When previews are shown, display the preview text
						<p className="text-xs text-center leading-tight mb-2 px-1">
						<span className="text-yellow-300 font-semibold">Today:</span> {preview.preview}
						</p>
					) : (
						// When previews are hidden, show traits (shorter text)
						<p className="text-xs text-center leading-tight mb-2 px-1">
						<span className="text-yellow-300 font-semibold">Traits:</span> {zodiac.traits}
						</p>
					)}
					
					<div className="text-xs opacity-75 text-center px-1">
						Click to view {showPreviews ? 'full horoscope' : 'today\'s horoscope'}
					</div>
					</div>
                </div>
              );
            })}
          </div>
        
		<p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mt-10">
          Explore your unique traits and a path to balance, prosperity, and clarity through ancient Chinese astrology.
        </p>
		
		<p className="text-black/80 text-sm mt-8">
		Prefer Western astrology instead? 
		<span className="text-gold font-semibold cursor-pointer hover:underline ml-1">
			<Link 
			to="/horoscope/western-zodiac" 
			className="text-gold font-semibold cursor-pointer hover:underline hover:text-yellow-500 transition-colors"
			>
			Check your Western Zodiac daily horoscope here →
			</Link>
		</span>
		</p>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;