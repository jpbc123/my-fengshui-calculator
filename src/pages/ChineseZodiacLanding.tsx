// src/pages/ChineseZodiacLanding.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header'; // Corrected import path
import Footer from '@/components/Footer'; // Corrected import path
import Breadcrumb from '@/components/Breadcrumb'; // Corrected import path

// Image imports - corrected to use the assumed '@/assets/' alias
import ratImage from '@/assets/chinese-zodiac/year-of-the-rat.png';
import oxImage from '@/assets/chinese-zodiac/year-of-the-ox.png';
import tigerImage from '@/assets/chinese-zodiac/year-of-the-tiger.png';
import rabbitImage from '@/assets/chinese-zodiac/year-of-the-rabbit.png';
import dragonImage from '@/assets/chinese-zodiac/year-of-the-dragon.png';
import snakeImage from '@/assets/chinese-zodiac/year-of-the-snake.png';
import horseImage from '@/assets/chinese-zodiac/year-of-the-horse.png';
import goatImage from '@/assets/chinese-zodiac/year-of-the-goat.png';
import monkeyImage from '@/assets/chinese-zodiac/year-of-the-monkey.png';
import roosterImage from '@/assets/chinese-zodiac/year-of-the-rooster.png';
import dogImage from '@/assets/chinese-zodiac/year-of-the-dog.png';
import pigImage from '@/assets/chinese-zodiac/year-of-the-pig.png';


// Define type for zodiac object (copied from HeroSection, keeping relevant fields)
interface Zodiac {
    id: number;
    name: string;
    displayYears: string;
    image: string;
    // color and traits are useful for the hover effect and can be kept
    color: string;
    traits: string;
}

const ChineseZodiacLanding = () => {
    const navigate = useNavigate();

    // Consolidated Chinese Zodiac data. This data is used to render the selection grid.
    const chineseZodiacs: Zodiac[] = [
        { id: 1, name: "Rat", displayYears: "2020, 2008, 1996, 1984", image: ratImage, color: "from-blue-500 to-blue-700", traits: "Intelligent, Adaptable, Quick-witted" },
        { id: 2, name: "Ox", displayYears: "2021, 2009, 1997, 1985", image: oxImage, color: "from-green-500 to-green-700", traits: "Reliable, Patient, Honest" },
        { id: 3, name: "Tiger", displayYears: "2022, 2010, 1998, 1986", image: tigerImage, color: "from-orange-500 to-orange-700", traits: "Brave, Confident, Competitive" },
        { id: 4, name: "Rabbit", displayYears: "2023, 2011, 1999, 1987", image: rabbitImage, color: "from-pink-500 to-pink-700", traits: "Gentle, Quiet, Elegant" },
        { id: 5, name: "Dragon", displayYears: "2024, 2012, 2000, 1988", image: dragonImage, color: "from-red-500 to-red-700", traits: "Strong, Lucky, Flexible" },
        { id: 6, name: "Snake", displayYears: "2025, 2013, 2001, 1989", image: snakeImage, color: "from-purple-500 to-purple-700", traits: "Wise, Intuitive, Graceful" },
        { id: 7, name: "Horse", displayYears: "2026, 2014, 2002, 1990", image: horseImage, color: "from-yellow-500 to-yellow-700", traits: "Energetic, Independent, Impatient" },
        { id: 8, name: "Goat", displayYears: "2027, 2015, 2003, 1991", image: goatImage, color: "from-emerald-500 to-emerald-700", traits: "Calm, Gentle, Sympathetic" },
        { id: 9, name: "Monkey", displayYears: "2028, 2016, 2004, 1992", image: monkeyImage, color: "from-amber-500 to-amber-700", traits: "Clever, Curious, Mischievous" },
        { id: 10, name: "Rooster", displayYears: "2029, 2017, 2005, 1993", image: roosterImage, color: "from-rose-500 to-rose-700", traits: "Observant, Hardworking, Courageous" },
        { id: 11, name: "Dog", displayYears: "2030, 2018, 2006, 1994", image: dogImage, color: "from-indigo-500 to-indigo-700", traits: "Loyal, Responsible, Reliable" },
        { id: 12, name: "Pig", displayYears: "2031, 2019, 2007, 1995", image: pigImage, color: "from-teal-500 to-teal-700", traits: "Honest, Generous, Reliable" }
    ];

    // Define breadcrumbs for this landing page
    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Chinese Horoscope" }, // This is the current page's label
    ];

    /**
     * Handles the click event for a zodiac animal.
     * Navigates to the Chinese Horoscope Result page for the selected zodiac.
     * @param zodiac The selected zodiac object.
     */
    const handleZodiacClick = (zodiac: Zodiac) => {
        // Navigate to the ChineseHoroscopeResult page, passing the zodiac sign as a URL parameter.
        // This will now route to the existing `/chinese-zodiac/:sign` route.
        navigate(`/zodiac/${zodiac.name.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Header /> {/* Renders the site-wide header */}
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl mt-20">
                <Breadcrumb items={breadcrumbs} /> {/* Renders breadcrumbs for navigation */}

                {/* Section title and description for selection */}
                <div className="text-center mb-8 mt-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Choose Your Chinese Zodiac Sign
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
                        Select your sign to discover your daily, weekly, and yearly horoscope.
                    </p>
                </div>

                {/* Grid for Chinese Zodiac selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {chineseZodiacs.map((zodiac) => (
                        <div
                            key={zodiac.id}
                            onClick={() => handleZodiacClick(zodiac)}
                            className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                            role="button" // Indicate this is an interactive element
                            tabIndex={0} // Make it focusable for keyboard navigation
                            onKeyPress={(e) => {
                                // Allow selection with Enter or Space key
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleZodiacClick(zodiac);
                                }
                            }}
                            aria-label={`View ${zodiac.name} horoscope`} // Accessibility label
                        >
                            {/* Base card for the zodiac sign */}
                            <div className="relative bg-gray-100 rounded-xl p-4 text-center text-black shadow-md border-2 border-gray-200 transition-all duration-300">
                                {/* Subtle gradient overlay for aesthetic */}
                                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent rounded-xl"></div>
                                
                                {/* Zodiac image, scales on hover */}
                                <div className="relative mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={zodiac.image}
                                        alt={zodiac.name}
                                        className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain"
                                    />
                                </div>
                                
                                {/* Zodiac name and display years */}
                                <h3 className="relative text-lg md:text-xl font-bold mb-1">
                                    {zodiac.name}
                                </h3>
                                <p className="text-sm text-gray-600">{zodiac.displayYears}</p>
                            </div>

                            {/* The Hover Overlay: Provides more details on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-indigo-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 text-white shadow-xl hover:shadow-2xl">
                                <div className="mb-1">
                                    <img
                                        src={zodiac.image}
                                        alt={zodiac.name}
                                        className="w-10 h-10 mx-auto object-contain"
                                    />
                                </div>
                                <h4 className="font-bold text-base mb-1">{zodiac.name}</h4>
                                <p className="text-xs text-center leading-relaxed">
                                    {zodiac.traits}
                                </p>
                                <div className="mt-1 text-xs opacity-75">
                                    Click to explore
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action for finding their sign if unsure */}
                <div className="text-center mt-12 mb-8">
                    <p className="text-gray-700 text-base">
                        Unsure of your sign? Use our calculator to find out!
                    </p>
                    <button
                        onClick={() => navigate('/chinese-zodiac-calculator')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-4 inline-block"
                    >
                        Calculate My Sign
                    </button>
                </div>

            </main>
            <Footer /> {/* Renders the site-wide footer */}
        </div>
    );
};

export default ChineseZodiacLanding;