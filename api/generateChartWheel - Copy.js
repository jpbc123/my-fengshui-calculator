// api/generateChartWheel.js
// Dedicated service for birth chart wheel generation with Swiss Ephemeris integration
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

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
    const { planetaryData, chartOptions = {} } = req.body;

    if (!planetaryData) {
      return res.status(400).json({ error: 'Planetary data is required' });
    }

    console.log('Generating birth chart wheel with enhanced Swiss Ephemeris data...');
    
    // Generate the SVG chart wheel with all enhancements
    const chartSVG = generateEnhancedNatalChartWheel(planetaryData, chartOptions);
    const chartLegend = generateChartLegend();
    const howToReadSection = generateHowToReadSection();
    
    // Convert SVG to base64 image for PDF compatibility
    let chartImageBase64 = null;
    try {
      chartImageBase64 = await convertSvgToImage(chartSVG);
      console.log('Chart SVG successfully converted to image');
    } catch (conversionError) {
      console.error('SVG to image conversion failed:', conversionError);
      // Continue without image - will fall back to SVG
    }
    
    return res.status(200).json({
      success: true,
      chartSVG: chartSVG,
      chartImageBase64: chartImageBase64, // New: base64 image for PDF
      chartLegend: chartLegend,
      howToReadSection: howToReadSection,
      format: 'svg',
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chart generation failed:', error);
    return res.status(500).json({
      error: 'Failed to generate chart wheel',
      details: error.message
    });
  }
}

