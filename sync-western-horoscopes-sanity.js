// sync-western-horoscopes-sanity.js - Fixed Batch Version
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
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

const westernZodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'tomorrow',
    types: ['daily'],
    signs: westernZodiacSigns,
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
          if (westernZodiacSigns.includes(sign)) { 
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

    promptText = `Generate detailed ${type} Western horoscopes for ALL 12 zodiac signs for ${dateInfo}.

Return a JSON array with EXACTLY 12 objects (one per sign: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces).

Each object must have this EXACT structure:
{
  "sign": "aries",
  "horoscope": "General forecast...",
  "money": "Financial outlook...",
  "social": "Social interactions...",
  "career": "Career outlook...",
  "love": "Love forecast...",
  "luckyColor": "Blue",
  "luckyNumber": "7"
}`;

    responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sign: { type: "STRING" },
          horoscope: { type: "STRING" },
          money: { type: "STRING" },
          social: { type: "STRING" },
          career: { type: "STRING" },
          love: { type: "STRING" },
          luckyColor: { type: "STRING" },
          luckyNumber: { type: "STRING" }
        },
        required: ["sign", "horoscope", "money", "social", "career", "love", "luckyColor", "luckyNumber"]
      }
    };

  } else if (type === 'yearly') {
    promptText = `Generate detailed YEARLY Western horoscopes for ALL 12 zodiac signs for the year ${currentYear}.

Return a JSON array with EXACTLY 12 objects (one per sign: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces).

Each object must have this EXACT structure:
{
  "sign": "aries",
  "overviewContent": "Detailed yearly overview...",
  "loveContent": "Yearly love forecast...",
  "careerContent": "Career outlook for the year...",
  "wealthContent": "Financial prospects...",
  "socialContent": "Social interactions and networking...",
  "luckyColor": "Red",
  "luckyNumber": "9"
}`;

    responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sign: { type: "STRING" },
          overviewContent: { type: "STRING" },
          loveContent: { type: "STRING" },
          careerContent: { type: "STRING" },
          wealthContent: { type: "STRING" },
          socialContent: { type: "STRING" },
          luckyColor: { type: "STRING" },
          luckyNumber: { type: "STRING" }
        },
        required: ["sign", "overviewContent", "loveContent", "careerContent", "wealthContent", "socialContent", "luckyColor", "luckyNumber"]
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

  const response = await fetchWithBackoff(geminiApiUrl, {
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

async function syncWesternHoroscopes() {
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
            _type: 'dailyWesternHoroscope',
            _id: `daily-${d.sign}-${d.forDate}`,
            sign: d.sign,
            forDate: d.forDate,
            horoscope: d.horoscope,
            money: d.money,
            social: d.social,
            career: d.career,
            love: d.love,
            luckyColor: d.luckyColor,
            luckyNumber: d.luckyNumber
          };
        } else if (type === 'weekly') {
          doc = {
            _type: 'weeklyWesternHoroscope',
            _id: `weekly-${d.sign}-${d.startDate}`,
            sign: d.sign,
            startDate: d.startDate,
            endDate: d.endDate,
            horoscope: d.horoscope,
            money: d.money,
            social: d.social,
            career: d.career,
            love: d.love,
            luckyColor: d.luckyColor,
            luckyNumber: d.luckyNumber
          };
        } else if (type === 'yearly') {
          doc = {
            _type: 'yearlyWesternHoroscope',
            _id: `yearly-${d.sign}-${d.year}`,
            sign: d.sign,
            year: d.year,
            overviewContent: d.overviewContent,
            loveContent: d.loveContent,
            careerContent: d.careerContent,
            wealthContent: d.wealthContent,
            socialContent: d.socialContent,
            luckyColor: d.luckyColor,
            luckyNumber: d.luckyNumber
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

syncWesternHoroscopes();