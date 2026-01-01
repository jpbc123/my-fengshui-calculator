// sync-full-moon.js - FIXED: Changed to gemini-2.5-flash
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import fetch from 'node-fetch';

dotenv.config({ quiet: true });

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
// FIXED: Changed from preview model to stable gemini-2.5-flash
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

async function fetchWithBackoff(url, options, retries = 5, baseDelay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 1000;
        console.warn(`Rate limit hit (429), retrying in ${Math.round(delayTime / 1000)}s...`);
        await new Promise((r) => setTimeout(r, delayTime));
        continue;
      }
      if (response.ok) return response;
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${await response.text()}`);
    } catch (err) {
      console.error(`Fetch attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 1000;
      console.warn(`Retrying in ${Math.round(delayTime / 1000)}s...`);
      await new Promise((r) => setTimeout(r, delayTime));
    }
  }
  throw new Error('Max retries exceeded.');
}

async function generateFullMoons(year) {
  const prompt = `
    Generate accurate Full Moon data for ${year}. There are 12 full moons per year with traditional names.
    
    For each full moon, provide:
    - Exact date (YYYY-MM-DD format)
    - Traditional name (Wolf Moon, Snow Moon, Worm Moon, Pink Moon, Flower Moon, Strawberry Moon, 
      Buck Moon, Sturgeon Moon, Harvest Moon, Hunter's Moon, Beaver Moon, Cold Moon)
    - Zodiac sign of the Full Moon
    - Peak time in UTC (HH:MM format, like "14:30")
    - Intensity level: "gentle", "moderate", or "intense"
    - Brief description of the moon's influence (50-100 words)
    - Energy theme (one clear sentence)
    - Array of 3-5 key themes (short phrases like "Family", "Emotional healing", etc.)
    - Whether it's a lunar eclipse (true/false)
    
    Return as JSON with this exact structure:
    {
      "full_moons": [
        {
          "date": "YYYY-MM-DD",
          "name": "Wolf Moon",
          "zodiac_sign": "Cancer", 
          "peak_time": "14:30",
          "intensity": "moderate",
          "description": "detailed description",
          "energy": "energy theme sentence",
          "themes": ["theme1", "theme2", "theme3"],
          "is_eclipse": false
        }
      ]
    }
  `;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          full_moons: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                date: { type: "STRING" },
                name: { type: "STRING" },
                zodiac_sign: { type: "STRING" },
                peak_time: { type: "STRING" },
                intensity: { type: "STRING" },
                description: { type: "STRING" },
                energy: { type: "STRING" },
                themes: { type: "ARRAY", items: { type: "STRING" } },
                is_eclipse: { type: "BOOLEAN" }
              },
              required: ["date", "name", "zodiac_sign", "peak_time", "intensity", "description", "energy", "themes", "is_eclipse"]
            }
          }
        },
        required: ["full_moons"]
      }
    }
  };

  const response = await fetchWithBackoff(geminiApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  
  // Handle response (matching your other fixed scripts)
  const candidate = result?.candidates?.[0];
  if (!candidate) {
    throw new Error(`No candidate returned from model: ${JSON.stringify(result)}`);
  }

  let jsonResponseText = null;
  
  if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
    jsonResponseText = candidate.content.parts[0].text;
  } else if (candidate.content && typeof candidate.content === 'string') {
    jsonResponseText = candidate.content;
  }

  if (!jsonResponseText) {
    console.error('Debug - Full result:', JSON.stringify(result, null, 2));
    throw new Error(`No text response found in model result`);
  }
  
  return JSON.parse(jsonResponseText);
}

async function syncFullMoon() {
  try {
    const args = process.argv.slice(2);
    let yearToGenerate;
    
    // Parse year argument
    if (args.includes('--this-year')) {
      yearToGenerate = new Date().getFullYear();
    } else if (args.includes('--next-year')) {
      yearToGenerate = new Date().getFullYear() + 1;
    } else {
      const customYearArg = args.find(arg => arg.startsWith('--year='));
      if (customYearArg) {
        const customYear = customYearArg.split('=')[1];
        if (/^\d{4}$/.test(customYear)) {
          yearToGenerate = parseInt(customYear);
        } else {
          console.error('Invalid year format. Use --year=YYYY');
          process.exit(1);
        }
      } else {
        yearToGenerate = new Date().getFullYear(); // Default to current year
      }
    }
    
    const shouldForceRegenerate = args.includes('--force');
    
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating Full Moon data for ${yearToGenerate}`);
    console.log(`Force regenerate: ${shouldForceRegenerate}`);
    console.log('---');

    // Check if data already exists for this year
    const existingMoons = await sanityClient.fetch(
      `*[_type == "fullMoon" && year == ${yearToGenerate}]`
    );

    if (existingMoons.length > 0 && !shouldForceRegenerate) {
      console.log(`Full Moon data already exists for ${yearToGenerate} (${existingMoons.length} moons).`);
      console.log('Use --force to regenerate.');
      return;
    }

    console.log(`Generating new Full Moon data for ${yearToGenerate}...`);
    const data = await generateFullMoons(yearToGenerate);

    // Store Full Moon data
    for (let i = 0; i < data.full_moons.length; i++) {
      const fullMoon = data.full_moons[i];
      const date = new Date(fullMoon.date);
      
      const doc = {
        _type: 'fullMoon',
        _id: `full-moon-${fullMoon.date}`,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: fullMoon.date,
        name: fullMoon.name,
        sign: fullMoon.zodiac_sign,
        peakTime: fullMoon.peak_time,
        intensity: fullMoon.intensity,
        description: fullMoon.description,
        energy: fullMoon.energy,
        themes: fullMoon.themes,
        isEclipse: fullMoon.is_eclipse,
        autoGenerated: true,
      };
      
      await sanityClient.createOrReplace(doc);
      console.log(`  ✓ ${fullMoon.name}: ${fullMoon.date} in ${fullMoon.zodiac_sign}${fullMoon.is_eclipse ? ' (ECLIPSE)' : ''}`);
    }

    console.log('---');
    console.log(`Successfully generated ${data.full_moons.length} Full Moons for ${yearToGenerate}`);
    
  } catch (error) {
    console.error('Failed to generate Full Moon data:', error.message);
    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node sync-full-moon.js [options]

Year Options:
  --this-year       Generate for current year (default)
  --next-year       Generate for next year
  --year=YYYY       Generate for specific year

Other Options:
  --force           Force regenerate even if exists
  --help, -h        Show this help message

Examples:
  node sync-full-moon.js --this-year
  node sync-full-moon.js --year=2025
  node sync-full-moon.js --next-year --force
  `);
  process.exit(0);
}

syncFullMoon().catch((err) => {
  console.error('Failed to sync Full Moon:', err.message);
  process.exit(1);
});