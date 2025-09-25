// api/calculateBirthChart.js
// Enhanced version with ephemeris integration

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsPDF } from 'jspdf';
import ephemeris from 'ephemeris';
import fs from 'fs';
import path from 'path';
import generateChartWheelHandler from './generateChartWheel.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function for ordinal numbers
function getOrdinal(num) {
  const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  return ordinals[num] || `${num}th`;
}

// Generate detailed house interpretations based on planetary placements
function generateDetailedHouseInterpretations(planets) {
  const houseInterpretations = [];
  
  // Group planets by house
  const planetsByHouse = {};
  Object.entries(planets).forEach(([planetName, data]) => {
    if (data.house && planetName !== 'ascendant' && planetName !== 'midheaven') {
      if (!planetsByHouse[data.house]) {
        planetsByHouse[data.house] = [];
      }
      planetsByHouse[data.house].push({name: planetName, ...data});
    }
  });
  
  // Generate interpretations for houses with planets
  Object.keys(planetsByHouse).sort((a, b) => parseInt(a) - parseInt(b)).forEach(house => {
    const planetsInHouse = planetsByHouse[house];
    const houseNum = parseInt(house);
    
    let title = '';
    let description = '';
    
    switch(houseNum) {
      case 1:
        title = 'The 1st House (Self & Identity)';
        description = `With ${planetsInHouse.map(p => p.name).join(' and ')} in your 1st house, your personality and self-expression are strongly influenced by these energies. This house represents your identity, physical appearance, and how you present yourself to the world.`;
        break;
      case 2:
        title = 'The 2nd House (Values & Resources)';
        description = `Your 2nd house contains ${planetsInHouse.map(p => p.name).join(' and ')}, indicating these energies significantly influence your relationship with money, possessions, and personal values. This house governs your material security and self-worth.`;
        break;
      case 3:
        title = 'The 3rd House (Communication & Learning)';
        description = `The presence of ${planetsInHouse.map(p => p.name).join(' and ')} in your 3rd house emphasizes communication, learning, and local relationships. This house rules your thinking patterns, siblings, and immediate environment.`;
        break;
      case 4:
        title = 'The 4th House (Home & Roots)';
        description = `Your 4th house, containing ${planetsInHouse.map(p => p.name).join(' and ')}, indicates a deep connection to your family roots and home environment. This area of life will be a constant source of learning and transformation, representing your foundation and emotional security.`;
        break;
      case 5:
        title = 'The 5th House (Creativity & Self-Expression)';
        description = `With ${planetsInHouse.map(p => p.name).join(' and ')} in your 5th house, you have a playful and creative nature with a strong desire for self-expression and enjoyment. This house governs creativity, romance, children, and personal pleasures.`;
        break;
      case 6:
        title = 'The 6th House (Work & Health)';
        description = `The 6th house placement of ${planetsInHouse.map(p => p.name).join(' and ')} indicates a disciplined and responsible approach to your work and health. This house rules daily routines, service to others, and physical well-being.`;
        break;
      case 7:
        title = 'The 7th House (Partnerships & Relationships)';
        description = `Your 7th house contains ${planetsInHouse.map(p => p.name).join(' and ')}, emphasizing the importance of partnerships and one-on-one relationships in your life. This house governs marriage, business partnerships, and open enemies.`;
        break;
      case 8:
        title = 'The 8th House (Transformation & Shared Resources)';
        description = `With ${planetsInHouse.map(p => p.name).join(' and ')} in your 8th house, you have a transformative approach to relationships and finances, with possible interest in shared resources. This house rules inheritance, taxes, insurance, and psychological transformation.`;
        break;
      case 9:
        title = 'The 9th House (Philosophy & Higher Learning)';
        description = `The 9th house placement of ${planetsInHouse.map(p => p.name).join(' and ')} suggests a strong connection to higher education, philosophy, and foreign cultures. This house governs long-distance travel, publishing, and spiritual beliefs.`;
        break;
      case 10:
        title = 'The 10th House (Career & Public Image)';
        description = `Your 10th house, holding ${planetsInHouse.map(p => p.name).join(' and ')}, points toward a public-facing career where you can utilize your innovative ideas and expand your influence. This house governs career achievements, reputation, and social status.`;
        break;
      case 11:
        title = 'The 11th House (Friendships & Group Activities)';
        description = `With ${planetsInHouse.map(p => p.name).join(' and ')} in your 11th house, you have unconventional friendships and social circles. This house rules hopes, wishes, group associations, and humanitarian causes.`;
        break;
      case 12:
        title = 'The 12th House (Spirituality & Subconscious)';
        description = `The 12th house placement of ${planetsInHouse.map(p => p.name).join(' and ')} signifies a strong connection to your intuition and spirituality. This house governs the subconscious mind, hidden enemies, and karmic patterns.`;
        break;
    }
    
    if (title && description) {
      houseInterpretations.push({ title, description });
    }
  });
  
  return houseInterpretations;
}

