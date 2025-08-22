// src/components/HeroSection.tsx
import { Link, useNavigate } from 'react-router-dom';
// Import zodiac images
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

// Define type for zodiac object
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

  return (
    <section className="relative bg-white text-black min-h-[90vh] py-32 overflow-hidden">


      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-6 h-6 bg-gold/30 rounded-full blur-lg animate-pulse" />
      <div className="absolute top-16 right-80 w-10 h-10 bg-gold/30 rounded-full blur-md animate-pulse delay-1500" />
      <div className="absolute top-45 left-16 w-20 h-20 bg-gold/30 rounded-full blur-md animate-pulse delay-1500" />
      <div className="absolute bottom-16 right-20 w-20 h-20 bg-gold/30 rounded-full blur-md animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-8 h-8 bg-gold/20 rounded-full blur-md animate-pulse delay-2000" />
      
      <div className="relative z-10 container mx-auto px-4 text-center max-w-6xl pt-1">
        {/* Chinese Zodiac Selection */}
        <div className="mt-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gold mb-10">
            Choose Your Chinese Zodiac
          </h1>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {chineseZodiacs.map((zodiac) => (
              <div
                key={zodiac.id}
                onClick={() => handleZodiacClick(zodiac)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleZodiacClick(zodiac);
                  }
                }}
                aria-label={`View ${zodiac.name} horoscope`}
              >
                <div className="relative bg-transparent rounded-xl p-4 text-center text-black shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/20">
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent rounded-xl"></div>
                  
                  {/* Zodiac image */}
                  <div className="relative mb-2 group-hover:animate-bounce">
                    <img 
                      src={zodiac.image} 
                      alt={zodiac.name}
                      className="w-10 h-10 md:w-16 md:h-16 mx-auto object-contain"
                    />
                  </div>
                  
                  {/* Zodiac name */}
                  <h3 className="relative text-sm md:text-base font-bold mb-1">
                    {zodiac.name}
                  </h3>
                  
                  {/* Hover overlay with traits */}
					<div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-indigo-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 border border-purple-400/30 text-white">
					<div className="mb-1">
						<img 
						src={zodiac.image} 
						alt={zodiac.name}
						className="w-10 h-10 mx-auto object-contain"
						/>
					</div>
					<h4 className="font-bold text-sm mb-1">{zodiac.name}</h4>
					<p className="text-xs text-center leading-relaxed">
						{zodiac.traits}
					</p>
					<div className="mt-1 text-xs opacity-75">
						Click to explore
					</div>
					</div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-black/80 text-sm mt-10">
            Don't know your Chinese zodiac year? 
            <span className="text-gold font-semibold cursor-pointer hover:underline ml-1">
              <Link 
                to="/chinese-zodiac-calculator" 
                className="text-gold font-semibold cursor-pointer hover:underline ml-1"
              >
                Calculate it here →
              </Link>
            </span>
          </p>
        </div>
        
        <p className="text-lg md:text-xl text-grea=y/80 max-w-2xl mx-auto">
          Begin your journey of self-discovery and unlock tools for balance, prosperity, and clarity.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;