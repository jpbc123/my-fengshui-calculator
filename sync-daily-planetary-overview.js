// sync-daily-planetary-overview.js - Fixed for Gemini 2.5 Flash with rate limiting
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
// FIXED: Use gemini-2.5-flash instead of preview version
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithBackoff(url, options, retries = 3, baseDelay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 1000;
        console.warn(`Rate limit hit (429), retrying in ${Math.round(delayTime / 1000)}s...`);
        await delay(delayTime);
        continue;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 1000;
      console.warn(`Retrying in ${Math.round(delayTime / 1000)}s...`);
      await delay(delayTime);
    }
  }
}

async function syncDailyPlanetaryOverview() {
  try {
    // Parse command line arguments for date control
    const args = process.argv.slice(2);
    let dateToGenerate;
    
    if (args.includes('--today')) {
      dateToGenerate = dayjs().format('YYYY-MM-DD');
    } else if (args.includes('--tomorrow')) {
      dateToGenerate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    } else if (args.includes('--yesterday')) {
      dateToGenerate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    } else {
      const customDateArg = args.find(arg => arg.startsWith('--date='));
      if (customDateArg) {
        const customDate = customDateArg.split('=')[1];
        if (dayjs(customDate).isValid()) {
          dateToGenerate = dayjs(customDate).format('YYYY-MM-DD');
        } else {
          console.error('Invalid date format. Use YYYY-MM-DD');
          process.exit(1);
        }
      } else {
        dateToGenerate = dayjs().add(1, 'day').format('YYYY-MM-DD'); // Default to tomorrow
      }
    }
    
    const shouldForceRegenerate = args.includes('--force');
    const targetDay = dayjs(dateToGenerate).format('dddd');
    
    console.log(`Generating planetary overview for ${dateToGenerate} (${targetDay})...`);

    // Check if content already exists
    const existing = await sanityClient.fetch(
      `*[_type == "dailyPlanetaryOverview" && date == $targetDate][0]`,
      { targetDate: dateToGenerate }
    );

    if (existing && !shouldForceRegenerate) {
      console.log(`Overview already exists for ${dateToGenerate}. Use --force to regenerate.`);
      return;
    }

    const prompt = `Using the date ${dateToGenerate} (${targetDay}), generate a "Daily Planetary Overview". Return a JSON object with: 'planetary_index' (1-5), 'summary' (max 150 chars), and 'article' (150-200 words).`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            planetary_index: { type: "INTEGER" },
            summary: { type: "STRING" },
            article: { type: "STRING" }
          },
          required: ["planetary_index", "summary", "article"]
        }
      }
    };

    // Add delay before API call to avoid rate limiting
    await delay(1000);

    const response = await fetchWithBackoff(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    // Handle the response
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

    const parsed = JSON.parse(jsonResponseText);

    await sanityClient.createOrReplace({
      _type: 'dailyPlanetaryOverview',
      _id: `planetary-${dateToGenerate}`,
      date: dateToGenerate,
      planetary_index: parsed.planetary_index,
      summary: parsed.summary,
      article: parsed.article,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    console.log(`Successfully generated planetary overview for ${dateToGenerate}`);
    console.log(`Energy Level: ${parsed.planetary_index}/5`);
    
  } catch (error) {
    console.error('Failed to generate planetary overview:', error.message);
    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node sync-daily-planetary-overview.js [options]

Options:
  --today           Generate for today
  --tomorrow        Generate for tomorrow (default)
  --yesterday       Generate for yesterday  
  --date=YYYY-MM-DD Generate for specific date
  --force           Force regenerate even if exists
  --help, -h        Show this help message

Examples:
  node sync-daily-planetary-overview.js --today
  node sync-daily-planetary-overview.js --date=2025-01-15
  node sync-daily-planetary-overview.js --tomorrow --force
  `);
  process.exit(0);
}

syncDailyPlanetaryOverview();