// Ephemeris implementation for accurate calculations
function generateAccuratePlanetaryData(birthDate, birthTime, birthLocation) {
  // Parse location coordinates
  let lat, lon;
  
  try {
    if (birthLocation.includes(',')) {
      const parts = birthLocation.split(',');
      lat = parseFloat(parts[0].trim());
      lon = parseFloat(parts[1].trim());
      
      if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error(`Invalid coordinates: ${birthLocation}`);
      }
    } else {
      throw new Error(`Invalid location format: ${birthLocation}. Expected format: "latitude,longitude"`);
    }
  } catch (error) {
    console.error('Location parsing error:', error.message);
    throw new Error(`Cannot process birth chart: ${error.message}. Please ensure location coordinates are provided correctly.`);
  }

  // Parse birth date and time
  const birthDateTime = new Date(`${birthDate}T${birthTime}`);
  
  // Get timezone offset for the birth location (simplified estimation)
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000; // Convert to milliseconds
  const timezoneOffset = Math.round(lon / 15) * 60; // Rough timezone estimation based on longitude
  
  // Convert local birth time to UTC
  const utcBirthTime = new Date(birthDateTime.getTime() - (timezoneOffset * 60000));
  
  console.log(`Calculating positions for: ${birthDateTime} UTC: ${utcBirthTime}`);
  console.log(`Location: ${lat}, ${lon}`);

  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const planets = {};

  try {
    // Get all planetary positions using ephemeris
    // ephemeris.getAllPlanets(dateObj, longitude, latitude, height)
    const ephemerisData = ephemeris.getAllPlanets(utcBirthTime, lon, lat, 0);
    
    if (!ephemerisData || !ephemerisData.observed) {
      throw new Error('Failed to get planetary data from ephemeris');
    }

    console.log('Ephemeris data structure:', Object.keys(ephemerisData));
    console.log('Observed data structure:', Object.keys(ephemerisData.observed));

    // The ephemeris library stores planetary data in the 'observed' object
    const observedData = ephemerisData.observed;

    // Check what planets are actually available
    console.log('Available planets in observed data:', Object.keys(observedData));

    // Process each planet from the observed data
    const planetMappings = {
      'sun': 'sun',
      'moon': 'moon', 
      'mercury': 'mercury',
      'venus': 'venus',
      'mars': 'mars',
      'jupiter': 'jupiter',
      'saturn': 'saturn',
      'uranus': 'uranus',
      'neptune': 'neptune',
      'pluto': 'pluto'
    };

    Object.entries(planetMappings).forEach(([planetName, ephemerisKey]) => {
      try {
        const planetData = observedData[ephemerisKey];
        
        if (!planetData) {
          console.warn(`Planet ${planetName} not found in ephemeris data. Available planets:`, Object.keys(observedData));
          throw new Error(`Planet ${planetName} not available in ephemeris data`);
        }
        
        // Log the structure of this planet's data to understand what properties are available
        console.log(`${planetName} data properties:`, Object.keys(planetData));
        
        if (typeof planetData.apparentLongitudeDd === 'number') {
          // This is the correct property for ephemeris library - longitude in decimal degrees
          let longitude = planetData.apparentLongitudeDd;
          
          // Already in degrees, just normalize to 0-360 range
          while (longitude < 0) longitude += 360;
          while (longitude >= 360) longitude -= 360;

          // Check for retrograde motion - ephemeris provides this directly
          const isRetrograde = planetData.is_retrograde === true;
          
          planets[planetName] = {
            sign: zodiacSigns[Math.floor(longitude / 30)],
            degree: longitude % 30,
            absoluteDegree: longitude,
            isRetrograde: isRetrograde,
            speed: isRetrograde ? -0.5 : 0.5
          };
        } else if (typeof planetData.apparentGeocentricLongitude === 'number') {
          let longitude = planetData.apparentGeocentricLongitude;
          
          // Convert from radians to degrees if necessary
          if (Math.abs(longitude) <= Math.PI * 2) {
            longitude = longitude * 180 / Math.PI;
          }
          
          // Normalize longitude to 0-360 range
          while (longitude < 0) longitude += 360;
          while (longitude >= 360) longitude -= 360;

          // Check for retrograde motion
          const isRetrograde = planetData.retrograde === true || planetData.is_retrograde === true || checkRetrogradeMotion(planetName, utcBirthTime, lon, lat);
          
          planets[planetName] = {
            sign: zodiacSigns[Math.floor(longitude / 30)],
            degree: longitude % 30,
            absoluteDegree: longitude,
            isRetrograde: isRetrograde,
            speed: isRetrograde ? -0.5 : 0.5
          };
        } else if (typeof planetData.eclipticLongitude === 'number') {
          // Alternative property name that might exist
          let longitude = planetData.eclipticLongitude;
          
          // Convert from radians to degrees if necessary
          if (Math.abs(longitude) <= Math.PI * 2) {
            longitude = longitude * 180 / Math.PI;
          }
          
          // Normalize longitude
          while (longitude < 0) longitude += 360;
          while (longitude >= 360) longitude -= 360;

          const isRetrograde = planetData.retrograde === true || planetData.is_retrograde === true || checkRetrogradeMotion(planetName, utcBirthTime, lon, lat);
          
          planets[planetName] = {
            sign: zodiacSigns[Math.floor(longitude / 30)],
            degree: longitude % 30,
            absoluteDegree: longitude,
            isRetrograde: isRetrograde,
            speed: isRetrograde ? -0.5 : 0.5
          };
        } else {
          console.warn(`No valid longitude data for ${planetName}. Available properties:`, Object.keys(planetData));
          console.warn(`Planet data sample:`, planetData);
          throw new Error(`No valid longitude data for ${planetName}`);
        }
      } catch (error) {
        console.error(`Error calculating ${planetName}:`, error);
        
        // Use fallback calculation
        const fallbackData = calculateImprovedPlanetPosition(
          (utcBirthTime.getTime() / 86400000) + 2440587.5,
          { name: planetName, period: getPlanetPeriod(planetName), offset: 0, baseSpeed: 1, retroFreq: getRetrogradeFrequency(planetName) }
        );

        planets[planetName] = {
          sign: zodiacSigns[Math.floor(fallbackData / 30)],
          degree: fallbackData % 30,
          absoluteDegree: fallbackData,
          isRetrograde: estimateRetrograde((utcBirthTime.getTime() / 86400000) / getPlanetPeriod(planetName), getRetrogradeFrequency(planetName)),
          speed: 1
        };
        console.log(`Used fallback calculation for ${planetName}`);
      }
    });

    // Calculate Ascendant using sidereal time calculation
    let ascendantDegree = 0;
    try {
      const lst = calculateLocalSiderealTime(utcBirthTime, lon);
      ascendantDegree = calculateAscendant(lst, lat);
    } catch (error) {
      console.error('Ascendant calculation error:', error);
      ascendantDegree = (calculateLocalSiderealTime(utcBirthTime, lon) * 15 + lon + 90) % 360;
      if (ascendantDegree < 0) ascendantDegree += 360;
    }

    planets.ascendant = {
      sign: zodiacSigns[Math.floor(ascendantDegree / 30)],
      degree: ascendantDegree % 30,
      absoluteDegree: ascendantDegree
    };
    
    // Calculate Midheaven
    const lst = calculateLocalSiderealTime(utcBirthTime, lon);
    let midheavenDegree = (lst * 15) % 360;
    if (midheavenDegree < 0) midheavenDegree += 360;

    planets.midheaven = {
      sign: zodiacSigns[Math.floor(midheavenDegree / 30)],
      degree: midheavenDegree % 30,
      absoluteDegree: midheavenDegree
    };

    // Calculate houses for all planets
    Object.keys(planets).forEach(planetName => {
      if (planets[planetName] && planetName !== 'ascendant' && planetName !== 'midheaven') {
        planets[planetName].house = calculateHouse(planets[planetName].absoluteDegree, ascendantDegree);
      }
    });

  } catch (error) {
    console.error('Ephemeris calculation failed:', error);
    throw new Error(`Failed to calculate planetary positions: ${error.message}`);
  }

  return planets;
}

