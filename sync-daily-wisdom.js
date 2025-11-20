// sync-daily-wisdom.js - Fixed for Gemini 2.5 Flash with rate limiting
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import fetch from 'node-fetch';

dotenv.config();

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

async function fetchWithBackoff(url, options, retries = 5, baseDelay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
        console.warn(`Rate limit hit (429), retrying in ${Math.round(delayTime / 1000)}s...`);
        await delay(delayTime);
        continue;
      }
      if (response.ok) return response;
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${await response.text()}`);
    } catch (err) {
      console.error(`Fetch attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
      console.warn(`Retrying in ${Math.round(delayTime / 1000)}s...`);
      await delay(delayTime);
    }
  }
  throw new Error('Max retries exceeded.');
}

async function generateDailyWisdom(targetDate) {
  const topics = ['feng shui', 'numerology', 'astrology'];
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `Generate a concise, uplifting motivational quote (under 15 words) 
  related to ${selectedTopic} for ${targetDate}. Then expand on that quote with a short article (200-250 words) 
  that provides practical advice. Format strictly as JSON: { "quote": "...", "article": "..." }.
  Ensure the content is focused exclusively on ${selectedTopic}.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          quote: { type: 'STRING' },
          article: { type: 'STRING' },
        },
        required: ['quote', 'article'],
      },
    },
  };

  // Add delay before API call to avoid rate limiting
  await delay(1000);

  const response = await fetchWithBackoff(geminiApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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

  return JSON.parse(jsonResponseText);
}

async function syncDailyWisdom() {
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
    
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating Daily Wisdom for ${dateToGenerate} (${targetDay})`);

    // Check if content already exists
    const existing = await sanityClient.fetch(
      `*[_type == "dailyWisdom" && date == $date][0]`,
      { date: dateToGenerate }
    );

    if (existing && !shouldForceRegenerate) {
      console.log(`Daily wisdom already exists for ${dateToGenerate}. Use --force to regenerate.`);
      return;
    }

    console.log(`Generating new Daily Wisdom for ${dateToGenerate}...`);
    const generated = await generateDailyWisdom(dateToGenerate);

    const doc = {
      _type: 'dailyWisdom',
      _id: `daily-wisdom-${dateToGenerate}`,
      date: dateToGenerate,
      quote: generated.quote,
      article: generated.article,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    await sanityClient.createOrReplace(doc);
    console.log(`Successfully generated daily wisdom for ${dateToGenerate}`);
    console.log(`Quote: "${generated.quote}"`);
    
  } catch (error) {
    console.error('Failed to generate daily wisdom:', error.message);
    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node sync-daily-wisdom.js [options]

Options:
  --today           Generate for today
  --tomorrow        Generate for tomorrow (default)
  --yesterday       Generate for yesterday  
  --date=YYYY-MM-DD Generate for specific date
  --force           Force regenerate even if exists
  --help, -h        Show this help message

Examples:
  node sync-daily-wisdom.js --today
  node sync-daily-wisdom.js --date=2025-01-15
  node sync-daily-wisdom.js --tomorrow --force
  `);
  process.exit(0);
}

syncDailyWisdom().catch((err) => {
  console.error('Failed to sync daily wisdom:', err.message);
});