// api/calculateBirthChart.js
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced calculation that requires proper coordinates
function generateEnhancedPlanetaryData(birthDate, birthTime, birthLocation) {
  const birthDateTime = new Date(`${birthDate}T${birthTime}`);
  const julianDay = getJulianDay(birthDateTime);
  
  // Parse location coordinates - expect format "lat,lon" from frontend
  let lat, lon;
  
  try {
    if (birthLocation.includes(',')) {
      const parts = birthLocation.split(',');
      lat = parseFloat(parts[0].trim());
      lon = parseFloat(parts[1].trim());
      
      // Validate coordinates are actual numbers and within valid ranges
      if (isNaN(lat) || isNaN(lon) || 
          lat < -90 || lat > 90 || 
          lon < -180 || lon > 180) {
        throw new Error(`Invalid coordinates: ${birthLocation}`);
      }
    } else {
      throw new Error(`Invalid location format: ${birthLocation}. Expected format: "latitude,longitude"`);
    }
  } catch (error) {
    console.error('Location parsing error:', error.message);
    throw new Error(`Cannot process birth chart: ${error.message}. Please ensure location coordinates are provided correctly.`);
  }
  
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const planets = {};
  
  // Calculate ascendant first (needed for house calculations)
  const ascendantDegree = calculateAscendant(julianDay, lat, birthTime);
  planets.ascendant = {
    sign: zodiacSigns[Math.floor(ascendantDegree / 30)],
    degree: ascendantDegree % 30,
    absoluteDegree: ascendantDegree
  };

  // Sun position
  const sunLongitude = calculateSunPosition(julianDay);
  planets.sun = {
    sign: zodiacSigns[Math.floor(sunLongitude / 30)],
    degree: sunLongitude % 30,
    house: calculateHouse(sunLongitude, ascendantDegree),
    absoluteDegree: sunLongitude
  };

  // Moon position
  const moonLongitude = calculateMoonPosition(julianDay);
  planets.moon = {
    sign: zodiacSigns[Math.floor(moonLongitude / 30)],
    degree: moonLongitude % 30,
    house: calculateHouse(moonLongitude, ascendantDegree),
    absoluteDegree: moonLongitude
  };

  // Other planets with orbital periods
  const planetaryData = [
    { name: 'mercury', period: 87.969, offset: 0 },
    { name: 'venus', period: 224.701, offset: 50 },
    { name: 'mars', period: 686.980, offset: 120 },
    { name: 'jupiter', period: 4332.59, offset: 180 },
    { name: 'saturn', period: 10759.22, offset: 240 },
    { name: 'uranus', period: 30688.5, offset: 300 },
    { name: 'neptune', period: 60182, offset: 330 },
    { name: 'pluto', period: 90560, offset: 350 }
  ];

  planetaryData.forEach(planet => {
    const longitude = calculatePlanetPosition(julianDay, planet.period, planet.offset);
    planets[planet.name] = {
      sign: zodiacSigns[Math.floor(longitude / 30)],
      degree: longitude % 30,
      house: calculateHouse(longitude, ascendantDegree),
      absoluteDegree: longitude
    };
  });

  // Calculate midheaven
  const midheavenDegree = (ascendantDegree + 270) % 360;
  planets.midheaven = {
    sign: zodiacSigns[Math.floor(midheavenDegree / 30)],
    degree: midheavenDegree % 30,
    absoluteDegree: midheavenDegree
  };

  console.log(`Planetary calculations completed for coordinates: ${lat}, ${lon}`);
  return planets;
}

// Fixed house calculation
function calculateHouse(planetDegree, ascendantDegree) {
  if (isNaN(planetDegree) || isNaN(ascendantDegree)) {
    console.warn('Invalid degrees for house calculation, defaulting to house 1');
    return 1;
  }
  
  const houseCusp = (planetDegree - ascendantDegree + 360) % 360;
  const house = Math.floor(houseCusp / 30) + 1;
  
  // Ensure house is between 1-12
  return house > 12 ? house - 12 : (house < 1 ? house + 12 : house);
}

// Astronomical helper functions
function getJulianDay(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function calculateSunPosition(julianDay) {
  const n = julianDay - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) * Math.PI / 180) % (2 * Math.PI);
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
  return lambda < 0 ? lambda + 360 : lambda;
}

function calculateMoonPosition(julianDay) {
  const n = julianDay - 2451545.0;
  const L = (218.316 + 13.176396 * n) % 360;
  const M = (134.963 + 13.064993 * n) % 360;
  const F = (93.272 + 13.229350 * n) % 360;
  
  // Simplified lunar longitude
  const longitude = (L + 6.289 * Math.sin(M * Math.PI / 180)) % 360;
  return longitude < 0 ? longitude + 360 : longitude;
}

function calculatePlanetPosition(julianDay, orbitalPeriod, offset) {
  const n = julianDay - 2451545.0;
  const meanAnomaly = (n / orbitalPeriod * 360 + offset) % 360;
  return meanAnomaly < 0 ? meanAnomaly + 360 : meanAnomaly;
}

function calculateAscendant(julianDay, latitude, birthTime) {
  const [hours, minutes] = birthTime.split(':').map(Number);
  const timeDecimal = hours + minutes / 60;
  
  // Simplified ascendant calculation
  const siderealTime = (julianDay % 1) * 360 + timeDecimal * 15;
  const ascendant = (siderealTime + latitude * 0.5) % 360;
  
  return ascendant < 0 ? ascendant + 360 : ascendant;
}

// Simplified planetary positions calculation
async function calculatePlanetaryPositions(birthDate, birthTime, birthLocation) {
  console.log('Using local astronomical calculations...');
  return generateEnhancedPlanetaryData(birthDate, birthTime, birthLocation);
}