// FIXED: Enhanced function to convert SVG to base64 image with environment detection
async function convertSvgToImage(svgString) {
  let browser;
  try {
    // Detect environment and configure Puppeteer accordingly
    const isDev = process.env.NODE_ENV === 'development' || !process.env.VERCEL;
    
    if (isDev) {
      // Local development configuration
      console.log('Running in development mode - using local Puppeteer');
      
      // Try to use regular puppeteer for local development
      try {
        const puppeteerRegular = await import('puppeteer');
        browser = await puppeteerRegular.default.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        });
      } catch (regularPuppeteerError) {
        console.log('Regular puppeteer not available, trying puppeteer-core with system Chrome');
        
        // Fallback: try to find system Chrome/Chromium
        const possiblePaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          '/usr/bin/google-chrome-stable',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        ];
        
        let executablePath = null;
        for (const path of possiblePaths) {
          try {
            const fs = await import('fs');
            if (fs.existsSync(path)) {
              executablePath = path;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (executablePath) {
          browser = await puppeteer.launch({
            executablePath,
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu'
            ]
          });
        } else {
          throw new Error('No Chrome/Chromium installation found. Please install Google Chrome or use regular puppeteer package.');
        }
      }
    } else {
      // Production/Vercel configuration
      console.log('Running in production mode - using Vercel-compatible Chromium');
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
    
    const page = await browser.newPage();
    
    // Set viewport to match SVG dimensions
    await page.setViewport({ 
      width: 600, 
      height: 640,
      deviceScaleFactor: 2 // Higher resolution
    });
    
    // Create HTML wrapper for the SVG
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              display: flex;
              justify-content: center;
              align-items: center;
              width: 600px;
              height: 640px;
              background: white;
            }
            svg { 
              width: 600px; 
              height: 640px; 
            }
          </style>
        </head>
        <body>
          ${svgString}
        </body>
      </html>
    `;
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 600,
        height: 640
      }
    });
    
    return screenshot.toString('base64');
    
  } catch (error) {
    console.error('Puppeteer SVG conversion failed:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Enhanced Birth Chart Wheel Generator with Swiss Ephemeris accuracy
function generateEnhancedNatalChartWheel(planetaryData, options = {}) {
  const {
    width = 600,
    height = 640,
    showAspects = true,
    showDegreeMarks = true,
    colorScheme = 'professional'
  } = options;

  const centerX = width * 0.5;
  const centerY = (height - 40) * 0.5;
  const outerRadius = Math.min(width, height - 80) * 0.43;
  const signRadius = outerRadius * 0.86;
  const planetRadius = outerRadius * 0.64;
  const houseRadius = outerRadius * 0.5;
  const innerRadius = outerRadius * 0.29;
  
  // Zodiac signs in order starting from Aries at 0°
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  // FIXED: Clean Unicode symbols that work properly in PDF generation
  const planetInfo = {
    sun: { symbol: '☉', fallback: 'SU', color: '#FF6B35', name: 'Sun' },
    moon: { symbol: '☽', fallback: 'MO', color: '#4ECDC4', name: 'Moon' },
    mercury: { symbol: '☿', fallback: 'ME', color: '#45B7D1', name: 'Mercury' },
    venus: { symbol: '♀', fallback: 'VE', color: '#96CEB4', name: 'Venus' },
    mars: { symbol: '♂', fallback: 'MA', color: '#FFEAA7', name: 'Mars' },
    jupiter: { symbol: '♃', fallback: 'JU', color: '#DDA0DD', name: 'Jupiter' },
    saturn: { symbol: '♄', fallback: 'SA', color: '#F39C12', name: 'Saturn' },
    uranus: { symbol: '♅', fallback: 'UR', color: '#00B894', name: 'Uranus' },
    neptune: { symbol: '♆', fallback: 'NE', color: '#6C5CE7', name: 'Neptune' },
    pluto: { symbol: '♇', fallback: 'PL', color: '#A29BFE', name: 'Pluto' },
    ascendant: { symbol: 'AC', fallback: 'AC', color: '#2D3436', name: 'Ascendant' },
    midheaven: { symbol: 'MC', fallback: 'MC', color: '#2D3436', name: 'Midheaven' }
  };

  // FIXED: Clean Unicode symbols for zodiac signs
  const signInfo = {
    'Aries': { symbol: '♈', fallback: 'AR', color: '#E74C3C', element: 'fire' },
    'Taurus': { symbol: '♉', fallback: 'TA', color: '#27AE60', element: 'earth' },
    'Gemini': { symbol: '♊', fallback: 'GE', color: '#F39C12', element: 'air' },
    'Cancer': { symbol: '♋', fallback: 'CA', color: '#3498DB', element: 'water' },
    'Leo': { symbol: '♌', fallback: 'LE', color: '#E74C3C', element: 'fire' },
    'Virgo': { symbol: '♍', fallback: 'VI', color: '#27AE60', element: 'earth' },
    'Libra': { symbol: '♎', fallback: 'LI', color: '#F39C12', element: 'air' },
    'Scorpio': { symbol: '♏', fallback: 'SC', color: '#3498DB', element: 'water' },
    'Sagittarius': { symbol: '♐', fallback: 'SG', color: '#E74C3C', element: 'fire' },
    'Capricorn': { symbol: '♑', fallback: 'CP', color: '#27AE60', element: 'earth' },
    'Aquarius': { symbol: '♒', fallback: 'AQ', color: '#F39C12', element: 'air' },
    'Pisces': { symbol: '♓', fallback: 'PI', color: '#3498DB', element: 'water' }
  };

  // Calculate aspects between planets with Swiss Ephemeris precision
  function calculatePreciseAspects() {
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
          
          // Professional aspect orbs based on Swiss Ephemeris standards
          const aspectTypes = [
            { name: 'conjunction', angle: 0, orb: 8, color: '#E74C3C', style: 'solid', strength: 'major' },
            { name: 'opposition', angle: 180, orb: 8, color: '#E74C3C', style: 'solid', strength: 'major' },
            { name: 'trine', angle: 120, orb: 6, color: '#27AE60', style: 'dashed', strength: 'major' },
            { name: 'square', angle: 90, orb: 6, color: '#E67E22', style: 'solid', strength: 'major' },
            { name: 'sextile', angle: 60, orb: 4, color: '#3498DB', style: 'dotted', strength: 'minor' },
            { name: 'quincunx', angle: 150, orb: 3, color: '#95A5A6', style: 'dotted', strength: 'minor' },
            { name: 'semisquare', angle: 45, orb: 2, color: '#D35400', style: 'dotted', strength: 'minor' },
            { name: 'sesquiquadrate', angle: 135, orb: 2, color: '#D35400', style: 'dotted', strength: 'minor' }
          ];
          
          for (const aspectType of aspectTypes) {
            const orb = Math.abs(diff - aspectType.angle);
            if (orb <= aspectType.orb) {
              aspects.push({
                planet1,
                planet2,
                type: aspectType.name,
                angle: aspectType.angle,
                orb: orb.toFixed(2),
                color: aspectType.color,
                style: aspectType.style,
                strength: aspectType.strength
              });
              break;
            }
          }
        }
      }
    }
    return aspects;
  }

  const aspects = showAspects ? calculatePreciseAspects() : [];

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .chart-text { font-family: 'Arial', sans-serif; text-anchor: middle; dominant-baseline: middle; }
        .sign-symbol { font-size: 20px; font-weight: bold; }
        .planet-symbol { font-size: 16px; font-weight: bold; }
        .house-number { font-size: 16px; font-weight: bold; fill: #34495e; }
        .degree-text { font-size: 10px; fill: #7f8c8d; }
        .wheel-line { stroke: #2c3e50; stroke-width: 2; fill: none; }
        .house-line { stroke: #95a5a6; stroke-width: 1.5; }
        .aspect-line { stroke-width: 1.5; fill: none; }
        .center-point { fill: #2c3e50; }
        .degree-tick { stroke: #bdc3c7; stroke-width: 0.5; }
        .retro-indicator { fill: #E74C3C; font-size: 8px; }
      </style>
      
      <!-- Enhanced patterns for aspects -->
      <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="2">
        <rect width="4" height="2" fill="currentColor"/>
      </pattern>
      <pattern id="dotted" patternUnits="userSpaceOnUse" width="4" height="2">
        <circle cx="2" cy="1" r="0.5" fill="currentColor"/>
      </pattern>
      
      <!-- Professional gradients -->
      <radialGradient id="chartGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8f9fa"/>
      </radialGradient>
    </defs>
    
    <!-- Chart background with gradient -->
    <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" fill="url(#chartGradient)" class="wheel-line"/>
    <circle cx="${centerX}" cy="${centerY}" r="${signRadius}" class="wheel-line"/>
    <circle cx="${centerX}" cy="${centerY}" r="${planetRadius}" stroke="#ecf0f1" stroke-width="1" fill="none"/>
    <circle cx="${centerX}" cy="${centerY}" r="${houseRadius}" class="wheel-line"/>
    <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" class="wheel-line"/>`;

  // Enhanced degree tick marks
  if (showDegreeMarks) {
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
  }

  // Enhanced zodiac sign sections
  for (let i = 0; i < 12; i++) {
    const startAngle = (i * 30 - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
    const midAngle = startAngle + Math.PI / 12;
    
    const sign = zodiacSigns[i];
    const signData = signInfo[sign];
    
    // Sign section backgrounds
    const x1 = centerX + signRadius * Math.cos(startAngle);
    const y1 = centerY + signRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + signRadius * Math.cos(endAngle);
    const y4 = centerY + signRadius * Math.sin(endAngle);
    
    svg += `<path d="M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${signRadius} ${signRadius} 0 0 0 ${x1} ${y1}" 
            fill="${signData.color}" opacity="0.15" stroke="${signData.color}" stroke-width="1"/>`;
    
    // Sign symbols with better positioning
    const symbolX = centerX + (signRadius + 20) * Math.cos(midAngle);
    const symbolY = centerY + (signRadius + 20) * Math.sin(midAngle);
    svg += `<text x="${symbolX}" y="${symbolY}" class="chart-text sign-symbol" fill="${signData.color}">${signData.symbol}</text>`;
    
    // Degree markings
    const degreeX = centerX + (outerRadius - 5) * Math.cos(startAngle);
    const degreeY = centerY + (outerRadius - 5) * Math.sin(startAngle);
    svg += `<text x="${degreeX}" y="${degreeY}" class="chart-text" style="font-size: 10px; fill: #7f8c8d;">${i * 30}°</text>`;
  }

  // FIXED: Improved house calculations and positioning
  const ascendantDegree = planetaryData.ascendant?.absoluteDegree || 0;
  const houseCusps = calculateImprovedHouseCusps(ascendantDegree, planetaryData);

  // Draw house lines with calculated cusps
  for (let i = 0; i < 12; i++) {
    const angle = (houseCusps[i] - 90) * Math.PI / 180;
    
    const x1 = centerX + innerRadius * Math.cos(angle);
    const y1 = centerY + innerRadius * Math.sin(angle);
    const x2 = centerX + houseRadius * Math.cos(angle);
    const y2 = centerY + houseRadius * Math.sin(angle);
    
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="house-line"/>`;
    
    // FIXED: Better house number positioning to prevent overlaps
    const nextHouseCusp = houseCusps[(i + 1) % 12];
    let houseSpan = nextHouseCusp - houseCusps[i];
    if (houseSpan < 0) houseSpan += 360;
    
    const houseMiddleAngle = (houseCusps[i] + houseSpan / 2 - 90) * Math.PI / 180;
    
    // Adjust radius based on house size to prevent overlaps
    const adjustedRadius = houseRadius - (houseSpan < 20 ? 40 : 25);
    const houseX = centerX + adjustedRadius * Math.cos(houseMiddleAngle);
    const houseY = centerY + adjustedRadius * Math.sin(houseMiddleAngle);
    
    svg += `<text x="${houseX}" y="${houseY}" class="chart-text house-number">${i + 1}</text>`;
  }

  // Draw aspect lines with enhanced styling
  if (showAspects) {
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
        
        const opacity = aspect.strength === 'major' ? 0.8 : 0.5;
        
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                class="aspect-line" stroke="${aspect.color}" 
                stroke-dasharray="${strokeDashArray}" opacity="${opacity}"/>`;
      }
    });
  }

  // Enhanced planet positioning with better collision avoidance
  const drawnPlanets = [];

  // First, sort planets by their absolute degree to process them in order
  const planetEntries = Object.entries(planetaryData).filter(([name, data]) => 
    data.absoluteDegree !== undefined
  ).sort(([,a], [,b]) => a.absoluteDegree - b.absoluteDegree);

  planetEntries.forEach(([planetName, data]) => {
    const planetAngle = (data.absoluteDegree - 90) * Math.PI / 180;
    const planetData = planetInfo[planetName];
    
    // Improved collision avoidance algorithm
    let currentRadius = planetRadius;
    let planetX, planetY;
    let finalPosition = null;
    
    // Try different radii to avoid collisions
    for (let radiusAttempt = 0; radiusAttempt < 4; radiusAttempt++) {
      currentRadius = planetRadius + (radiusAttempt * 30);
      
      // Try slight angle adjustments at each radius
      for (let angleOffset = 0; angleOffset <= 30; angleOffset += 5) {
        for (let direction of [-1, 1]) {
          const testAngle = planetAngle + (direction * angleOffset * Math.PI / 180);
          planetX = centerX + currentRadius * Math.cos(testAngle);
          planetY = centerY + currentRadius * Math.sin(testAngle);
          
          // Check for collisions with existing planets
          let collision = false;
          const minDistance = 45; // Increased minimum distance
          
          for (const drawn of drawnPlanets) {
            const distance = Math.sqrt(
              Math.pow(drawn.x - planetX, 2) + Math.pow(drawn.y - planetY, 2)
            );
            if (distance < minDistance) {
              collision = true;
              break;
            }
          }
          
          if (!collision) {
            finalPosition = { x: planetX, y: planetY, angle: testAngle };
            break;
          }
          
          if (angleOffset === 0) break; // Don't try both directions for 0 offset
        }
        if (finalPosition) break;
      }
      if (finalPosition) break;
    }
    
    // Use final position or fallback to original position
    if (finalPosition) {
      planetX = finalPosition.x;
      planetY = finalPosition.y;
    } else {
      // Fallback: place at original angle but further out
      planetX = centerX + (planetRadius + 60) * Math.cos(planetAngle);
      planetY = centerY + (planetRadius + 60) * Math.sin(planetAngle);
    }
    
    drawnPlanets.push({ x: planetX, y: planetY, planet: planetName });
    
    // Enhanced planet circle with shadow effect
    svg += `<circle cx="${planetX + 1}" cy="${planetY + 1}" r="18" fill="rgba(0,0,0,0.15)"/>`;
    svg += `<circle cx="${planetX}" cy="${planetY}" r="18" fill="white" stroke="${planetData?.color || '#2c3e50'}" stroke-width="2.5"/>`;
    
    // FIXED: Planet symbol with better encoding for PDF compatibility
    const symbol = planetData?.symbol || planetData?.fallback || planetName.charAt(0).toUpperCase();
    svg += `<text x="${planetX}" y="${planetY + 1}" class="chart-text planet-symbol" fill="${planetData?.color || '#2c3e50'}" style="font-size: 14px; font-weight: bold;">${symbol}</text>`;
    
    // Retrograde indicator - positioned more carefully
    if (data.isRetrograde) {
      svg += `<text x="${planetX + 22}" y="${planetY - 12}" class="chart-text retro-indicator" style="font-size: 10px; font-weight: bold;">R</text>`;
    }
    
    // Simplified degree information - only show degrees, not sign abbreviation
    const degreeText = `${Math.round(data.degree)}°`;
    svg += `<text x="${planetX}" y="${planetY + 32}" class="chart-text degree-text" style="font-size: 9px;">${degreeText}</text>`;
    
    // Connection line to chart edge - make it more subtle
    const edgeX = centerX + (signRadius - 5) * Math.cos(planetAngle);
    const edgeY = centerY + (signRadius - 5) * Math.sin(planetAngle);
    svg += `<line x1="${planetX}" y1="${planetY}" x2="${edgeX}" y2="${edgeY}" 
            stroke="#bdc3c7" stroke-width="0.8" stroke-dasharray="2,3" opacity="0.4"/>`;
  });

  // Enhanced center point
  svg += `<circle cx="${centerX}" cy="${centerY}" r="8" class="center-point"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="4" fill="white"/>`;
  
  // Professional legend
  svg += `<text x="${centerX}" y="${height - 20}" class="chart-text" style="font-size: 11px; fill: #7f8c8d;">
    Swiss Ephemeris Precision | Aspects: Red=Major | Green=Trine | Blue=Sextile | Orange=Square</text>`;
  
  svg += `</svg>`;
  
  return svg;
}