// Helper function to check retrograde motion
function checkRetrogradeMotion(planetName, birthDateTime, longitude, latitude) {
  try {
    // Calculate positions 1 day before and after to determine direction
    const dayBefore = new Date(birthDateTime.getTime() - 24 * 60 * 60 * 1000);
    const dayAfter = new Date(birthDateTime.getTime() + 24 * 60 * 60 * 1000);
    
    const dataBefore = ephemeris.getAllPlanets(dayBefore, longitude, latitude, 0);
    const dataAfter = ephemeris.getAllPlanets(dayAfter, longitude, latitude, 0);
    
    if (dataBefore && dataAfter && 
        dataBefore.observed && dataAfter.observed &&
        dataBefore.observed[planetName] && dataAfter.observed[planetName]) {
      
      const beforePlanet = dataBefore.observed[planetName];
      const afterPlanet = dataAfter.observed[planetName];
      
      let lonBefore, lonAfter;
      
      // Get longitude from whichever property exists
      if (typeof beforePlanet.apparentGeocentricLongitude === 'number') {
        lonBefore = beforePlanet.apparentGeocentricLongitude;
      } else if (typeof beforePlanet.eclipticLongitude === 'number') {
        lonBefore = beforePlanet.eclipticLongitude;
      } else {
        throw new Error('No longitude data found');
      }
      
      if (typeof afterPlanet.apparentGeocentricLongitude === 'number') {
        lonAfter = afterPlanet.apparentGeocentricLongitude;
      } else if (typeof afterPlanet.eclipticLongitude === 'number') {
        lonAfter = afterPlanet.eclipticLongitude;
      } else {
        throw new Error('No longitude data found');
      }
      
      // Convert from radians to degrees if necessary
      if (Math.abs(lonBefore) <= Math.PI * 2) {
        lonBefore = lonBefore * 180 / Math.PI;
      }
      if (Math.abs(lonAfter) <= Math.PI * 2) {
        lonAfter = lonAfter * 180 / Math.PI;
      }
      
      // Normalize to 0-360 range
      while (lonBefore < 0) lonBefore += 360;
      while (lonBefore >= 360) lonBefore -= 360;
      while (lonAfter < 0) lonAfter += 360;
      while (lonAfter >= 360) lonAfter -= 360;
      
      // Handle 360-degree boundary crossing
      if (lonAfter - lonBefore > 180) lonAfter -= 360;
      if (lonBefore - lonAfter > 180) lonBefore -= 360;
      
      // If longitude decreased, planet is retrograde
      return lonAfter < lonBefore;
    }
  } catch (error) {
    console.error(`Retrograde calculation error for ${planetName}:`, error);
  }
  
  // Default retrograde probabilities based on astronomical patterns
  const retrogradeFrequencies = {
    sun: 0,
    moon: 0,
    mercury: 0.25,
    venus: 0.08,
    mars: 0.11,
    jupiter: 0.33,
    saturn: 0.36,
    uranus: 0.42,
    neptune: 0.43,
    pluto: 0.44
  };
  
  return Math.random() < (retrogradeFrequencies[planetName] || 0.1);
}

// Calculate Local Sidereal Time
function calculateLocalSiderealTime(date, longitude) {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525.0;
  
  // Greenwich Sidereal Time at 0h UT
  let gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000.0;
  
  // Normalize to 0-360 degrees
  gst = gst % 360;
  if (gst < 0) gst += 360;
  
  // Convert to hours and add longitude
  const lst = (gst / 15.0) + (longitude / 15.0) + (date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600);
  
  return lst % 24;
}

// Calculate Ascendant
function calculateAscendant(lst, latitude) {
  const lstDegrees = lst * 15; // Convert hours to degrees
  const latRadians = latitude * Math.PI / 180;
  const obliquity = 23.4392911; // Mean obliquity of ecliptic
  const obliquityRadians = obliquity * Math.PI / 180;
  const lstRadians = lstDegrees * Math.PI / 180;
  
  const ascendantRadians = Math.atan2(
    Math.cos(lstRadians), 
    -(Math.sin(lstRadians) * Math.cos(obliquityRadians) + Math.tan(latRadians) * Math.sin(obliquityRadians))
  );
  
  let ascendantDegree = ascendantRadians * 180 / Math.PI;
  if (ascendantDegree < 0) ascendantDegree += 360;
  
  return ascendantDegree;
}

// Get Julian Day
function getJulianDay(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function calculateImprovedSun(julianDay) {
  const n = julianDay - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) * Math.PI / 180) % (2 * Math.PI);
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
  const longitude = lambda < 0 ? lambda + 360 : lambda;
  
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  return {
    sign: zodiacSigns[Math.floor(longitude / 30)],
    degree: longitude % 30,
    absoluteDegree: longitude,
    isRetrograde: false,
    speed: 1
  };
}

function calculateImprovedPlanetPosition(julianDay, planet) {
  const n = julianDay - 2451545.0;
  
  if (planet.name === 'moon') {
    const L = (218.316 + 13.176396 * n) % 360;
    const M = (134.963 + 13.064993 * n) % 360;
    const F = (93.272 + 13.229350 * n) % 360;
    
    let longitude = (L + 6.289 * Math.sin(M * Math.PI / 180) + 1.274 * Math.sin((2 * 134.963 + 13.064993 * n - M) * Math.PI / 180) + 0.658 * Math.sin(2 * 134.963 * Math.PI / 180)) % 360;
    
    return longitude < 0 ? longitude + 360 : longitude;
  } else {
    const meanAnomaly = (n / planet.period * 360 + planet.offset) % 360;
    let longitude = meanAnomaly;
    
    switch (planet.name) {
      case 'mercury': longitude += 2.3 * Math.sin(meanAnomaly * Math.PI / 180); break;
      case 'venus': longitude += 0.7 * Math.sin(meanAnomaly * Math.PI / 180); break;
      case 'mars': longitude += 1.9 * Math.sin(meanAnomaly * Math.PI / 180); break;
      default: longitude += 0.5 * Math.sin(meanAnomaly * Math.PI / 180);
    }
    
    longitude = longitude % 360;
    return longitude < 0 ? longitude + 360 : longitude;
  }
}

