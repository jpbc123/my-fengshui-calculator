// sync-chinese-horoscopes-sanity.js - Updated to use Gemini 2.5 Flash-Lite
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

/**
 * UPDATED: Pointing to the stable gemini-2.5-flash-lite model.
 * This model provides a higher free-tier quota (30 RPM / 1,000 RPD) 
 * to handle batch generation without 429 errors.
 */
const geminiApiUrlBase = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}`;

const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
];

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'tomorrow', // default
    types: ['daily', 'weekly', 'yearly'], // default all types
    signs: chineseZodiacSigns // default all signs
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--today':
        config.mode = 'today';
        break;
      case '--tomorrow':
        config.mode = 'tomorrow';
        break;
      case '--yesterday':
        config.mode = 'yesterday';
        break;
      case '--daily-only':
        config.types = ['daily'];
        break;
      case '--weekly-only':
        config.types = ['weekly'];
        break;
      case '--yearly-only':
        config.types = ['yearly'];
        break;
      case '--sign':
        if (i + 1 < args.length) {
          const sign = args[i + 1].toLowerCase();
          if (chineseZodiacSigns.includes(sign)) {
            config.signs = [sign];
            i++; // skip next arg since we used it
          } else {
            console.error(`Invalid sign: ${args[i + 1]}. Valid signs: ${chineseZodiacSigns.join(', ')}`);
            process.exit(1);
          }
        }
        break;
      case '--help':
        showHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}. Use --help for usage information.`);
        process.exit(1);
    }
  }

  return config;
}

function showHelp() {
  console.log(`
Chinese Horoscope Sync Script

Usage: node sync-chinese-horoscopes-sanity.js [OPTIONS]

Date Options (choose one):
  --today       Generate horoscopes for today's date
  --tomorrow    Generate horoscopes for tomorrow's date (default)
  --yesterday   Generate horoscopes for yesterday's date

Type Options (choose one):
  --daily-only   Generate only daily horoscopes
  --weekly-only  Generate only weekly horoscopes  
  --yearly-only  Generate only yearly horoscopes
  (default: generates all types)

Sign Options:
  --sign [SIGN]  Generate for specific zodiac sign only
  (default: generates for all signs)
  Valid signs: ${chineseZodiacSigns.join(', ')}

Examples:
  node sync-chinese-horoscopes-sanity.js --today
  node sync-chinese-horoscopes-sanity.js --tomorrow --daily-only
  node sync-chinese-horoscopes-sanity.js --today --sign rat
  node sync-chinese-horoscopes-sanity.js --weekly-only --sign dragon
  `);
}

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

/**
 * Build function declarations for the model's function-calling interface.
 */
function createFunctionDeclarations() {
  const dailyAndWeeklyParams = {
    type: "object",
    properties: {
      horoscope: { type: "string" },
      horoscope_en: { type: "string" },
      money: { type: "string" },
      money_en: { type: "string" },
      social: { type: "string" },
      social_en: { type: "string" },
      career: { type: "string" },
      career_en: { type: "string" },
      love: { type: "string" },
      love_en: { type: "string" },
      lucky_color: { type: "string" },
      lucky_color_en: { type: "string" },
      lucky_number: { type: "string" },
      lucky_number_en: { type: "string" },
      lucky_number_cn: { type: "string" }
    },
    required: ["horoscope","horoscope_en","money","money_en","social","social_en",
               "career","career_en","love","love_en","lucky_color","lucky_color_en",
               "lucky_number","lucky_number_en","lucky_number_cn"]
  };

  const yearlyParams = {
    type: "object",
    properties: {
      overview_content: { type: "string" },
      overview_content_cn: { type: "string" },
      love_content: { type: "string" },
      love_content_cn: { type: "string" },
      career_content: { type: "string" },
      career_content_cn: { type: "string" },
      wealth_content: { type: "string" },
      wealth_content_cn: { type: "string" },
      social_content: { type: "string" },
      social_content_cn: { type: "string" },
      lucky_color: { type: "string" },
      lucky_color_cn: { type: "string" },
      lucky_number: { type: "string" },
      lucky_number_cn: { type: "string" }
    },
    required: ["overview_content","overview_content_cn","love_content","love_content_cn",
               "career_content","career_content_cn","wealth_content","wealth_content_cn",
               "social_content","social_content_cn","lucky_color","lucky_color_cn",
               "lucky_number","lucky_number_cn"]
  };

  return [
    {
      name: "daily_horoscope",
      description: "Daily Chinese horoscope result in both Chinese and English (exact schema).",
      parameters: dailyAndWeeklyParams
    },
    {
      name: "weekly_horoscope",
      description: "Weekly Chinese horoscope result in both Chinese and English (exact schema).",
      parameters: dailyAndWeeklyParams
    },
    {
      name: "yearly_horoscope",
      description: "Yearly Chinese horoscope result in both Chinese and English (exact schema).",
      parameters: yearlyParams
    }
  ];
}