// Improved AI interpretation with robust JSON parsing
async function generateInterpretations(planetaryData, personalInfo) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const planetarySummary = Object.entries(planetaryData).map(([planet, data]) => {
    return `${planet.toUpperCase()}: ${data.sign} ${data.degree.toFixed(1)} degrees in House ${data.house || 'N/A'}`;
  }).join('\n');
  
  const prompt = `Generate a birth chart analysis as valid JSON only. No markdown, no explanations, just pure JSON.

PLANETARY POSITIONS:
${planetarySummary}

Return ONLY a JSON object with these exact keys and 250-350 word values:
{
  "overview": "Complete chart overview...",
  "planetary_positions": "Detailed planet meanings...",
  "houses": "House interpretations...",
  "aspects": "Planetary relationships...",
  "life_path": "Life purpose insights...",
  "career": "Professional guidance...",
  "relationships": "Love and relationship insights...",
  "personality": "Character analysis...",
  "life_purpose": "Core life mission...",
  "challenges": "Growth areas..."
}

Write in second person (you/your). Make it personal for ${personalInfo.fullName}.`;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Clean the response more aggressively
    responseText = responseText
      .replace(/```json\s*|\s*```/g, '')
      .replace(/```\s*|\s*```/g, '')
      .replace(/^[^{]*{/, '{')  // Remove anything before first {
      .replace(/}[^}]*$/, '}') // Remove anything after last }
      .replace(/\n/g, ' ')     // Replace newlines with spaces
      .replace(/\s+/g, ' ')    // Collapse multiple spaces
      .trim();
    
    try {
      const parsed = JSON.parse(responseText);
      console.log('Successfully parsed AI response');
      return parsed;
    } catch (parseError) {
      console.error('JSON parse failed, using fallback');
      return generateFallbackInterpretations(planetaryData, personalInfo);
    }
  } catch (error) {
    console.error('AI generation failed, using fallback');
    return generateFallbackInterpretations(planetaryData, personalInfo);
  }
}

// Fallback interpretations if AI fails
function generateFallbackInterpretations(planetaryData, personalInfo) {
  const sunSign = planetaryData.sun?.sign || 'Unknown';
  const moonSign = planetaryData.moon?.sign || 'Unknown';
  const risingSign = planetaryData.ascendant?.sign || 'Unknown';

  return {
    overview: `${personalInfo.fullName}, your birth chart reveals a unique cosmic blueprint shaped by your ${sunSign} Sun, ${moonSign} Moon, and ${risingSign} Rising. This combination creates a complex personality with distinct strengths, challenges, and life themes that will unfold throughout your journey.`,
    planetary_positions: `Your Sun in ${sunSign} represents your core identity and life force, while your Moon in ${moonSign} governs your emotional nature and intuitive responses. Each planetary placement in your chart contributes to the rich tapestry of your personality and life experiences.`,
    houses: `The twelve houses of your chart represent different life areas where planetary energies manifest. Your planetary emphasis in certain houses indicates where you'll focus most of your energy and attention throughout life.`,
    aspects: `The relationships between planets in your chart create dynamic interactions that influence how different parts of your personality work together. These aspects reveal your internal harmony and potential areas of creative tension.`,
    life_path: `Your spiritual journey is encoded in the deeper patterns of your birth chart, revealing lessons you're here to learn and gifts you're meant to share with the world.`,
    career: `Your professional path is illuminated by the planets in your career houses and their aspects, showing your natural talents and the work environment where you'll thrive most.`,
    relationships: `Your approach to love and partnerships is revealed through Venus and Mars placements, showing how you give and receive affection and what you seek in close relationships.`,
    personality: `The combination of your ${sunSign} Sun, ${moonSign} Moon, and ${risingSign} Rising creates a unique personality blend that shapes how you express yourself and interact with the world.`,
    life_purpose: `Your soul's mission in this lifetime involves integrating the various energies in your chart and expressing your highest potential through service to others.`,
    challenges: `Every chart contains growth areas that offer opportunities for personal development. These challenges are actually gifts that help you develop strength and wisdom.`
  };
}

