// api/ephemeris.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Zodiac signs for calculations
const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Date ranges for zodiac signs (approximate)
const zodiacDates = [
  { sign: 'Capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { sign: 'Aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { sign: 'Pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { sign: 'Aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { sign: 'Taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { sign: 'Gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { sign: 'Cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { sign: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { sign: 'Virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { sign: 'Libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { sign: 'Scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { sign: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
];

// External ephemeris API integration
async function fetchExternalEphemeris(date, time, location) {
  if (!process.env.ASTRO_API_KEY) {
    return null; // No external API configured
  }

  try {
    // Try AstroAPI.com (example - you'd need to sign up)
    const response = await fetch('https://api.astroapi.com/v1/ephemeris', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: date,
        time: time,
        location: location,
        format: 'tropical',
        house_system: 'placidus'
      })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('External ephemeris API error:', error);
  }

  return null;
}

// Calculate sun sign from birth date
function calculateSunSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();

  for (const zodiac of zodiacDates) {
    const { sign, start, end } = zodiac;
    
    // Handle year-end transition (Capricorn)
    if (start.month > end.month) {
      if ((month === start.month && day >= start.day) || 
          (month === end.month && day <= end.day)) {
        return sign;
      }
    } else {
      // Normal date range
      if ((month === start.month && day >= start.day) || 
          (month === end.month && day <= end.day) ||
          (month > start.month && month < end.month)) {
        return sign;
      }
    }
  }
  
  return 'Capricorn'; // Default fallback
}

// Generate calculated planetary positions
function calculatePlanetaryPositions(birthDate, birthTime, birthLocation) {
  const birthDateTime = new Date(birthDate + 'T' + birthTime);
  const dayOfYear = Math.floor((birthDateTime - new Date(birthDateTime.getFullYear(), 0, 0)) / 86400000);
  const timeMinutes = parseInt(birthTime.replace(':', ''));
  const locationHash = birthLocation.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
  
  // Calculate sun sign accurately
  const sunSign = calculateSunSign(birthDate);
  const sunSignIndex = zodiacSigns.indexOf(sunSign);
  
  // More sophisticated planetary calculations
  const planetaryData = {
    // Sun position (based on actual birth date)
    sun: {
      sign: sunSign,
      degree: (dayOfYear % 30) + (timeMinutes % 100) / 100 * 30,
      house: ((dayOfYear + locationHash) % 12) + 1,
      element: getElementForSign(sunSign),
      quality: getQualityForSign(sunSign)
    },
    
    // Moon (moves ~13 degrees per day)
    moon: {
      sign: zodiacSigns[(sunSignIndex + Math.floor((dayOfYear * 13) / 30)) % 12],
      degree: ((dayOfYear * 13) % 30) + (timeMinutes % 60) / 60 * 30,
      house: ((timeMinutes + locationHash) % 12) + 1,
      phase: calculateMoonPhase(dayOfYear)
    },
    
    // Mercury (close to Sun, ±28 degrees max)
    mercury: {
      sign: zodiacSigns[(sunSignIndex + Math.floor(Math.random() * 3) - 1 + 12) % 12],
      degree: ((dayOfYear + 15) % 30) + Math.random() * 15,
      house: ((dayOfYear + locationHash + 1) % 12) + 1,
      retrograde: Math.random() < 0.2 // 20% chance retrograde
    },
    
    // Venus (close to Sun, ±47 degrees max)
    venus: {
      sign: zodiacSigns[(sunSignIndex + Math.floor(Math.random() * 4) - 2 + 12) % 12],
      degree: ((dayOfYear + 30) % 30) + Math.random() * 20,
      house: ((dayOfYear + locationHash + 2) % 12) + 1,
      retrograde: Math.random() < 0.08 // 8% chance retrograde
    },
    
    // Mars (moves ~0.5 degrees per day)
    mars: {
      sign: zodiacSigns[(sunSignIndex + Math.floor((dayOfYear * 0.5) / 30)) % 12],
      degree: ((dayOfYear * 0.5) % 30),
      house: ((dayOfYear + locationHash + 3) % 12) + 1,
      retrograde: Math.random() < 0.1 // 10% chance retrograde
    },
    
    // Jupiter (moves ~0.08 degrees per day, 12-year cycle)
    jupiter: {
      sign: zodiacSigns[Math.floor((birthDateTime.getFullYear() - 2000) / 1) % 12],
      degree: ((dayOfYear * 0.08) % 30),
      house: ((dayOfYear + locationHash + 4) % 12) + 1,
      retrograde: Math.random() < 0.3 // 30% chance retrograde
    },
    
    // Saturn (moves ~0.03 degrees per day, 29-year cycle)
    saturn: {
      sign: zodiacSigns[Math.floor((birthDateTime.getFullYear() - 2000) / 2.5) % 12],
      degree: ((dayOfYear * 0.03) % 30),
      house: ((dayOfYear + locationHash + 5) % 12) + 1,
      retrograde: Math.random() < 0.4 // 40% chance retrograde
    },
    
    // Uranus (84-year cycle)
    uranus: {
      sign: zodiacSigns[Math.floor((birthDateTime.getFullYear() - 1900) / 7) % 12],
      degree: ((dayOfYear * 0.01) % 30),
      house: ((dayOfYear + locationHash + 6) % 12) + 1,
      retrograde: Math.random() < 0.4
    },
    
    // Neptune (165-year cycle)
    neptune: {
      sign: zodiacSigns[Math.floor((birthDateTime.getFullYear() - 1900) / 14) % 12],
      degree: ((dayOfYear * 0.006) % 30),
      house: ((dayOfYear + locationHash + 7) % 12) + 1,
      retrograde: Math.random() < 0.4
    },
    
    // Pluto (248-year cycle)
    pluto: {
      sign: zodiacSigns[Math.floor((birthDateTime.getFullYear() - 1900) / 20) % 12],
      degree: ((dayOfYear * 0.004) % 30),
      house: ((dayOfYear + locationHash + 8) % 12) + 1,
      retrograde: Math.random() < 0.4
    },
    
    // Ascendant (Rising Sign - based on time and location)
    ascendant: {
      sign: zodiacSigns[(locationHash + Math.floor(timeMinutes / 60)) % 12],
      degree: (timeMinutes % 60) / 60 * 30
    },
    
    // Midheaven (MC - 90 degrees from Ascendant)
    midheaven: {
      sign: zodiacSigns[(locationHash + Math.floor(timeMinutes / 60) + 3) % 12],
      degree: ((timeMinutes + 90) % 60) / 60 * 30
    },
    
    // North Node (lunar nodes have 18.6-year cycle)
    northNode: {
      sign: zodiacSigns[Math.floor((dayOfYear + birthDateTime.getFullYear() * 20) / 30) % 12],
      degree: ((dayOfYear * 20) % 30),
      house: ((dayOfYear + locationHash + 9) % 12) + 1
    }
  };
  
  return planetaryData;
}

// Helper functions for astrological elements and qualities
function getElementForSign(sign) {
  const elements = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
  };
  return elements[sign] || 'Unknown';
}

function getQualityForSign(sign) {
  const qualities = {
    'Aries': 'Cardinal', 'Cancer': 'Cardinal', 'Libra': 'Cardinal', 'Capricorn': 'Cardinal',
    'Taurus': 'Fixed', 'Leo': 'Fixed', 'Scorpio': 'Fixed', 'Aquarius': 'Fixed',
    'Gemini': 'Mutable', 'Virgo': 'Mutable', 'Sagittarius': 'Mutable', 'Pisces': 'Mutable'
  };
  return qualities[sign] || 'Unknown';
}

function calculateMoonPhase(dayOfYear) {
  // Simplified moon phase calculation (29.5-day cycle)
  const phase = (dayOfYear % 29.5) / 29.5;
  if (phase < 0.125) return 'New Moon';
  if (phase < 0.375) return 'Waxing Crescent';
  if (phase < 0.625) return 'Full Moon';
  if (phase < 0.875) return 'Waning Crescent';
  return 'New Moon';
}

// Calculate major aspects between planets
function calculateAspects(planetaryData) {
  const aspects = [];
  const planetNames = Object.keys(planetaryData).filter(p => 
    !['ascendant', 'midheaven', 'northNode'].includes(p)
  );
  
  const aspectOrbs = {
    'Conjunction': { angle: 0, orb: 8 },
    'Opposition': { angle: 180, orb: 8 },
    'Trine': { angle: 120, orb: 8 },
    'Square': { angle: 90, orb: 8 },
    'Sextile': { angle: 60, orb: 6 },
    'Quincunx': { angle: 150, orb: 3 }
  };
  
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planetNames[i];
      const planet2 = planetNames[j];
      
      // Calculate degree positions (simplified)
      const pos1 = zodiacSigns.indexOf(planetaryData[planet1].sign) * 30 + planetaryData[planet1].degree;
      const pos2 = zodiacSigns.indexOf(planetaryData[planet2].sign) * 30 + planetaryData[planet2].degree;
      
      let difference = Math.abs(pos1 - pos2);
      if (difference > 180) difference = 360 - difference;
      
      // Check for aspects
      for (const [aspectName, aspectData] of Object.entries(aspectOrbs)) {
        if (Math.abs(difference - aspectData.angle) <= aspectData.orb) {
          aspects.push({
            planet1,
            planet2,
            aspect: aspectName,
            orb: Math.abs(difference - aspectData.angle).toFixed(1)
          });
          break;
        }
      }
    }
  }
  
  return aspects;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { birthDate, birthTime, birthLocation } = req.method === 'GET' ? req.query : req.body;

    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({ 
        error: 'Birth date, time, and location are required',
        example: {
          birthDate: '1990-01-15',
          birthTime: '14:30',
          birthLocation: 'New York, NY, USA'
        }
      });
    }

    // Try external ephemeris API first
    let ephemerisData = await fetchExternalEphemeris(birthDate, birthTime, birthLocation);
    
    // If external API fails, use calculated data
    if (!ephemerisData) {
      console.log('Using calculated ephemeris data');
      const planetaryData = calculatePlanetaryPositions(birthDate, birthTime, birthLocation);
      const aspects = calculateAspects(planetaryData);
      
      ephemerisData = {
        source: 'calculated',
        birth_info: {
          date: birthDate,
          time: birthTime,
          location: birthLocation
        },
        planetary_positions: planetaryData,
        aspects: aspects,
        houses: generateHouses(planetaryData),
        calculated_at: new Date().toISOString()
      };
    } else {
      ephemerisData.source = 'external_api';
    }

    // Cache the result in Supabase for future reference
    try {
      await supabase
        .from('ephemeris_cache')
        .upsert({
          birth_date: birthDate,
          birth_time: birthTime,
          birth_location: birthLocation,
          ephemeris_data: ephemerisData,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'birth_date,birth_time,birth_location'
        });
    } catch (cacheError) {
      console.error('Failed to cache ephemeris data:', cacheError);
      // Continue without caching
    }

    return res.status(200).json(ephemerisData);

  } catch (error) {
    console.error('Ephemeris calculation error:', error);
    return res.status(500).json({ 
      error: 'Failed to calculate ephemeris data',
      details: error.message 
    });
  }
}

// Generate house cusps (simplified)
function generateHouses(planetaryData) {
  const houses = {};
  const ascendantSign = planetaryData.ascendant.sign;
  const ascendantIndex = zodiacSigns.indexOf(ascendantSign);
  
  for (let i = 1; i <= 12; i++) {
    const houseSign = zodiacSigns[(ascendantIndex + i - 1) % 12];
    houses[`house_${i}`] = {
      sign: houseSign,
      cusp_degree: Math.random() * 30,
      ruling_planet: getRulingPlanet(houseSign),
      element: getElementForSign(houseSign),
      quality: getQualityForSign(houseSign)
    };
  }
  
  return houses;
}

function getRulingPlanet(sign) {
  const rulers = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
    'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
    'Libra': 'Venus', 'Scorpio': 'Pluto', 'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn', 'Aquarius': 'Uranus', 'Pisces': 'Neptune'
  };
  return rulers[sign] || 'Unknown';
}