async function generateHoroscope(sign, period, type, config) {
  let promptText;
  let identifier;
  let targetDate, targetWeekStart, targetWeekEnd, targetDayName;

  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  const currentYear = dayjs().year();
  targetDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  targetWeekStart = dayjs().add(dayOffset, 'day').startOf('week').format('YYYY-MM-DD');
  targetWeekEnd = dayjs().add(dayOffset, 'day').endOf('week').format('YYYY-MM-DD');
  targetDayName = dayjs().add(dayOffset, 'day').format('dddd');

  if (type === 'daily') {
    identifier = targetDate;
    promptText = `You are a helpful bilingual (Chinese and English) horoscope writer.
Please generate a detailed DAILY Chinese horoscope for the ${sign} sign for ${targetDate} (${targetDayName}).
Provide content in Chinese and English for: horoscope, money, social, career, love.
Also provide a lucky color and lucky number in both languages.
Call function "daily_horoscope".`;
  } else if (type === 'weekly') {
    identifier = targetWeekStart;
    promptText = `You are a helpful bilingual (Chinese and English) horoscope writer.
Please generate a detailed WEEKLY Chinese horoscope for the ${sign} sign for ${targetWeekStart} to ${targetWeekEnd}.
Provide content in Chinese and English for: horoscope, money, social, career, love.
Call function "weekly_horoscope".`;
  } else if (type === 'yearly') {
    identifier = currentYear;
    promptText = `You are a helpful bilingual (Chinese and English) horoscope writer.
Please generate a detailed YEARLY Chinese horoscope for the ${sign} sign for the year ${currentYear}.
Provide Chinese and English for: overview, love, career, wealth, and social.
Call function "yearly_horoscope".`;
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    tools: [{ function_declarations: createFunctionDeclarations() }],
    toolConfig: {
      function_calling_config: {
        mode: "ANY",
        allowed_function_names: [type === 'daily' ? 'daily_horoscope' : type === 'weekly' ? 'weekly_horoscope' : 'yearly_horoscope']
      }
    }
  };

  const response = await fetchWithBackoff(geminiApiUrlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  const candidate = result?.candidates?.[0];
  if (!candidate) throw new Error(`No candidate returned: ${JSON.stringify(result)}`);

  let functionCallObj = null;
  if (candidate.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.functionCall || part.function_call) {
        functionCallObj = part.functionCall || part.function_call;
        break;
      }
    }
  }

  if (!functionCallObj) throw new Error("No function_call found in result");

  const parsedData = typeof functionCallObj.args === 'string' 
    ? JSON.parse(functionCallObj.args) 
    : functionCallObj.args;

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

  return {
    ...parsedData,
    forDate: targetDate,
    startDate: targetWeekStart,
    endDate: targetWeekEnd
  };
}

async function syncChineseHoroscopes() {
  const config = parseArgs();
  const targetDate = dayjs().add(config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1, 'day').format('YYYY-MM-DD');
  
  console.log(`🚀 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Chinese horoscope sync for ${config.mode.toUpperCase()}: ${targetDate}`);

  for (const sign of config.signs) {
    const transaction = sanityClient.transaction();
    try {
      console.log(`🐉 Processing ${sign.toUpperCase()}...`);

      if (config.types.includes('daily')) {
        const dailyData = await generateHoroscope(sign, 'daily', 'daily', config);
        transaction.createOrReplace({
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
        });
        console.log(`   ✅ Daily horoscope prepared`);
      }

      if (config.types.includes('weekly')) {
        const weeklyData = await generateHoroscope(sign, 'weekly', 'weekly', config);
        transaction.createOrReplace({
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
        });
        console.log(`   ✅ Weekly horoscope prepared`);
      }

      if (config.types.includes('yearly')) {
        const yearlyData = await generateHoroscope(sign, 'yearly', 'yearly', config);
        transaction.createOrReplace({
          _type: 'yearlyChineseHoroscope',
          _id: `yearly-${sign}-${yearlyData.year}`,
          sign: sign,
          year: yearlyData.year,
          ...yearlyData
        });
        console.log(`   ✅ Yearly horoscope prepared`);
      }
  
      await transaction.commit();
      console.log(`🎉 Successfully synced ${sign.toUpperCase()}`);
      await delay(2000);
      
    } catch (error) {
      console.error(`💥 Failed ${sign.toUpperCase()}:`, error.message);
    }
  }
}

syncChineseHoroscopes();