// Enhanced Birth Chart Wheel Generator
function generateEnhancedNatalChartWheel(planetaryData) {
  const centerX = 300;
  const centerY = 300;
  const outerRadius = 280;
  const signRadius = 240;
  const planetRadius = 180;
  const houseRadius = 140;
  const innerRadius = 80;
  
  // Zodiac signs in order starting from Aries at 0°
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  // Planet symbols and colors (matching professional software)
  const planetInfo = {
    sun: { symbol: '☉', color: '#FF6B35', name: 'Sun' },
    moon: { symbol: '☽', color: '#4ECDC4', name: 'Moon' },
    mercury: { symbol: '☿', color: '#45B7D1', name: 'Mercury' },
    venus: { symbol: '♀', color: '#96CEB4', name: 'Venus' },
    mars: { symbol: '♂', color: '#FFEAA7', name: 'Mars' },
    jupiter: { symbol: '♃', color: '#DDA0DD', name: 'Jupiter' },
    saturn: { symbol: '♄', color: '#F39C12', name: 'Saturn' },
    uranus: { symbol: '♅', color: '#00B894', name: 'Uranus' },
    neptune: { symbol: '♆', color: '#6C5CE7', name: 'Neptune' },
    pluto: { symbol: '♇', color: '#A29BFE', name: 'Pluto' },
    ascendant: { symbol: 'AC', color: '#2D3436', name: 'Ascendant' },
    midheaven: { symbol: 'MC', color: '#2D3436', name: 'Midheaven' }
  };

  // Sign symbols and colors
  const signInfo = {
    'Aries': { symbol: '♈', color: '#E74C3C', element: 'fire' },
    'Taurus': { symbol: '♉', color: '#27AE60', element: 'earth' },
    'Gemini': { symbol: '♊', color: '#F39C12', element: 'air' },
    'Cancer': { symbol: '♋', color: '#3498DB', element: 'water' },
    'Leo': { symbol: '♌', color: '#E74C3C', element: 'fire' },
    'Virgo': { symbol: '♍', color: '#27AE60', element: 'earth' },
    'Libra': { symbol: '♎', color: '#F39C12', element: 'air' },
    'Scorpio': { symbol: '♏', color: '#3498DB', element: 'water' },
    'Sagittarius': { symbol: '♐', color: '#E74C3C', element: 'fire' },
    'Capricorn': { symbol: '♑', color: '#27AE60', element: 'earth' },
    'Aquarius': { symbol: '♒', color: '#F39C12', element: 'air' },
    'Pisces': { symbol: '♓', color: '#3498DB', element: 'water' }
  };

  // Calculate aspects between planets
  function calculateAspects() {
    const aspects = [];
    const planetList = Object.entries(planetaryData).filter(([name]) => 
      name !== 'ascendant' && name !== 'midheaven'
    );

    for (let i = 0; i < planetList.length; i++) {
      for (let j = i + 1; j < planetList.length; j++) {
        const [planet1, data1] = planetList[i];
        const [planet2, data2] = planetList[j];
        
        if (data1.absoluteDegree !== undefined && data2.absoluteDegree !== undefined) {
          let diff = Math.abs(data1.absoluteDegree - data2.absoluteDegree);
          if (diff > 180) diff = 360 - diff;
          
          // Define aspect orbs (tolerance)
          const aspectTypes = [
            { name: 'conjunction', angle: 0, orb: 8, color: '#E74C3C', style: 'solid' },
            { name: 'opposition', angle: 180, orb: 8, color: '#E74C3C', style: 'solid' },
            { name: 'trine', angle: 120, orb: 6, color: '#27AE60', style: 'dashed' },
            { name: 'square', angle: 90, orb: 6, color: '#E67E22', style: 'solid' },
            { name: 'sextile', angle: 60, orb: 4, color: '#3498DB', style: 'dotted' }
          ];
          
          for (const aspectType of aspectTypes) {
            if (Math.abs(diff - aspectType.angle) <= aspectType.orb) {
              aspects.push({
                planet1,
                planet2,
                type: aspectType.name,
                angle: diff,
                color: aspectType.color,
                style: aspectType.style
              });
              break;
            }
          }
        }
      }
    }
    return aspects;
  }

  const aspects = calculateAspects();

  let svg = `<svg width="600" height="640" viewBox="0 0 600 640" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .chart-text { font-family: 'Arial', sans-serif; text-anchor: middle; dominant-baseline: middle; }
        .sign-symbol { font-size: 20px; font-weight: bold; }
        .sign-name { font-size: 11px; fill: #2c3e50; }
        .planet-symbol { font-size: 16px; font-weight: bold; }
        .house-number { font-size: 16px; font-weight: bold; fill: #34495e; }
        .degree-text { font-size: 10px; fill: #7f8c8d; }
        .wheel-line { stroke: #2c3e50; stroke-width: 2; fill: none; }
        .house-line { stroke: #95a5a6; stroke-width: 1.5; }
        .aspect-line { stroke-width: 1.5; fill: none; }
        .center-point { fill: #2c3e50; }
        .degree-tick { stroke: #bdc3c7; stroke-width: 0.5; }
      </style>
      
      <!-- Define patterns for different aspect types -->
      <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="2">
        <rect width="4" height="2" fill="currentColor"/>
      </pattern>
      <pattern id="dotted" patternUnits="userSpaceOnUse" width="4" height="2">
        <circle cx="2" cy="1" r="0.5" fill="currentColor"/>
      </pattern>
    </defs>
    
    <!-- Background circles with subtle gradients -->
    <defs>
      <radialGradient id="chartGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8f9fa"/>
      </radialGradient>
    </defs>
    
    <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" fill="url(#chartGradient)" class="wheel-line"/>
    <circle cx="${centerX}" cy="${centerY}" r="${signRadius}" class="wheel-line"/>
    <circle cx="${centerX}" cy="${centerY}" r="${planetRadius}" stroke="#ecf0f1" stroke-width="1" fill="none"/>
    <circle cx="${centerX}" cy="${centerY}" r="${houseRadius}" class="wheel-line"/>
    <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" class="wheel-line"/>`;

  // Add degree tick marks around outer rim
  for (let degree = 0; degree < 360; degree += 5) {
    const angle = (degree - 90) * Math.PI / 180;
    const isMainTick = degree % 30 === 0;
    const tickLength = isMainTick ? 15 : 8;
    
    const x1 = centerX + outerRadius * Math.cos(angle);
    const y1 = centerY + outerRadius * Math.sin(angle);
    const x2 = centerX + (outerRadius - tickLength) * Math.cos(angle);
    const y2 = centerY + (outerRadius - tickLength) * Math.sin(angle);
    
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="degree-tick" 
            stroke-width="${isMainTick ? 2 : 0.5}"/>`;
  }

  // Draw zodiac sign sections with enhanced styling
  for (let i = 0; i < 12; i++) {
    const startAngle = (i * 30 - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
    const midAngle = startAngle + Math.PI / 12;
    
    const sign = zodiacSigns[i];
    const signData = signInfo[sign];
    
    // Create sign section background with subtle gradient
    const x1 = centerX + signRadius * Math.cos(startAngle);
    const y1 = centerY + signRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + signRadius * Math.cos(endAngle);
    const y4 = centerY + signRadius * Math.sin(endAngle);
    
    // Sign background sector
    svg += `<path d="M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${signRadius} ${signRadius} 0 0 0 ${x1} ${y1}" 
            fill="${signData.color}" opacity="0.15" stroke="${signData.color}" stroke-width="1"/>`;
    
    // Sign symbol
    const symbolX = centerX + (signRadius + 20) * Math.cos(midAngle);
    const symbolY = centerY + (signRadius + 20) * Math.sin(midAngle);
    svg += `<text x="${symbolX}" y="${symbolY}" class="chart-text sign-symbol" fill="${signData.color}">${signData.symbol}</text>`;
    
    // Degree markings for sign boundaries
    const degreeX = centerX + (outerRadius - 5) * Math.cos(startAngle);
    const degreeY = centerY + (outerRadius - 5) * Math.sin(startAngle);
    svg += `<text x="${degreeX}" y="${degreeY}" class="chart-text" style="font-size: 10px; fill: #7f8c8d;">${i * 30}°</text>`;
  }

  // Calculate house cusps (simplified - in reality these would be calculated based on birth time/location)
  const ascendantDegree = planetaryData.ascendant?.absoluteDegree || 0;
  const houseCusps = [];
  for (let i = 0; i < 12; i++) {
    houseCusps.push((ascendantDegree + i * 30) % 360);
  }

  // Draw house lines and numbers with calculated cusps
  for (let i = 0; i < 12; i++) {
    const angle = (houseCusps[i] - 90) * Math.PI / 180;
    
    // House division lines
    const x1 = centerX + innerRadius * Math.cos(angle);
    const y1 = centerY + innerRadius * Math.sin(angle);
    const x2 = centerX + houseRadius * Math.cos(angle);
    const y2 = centerY + houseRadius * Math.sin(angle);
    
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="house-line"/>`;
    
    // House numbers positioned better
    const nextAngle = (houseCusps[(i + 1) % 12] - 90) * Math.PI / 180;
    const houseAngle = angle + (nextAngle - angle) / 2;
    const houseX = centerX + (houseRadius - 25) * Math.cos(houseAngle);
    const houseY = centerY + (houseRadius - 25) * Math.sin(houseAngle);
    svg += `<text x="${houseX}" y="${houseY}" class="chart-text house-number">${i + 1}</text>`;
  }

  // Draw aspect lines BEFORE planets so they appear behind
  aspects.forEach(aspect => {
    const planet1Data = planetaryData[aspect.planet1];
    const planet2Data = planetaryData[aspect.planet2];
    
    if (planet1Data && planet2Data) {
      const angle1 = (planet1Data.absoluteDegree - 90) * Math.PI / 180;
      const angle2 = (planet2Data.absoluteDegree - 90) * Math.PI / 180;
      
      const x1 = centerX + (innerRadius + 20) * Math.cos(angle1);
      const y1 = centerY + (innerRadius + 20) * Math.sin(angle1);
      const x2 = centerX + (innerRadius + 20) * Math.cos(angle2);
      const y2 = centerY + (innerRadius + 20) * Math.sin(angle2);
      
      let strokeDashArray = '';
      if (aspect.style === 'dashed') strokeDashArray = '8,4';
      if (aspect.style === 'dotted') strokeDashArray = '2,3';
      
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              class="aspect-line" stroke="${aspect.color}" 
              stroke-dasharray="${strokeDashArray}" opacity="0.7"/>`;
    }
  });

  // Draw planets with enhanced positioning and collision detection
  const planetPositions = {};
  const drawnPlanets = [];
  
  Object.entries(planetaryData).forEach(([planetName, data]) => {
    if (data.absoluteDegree !== undefined) {
      const planetAngle = (data.absoluteDegree - 90) * Math.PI / 180;
      const planetData = planetInfo[planetName];
      
      // Smart positioning to avoid overlap
      let currentRadius = planetRadius;
      let adjustedAngle = planetAngle;
      
      // Check for nearby planets and adjust position
      for (const drawn of drawnPlanets) {
        const distance = Math.sqrt(
          Math.pow(drawn.x - (centerX + currentRadius * Math.cos(adjustedAngle)), 2) +
          Math.pow(drawn.y - (centerY + currentRadius * Math.sin(adjustedAngle)), 2)
        );
        
        if (distance < 35) { // Too close, adjust
          currentRadius += 25;
          break;
        }
      }
      
      const planetX = centerX + currentRadius * Math.cos(adjustedAngle);
      const planetY = centerY + currentRadius * Math.sin(adjustedAngle);
      
      drawnPlanets.push({ x: planetX, y: planetY });
      
      // Enhanced planet circle with shadow
      svg += `<circle cx="${planetX}" cy="${planetY}" r="2" fill="#34495e" opacity="0.3" transform="translate(2,2)"/>`;
      svg += `<circle cx="${planetX}" cy="${planetY}" r="16" fill="white" stroke="${planetData?.color || '#2c3e50'}" stroke-width="2"/>`;
      
      // Planet symbol
      const symbol = planetData?.symbol || planetName.charAt(0).toUpperCase();
      svg += `<text x="${planetX}" y="${planetY}" class="chart-text planet-symbol" fill="${planetData?.color || '#2c3e50'}">${symbol}</text>`;
      
      // Degree and sign text positioned better
      const degreeText = `${Math.round(data.degree)}° ${data.sign.substring(0, 3)}`;
      svg += `<text x="${planetX}" y="${planetY + 28}" class="chart-text degree-text">${degreeText}</text>`;
      
      // Connection line to chart edge (more subtle)
      const edgeX = centerX + (signRadius - 10) * Math.cos(planetAngle);
      const edgeY = centerY + (signRadius - 10) * Math.sin(planetAngle);
      svg += `<line x1="${planetX}" y1="${planetY}" x2="${edgeX}" y2="${edgeY}" 
              stroke="#bdc3c7" stroke-width="1" stroke-dasharray="1,2" opacity="0.5"/>`;
    }
  });

  // Enhanced center point
  svg += `<circle cx="${centerX}" cy="${centerY}" r="6" class="center-point"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="3" fill="white"/>`;
  
  // Title and metadata
  svg += `<text x="${centerX}" y="40" class="chart-text" style="font-size: 20px; font-weight: bold; fill: #2c3e50;"></text>`;
  
  // Professional legend at bottom
  svg += `<text x="${centerX}" y="620" class="chart-text" style="font-size: 11px; fill: #7f8c8d;">
    Aspects: Red=Major | Green=Trine | Blue=Sextile | Orange=Square | Planets positioned by degree</text>`;
  
  svg += `</svg>`;
  
  return svg;
}

// Example usage:
// const chartSVG = generateEnhancedNatalChartWheel(planetaryData);
// This would replace your existing generateNatalChartWheel function

// Function to create chart legend
function generateChartLegend() {
  const planetSymbols = {
    '☉ Sun': 'Core identity, ego, life purpose',
    '☽ Moon': 'Emotions, instincts, subconscious',
    '☿ Mercury': 'Communication, thinking, learning',
    '♀ Venus': 'Love, beauty, relationships, values',
    '♂ Mars': 'Energy, action, desire, courage',
    '♃ Jupiter': 'Growth, wisdom, expansion, luck',
    '♄ Saturn': 'Discipline, responsibility, limitations',
    '⛢ Uranus': 'Innovation, rebellion, sudden change',
    '♆ Neptune': 'Dreams, spirituality, illusion',
    '♇ Pluto': 'Transformation, power, regeneration',
    'AC Ascendant': 'Your outer personality, first impression',
    'MC Midheaven': 'Career, reputation, public image'
  };

  const signSymbols = {
    '♈ Aries': 'Fire - Bold, pioneering, energetic',
    '♉ Taurus': 'Earth - Stable, practical, sensual',
    '♊ Gemini': 'Air - Curious, communicative, adaptable',
    '♋ Cancer': 'Water - Nurturing, emotional, protective',
    '♌ Leo': 'Fire - Dramatic, creative, confident',
    '♍ Virgo': 'Earth - Analytical, helpful, perfectionist',
    '♎ Libra': 'Air - Harmonious, diplomatic, aesthetic',
    '♏ Scorpio': 'Water - Intense, mysterious, transformative',
    '♐ Sagittarius': 'Fire - Adventurous, philosophical, optimistic',
    '♑ Capricorn': 'Earth - Ambitious, disciplined, traditional',
    '♒ Aquarius': 'Air - Independent, innovative, humanitarian',
    '♓ Pisces': 'Water - Imaginative, compassionate, intuitive'
  };

  let legend = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px; font-size: 12px;">
      <div>
        <h4 style="color: #1e40af; margin-bottom: 15px; font-size: 14px;">Planet Symbols</h4>`;
  
  Object.entries(planetSymbols).forEach(([symbol, meaning]) => {
    legend += `<div style="margin-bottom: 8px;"><strong>${symbol}:</strong> ${meaning}</div>`;
  });
  
  legend += `
      </div>
      <div>
        <h4 style="color: #1e40af; margin-bottom: 15px; font-size: 14px;">Zodiac Signs</h4>`;
        
  Object.entries(signSymbols).forEach(([symbol, meaning]) => {
    legend += `<div style="margin-bottom: 8px;"><strong>${symbol}:</strong> ${meaning}</div>`;
  });
  
  legend += `
      </div>
    </div>`;
    
  return legend;
}

// Function to generate "How to Read" section
function generateHowToReadSection() {
  return `
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">How to Read Your Birth Chart</h3>
      <div style="font-size: 14px; line-height: 1.6; color: #374151;">
        <p><strong>1. The Outer Ring:</strong> Shows the 12 zodiac signs in their natural order, starting with Aries at the 9 o'clock position.</p>
        <p><strong>2. The Houses:</strong> The 12 numbered sections represent different life areas. House 1 starts at your Ascendant.</p>
        <p><strong>3. Planet Positions:</strong> Colored symbols show where each planet was positioned at your birth. The degree numbers indicate precise placement.</p>
        <p><strong>4. Your Big Three:</strong> Look for your Sun ☉ (core self), Moon ☽ (emotions), and Ascendant AC (outer personality).</p>
        <p><strong>5. Elements:</strong> Notice clusters of planets in Fire (energy), Earth (practical), Air (mental), or Water (emotional) signs.</p>
        <p><strong>6. Aspects:</strong> Planets that are close together or opposite each other create special relationships affecting your personality.</p>
      </div>
    </div>`;
}

// Enhanced PDF generation with dynamic TOC and natal chart
async function generatePDF(chartData, interpretations) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Read logo file from assets
    let logoBase64 = '';
    try {
      const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = logoBuffer.toString('base64');
        console.log('Logo loaded successfully');
      } else {
        console.log('Logo not found at:', logoPath);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
    
    // Generate HTML content with improved formatting and dynamic TOC
    const htmlContent = generateImprovedHTML(chartData, interpretations, logoBase64);
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' }
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    console.error('PDF generation failed:', error);
    // Return a simple text-based "PDF" as fallback
    const textContent = generateTextReport(chartData, interpretations);
    return Buffer.from(textContent, 'utf8');
  }
}

// Improved HTML generation with better formatting, dynamic TOC, and natal chart
function generateImprovedHTML(chartData, interpretations, logoBase64) {
  // Clean interpretations to remove problematic characters and add proper line breaks
  const cleanInterpretations = {};
  Object.keys(interpretations).forEach(key => {
    cleanInterpretations[key] = interpretations[key]
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/\. ([A-Z])/g, '.</p><p>$1') // Split sentences into paragraphs
      .trim();
    
    // Ensure it starts and ends with paragraph tags
    if (!cleanInterpretations[key].startsWith('<p>')) {
      cleanInterpretations[key] = '<p>' + cleanInterpretations[key];
    }
    if (!cleanInterpretations[key].endsWith('</p>')) {
      cleanInterpretations[key] = cleanInterpretations[key] + '</p>';
    }
  });

  // Create properly formatted planets table with conditional house display
  const planetsTable = Object.entries(chartData.planets)
    .map(([planet, data]) => {
      const houseDisplay = (planet === 'ascendant' || planet === 'midheaven') 
        ? '<em>Chart Point</em>' 
        : `House ${data.house}`;
      
      return `
        <tr>
          <td style="font-weight: bold; text-transform: capitalize;">${planet}</td>
          <td><strong>${data.sign}</strong></td>
          <td>${data.degree.toFixed(1)}°</td>
          <td>${houseDisplay}</td>
        </tr>
      `;
    }).join('');

  const logoImg = logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" style="max-width: 200px; height: auto; margin: 0 auto 40px; display: block;">` : '';

  // Create properly formatted planetary position descriptions
  const planetaryDescriptions = Object.entries(chartData.planets)
    .map(([planet, data]) => {
      const houseText = (planet === 'ascendant' || planet === 'midheaven') 
        ? ` (Chart Point)` 
        : ` in the ${getOrdinalNumber(data.house)} House`;
      
      const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
      
      return `
        <div class="planet-description">
          <h4><strong>${planetName} in ${data.sign} (${data.degree.toFixed(1)}°)${houseText}:</strong></h4>
          <p>${getPlanetDescription(planet, data.sign, data.house)}</p>
        </div>
      `;
    }).join('');

  // Generate the natal chart wheel SVG
  const natalChartSVG = generateEnhancedNatalChartWheel(chartData.planets);
  const howToReadSection = generateHowToReadSection();
  const chartLegend = generateChartLegend();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Birth Chart Analysis - ${chartData.fullName}</title>
  <style>
    @page { margin: 0.75in; size: A4; }
    body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; line-height: 1.7; color: #2c2c2c; font-size: 14px; }
    .cover-page { text-align: center; padding: 50px 20px; page-break-after: always; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
    .cover-title { color: #1e3a8a; font-size: 36px; margin-bottom: 20px; font-weight: bold; }
    .birth-info { background-color: #eff6ff; padding: 30px; border-radius: 12px; margin: 20px auto; border-left: 4px solid #3b82f6; max-width: 500px; }
    .birth-info h2 { color: #1e40af; font-size: 24px; margin-bottom: 20px; text-align: center; }
    .highlight { background-color: #fef3c7; padding: 4px 8px; border-radius: 4px; font-weight: bold; margin: 0 5px; }
    .personal-message { padding: 50px 30px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; margin: 40px 0; page-break-after: always; font-size: 16px; line-height: 1.8; text-align: center; }
    .personal-message h2 { color: #92400e; font-size: 28px; margin-bottom: 30px; }
    .toc-page { page-break-after: always; padding: 30px 0; }
    .toc-title { color: #1e3a8a; font-size: 28px; text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
    .toc-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dotted #d1d5db; font-size: 16px; }
    .chart-page { page-break-after: always; padding: 20px 0; text-align: center; }
    .chart-container { display: flex; justify-content: center; margin: 20px 0; }
    .section { page-break-inside: avoid; margin: 30px 0; padding: 20px 0; border-bottom: 1px solid #e5e7eb; }
    h2 { color: #1e40af; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 35px; margin-bottom: 20px; font-weight: bold; }
    h4 { color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
    .planet-table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .planet-table th { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; border: 1px solid #2563eb; padding: 15px 10px; text-align: left; font-weight: bold; font-size: 14px; }
    .planet-table td { border: 1px solid #d1d5db; padding: 12px 10px; text-align: left; background-color: #f9fafb; }
    .planet-table tbody tr:nth-child(even) td { background-color: #f1f5f9; }
    .page-break { page-break-before: always; }
    .content-text { font-size: 15px; text-align: justify; margin: 20px 0; line-height: 1.8; }
    .content-text p { margin-bottom: 15px; }
    .planet-description { margin-bottom: 25px; }
    .planet-description h4 { color: #1e40af; margin-bottom: 10px; }
    .planet-description p { margin-bottom: 10px; line-height: 1.6; }
    .disclaimer { background-color: #f1f5f9; padding: 30px; border-radius: 8px; margin: 50px 0; border: 2px solid #3b82f6; font-size: 12px; line-height: 1.6; }
    .disclaimer h3 { color: #1e40af; font-size: 16px; margin-bottom: 15px; text-align: center; }
  </style>
</head>
<body>
  <div class="cover-page">
    ${logoImg}
    <h1 class="cover-title">Birth Chart Analysis</h1>
    <p style="font-size: 18px; color: #475569; margin-bottom: 40px; font-style: italic;">A Complete Astrological Profile</p>
    <div class="birth-info">
      <h2>${chartData.fullName}</h2>
      <div style="font-size: 16px; color: #374151; text-align: center;">
        <p><strong>Born:</strong> ${formatDate(chartData.birthDate)} at ${chartData.birthTime}</p>
        <p><strong>Location:</strong> ${chartData.birthLocationDisplay || chartData.birthLocation}</p>
        <div style="margin-top: 20px;">
          <span class="highlight">Sun: ${chartData.planets.sun?.sign || 'N/A'}</span>
          <span class="highlight">Moon: ${chartData.planets.moon?.sign || 'N/A'}</span>
          <span class="highlight">Rising: ${chartData.planets.ascendant?.sign || 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="personal-message">
    <h2>A Personal Message</h2>
    <p><strong>Dear ${chartData.fullName},</strong></p>
    <p>Unlock the secrets of who you are with your personal Birth Chart. This unique guide from Feng Shui & Beyond reveals your core personality traits and helps you navigate your life's journey with a clear understanding of your opportunities and potential challenges.</p>
    <p>This comprehensive analysis has been carefully calculated using your exact birth information and interpreted according to traditional astrological principles.</p>
    <div style="margin-top: 40px; font-style: italic; color: #6b7280; font-size: 14px;">
      <p><strong>Best Wishes,</strong><br><strong>The Feng Shui & Beyond Team</strong></p>
    </div>
  </div>

  <div class="toc-page">
    <h1 class="toc-title">Table of Contents</h1>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Your Birth Chart Wheel</span><span style="color: #6b7280;">Page 4</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Chart Overview</span><span style="color: #6b7280;">Page 5</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Planetary Positions</span><span style="color: #6b7280;">Page 6</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">House Interpretations</span><span style="color: #6b7280;">Page 8</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Planetary Aspects</span><span style="color: #6b7280;">Page 8</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Life Path & Spiritual Journey</span><span style="color: #6b7280;">Page 9</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Career & Goals</span><span style="color: #6b7280;">Page 9</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Love & Relationships</span><span style="color: #6b7280;">Page 10</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Personality Profile</span><span style="color: #6b7280;">Page 10</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Life Purpose & Gifts</span><span style="color: #6b7280;">Page 11</span></div>
    <div class="toc-item"><span style="font-weight: bold; color: #374151;">Growth Areas & Challenges</span><span style="color: #6b7280;">Page 11</span></div>
  </div>

  <div class="chart-page">
	<h1 style="color: #1e40af; font-size: 28px; margin-bottom: 30px;">Your Birth Chart Wheel</h1>
	<div class="chart-container">
		${natalChartSVG}
	</div>
	</div>
	
	<div class="page-break"></div>
	<div style="padding: 20px 0;">
	${chartLegend}
	${howToReadSection}
	</div>

  <div class="page-break"></div>
  <div class="section">
    <h2>Chart Overview</h2>
    <div class="content-text">${cleanInterpretations.overview}</div>
  </div>

  <div class="section">
    <h2>Planetary Positions</h2>
    <table class="planet-table">
      <thead><tr><th>Planet</th><th>Zodiac Sign</th><th>Degree</th><th>House</th></tr></thead>
      <tbody>${planetsTable}</tbody>
    </table>
    
    <div class="content-text">
      ${planetaryDescriptions}
    </div>
  </div>

  <div class="page-break"></div>
  <div class="section"><h2>House Interpretations</h2><div class="content-text">${cleanInterpretations.houses}</div></div>
  <div class="section"><h2>Planetary Aspects</h2><div class="content-text">${cleanInterpretations.aspects}</div></div>
  
  <div class="page-break"></div>
  <div class="section"><h2>Life Path & Spiritual Journey</h2><div class="content-text">${cleanInterpretations.life_path}</div></div>
  <div class="section"><h2>Career & Goals</h2><div class="content-text">${cleanInterpretations.career}</div></div>
  <div class="section"><h2>Love & Relationships</h2><div class="content-text">${cleanInterpretations.relationships}</div></div>
  
  <div class="page-break"></div>
  <div class="section"><h2>Personality Profile</h2><div class="content-text">${cleanInterpretations.personality}</div></div>
  <div class="section"><h2>Life Purpose & Gifts</h2><div class="content-text">${cleanInterpretations.life_purpose}</div></div>
  <div class="section"><h2>Growth Areas & Challenges</h2><div class="content-text">${cleanInterpretations.challenges}</div></div>

  <div class="disclaimer">
    <h3>Disclaimer</h3>
    <p>Feng Shui & Beyond provides astrological interpretations based on traditional astrological principles and the positions of celestial bodies at the time of birth. These interpretations are offered for entertainment, self-reflection, and personal insight purposes only.</p>
    <p>The astrological analysis contained in this report represents one perspective on astrological symbolism and should not be considered as absolute truth or predictive fact. Different astrologers may interpret the same chart in varying ways based on their training, experience, and methodological approaches.</p>
    <p>This birth chart analysis is not intended to replace professional advice of any kind. Feng Shui & Beyond services do not constitute legal, medical, psychological, financial, business, or therapeutic guidance. For important life decisions or concerns regarding health, relationships, career, or other significant matters, please consult qualified professionals in the appropriate fields.</p>
    <p>By using our services, you acknowledge that astrological interpretations are speculative in nature and that you are responsible for your own choices and actions. Results and experiences may vary among individuals.</p>
    <div style="text-align: center; margin-top: 30px; font-weight: bold; color: #374151;">
      Copyright ${new Date().getFullYear()} Feng Shui & Beyond. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

// Helper function to format dates nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Helper function to get ordinal numbers
function getOrdinalNumber(num) {
  const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  return ordinals[num] || `${num}th`;
}

// Helper function to get planet descriptions
function getPlanetDescription(planet, sign, house) {
  const descriptions = {
    sun: `Your core identity is deeply connected to the ${sign} energy. This placement reveals your fundamental nature and life purpose.`,
    moon: `Your emotional nature and subconscious needs are shaped by ${sign}. This influences how you process feelings and seek comfort.`,
    mercury: `Your communication style and thinking patterns reflect ${sign} qualities. This affects how you learn and express ideas.`,
    venus: `Your approach to love, beauty, and relationships is influenced by ${sign}. This shapes your aesthetic preferences and social connections.`,
    mars: `Your drive, ambition, and approach to action are colored by ${sign}. This affects how you pursue goals and handle conflicts.`,
    jupiter: `Your philosophy, growth, and expansion are guided by ${sign}. This influences your beliefs and opportunities for development.`,
    saturn: `Your discipline, responsibility, and life lessons are structured by ${sign}. This shapes your approach to challenges and authority.`,
    uranus: `Your innovation, rebellion, and unique qualities are expressed through ${sign}. This affects your desire for freedom and change.`,
    neptune: `Your spirituality, dreams, and imagination are inspired by ${sign}. This influences your connection to the mystical and creative.`,
    pluto: `Your transformation, power, and regeneration work through ${sign}. This affects your ability to transform and evolve.`,
    ascendant: `Your outward personality and first impressions are shaped by ${sign}. This is how others perceive you initially.`,
    midheaven: `Your career aspirations and public image are influenced by ${sign}. This affects your professional goals and reputation.`
  };
  
  return descriptions[planet] || `This ${planet} placement in ${sign} brings unique qualities to your personality.`;
}

// Simple email function using fetch
async function sendEmail(email, pdfBuffer, fullName) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email service not configured - would send to:', email);
    return { id: 'test-' + Date.now() };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Feng Shui & Beyond <hello@fengshuiandbeyond.com>',
        to: [email],
        subject: `Your Birth Chart Analysis is Ready, ${fullName}!`,
        html: `<div style="font-family: 'Times New Roman', serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f8fafc; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e3a8a; font-size: 28px; margin-bottom: 10px;">Your Birth Chart is Ready!</h1>
            <p style="color: #475569; font-size: 18px; font-style: italic;">A Complete Astrological Analysis</p>
          </div>
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear ${fullName},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Unlock the secrets of who you are with your personal Birth Chart. This unique guide from Feng Shui & Beyond reveals your core personality traits and helps you navigate your life's journey with a clear understanding of your opportunities and potential challenges.</p>
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px; font-size: 20px;">Your Complete Analysis Includes:</h3>
              <ul style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Your Personal Birth Chart Wheel:</strong> Visual representation of planetary positions</li>
                <li><strong>Planetary Positions:</strong> Exact calculations with detailed interpretations</li>
                <li><strong>House Analysis:</strong> Life areas where you'll focus your energy</li>
                <li><strong>Personality Profile:</strong> Your Sun, Moon, and Rising sign combination</li>
                <li><strong>Life Path Insights:</strong> Your spiritual journey and growth areas</li>
                <li><strong>Career Guidance:</strong> Talents and ideal work environments</li>
                <li><strong>Relationship Compatibility:</strong> Your approach to love and partnerships</li>
                <li><strong>Planetary Aspects:</strong> How different parts of your personality interact</li>
                <li><strong>Growth Areas:</strong> Personal development opportunities</li>
              </ul>
            </div>
            <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">We hope you enjoy exploring what makes you uniquely you. Your birth chart is a powerful tool for self-understanding and personal growth.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: bold;">Your detailed PDF report is attached below</div>
            </div>
          </div>
        </div>`,
        attachments: [{
          filename: `${fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Birth_Chart.pdf`,
          content: Buffer.from(pdfBuffer).toString('base64'),
          type: 'application/pdf'
        }]
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Email failed');
    }
    
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

// Fallback text report
function generateTextReport(chartData, interpretations) {
  return `BIRTH CHART ANALYSIS
=====================

Name: ${chartData.fullName}
Birth Date: ${chartData.birthDate}
Birth Time: ${chartData.birthTime}
Location: ${chartData.birthLocationDisplay || chartData.birthLocation}

OVERVIEW
--------
${interpretations.overview}

CAREER INSIGHTS
--------------
${interpretations.career}

RELATIONSHIPS
------------
${interpretations.relationships}

Generated by Feng Shui & Beyond
`;
}

// Main handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    console.log(`Processing birth chart for order: ${orderId}`);

    // Get order details - now including birth_location_display
    const { data: order, error: orderError } = await supabase
      .from('birth_chart_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Calculate planetary positions
    const planetaryData = await calculatePlanetaryPositions(
      order.birth_date,
      order.birth_time,
      order.birth_location
    );
	
	// store in birth_chart_calculations
	try {
	await supabase
		.from('birth_chart_calculations')
		.insert({
		order_id: orderId,
		planetary_data: planetaryData,
		created_at: new Date().toISOString()
		});
	console.log('Planetary data saved to calculations table');
	} catch (error) {
	console.error('Failed to save planetary data:', error);
	// Don't throw error - continue with PDF generation
	}

    // Generate interpretations
    const interpretations = await generateInterpretations(planetaryData, {
      fullName: order.full_name
    });

    // Generate PDF with improved data structure
    const pdfBuffer = await generatePDF({
      fullName: order.full_name,
      birthDate: order.birth_date,
      birthTime: order.birth_time,
      birthLocation: order.birth_location,
      birthLocationDisplay: order.birth_location_display,
      planets: planetaryData
    }, interpretations);

    // Send email
    const emailResult = await sendEmail(order.email, pdfBuffer, order.full_name);

    // Update order status
    await supabase
      .from('birth_chart_orders')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return res.status(200).json({ 
      success: true, 
      message: 'Birth chart generated successfully',
      emailId: emailResult.id
    });

  } catch (error) {
    console.error('Birth chart processing failed:', error);
    return res.status(500).json({ 
      error: 'Failed to process birth chart',
      details: error.message
    });
  }
}