// sync-chinese-horoscopes-sanity.js - Batch Version with Comprehensive Logging
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
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiUrlBase = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}`;

const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'tomorrow',
    types: ['daily', 'weekly'],
    signs: chineseZodiacSigns
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--today': config.mode = 'today'; break;
      case '--tomorrow': config.mode = 'tomorrow'; break;
      case '--daily-only': config.types = ['daily']; break;
      case '--weekly-only': config.types = ['weekly']; break;
      case '--sign':
        if (i + 1 < args.length) {
          const sign = args[i + 1].toLowerCase();
          if (chineseZodiacSigns.includes(sign)) { config.signs = [sign]; i++; }
        }
        break;
    }
  }
  return config;
}

async function fetchWithBackoff(url, options, retries = 3, baseDelay = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📡 [${dayjs().format('HH:mm:ss')}] Calling Gemini API (Attempt ${i + 1}/${retries})...`);
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const errorData = await response.json();
        const waitTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
        console.warn(`⚠️  [429] Quota Exceeded. Gemini says: "${errorData.error.message}"`);
        console.warn(`⏳  Retrying in ${Math.round(waitTime/1000)}s...`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }

      if (response.ok) {
        console.log(`✅ [${dayjs().format('HH:mm:ss')}] API Response Received Successfully.`);
        return response;
      }
      
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    } catch (error) {
      console.error(`❌ [${dayjs().format('HH:mm:ss')}] Network/API Error: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, Math.pow(2, i) * baseDelay));
    }
  }
}

async function generateBatch(type, config) {
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  const targetDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  const weekStart = dayjs().add(dayOffset, 'day').startOf('week').format('YYYY-MM-DD');
  const weekEnd = dayjs().add(dayOffset, 'day').endOf('week').format('YYYY-MM-DD');

  console.log(`📝 Preparing ${type.toUpperCase()} prompt for all 12 signs...`);
  
  const promptText = `Generate a detailed BILINGUAL (Chinese and English) ${type} horoscope for ALL 12 Chinese zodiac signs for ${type === 'daily' ? targetDate : weekStart + ' to ' + weekEnd}.
  Return EXCLUSIVELY a JSON array of 12 objects. Each object must strictly follow this schema:
  {
    "sign": "rat",
    "horoscope": "...", "horoscope_en": "...",
    "money": "...", "money_en": "...",
    "social": "...", "social_en": "...",
    "career": "...", "career_en": "...",
    "love": "...", "love_en": "...",
    "lucky_color": "...", "lucky_color_en": "...",
    "lucky_number": "...", "lucky_number_en": "...",
    "lucky_number_cn": "..."
  }`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  const response = await fetchWithBackoff(geminiApiUrlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  let parsed = JSON.parse(text);
  
  // Normalize if model wraps in an object
  if (!Array.isArray(parsed) && parsed.horoscopes) parsed = parsed.horoscopes;
  
  console.log(`📊 Parsed ${parsed.length} signs from API response.`);

  return parsed.map(item => ({
    ...item,
    forDate: targetDate,
    startDate: weekStart,
    endDate: weekEnd
  }));
}

async function syncChineseHoroscopes() {
  const config = parseArgs();
  console.log(`\n🚀 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] STARTING BATCH SYNC`);
  console.log(`📅 Mode: ${config.mode.toUpperCase()} | Types: ${config.types.join(', ')}\n`);

  try {
    for (const type of config.types) {
      const results = await generateBatch(type, config);
      const transaction = sanityClient.transaction();
      let count = 0;

      results.forEach(d => {
        if (config.signs.includes(d.sign)) {
          const docId = type === 'daily' ? `daily-${d.sign}-${d.forDate}` : `weekly-${d.sign}-${d.startDate}`;
          transaction.createOrReplace({
            _type: type === 'daily' ? 'dailyChineseHoroscope' : 'weeklyChineseHoroscope',
            _id: docId,
            ...d,
            horoscopeEn: d.horoscope_en, moneyEn: d.money_en, socialEn: d.social_en, 
            careerEn: d.career_en, loveEn: d.love_en, luckyColorEn: d.lucky_color_en,
            luckyNumberEn: d.lucky_number_en, luckyColor: d.lucky_color, luckyNumber: d.lucky_number
          });
          count++;
        }
      });

      console.log(`💾 Committing ${count} ${type} documents to Sanity...`);
      await transaction.commit();
      console.log(`✨ Successfully synced ${type.toUpperCase()} batch.\n`);
    }
  } catch (error) {
    console.error(`\n💥 SYNC ABORTED: ${error.message}`);
  }
  
  console.log(`🏆 [${dayjs().format('HH:mm:ss')}] ALL TASKS COMPLETED.\n`);
}

syncChineseHoroscopes();