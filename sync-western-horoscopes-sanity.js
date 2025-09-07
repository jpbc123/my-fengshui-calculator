// sync-western-horoscopes-sanity.js - FIXED VERSION
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import fetch from 'node-fetch';

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  //token: process.env.SANITY_WRITE_TOKEN,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

const westernZodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

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
        await new Promise(resolve => setTimeout(resolve, delayTime));
        continue;
      }
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${await response.text()}`);
    } catch (error) {
      console.error(`Fetch attempt ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
      console.warn(`Retrying in ${Math.round(delayTime / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
  }
  throw new Error("Maximum retries exceeded for API call.");
}

async function generateHoroscope(sign, type) {
  let promptText;
  let identifier;

  const currentYear = dayjs().year();
  const currentWeekStart = dayjs().startOf('week').format('YYYY-MM-DD');
  const currentWeekEnd = dayjs().endOf('week').format('YYYY-MM-DD');
  const today = dayjs().format('YYYY-MM-DD');

  if (type === 'daily') {
    // 👈 FIXED: Updated to match Sanity schema field names
    promptText = `Generate a concise yet insightful daily Western horoscope for ${sign} on ${today}.
    Cover overview, love, career, wealth, social. Also provide a lucky color and a lucky number.
    Respond as JSON with these exact keys:
    {
      "horoscope": "General daily forecast...",
      "love": "Love and relationship insights...",
      "career": "Career and work guidance...",
      "money": "Financial outlook...",
      "social": "Social interactions and friendships...",
      "luckyColor": "Blue",
      "luckyNumber": 7
    }`;
    identifier = today;

  } else if (type === 'weekly') {
    // 👈 FIXED: Updated to match Sanity schema field names
    promptText = `Generate a concise yet insightful weekly Western horoscope for ${sign}, covering ${currentWeekStart} to ${currentWeekEnd}.
    Cover overview, love, career, wealth, social. Also provide a lucky color and a lucky number.
    Respond as JSON with these exact keys:
    {
      "horoscope": "General weekly forecast...",
      "love": "Love and relationship insights...",
      "career": "Career and work guidance...",
      "money": "Financial outlook...",
      "social": "Social interactions and friendships...",
      "luckyColor": "Green",
      "luckyNumber": 3
    }`;
    identifier = currentWeekStart;

  } else if (type === 'yearly') {
    // 👈 FIXED: Updated to match Sanity schema field names
    promptText = `Generate a detailed yearly Western horoscope for ${sign} for the year ${currentYear}.
    Cover overview, love, career, wealth, social. Also provide a lucky color and a lucky number.
    Respond as JSON with these exact keys:
    {
      "overviewContent": "Detailed yearly overview...",
      "loveContent": "Annual love forecast...",
      "careerContent": "Career prospects for the year...",
      "wealthContent": "Financial outlook for the year...",
      "socialContent": "Social connections and networking...",
      "luckyColor": "Red",
      "luckyNumber": 9
    }`;
    identifier = currentYear;
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  };

  const response = await fetchWithBackoff(geminiApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  const jsonResponseText = result.candidates[0].content.parts[0].text;

  return {
    ...(JSON.parse(jsonResponseText)),
    identifier
  };
}

async function syncWesternHoroscopes() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Sanity.io Western horoscope sync...`);

  for (const sign of westernZodiacSigns) {
    const transaction = sanityClient.transaction();

    try {
      // Daily
      const dailyData = await generateHoroscope(sign, 'daily');
      const dailyDoc = {
        _type: 'dailyWesternHoroscope',
        _id: `daily-${sign}-${dailyData.identifier}`,
        sign,
        forDate: dailyData.identifier,
        horoscope: dailyData.horoscope,
        love: dailyData.love,
        career: dailyData.career,
        money: dailyData.money,
        social: dailyData.social,
        luckyColor: dailyData.luckyColor,
        luckyNumber: dailyData.luckyNumber
      };
      transaction.createOrReplace(dailyDoc);
      console.log(`[${dayjs().format('HH:mm:ss')}] ${sign} → daily prepared`);

      // Weekly
      const weeklyData = await generateHoroscope(sign, 'weekly');
      const weeklyDoc = {
        _type: 'weeklyWesternHoroscope',
        _id: `weekly-${sign}-${weeklyData.identifier}`,
        sign,
        startDate: weeklyData.identifier,
        endDate: dayjs(weeklyData.identifier).endOf('week').format('YYYY-MM-DD'),
        horoscope: weeklyData.horoscope,
        love: weeklyData.love,
        career: weeklyData.career,
        money: weeklyData.money,
        social: weeklyData.social,
        luckyColor: weeklyData.luckyColor,
        luckyNumber: weeklyData.luckyNumber
      };
      transaction.createOrReplace(weeklyDoc);
      console.log(`[${dayjs().format('HH:mm:ss')}] ${sign} → weekly prepared`);

      // Yearly
      const yearlyData = await generateHoroscope(sign, 'yearly');
      const yearlyDoc = {
        _type: 'yearlyWesternHoroscope',
        _id: `yearly-${sign}-${yearlyData.identifier}`,
        sign,
        year: yearlyData.identifier,
        overviewContent: yearlyData.overviewContent,
        loveContent: yearlyData.loveContent,
        careerContent: yearlyData.careerContent,
        wealthContent: yearlyData.wealthContent,
        socialContent: yearlyData.socialContent,
        luckyColor: yearlyData.luckyColor,
        luckyNumber: yearlyData.luckyNumber
      };
      transaction.createOrReplace(yearlyDoc);
      console.log(`[${dayjs().format('HH:mm:ss')}] ${sign} → yearly prepared`);

      await transaction.commit();
      console.log(`[${dayjs().format('HH:mm:ss')}] Synced Western horoscopes for: ${sign}`);
    } catch (error) {
      console.error(`[${dayjs().format('HH:mm:ss')}] Failed for ${sign}:`, error.message);
    }

    await delay(3000);
  }

  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] All Western horoscopes synced successfully.`);
}

syncWesternHoroscopes();