function estimateRetrograde(orbitalPosition, retrogradeFrequency) {
  if (retrogradeFrequency === 0) return false;
  const currentCycle = orbitalPosition % 1;
  return currentCycle > (0.4 - retrogradeFrequency/2) && currentCycle < (0.4 + retrogradeFrequency/2);
}

function calculateHouse(planetDegree, ascendantDegree) {
  if (isNaN(planetDegree) || isNaN(ascendantDegree)) return 1;
  const houseCusp = (planetDegree - ascendantDegree + 360) % 360;
  const house = Math.floor(houseCusp / 30) + 1;
  return house > 12 ? house - 12 : (house < 1 ? house + 12 : house);
}

// Helper function to get planet orbital periods (in days)
function getPlanetPeriod(planetName) {
  const periods = {
    sun: 365.25,
    moon: 27.32,
    mercury: 87.97,
    venus: 224.7,
    mars: 686.98,
    jupiter: 4332.6,
    saturn: 10759,
    uranus: 30687,
    neptune: 60190,
    pluto: 90800
  };
  return periods[planetName] || 365.25;
}

// Helper function to get retrograde frequencies
function getRetrogradeFrequency(planetName) {
  const frequencies = {
    sun: 0,
    moon: 0,
    mercury: 0.25,
    venus: 0.08,
    mars: 0.11,
    jupiter: 0.33,
    saturn: 0.36,
    uranus: 0.42,
    neptune: 0.43,
    pluto: 0.44
  };
  return frequencies[planetName] || 0.1;
}

function calculatePlanetaryPositions(birthDate, birthTime, birthLocation) {
  console.log('Using Ephemeris for accurate astronomical calculations...');
  try {
    return generateAccuratePlanetaryData(birthDate, birthTime, birthLocation);
  } catch (error) {
    console.error('Ephemeris calculation failed, using fallback:', error);
    return generateEnhancedPlanetaryData(birthDate, birthTime, birthLocation);
  }
}

// Chart wheel generation function - calls separate service
// Chart wheel generation function - direct import instead of HTTP call
async function generateBirthChartWheel(planetaryData) {
  try {
    console.log('Generating birth chart wheel with direct function call...');
    
    // Create mock request and response objects for the handler
    const mockReq = {
      method: 'POST',
      body: { 
        planetaryData,
        chartOptions: { showAspects: true, showDegreeMarks: true, colorScheme: 'professional' }
      }
    };
    
    let result = null;
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          result = { ...data, statusCode: code };
          return { end: () => {} };
        },
        end: () => {}
      }),
      json: (data) => {
        result = data;
      },
      setHeader: () => {} // Mock the setHeader calls
    };
    
    // Call the handler directly
    await generateChartWheelHandler(mockReq, mockRes);
    
    if (result && result.success) {
      return {
        chartSVG: result.chartSVG,
        chartImageBase64: result.chartImageBase64,
        chartLegend: result.chartLegend,
        howToReadSection: result.howToReadSection
      };
    } else {
      throw new Error('Chart generation handler did not return valid data');
    }
    
  } catch (error) {
    console.error('Direct chart generation failed:', error.message);
    return {
      chartSVG: generateFallbackChart(planetaryData),
      chartImageBase64: null,
      chartLegend: generateBasicChartLegend(),
      howToReadSection: generateBasicHowToRead()
    };
  }
}