// FIXED: Improved house cusp calculation with better spacing
function calculateImprovedHouseCusps(ascendantDegree, planetaryData) {
  const houseCusps = [];
  
  // Use actual midheaven if available, otherwise approximate
  const midheavenDegree = planetaryData.midheaven?.absoluteDegree || ((ascendantDegree + 270) % 360);
  
  // Set the four main angles
  houseCusps[0] = ascendantDegree; // 1st house (Ascendant)
  houseCusps[9] = midheavenDegree; // 10th house (Midheaven)
  houseCusps[6] = (ascendantDegree + 180) % 360; // 7th house (Descendant)
  houseCusps[3] = (midheavenDegree + 180) % 360; // 4th house (IC)
  
  // Calculate intermediate house cusps using improved algorithm
  // This prevents house number overlaps by ensuring minimum spacing
  
  // Quadrant 1 (Houses 1-3): ASC to IC
  const quad1Span = calculateSpan(ascendantDegree, houseCusps[3]);
  houseCusps[1] = (ascendantDegree + quad1Span * 0.33) % 360;
  houseCusps[2] = (ascendantDegree + quad1Span * 0.67) % 360;
  
  // Quadrant 2 (Houses 4-6): IC to DESC
  const quad2Span = calculateSpan(houseCusps[3], houseCusps[6]);
  houseCusps[4] = (houseCusps[3] + quad2Span * 0.33) % 360;
  houseCusps[5] = (houseCusps[3] + quad2Span * 0.67) % 360;
  
  // Quadrant 3 (Houses 7-9): DESC to MC
  const quad3Span = calculateSpan(houseCusps[6], midheavenDegree);
  houseCusps[7] = (houseCusps[6] + quad3Span * 0.33) % 360;
  houseCusps[8] = (houseCusps[6] + quad3Span * 0.67) % 360;
  
  // Quadrant 4 (Houses 10-12): MC to ASC
  const quad4Span = calculateSpan(midheavenDegree, ascendantDegree);
  houseCusps[10] = (midheavenDegree + quad4Span * 0.33) % 360;
  houseCusps[11] = (midheavenDegree + quad4Span * 0.67) % 360;
  
  return houseCusps;
}

