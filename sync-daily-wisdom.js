// sync-daily-wisdom.js - FIXED VERSION
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import fetch from 'node-fetch';

dotenv.config();

// Setup Sanity client
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

// Gemini API setup
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

// Helper for exponential backoff
async function fetchWithBackoff(url, options, retries = 5, baseDelay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
        console.warn(`Rate limit hit (429), retrying in ${Math.round(delayTime / 1000)}s...`);
        await new Promise((r) => setTimeout(r, delayTime));
        continue;
      }
      if (response.ok) return response;
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${await response.text()}`);
    } catch (err) {
      console.error(`Fetch attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
      console.warn(`Retrying in ${Math.round(delayTime / 1000)}s...`);
      await new Promise((r) => setTimeout(r, delayTime));
    }
  }
  throw new Error('Max retries exceeded.');
}

// ------------------- NEW: RANDOM TOPIC SELECTION -------------------
async function generateDailyWisdom(today) {
  const topics = ['feng shui', 'numerology', 'astrology'];
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `Generate a concise, uplifting motivational quote (under 15 words) 
  related to ${selectedTopic}. Then expand on that quote with a short article (200-250 words) 
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

  const response = await fetchWithBackoff(geminiApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  const jsonResponse = result.candidates[0].content.parts[0].text;
  return JSON.parse(jsonResponse);
}

async function syncDailyWisdom() {
  const today = dayjs().format('YYYY-MM-DD');
  console.log(`[${today}] Checking Sanity for existing Daily Wisdom...`);

  const existing = await sanityClient.fetch(
    `*[_type == "dailyWisdom" && date == $date][0]`,
    { date: today }
  );

  if (existing) {
    console.log(`[${today}] Already exists in Sanity. Skipping.`);
    return;
  }

  console.log(`[${today}] Generating new Daily Wisdom...`);
  const generated = await generateDailyWisdom(today);

  const doc = {
    _type: 'dailyWisdom',
    _id: `daily-wisdom-${today}`,
    date: today,
    quote: generated.quote,
    article: generated.article,
  };

  await sanityClient.createOrReplace(doc);
  console.log(`[${today}] Stored Daily Wisdom in Sanity.`);
}

// Run
syncDailyWisdom().catch((err) => {
  console.error('Failed to sync daily wisdom:', err.message);
});