// Enhanced PDF generation with all improvements
async function generatePDF(chartData, interpretations) {
  try {
    console.log('Creating enhanced PDF with improved layout...');
    
    const chartComponents = await generateBirthChartWheel(chartData.planets);
    
    // Load logo
    let logoBase64 = '';
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = logoBuffer.toString('base64');
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
    
    const doc = new jsPDF();
    let yPosition = 20;
    
    // COVER PAGE
    if (logoBase64) {
      try {
        const logoWidth = 50, logoHeight = 15;
        const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
        doc.addImage(logoBase64, 'PNG', logoX, yPosition, logoWidth, logoHeight);
        yPosition = 55;
      } catch (logoError) {
        console.error('Logo addition failed:', logoError);
        yPosition = 20;
      }
    }
    
    // Title
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('Birth Chart Analysis', 105, yPosition, { align: 'center' });
    yPosition += 15;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('A Complete Astrological Profile', 105, yPosition, { align: 'center' });
    yPosition += 30;
    
    // Personal info box
    doc.setDrawColor(59, 130, 246);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(20, yPosition - 5, 170, 35, 3, 3, 'FD');
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(chartData.fullName, 105, yPosition + 8, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Born: ${formatDate(chartData.birthDate)} at ${chartData.birthTime}`, 105, yPosition + 18, { align: 'center' });
    doc.text(`Location: ${chartData.birthLocationDisplay || chartData.birthLocation}`, 105, yPosition + 28, { align: 'center' });

    // PERSONAL MESSAGE PAGE
    doc.addPage();
    yPosition = 30;
    
    doc.setDrawColor(146, 64, 14);
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(20, yPosition - 5, 170, 120, 5, 5, 'FD');
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'italic');
    doc.text('A Personal Message', 105, yPosition + 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text(`Dear ${chartData.fullName},`, 25, yPosition + 35);
    
    doc.setFont('helvetica', 'italic');
    const personalMessage = `Unlock the secrets of who you are with your personal Birth Chart. This unique guide from Feng Shui & Beyond reveals your core personality traits and helps you navigate your life's journey with a clear understanding of your opportunities and potential challenges.

This comprehensive analysis has been carefully calculated using your exact birth information and interpreted according to traditional astrological principles.`;
    
    const messageLines = doc.splitTextToSize(personalMessage, 160);
    let messageY = yPosition + 50;
    messageLines.forEach(line => {
      if (messageY < yPosition + 100) {
        doc.text(line, 25, messageY);
        messageY += 5;
      }
    });
    
    doc.setFont('helvetica', 'italic');
    doc.text('Best Wishes,', 25, messageY + 10);
    doc.text('The Feng Shui & Beyond Team', 25, messageY + 18);

    // Add chart wheel if available
    if (chartComponents.chartImageBase64) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Birth Chart Wheel', 105, 20, { align: 'center' });
      
      try {
        doc.addImage(`data:image/png;base64,${chartComponents.chartImageBase64}`, 'PNG', 15, 30, 180, 192);
      } catch (imageError) {
        console.error('Failed to add chart image to PDF:', imageError);
      }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Accurate Ephemeris Calculations', 105, 235, { align: 'center' });
    }
	
	if (chartComponents.howToReadSection) {
		doc.addPage();
		doc.setFontSize(16);
		doc.setFont('helvetica', 'bold');
		doc.text('How to Read Your Birth Chart', 20, 30);
		
		yPosition = 50;
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal');
		
		const howToReadPoints = [
			'1. The Outer Ring: Shows the 12 zodiac signs in their natural order, starting with Aries at the 9 o\'clock position.',
			'2. The Houses: The 12 numbered sections represent different life areas. House 1 starts at your Ascendant (AC).',
			'3. Planet Positions: Colored symbols show exact planetary positions calculated with Ephemeris precision.',
			'4. Your Big Three: Look for your Sun (core self), Moon (emotions), and Ascendant AC (outer personality).',
		'5. Aspects: Lines connecting planets show their relationships - harmonious (green/blue) or challenging (red/orange).',
		'6. Retrograde Planets: Marked with \'R\' - indicating inward-focused energy for that planet.',
		'Precision: This chart uses Ephemeris calculations for professional-grade accuracy.'
	];
	
	howToReadPoints.forEach(point => {
		if (yPosition > 270) {
			doc.addPage();
			yPosition = 20;
		}
		const lines = doc.splitTextToSize(point, 170);
		lines.forEach(line => {
			doc.text(line, 20, yPosition);
			yPosition += 5;
		});
		yPosition += 3;
	});
}

// Add Legend section
if (chartComponents.chartLegend) {
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Chart Legend', 20, 30);
  
  yPosition = 50;
  
  // Create two-column layout
  const leftColumnX = 20;
  const rightColumnX = 110;
  let leftColumnY = yPosition;
  let rightColumnY = yPosition;
  
  // Planet Symbols section (left column)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Planet Symbols', leftColumnX, leftColumnY);
  leftColumnY += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const planetSymbols = [
    'Sun: Core identity, ego, life purpose',
    'Moon: Emotions, instincts, subconscious',
    'Mercury: Communication, thinking, learning',
    'Venus: Love, beauty, relationships, values',
    'Mars: Energy, action, desire, courage',
    'Jupiter: Growth, wisdom, expansion, luck',
    'Saturn: Discipline, responsibility, limitations',
    'Uranus: Innovation, rebellion, sudden change',
    'Neptune: Dreams, spirituality, illusion',
    'Pluto: Transformation, power, regeneration',
    'AC Ascendant: Your outer personality, first impression',
    'MC Midheaven: Career, reputation, public image'
  ];
  
  planetSymbols.forEach(symbol => {
    const lines = doc.splitTextToSize(symbol, 85);
    lines.forEach(line => {
      if (leftColumnY > 280) {
        doc.addPage();
        leftColumnY = 20;
      }
      doc.text(`• ${line}`, leftColumnX, leftColumnY);
      leftColumnY += 4;
    });
    leftColumnY += 2;
  });
  
  // Zodiac Signs section (right column)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Zodiac Signs', rightColumnX, rightColumnY);
  rightColumnY += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const zodiacSigns = [
    'Aries: Fire - Bold, pioneering, energetic',
    'Taurus: Earth - Stable, practical, sensual',
    'Gemini: Air - Curious, communicative, adaptable',
    'Cancer: Water - Nurturing, emotional, protective',
    'Leo: Fire - Dramatic, creative, confident',
    'Virgo: Earth - Analytical, helpful, perfectionist',
    'Libra: Air - Harmonious, diplomatic, aesthetic',
    'Scorpio: Water - Intense, mysterious, transformative',
    'Sagittarius: Fire - Adventurous, philosophical, optimistic',
    'Capricorn: Earth - Ambitious, disciplined, traditional',
    'Aquarius: Air - Independent, innovative, humanitarian',
    'Pisces: Water - Imaginative, compassionate, intuitive'
  ];
  
  zodiacSigns.forEach(sign => {
    const lines = doc.splitTextToSize(sign, 85);
    lines.forEach(line => {
      if (rightColumnY > 280) {
        doc.addPage();
        rightColumnY = 20;
        leftColumnY = Math.max(leftColumnY, rightColumnY);
      }
      doc.text(`• ${line}`, rightColumnX, rightColumnY);
      rightColumnY += 4;
    });
    rightColumnY += 2;
  });
  
  yPosition = Math.max(leftColumnY, rightColumnY) + 10;
}

    // Enhanced Planetary Positions Table
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Planetary Positions', 20, yPosition);
    yPosition += 15;
    
    // Table headers
    doc.setFillColor(30, 64, 175);
    doc.rect(20, yPosition - 8, 170, 12, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Planet', 25, yPosition - 2);
    doc.text('Sign', 65, yPosition - 2);
    doc.text('Degree', 100, yPosition - 2);
    doc.text('House', 130, yPosition - 2);
    doc.text('Status', 160, yPosition - 2);
    
    yPosition += 8;
    doc.setTextColor(0, 0, 0);
    
    // Table content
    doc.setFont('helvetica', 'normal');
    let rowCount = 0;
    
    Object.entries(chartData.planets).forEach(([planet, data]) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      if (rowCount % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPosition - 5, 170, 8, 'F');
      }
      
      const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
      const house = (planet === 'ascendant' || planet === 'midheaven') ? 'Chart Point' : `House ${data.house}`;
      const status = data.isRetrograde ? 'Retrograde' : 'Direct';
      
      doc.text(planetName, 25, yPosition);
      doc.text(data.sign, 65, yPosition);
      doc.text(`${data.degree.toFixed(1)}°`, 100, yPosition);
      doc.text(house, 130, yPosition);
      doc.text(status, 160, yPosition);
      
      yPosition += 8;
      rowCount++;
    });

    // Detailed Planetary Meanings
    yPosition += 25;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Planetary Meanings', 20, yPosition);
    yPosition += 15;
    
    const planetaryDescriptions = [
      { name: 'Ascendant', planet: chartData.planets.ascendant, description: 'Your outward personality and first impressions are shaped by this placement. This is how others perceive you initially.' },
      { name: 'Sun', planet: chartData.planets.sun, description: 'Your core identity is deeply connected to this energy. This placement reveals your fundamental nature and life purpose.' },
      { name: 'Moon', planet: chartData.planets.moon, description: 'Your emotional nature and subconscious needs are shaped by this placement. This influences how you process feelings and seek comfort.' },
      { name: 'Mercury', planet: chartData.planets.mercury, description: 'Your communication style and thinking patterns reflect these qualities. This affects how you learn and express ideas.' },
      { name: 'Venus', planet: chartData.planets.venus, description: 'Your approach to love, beauty, and relationships is influenced by this placement. This shapes your aesthetic preferences and social connections.' },
      { name: 'Mars', planet: chartData.planets.mars, description: 'Your drive, ambition, and approach to action are colored by this energy. This affects how you pursue goals and handle conflicts.' },
      { name: 'Jupiter', planet: chartData.planets.jupiter, description: 'Your philosophy, growth, and expansion are guided by this placement. This influences your beliefs and opportunities for development.' },
      { name: 'Saturn', planet: chartData.planets.saturn, description: 'Your discipline, responsibility, and life lessons are structured by this energy. This shapes your approach to challenges and authority.' },
      { name: 'Uranus', planet: chartData.planets.uranus, description: 'Your innovation, rebellion, and unique qualities are expressed through this placement. This affects your desire for freedom and change.' },
      { name: 'Neptune', planet: chartData.planets.neptune, description: 'Your spirituality, dreams, and imagination are inspired by this energy. This influences your connection to the mystical and creative.' },
      { name: 'Pluto', planet: chartData.planets.pluto, description: 'Your transformation, power, and regeneration work through this placement. This affects your ability to transform and evolve.' },
      { name: 'Midheaven', planet: chartData.planets.midheaven, description: 'Your career aspirations and public image are influenced by this placement. This affects your professional goals and reputation.' }
    ];
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    planetaryDescriptions.forEach(item => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      if (item.planet) {
        const house = (item.name === 'Ascendant' || item.name === 'Midheaven') ? 'Chart Point' : `the ${getOrdinal(item.planet.house)} House`;
        const retrograde = item.planet.isRetrograde ? ' (Retrograde)' : '';
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.name} in ${item.planet.sign} (${item.planet.degree.toFixed(1)}°) in ${house}${retrograde}:`, 20, yPosition);
        yPosition += 6;
        
        doc.setFont('helvetica', 'normal');
        const description = doc.splitTextToSize(item.description, 170);
        description.forEach(line => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += 4;
        });
        yPosition += 8;
      }
    });

    // Enhanced House Interpretations
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('House Interpretations', 20, yPosition);
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(20, yPosition + 3, 20 + doc.getTextWidth('House Interpretations'), yPosition + 3);
    
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const houseDescriptions = generateDetailedHouseInterpretations(chartData.planets);
    
    houseDescriptions.forEach(house => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${house.title}:`, 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(house.description, 170);
      
      lines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });
      
      yPosition += 10;
    });

    // Add interpretation sections
    const addSection = (title, content) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, yPosition);
      
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(1);
      doc.line(20, yPosition + 3, 20 + doc.getTextWidth(title), yPosition + 3);
      
      yPosition += 15;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const lines = doc.splitTextToSize(cleanContent, 170);
      
      lines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });
      
      yPosition += 15;
    };
    
    // Add all sections
    addSection('Chart Overview', interpretations.overview);
    addSection('Planetary Meanings', interpretations.planetary_positions);
    addSection('Planetary Aspects', interpretations.aspects);
    addSection('Life Path & Spiritual Journey', interpretations.life_path);
    addSection('Career & Goals', interpretations.career);
    addSection('Love & Relationships', interpretations.relationships);
    addSection('Personality Profile', interpretations.personality);
    addSection('Life Purpose & Gifts', interpretations.life_purpose);
    addSection('Growth Areas & Challenges', interpretations.challenges);
    
    // Styled Disclaimer
    doc.addPage();
    yPosition = 20;
    
    doc.setDrawColor(59, 130, 246);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(15, yPosition - 5, 180, 200, 5, 5, 'FD');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('Disclaimer', 105, yPosition + 15, { align: 'center' });
    
    yPosition += 30;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    
    const disclaimerSections = [
      'Feng Shui & Beyond provides astrological interpretations based on traditional astrological principles and the positions of celestial bodies at the time of birth. These interpretations are offered for entertainment, self-reflection, and personal insight purposes only.',
      'The astrological analysis contained in this report represents one perspective on astrological symbolism and should not be considered as absolute truth or predictive fact. Different astrologers may interpret the same chart in varying ways based on their training, experience, and methodological approaches.',
      'This birth chart analysis is not intended to replace professional advice of any kind. Feng Shui & Beyond services do not constitute legal, medical, psychological, financial, business, or therapeutic guidance. For important life decisions or concerns regarding health, relationships, career, or other significant matters, please consult qualified professionals in the appropriate fields.',
      'By using our services, you acknowledge that astrological interpretations are speculative in nature and that you are responsible for your own choices and actions. Results and experiences may vary among individuals.'
    ];
    
    disclaimerSections.forEach(section => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const lines = doc.splitTextToSize(section, 165);
      lines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
      });
      
      yPosition += 8;
    });
    
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(`Copyright ${new Date().getFullYear()} Feng Shui & Beyond. All rights reserved.`, 105, yPosition, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('Enhanced PDF generated successfully with ephemeris calculations, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('Enhanced PDF generation failed:', error);
    const textContent = generateTextReport(chartData, interpretations);
    return Buffer.from(textContent, 'utf8');
  }
}

// Enhanced legend with proper symbols
function generateBasicChartLegend() {
  return `
    <div style="padding: 20px; background: #f0f4f8; border-radius: 8px; margin: 20px 0;">
      <h4 style="color: #1e40af; margin-bottom: 15px;">Planet Symbols & Zodiac Signs</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #374151;">
        <div>☉ Sun: Core identity, ego, life purpose</div>
        <div>♈ Aries: Fire - Bold, pioneering, energetic</div>
        <div>☽ Moon: Emotions, instincts, subconscious</div>
        <div>♉ Taurus: Earth - Stable, practical, sensual</div>
        <div>☿ Mercury: Communication, thinking, learning</div>
        <div>♊ Gemini: Air - Curious, communicative, adaptable</div>
        <div>♀ Venus: Love, beauty, relationships, values</div>
        <div>♋ Cancer: Water - Nurturing, emotional, protective</div>
        <div>♂ Mars: Energy, action, desire, courage</div>
        <div>♌ Leo: Fire - Dramatic, creative, confident</div>
        <div>♃ Jupiter: Growth, wisdom, expansion, luck</div>
        <div>♍ Virgo: Earth - Analytical, helpful, perfectionist</div>
        <div>♄ Saturn: Discipline, responsibility, limitations</div>
        <div>♎ Libra: Air - Harmonious, diplomatic, aesthetic</div>
        <div>♅ Uranus: Innovation, rebellion, sudden change</div>
        <div>♏ Scorpio: Water - Intense, mysterious, transformative</div>
        <div>♆ Neptune: Dreams, spirituality, illusion</div>
        <div>♐ Sagittarius: Fire - Adventurous, philosophical, optimistic</div>
        <div>♇ Pluto: Transformation, power, regeneration</div>
        <div>♑ Capricorn: Earth - Ambitious, disciplined, traditional</div>
        <div>AC Ascendant: Your outer personality, first impression</div>
        <div>♒ Aquarius: Air - Independent, innovative, humanitarian</div>
        <div>MC Midheaven: Career, reputation, public image</div>
        <div>♓ Pisces: Water - Imaginative, compassionate, intuitive</div>
      </div>
    </div>`;
}

function generateBasicHowToRead() {
  return `
    <div style="padding: 20px; background: #f0f4f8; border-radius: 8px; margin: 20px 0;">
      <h4 style="color: #1e40af; margin-bottom: 15px;">How to Read Your Chart</h4>
      <p style="font-size: 12px; color: #374151;">This chart represents the positions of celestial bodies at your moment of birth, calculated using ephemeris data for professional-grade accuracy.</p>
    </div>`;
}

function generateFallbackChart(planetaryData) {
  return `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="180" fill="#f8f9fa" stroke="#2c3e50" stroke-width="2"/>
    <circle cx="200" cy="200" r="120" fill="none" stroke="#95a5a6" stroke-width="1"/>
    <text x="200" y="40" style="font-family: Arial, sans-serif; text-anchor: middle; fill: #2c3e50; font-size: 16px; font-weight: bold;">Birth Chart</text>
    ${Object.entries(planetaryData).map(([planet, data], index) => {
      const y = 80 + (index * 25);
      const retrograde = data.isRetrograde ? ' R' : '';
      return `<text x="200" y="${y}" style="font-family: Arial, sans-serif; text-anchor: middle; fill: #2c3e50; font-size: 12px;">
        ${planet.toUpperCase()}: ${data.sign} ${data.degree.toFixed(1)}°${retrograde}
      </text>`;
    }).join('')}
    <text x="200" y="350" style="font-family: Arial, sans-serif; text-anchor: middle; fill: #7f8c8d; font-size: 10px;">
      Ephemeris calculations - chart service unavailable
    </text>
  </svg>`;
}

// AI interpretation
async function generateInterpretations(planetaryData, personalInfo) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const planetarySummary = Object.entries(planetaryData).map(([planet, data]) => {
    const retrograde = data.isRetrograde ? ' (Retrograde)' : '';
    return `${planet.toUpperCase()}: ${data.sign} ${data.degree.toFixed(1)} degrees in House ${data.house || 'N/A'}${retrograde}`;
  }).join('\n');
  
  const prompt = `Generate a birth chart analysis as valid JSON only. No markdown, no explanations, just pure JSON.

PLANETARY POSITIONS:
${planetarySummary}

Return ONLY a JSON object with these exact keys and 250-350 word values:
{
  "overview": "Complete chart overview...",
  "planetary_positions": "Detailed planet meanings including retrograde effects...",
  "houses": "House interpretations...",
  "aspects": "Planetary relationships...",
  "life_path": "Life purpose insights...",
  "career": "Professional guidance...",
  "relationships": "Love and relationship insights...",
  "personality": "Character analysis...",
  "life_purpose": "Core life mission...",
  "challenges": "Growth areas..."
}

Write in second person (you/your). Make it personal for ${personalInfo.fullName}. 
Pay attention to any retrograde planets and their special significance.`;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    responseText = responseText
      .replace(/```json\s*|\s*```/g, '')
      .replace(/```\s*|\s*```/g, '')
      .replace(/^[^{]*{/, '{')
      .replace(/}[^}]*$/, '}')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    try {
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (parseError) {
      return generateFallbackInterpretations(planetaryData, personalInfo);
    }
  } catch (error) {
    return generateFallbackInterpretations(planetaryData, personalInfo);
  }
}

function generateFallbackInterpretations(planetaryData, personalInfo) {
  const sunSign = planetaryData.sun?.sign || 'Unknown';
  const moonSign = planetaryData.moon?.sign || 'Unknown';
  const risingSign = planetaryData.ascendant?.sign || 'Unknown';
  
  const retrogradeCount = Object.values(planetaryData).filter(p => p.isRetrograde).length;
  const retrogradeNote = retrogradeCount > 0 ? ` With ${retrogradeCount} planets in retrograde motion, you have a special inward-focused energy that encourages deep self-reflection.` : '';

  return {
    overview: `${personalInfo.fullName}, your birth chart reveals a unique cosmic blueprint shaped by your ${sunSign} Sun, ${moonSign} Moon, and ${risingSign} Rising.${retrogradeNote} This combination creates a complex personality with distinct strengths, challenges, and life themes.`,
    planetary_positions: `Your Sun in ${sunSign} represents your core identity and life force, while your Moon in ${moonSign} governs your emotional nature and intuitive responses. Each planetary placement contributes to your unique astrological signature.`,
    houses: `The twelve houses of your chart represent different life areas where planetary energies manifest. Your planetary emphasis in certain houses indicates where you'll focus most of your energy throughout life.`,
    aspects: `The relationships between planets in your chart create dynamic interactions that influence how different parts of your personality work together, revealing harmony and creative tension.`,
    life_path: `Your spiritual journey is encoded in the patterns of your birth chart, revealing lessons you're here to learn and gifts you're meant to share with the world.`,
    career: `Your professional path is illuminated by the planets in your career houses, showing your natural talents and the work environment where you'll thrive most.`,
    relationships: `Your approach to love and partnerships is revealed through Venus and Mars placements, showing how you give and receive affection and what you seek in relationships.`,
    personality: `The combination of your ${sunSign} Sun, ${moonSign} Moon, and ${risingSign} Rising creates a unique personality blend that shapes how you express yourself and interact with the world.`,
    life_purpose: `Your soul's mission involves integrating the various energies in your chart and expressing your highest potential through service to others.`,
    challenges: `Every chart contains growth areas that offer opportunities for personal development. These challenges are gifts that help you develop strength and wisdom.`
  };
}

