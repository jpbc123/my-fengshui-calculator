// sync-daily-fengshui-tip.js
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
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

// Helper: backoff retries
async function fetchWithBackoff(url, options, retries = 5, baseDelay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * baseDelay + Math.random() * 5000;
        console.warn(`Rate limit hit (429), retrying in ${Math.round(delay / 1000)}s...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${await response.text()}`);
      }
      return response;
    } catch (err) {
      console.error(`Fetch attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      const delay = Math.pow(2, i) * baseDelay + Math.random() * 5000;
      console.warn(`Retrying in ${Math.round(delay / 1000)}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function syncDailyFengShuiTip() {
  const today = dayjs().format('YYYY-MM-DD');
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Checking Sanity for Feng Shui tip for ${today}...`);

  // Check if today's tip already exists
  const existing = await sanityClient.fetch(
    `*[_type == "dailyFengShuiTip" && date == $today][0]`,
    { today }
  );

  if (existing) {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Tip already exists for today. Skipping.`);
    return;
  }

  // Generate a new tip
  const prompt = `Generate a single, unique, and actionable daily Feng Shui tip. 
  The tip should be concise, around 10-20 words, and directly applicable. 
  Example: "Clear your entryway to welcome positive chi into your home."`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          tip: { type: "STRING" }
        },
        required: ["tip"]
      }
    }
  };

  try {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating new Feng Shui tip...`);
    const response = await fetchWithBackoff(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const jsonResponse = result.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(jsonResponse);
    const tip = parsed.tip;

    // Store in Sanity
    await sanityClient.createOrReplace({
      _type: 'dailyFengShuiTip',
      _id: `fengshui-${today}`,
      date: today,
      tip,
      createdAt: new Date().toISOString(),
    });

    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully stored Feng Shui tip: "${tip}"`);
  } catch (err) {
    console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to generate/store Feng Shui tip:`, err.message);
  }
}

syncDailyFengShuiTip();
