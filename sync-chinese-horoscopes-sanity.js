// sync-chinese-horoscopes-sanity.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import fetch from 'node-fetch';

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

// Load environment variables from .env
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

const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
];

// Helper function to introduce a delay to avoid rate limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to fetch from Gemini API with exponential backoff
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
      if (i === retries - 1) {
        throw error;
      }
      const delayTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
      console.warn(`Retrying in ${Math.round(delayTime / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
  }
  throw new Error("Maximum retries exceeded for API call.");
}

async function generateHoroscope(sign, period, type) {
  let promptText;
  let identifier;
  let responseSchema;

  const currentYear = dayjs().year();
  const currentWeekStart = dayjs().startOf('week').format('YYYY-MM-DD');
  const currentWeekEnd = dayjs().endOf('week').format('YYYY-MM-DD');
  const today = dayjs().format('YYYY-MM-DD');

  if (type === 'daily') {
    promptText = `Generate a detailed daily Chinese horoscope for the ${sign} sign for ${today}.
    Cover the following categories in both Chinese and English: horoscope, money, social, career, love.
    Also provide a lucky color and lucky number (both Chinese and English).
    Format as a JSON object with these exact keys:
    {
      "horoscope": "...", "horoscope_en": "...",
      "money": "...", "money_en": "...",
      "social": "...", "social_en": "...",
      "career": "...", "career_en": "...",
      "love": "...", "love_en": "...",
      "lucky_color": "...", "lucky_color_en": "...",
      "lucky_number": 5, "lucky_number_en": "five",
      "lucky_number_cn": "五"
    }`;
    identifier = today;

    responseSchema = {
      type: "OBJECT",
      properties: {
        horoscope: { type: "STRING" },
        horoscope_en: { type: "STRING" },
        money: { type: "STRING" },
        money_en: { type: "STRING" },
        social: { type: "STRING" },
        social_en: { type: "STRING" },
        career: { type: "STRING" },
        career_en: { type: "STRING" },
        love: { type: "STRING" },
        love_en: { type: "STRING" },
        lucky_color: { type: "STRING" },
        lucky_color_en: { type: "STRING" },
        lucky_number: { type: "STRING" },
        lucky_number_en: { type: "STRING" },
        lucky_number_cn: { type: "STRING" }
      },
      required: ["horoscope","horoscope_en","money","money_en","social","social_en",
                 "career","career_en","love","love_en","lucky_color","lucky_color_en",
                 "lucky_number","lucky_number_en","lucky_number_cn"]
    };

  } else if (type === 'weekly') {
    promptText = `Generate a detailed weekly Chinese horoscope for the ${sign} sign for the week starting ${currentWeekStart} and ending ${currentWeekEnd}.
    Cover the following categories in both Chinese and English: horoscope, money, social, career, love.
    Also provide a lucky color and lucky number (both Chinese and English).
    Format as a JSON object with these exact keys:
    {
      "horoscope": "...", "horoscope_en": "...",
      "money": "...", "money_en": "...",
      "social": "...", "social_en": "...",
      "career": "...", "career_en": "...",
      "love": "...", "love_en": "...",
      "lucky_color": "...", "lucky_color_en": "...",
      "lucky_number": 8, "lucky_number_en": "eight",
      "lucky_number_cn": "八"
    }`;
    identifier = currentWeekStart;

    responseSchema = {
      type: "OBJECT",
      properties: {
        horoscope: { type: "STRING" },
        horoscope_en: { type: "STRING" },
        money: { type: "STRING" },
        money_en: { type: "STRING" },
        social: { type: "STRING" },
        social_en: { type: "STRING" },
        career: { type: "STRING" },
        career_en: { type: "STRING" },
        love: { type: "STRING" },
        love_en: { type: "STRING" },
        lucky_color: { type: "STRING" },
        lucky_color_en: { type: "STRING" },
        lucky_number: { type: "STRING" },
        lucky_number_en: { type: "STRING" },
        lucky_number_cn: { type: "STRING" }
      },
      required: ["horoscope","horoscope_en","money","money_en","social","social_en",
                 "career","career_en","love","love_en","lucky_color","lucky_color_en",
                 "lucky_number","lucky_number_en","lucky_number_cn"]
    };

  } else if (type === 'yearly') {
    promptText = `Generate a detailed yearly Chinese horoscope for the ${sign} sign for the year ${currentYear}.
    Provide both Chinese and English for: overview, love, career, wealth, and social.
    Also provide a lucky color and lucky number (both Chinese and English).
    Format as a JSON object with these exact keys:
    {
      "overview_content": "...", "overview_content_cn": "...",
      "love_content": "...", "love_content_cn": "...",
      "career_content": "...", "career_content_cn": "...",
      "wealth_content": "...", "wealth_content_cn": "...",
      "social_content": "...", "social_content_cn": "...",
      "lucky_color": "...", "lucky_color_cn": "...",
      "lucky_number": 6, "lucky_number_cn": "六"
    }`;
    identifier = currentYear;

    responseSchema = {
      type: "OBJECT",
      properties: {
        overview_content: { type: "STRING" },
        overview_content_cn: { type: "STRING" },
        love_content: { type: "STRING" },
        love_content_cn: { type: "STRING" },
        career_content: { type: "STRING" },
        career_content_cn: { type: "STRING" },
        wealth_content: { type: "STRING" },
        wealth_content_cn: { type: "STRING" },
        social_content: { type: "STRING" },
        social_content_cn: { type: "STRING" },
        lucky_color: { type: "STRING" },
        lucky_color_cn: { type: "STRING" },
        lucky_number: { type: "STRING" },
        lucky_number_cn: { type: "STRING" }
      },
      required: ["overview_content","overview_content_cn","love_content","love_content_cn",
                 "career_content","career_content_cn","wealth_content","wealth_content_cn",
                 "social_content","social_content_cn","lucky_color","lucky_color_cn",
                 "lucky_number","lucky_number_cn"]
    };
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema
    }
  };

  const response = await fetchWithBackoff(geminiApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  const jsonResponseText = result.candidates[0].content.parts[0].text;
  const parsedData = JSON.parse(jsonResponseText);

  if (type === 'yearly') {
    return {
      year: identifier,
      overview_content: parsedData.overview_content,
      overview_content_cn: parsedData.overview_content_cn,
      love_content: parsedData.love_content,
      love_content_cn: parsedData.love_content_cn,
      career_content: parsedData.career_content,
      career_content_cn: parsedData.career_content_cn,
      wealth_content: parsedData.wealth_content,
      wealth_content_cn: parsedData.wealth_content_cn,
      social_content: parsedData.social_content,
      social_content_cn: parsedData.social_content_cn,
      lucky_color: parsedData.lucky_color,
      lucky_color_cn: parsedData.lucky_color_cn,
      lucky_number: parsedData.lucky_number,
      lucky_number_cn: parsedData.lucky_number_cn
    };
  }

  // Daily + Weekly
  return {
    ...parsedData,
    forDate: today,
    startDate: currentWeekStart,
    endDate: currentWeekEnd
  };
}

// Main function to run the sync process
async function syncChineseHoroscopes() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Sanity.io Chinese horoscope sync process...`);

  for (const sign of chineseZodiacSigns) {
    const transaction = sanityClient.transaction();

    try {
      // Daily
      const dailyData = await generateHoroscope(sign, 'daily', 'daily');
      const dailyDoc = {
        _type: 'dailyChineseHoroscope',
        _id: `daily-${sign}-${dailyData.forDate}`,
        sign: sign,
        forDate: dailyData.forDate,
        horoscope: dailyData.horoscope,
        money: dailyData.money,
        social: dailyData.social,
        career: dailyData.career,
        love: dailyData.love,
        luckyColor: dailyData.lucky_color,
        luckyNumber: dailyData.lucky_number,
        horoscopeEn: dailyData.horoscope_en,
        moneyEn: dailyData.money_en,
        socialEn: dailyData.social_en,
        careerEn: dailyData.career_en,
        loveEn: dailyData.love_en,
        luckyColorEn: dailyData.lucky_color_en,
        luckyNumberEn: dailyData.lucky_number_en,
      };
      transaction.createOrReplace(dailyDoc);
	  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${sign} → daily prepared`);

      // Weekly
      const weeklyData = await generateHoroscope(sign, 'weekly', 'weekly');
      const weeklyDoc = {
        _type: 'weeklyChineseHoroscope',
        _id: `weekly-${sign}-${weeklyData.startDate}`,
        sign: sign,
        startDate: weeklyData.startDate,
        endDate: weeklyData.endDate,
        horoscope: weeklyData.horoscope,
        horoscopeEn: weeklyData.horoscope_en,
		money: weeklyData.money,
		moneyEn: weeklyData.money_en,
        social: weeklyData.social,
        socialEn: weeklyData.social_en,
        career: weeklyData.career,
        careerEn: weeklyData.career_en,
        love: weeklyData.love,
        loveEn: weeklyData.love_en,
        luckyColor: weeklyData.lucky_color,
        luckyColorEn: weeklyData.lucky_color_en,
        luckyNumber: weeklyData.lucky_number,
        luckyNumberEn: weeklyData.lucky_number_en,
      };
      transaction.createOrReplace(weeklyDoc);
	  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${sign} → weekly prepared`);


      // Yearly
      const yearlyData = await generateHoroscope(sign, 'yearly', 'yearly');
      const yearlyDoc = {
        _type: 'yearlyChineseHoroscope',
        _id: `yearly-${sign}-${yearlyData.year}`,
        sign: sign,
		year: yearlyData.year,
		overviewContent: yearlyData.overview_content,
		overviewContentCn: yearlyData.overview_content_cn,
		loveContent: yearlyData.love_content,
		loveContentCn: yearlyData.love_content_cn,
		careerContent: yearlyData.career_content,
		careerContentCn: yearlyData.career_content_cn,
		wealthContent: yearlyData.wealth_content,
		wealthContentCn: yearlyData.wealth_content_cn,
		socialContent: yearlyData.social_content,
		socialContentCn: yearlyData.social_content_cn,
		luckyColor: yearlyData.lucky_color,
		luckyColorCn: yearlyData.lucky_color_cn,
		luckyNumber: yearlyData.lucky_number,
		luckyNumberCn: yearlyData.lucky_number_cn,
      };
      transaction.createOrReplace(yearlyDoc);
	  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${sign} → yearly prepared`);
  
      await transaction.commit();
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Synced horoscopes for: ${sign}`);
    } catch (error) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed for ${sign}:`, error.message);
    }
  }

  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] All Chinese horoscopes synced successfully.`);
}

// Run
syncChineseHoroscopes();