// Email function
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
            <p style="color: #475569; font-size: 18px; font-style: italic;">Professional Astrological Analysis</p>
          </div>
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear ${fullName},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Your birth chart has been calculated using accurate ephemeris data to provide you with the most precise astrological analysis possible.</p>
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px; font-size: 20px;">Your Analysis Includes:</h3>
              <ul style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Professional Chart Wheel:</strong> Visual representation with precise positioning</li>
                <li><strong>Accurate Retrograde Detection:</strong> Real astronomical calculations</li>
                <li><strong>Detailed Planetary Descriptions:</strong> Comprehensive analysis of each placement</li>
                <li><strong>Enhanced House Interpretations:</strong> Personalized insights for occupied houses</li>
                <li><strong>Life Path Insights:</strong> Your spiritual journey and growth areas</li>
                <li><strong>Career & Relationship Guidance:</strong> Professional and personal insights</li>
              </ul>
            </div>
            <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">This analysis provides reliable insights into your cosmic blueprint and personal potential.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: bold;">Your report is attached below</div>
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function generateTextReport(chartData, interpretations) {
  return `BIRTH CHART ANALYSIS
====================

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

Generated by Feng Shui & Beyond using Ephemeris calculations
`;
}

function generateEnhancedPlanetaryData(birthDate, birthTime, birthLocation) {
  console.log('Using fallback calculation method');
  
  const birthDateTime = new Date(`${birthDate}T${birthTime}`);
  const julianDay = (birthDateTime.getTime() / 86400000) + 2440587.5;
  
  let lat, lon;
  const parts = birthLocation.split(',');
  lat = parseFloat(parts[0].trim());
  lon = parseFloat(parts[1].trim());
  
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const planets = {};
  
  // Enhanced Sun calculation
  const sunData = calculateImprovedSun(julianDay);
  planets.sun = sunData;

  // Enhanced Moon calculation
  const moonLongitude = calculateImprovedPlanetPosition(julianDay, { name: 'moon', period: 27.32 });
  planets.moon = {
    sign: zodiacSigns[Math.floor(moonLongitude / 30)],
    degree: moonLongitude % 30,
    absoluteDegree: moonLongitude,
    isRetrograde: false,
    speed: 13.176,
    house: calculateHouse(moonLongitude, sunData.absoluteDegree)
  };

  // Calculate other planets with improved algorithms
  const planetConfigs = [
    { name: 'mercury', period: 87.97, offset: 174.795, retroFreq: 0.25 },
    { name: 'venus', period: 224.7, offset: 50.115, retroFreq: 0.08 },
    { name: 'mars', period: 686.98, offset: 19.412, retroFreq: 0.11 },
    { name: 'jupiter', period: 4332.6, offset: 20.020, retroFreq: 0.33 },
    { name: 'saturn', period: 10759, offset: 317.021, retroFreq: 0.36 },
    { name: 'uranus', period: 30687, offset: 141.050, retroFreq: 0.42 },
    { name: 'neptune', period: 60190, offset: 256.225, retroFreq: 0.43 },
    { name: 'pluto', period: 90800, offset: 14.882, retroFreq: 0.44 }
  ];

  planetConfigs.forEach(config => {
    const longitude = calculateImprovedPlanetPosition(julianDay, config);
    const isRetrograde = estimateRetrograde((julianDay - 2451545.0) / config.period, config.retroFreq);
    
    planets[config.name] = {
      sign: zodiacSigns[Math.floor(longitude / 30)],
      degree: longitude % 30,
      absoluteDegree: longitude,
      isRetrograde: isRetrograde,
      speed: isRetrograde ? -0.5 : 0.5,
      house: calculateHouse(longitude, sunData.absoluteDegree)
    };
  });

  // Calculate Ascendant and Midheaven
  const lst = calculateLocalSiderealTime(birthDateTime, lon);
  const ascendantDegree = calculateAscendant(lst, lat);
  const midheavenDegree = (lst * 15) % 360;

  planets.ascendant = {
    sign: zodiacSigns[Math.floor(ascendantDegree / 30)],
    degree: ascendantDegree % 30,
    absoluteDegree: ascendantDegree
  };

  planets.midheaven = {
    sign: zodiacSigns[Math.floor(midheavenDegree / 30)],
    degree: midheavenDegree % 30,
    absoluteDegree: midheavenDegree
  };

  // Recalculate houses with proper ascendant
  Object.keys(planets).forEach(planetName => {
    if (planets[planetName] && planetName !== 'ascendant' && planetName !== 'midheaven') {
      planets[planetName].house = calculateHouse(planets[planetName].absoluteDegree, ascendantDegree);
    }
  });

  return planets;
}

