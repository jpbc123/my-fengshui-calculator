// sync-chinese-horoscopes-sanity.js - Fixed Batch Version
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
const geminiApiUrlBase = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'tomorrow',
    types: ['daily'],
    signs: chineseZodiacSigns,
    specificDate: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--today': config.mode = 'today'; break;
      case '--tomorrow': config.mode = 'tomorrow'; break;
      case '--yesterday': config.mode = 'yesterday'; break;
      case '--daily-only': config.types = ['daily']; break;
      case '--weekly-only': config.types = ['weekly']; break;
      case '--yearly-only': config.types = ['yearly']; break;
      case '--date':
        if (i + 1 < args.length) {
          config.specificDate = args[i + 1];
          i++;
        }
        break;
      case '--sign':
        if (i + 1 < args.length) {
          const sign = args[i + 1].toLowerCase();
          if (chineseZodiacSigns.includes(sign)) { 
            config.signs = [sign]; 
            i++; 
          }
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
        console.warn(`⚠️  [429] Rate limit. Waiting ${Math.round(waitTime/1000)}s...`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }

      if (response.ok) {
        console.log(`✅ [${dayjs().format('HH:mm:ss')}] API Response Received.`);
        return response;
      }
      
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    } catch (error) {
      console.error(`❌ [${dayjs().format('HH:mm:ss')}] Error: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, Math.pow(2, i) * baseDelay));
    }
  }
}

async function generateBatch(type, config) {
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  const targetDate = config.specificDate || dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  const weekStart = dayjs(targetDate).startOf('week').format('YYYY-MM-DD');
  const weekEnd = dayjs(targetDate).endOf('week').format('YYYY-MM-DD');
  const currentYear = dayjs(targetDate).year();

  console.log(`📝 Preparing ${type.toUpperCase()} prompt for all 12 signs...`);
  
  let promptText, responseSchema;

  if (type === 'daily' || type === 'weekly') {
    const dateInfo = type === 'daily' 
      ? `${targetDate} (${dayjs(targetDate).format('dddd')})`
      : `week starting ${weekStart} and ending ${weekEnd}`;

    promptText = `Generate detailed BILINGUAL (Chinese and English) ${type} Chinese horoscopes for ALL 12 zodiac signs for ${dateInfo}.

Return a JSON array with EXACTLY 12 objects (one per sign: rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig).

Each object must have this EXACT structure:
{
  "sign": "rat",
  "horoscope": "Chinese text...",
  "horoscope_en": "English text...",
  "money": "Chinese text...",
  "money_en": "English text...",
  "social": "Chinese text...",
  "social_en": "English text...",
  "career": "Chinese text...",
  "career_en": "English text...",
  "love": "Chinese text...",
  "love_en": "English text...",
  "lucky_color": "红色",
  "lucky_color_en": "Red",
  "lucky_number": "8",
  "lucky_number_en": "Eight",
  "lucky_number_cn": "八"
}`;

    responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sign: { type: "STRING" },
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
        required: ["sign", "horoscope", "horoscope_en", "money", "money_en", "social", "social_en",
                   "career", "career_en", "love", "love_en", "lucky_color", "lucky_color_en",
                   "lucky_number", "lucky_number_en", "lucky_number_cn"]
      }
    };

  } else if (type === 'yearly') {
    promptText = `Generate detailed BILINGUAL (Chinese and English) YEARLY Chinese horoscopes for ALL 12 zodiac signs for the year ${currentYear}.

Return a JSON array with EXACTLY 12 objects (one per sign: rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig).

Each object must have this EXACT structure:
{
  "sign": "rat",
  "overview_content": "English overview...",
  "overview_content_cn": "Chinese overview...",
  "love_content": "English love...",
  "love_content_cn": "Chinese love...",
  "career_content": "English career...",
  "career_content_cn": "Chinese career...",
  "wealth_content": "English wealth...",
  "wealth_content_cn": "Chinese wealth...",
  "social_content": "English social...",
  "social_content_cn": "Chinese social...",
  "lucky_color": "Red",
  "lucky_color_cn": "红色",
  "lucky_number": "8",
  "lucky_number_cn": "八"
}`;

    responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sign: { type: "STRING" },
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
        required: ["sign", "overview_content", "overview_content_cn", "love_content", "love_content_cn",
                   "career_content", "career_content_cn", "wealth_content", "wealth_content_cn",
                   "social_content", "social_content_cn", "lucky_color", "lucky_color_cn",
                   "lucky_number", "lucky_number_cn"]
      }
    };
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    generationConfig: { 
      responseMimeType: "application/json",
      responseSchema
    }
  };

  const response = await fetchWithBackoff(geminiApiUrlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  
  // Parse response
  const candidate = result?.candidates?.[0];
  if (!candidate) {
    throw new Error(`No candidate in response: ${JSON.stringify(result)}`);
  }

  let jsonText = candidate.content?.parts?.[0]?.text;
  if (!jsonText) {
    console.error('Full result:', JSON.stringify(result, null, 2));
    throw new Error('No text in response');
  }

  let parsed = JSON.parse(jsonText);
  
  // Handle if wrapped in object
  if (!Array.isArray(parsed)) {
    if (parsed.horoscopes) parsed = parsed.horoscopes;
    else if (parsed.data) parsed = parsed.data;
  }
  
  if (!Array.isArray(parsed)) {
    throw new Error('Response is not an array');
  }

  console.log(`📊 Parsed ${parsed.length} signs from API response.`);

  // Add date info to each sign
  return parsed.map(item => ({
    ...item,
    forDate: targetDate,
    startDate: weekStart,
    endDate: weekEnd,
    year: currentYear
  }));
}

async function syncChineseHoroscopes() {
  const config = parseArgs();
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  const targetDate = config.specificDate || dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  
  console.log(`\n🚀 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] STARTING BATCH SYNC`);
  console.log(`📅 Target Date: ${targetDate} | Types: ${config.types.join(', ')}\n`);

  try {
    for (const type of config.types) {
      console.log(`\n=== Processing ${type.toUpperCase()} ===`);
      const results = await generateBatch(type, config);
      const transaction = sanityClient.transaction();
      let count = 0;

      results.forEach(d => {
        if (!config.signs.includes(d.sign)) return;

        let doc;
        if (type === 'daily') {
          doc = {
            _type: 'dailyChineseHoroscope',
            _id: `daily-${d.sign}-${d.forDate}`,
            sign: d.sign,
            forDate: d.forDate,
            horoscope: d.horoscope,
            horoscopeEn: d.horoscope_en,
            money: d.money,
            moneyEn: d.money_en,
            social: d.social,
            socialEn: d.social_en,
            career: d.career,
            careerEn: d.career_en,
            love: d.love,
            loveEn: d.love_en,
            luckyColor: d.lucky_color,
            luckyColorEn: d.lucky_color_en,
            luckyNumber: d.lucky_number,
            luckyNumberEn: d.lucky_number_en
          };
        } else if (type === 'weekly') {
          doc = {
            _type: 'weeklyChineseHoroscope',
            _id: `weekly-${d.sign}-${d.startDate}`,
            sign: d.sign,
            startDate: d.startDate,
            endDate: d.endDate,
            horoscope: d.horoscope,
            horoscopeEn: d.horoscope_en,
            money: d.money,
            moneyEn: d.money_en,
            social: d.social,
            socialEn: d.social_en,
            career: d.career,
            careerEn: d.career_en,
            love: d.love,
            loveEn: d.love_en,
            luckyColor: d.lucky_color,
            luckyColorEn: d.lucky_color_en,
            luckyNumber: d.lucky_number,
            luckyNumberEn: d.lucky_number_en
          };
        } else if (type === 'yearly') {
          doc = {
            _type: 'yearlyChineseHoroscope',
            _id: `yearly-${d.sign}-${d.year}`,
            sign: d.sign,
            year: d.year,
            overviewContent: d.overview_content,
            overviewContentCn: d.overview_content_cn,
            loveContent: d.love_content,
            loveContentCn: d.love_content_cn,
            careerContent: d.career_content,
            careerContentCn: d.career_content_cn,
            wealthContent: d.wealth_content,
            wealthContentCn: d.wealth_content_cn,
            socialContent: d.social_content,
            socialContentCn: d.social_content_cn,
            luckyColor: d.lucky_color,
            luckyColorCn: d.lucky_color_cn,
            luckyNumber: d.lucky_number,
            luckyNumberCn: d.lucky_number_cn
          };
        }

        if (doc) {
          transaction.createOrReplace(doc);
          count++;
          console.log(`   ✓ ${d.sign.toUpperCase()}`);
        }
      });

      console.log(`\n💾 Committing ${count} ${type} documents to Sanity...`);
      await transaction.commit();
      console.log(`✨ Successfully synced ${type.toUpperCase()} batch.\n`);
    }
  } catch (error) {
    console.error(`\n💥 SYNC FAILED: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
  
  console.log(`🏆 [${dayjs().format('HH:mm:ss')}] ALL TASKS COMPLETED.\n`);
}

syncChineseHoroscopes();