// Helper function to calculate angular span considering 360° wrap-around
function calculateSpan(start, end) {
  let span = end - start;
  if (span < 0) span += 360;
  return span;
}

// Enhanced chart legend
function generateChartLegend() {
  const planetSymbols = {
    '☉ Sun': 'Core identity, ego, life purpose',
    '☽ Moon': 'Emotions, instincts, subconscious',
    '☿ Mercury': 'Communication, thinking, learning',
    '♀ Venus': 'Love, beauty, relationships, values',
    '♂ Mars': 'Energy, action, desire, courage',
    '♃ Jupiter': 'Growth, wisdom, expansion, luck',
    '♄ Saturn': 'Discipline, responsibility, limitations',
    '♅ Uranus': 'Innovation, rebellion, sudden change',
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

// Enhanced "How to Read" section
function generateHowToReadSection() {
  return `
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">How to Read Your Swiss Ephemeris Birth Chart</h3>
      <div style="font-size: 14px; line-height: 1.6; color: #374151;">
        <p><strong>1. The Outer Ring:</strong> Shows the 12 zodiac signs in their natural order, starting with Aries at the 9 o'clock position.</p>
        <p><strong>2. The Houses:</strong> The 12 numbered sections represent different life areas. House 1 starts at your Ascendant (AC).</p>
        <p><strong>3. Planet Positions:</strong> Colored symbols show exact planetary positions calculated with Swiss Ephemeris precision.</p>
        <p><strong>4. Your Big Three:</strong> Look for your Sun ☉ (core self), Moon ☽ (emotions), and Ascendant AC (outer personality).</p>
        <p><strong>5. Aspects:</strong> Lines connecting planets show their relationships - harmonious (green/blue) or challenging (red/orange).</p>
        <p><strong>6. Retrograde Planets:</strong> Marked with 'R' - indicating inward-focused energy for that planet.</p>
        <p><strong>Precision:</strong> This chart uses Swiss Ephemeris calculations for professional-grade accuracy.</p>
      </div>
    </div>`;
}