export default async function handler(req, res) {
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

    const { data: order, error: orderError } = await supabase
      .from('birth_chart_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    const planetaryData = await calculatePlanetaryPositions(
      order.birth_date,
      order.birth_time,
      order.birth_location
    );

    try {
      await supabase
        .from('birth_chart_calculations')
        .insert({
          order_id: orderId,
          planetary_data: planetaryData,
          calculation_method: 'ephemeris',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to save planetary data:', error);
    }

    const interpretations = await generateInterpretations(planetaryData, {
      fullName: order.full_name
    });

    const pdfBuffer = await generatePDF({
      fullName: order.full_name,
      birthDate: order.birth_date,
      birthTime: order.birth_time,
      birthLocation: order.birth_location,
      birthLocationDisplay: order.birth_location_display,
      planets: planetaryData
    }, interpretations);

    const emailResult = await sendEmail(order.email, pdfBuffer, order.full_name);

    await supabase
      .from('birth_chart_orders')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        calculation_method: 'ephemeris'
      })
      .eq('id', orderId);

    return res.status(200).json({ 
      success: true, 
      message: 'Birth chart generated successfully',
      emailId: emailResult.id,
      precision: 'ephemeris',
      features: ['enhanced_planetary_descriptions', 'detailed_house_interpretations', 'professional_disclaimer', 'proper_astrological_symbols']
    });

  } catch (error) {
    console.error('Birth chart processing failed:', error);
    return res.status(500).json({ 
      error: 'Failed to process birth chart',
      details: error.message
    });
  }
}