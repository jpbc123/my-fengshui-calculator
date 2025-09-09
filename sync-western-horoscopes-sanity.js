// sync-western-horoscopes-sanity.js - Enhanced with command line parameters (matching Chinese sync)
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
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

const westernZodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

// Parse command line arguments (matching Chinese sync)
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'tomorrow', // default
    types: ['daily', 'weekly', 'yearly'], // default all types
    signs: westernZodiacSigns // default all signs
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
          if (westernZodiacSigns.includes(sign)) {
            config.signs = [sign];
            i++; // skip next arg since we used it
          } else {
            console.error(`Invalid sign: ${args[i + 1]}. Valid signs: ${westernZodiacSigns.join(', ')}`);
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
Western Horoscope Sync Script

Usage: node sync-western-horoscopes-sanity.js [OPTIONS]

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
  Valid signs: ${westernZodiacSigns.join(', ')}

Examples:
  node sync-western-horoscopes-sanity.js --today
  node sync-western-horoscopes-sanity.js --tomorrow --daily-only
  node sync-western-horoscopes-sanity.js --today --sign aries
  node sync-western-horoscopes-sanity.js --weekly-only --sign leo
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

async function generateHoroscope(sign, period, type, config) {
  let promptText;
  let identifier;
  let responseSchema;
  let targetDate, targetWeekStart, targetWeekEnd, targetDayName;

  // Calculate target dates based on mode (matching Chinese sync logic)
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  
  const currentYear = dayjs().year();
  targetDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  targetWeekStart = dayjs().add(dayOffset, 'day').startOf('week').format('YYYY-MM-DD');
  targetWeekEnd = dayjs().add(dayOffset, 'day').endOf('week').format('YYYY-MM-DD');
  targetDayName = dayjs().add(dayOffset, 'day').format('dddd');

  if (type === 'daily') {
    promptText = `Generate a detailed daily Western horoscope for the ${sign} sign for ${targetDate} (${targetDayName}).
    Cover the following categories: horoscope, money, social, career, love.
    Also provide a lucky color and lucky number.
    Format as a JSON object with these exact keys:
    {
      "horoscope": "General daily forecast...",
      "money": "Financial outlook...",
      "social": "Social interactions...",
      "career": "Career outlook...",
      "love": "Love forecast...",
      "luckyColor": "Blue",
      "luckyNumber": 7
    }`;
    identifier = targetDate;

    responseSchema = {
      type: "OBJECT",
      properties: {
        horoscope: { type: "STRING" },
        money: { type: "STRING" },
        social: { type: "STRING" },
        career: { type: "STRING" },
        love: { type: "STRING" },
        luckyColor: { type: "STRING" },
        luckyNumber: { type: "STRING" }
      },
      required: ["horoscope", "money", "social", "career", "love", "luckyColor", "luckyNumber"]
    };

  } else if (type === 'weekly') {
    promptText = `Generate a detailed weekly Western horoscope for the ${sign} sign for the week starting ${targetWeekStart} and ending ${targetWeekEnd}.
    Cover the following categories: horoscope, money, social, career, love.
    Also provide a lucky color and lucky number.
    Format as a JSON object with these exact keys:
    {
      "horoscope": "General weekly forecast...",
      "money": "Financial outlook...",
      "social": "Social interactions...",
      "career": "Career outlook...",
      "love": "Love forecast...",
      "luckyColor": "Green",
      "luckyNumber": 3
    }`;
    identifier = targetWeekStart;

    responseSchema = {
      type: "OBJECT",
      properties: {
        horoscope: { type: "STRING" },
        money: { type: "STRING" },
        social: { type: "STRING" },
        career: { type: "STRING" },
        love: { type: "STRING" },
        luckyColor: { type: "STRING" },
        luckyNumber: { type: "STRING" }
      },
      required: ["horoscope", "money", "social", "career", "love", "luckyColor", "luckyNumber"]
    };

  } else if (type === 'yearly') {
    promptText = `Generate a detailed yearly Western horoscope for the ${sign} sign for the year ${currentYear}.
    Provide comprehensive content for: overview, love, career, wealth, and social.
    Also provide a lucky color and lucky number.
    Format as a JSON object with these exact keys:
    {
      "overviewContent": "Detailed yearly overview...",
      "loveContent": "Yearly love forecast...",
      "careerContent": "Career outlook for the year...",
      "wealthContent": "Financial prospects...",
      "socialContent": "Social interactions and networking...",
      "luckyColor": "Red",
      "luckyNumber": 9
    }`;
    identifier = currentYear;

    responseSchema = {
      type: "OBJECT",
      properties: {
        overviewContent: { type: "STRING" },
        loveContent: { type: "STRING" },
        careerContent: { type: "STRING" },
        wealthContent: { type: "STRING" },
        socialContent: { type: "STRING" },
        luckyColor: { type: "STRING" },
        luckyNumber: { type: "STRING" }
      },
      required: ["overviewContent", "loveContent", "careerContent", "wealthContent", "socialContent", "luckyColor", "luckyNumber"]
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
      overviewContent: parsedData.overviewContent,
      loveContent: parsedData.loveContent,
      careerContent: parsedData.careerContent,
      wealthContent: parsedData.wealthContent,
      socialContent: parsedData.socialContent,
      luckyColor: parsedData.luckyColor,
      luckyNumber: parsedData.luckyNumber
    };
  }

  // Daily + Weekly
  return {
    ...parsedData,
    forDate: targetDate,
    startDate: targetWeekStart,
    endDate: targetWeekEnd
  };
}

async function syncWesternHoroscopes() {
  const config = parseArgs();
  
  const modeDisplay = config.mode === 'today' ? 'TODAY' : config.mode === 'tomorrow' ? 'TOMORROW' : 'YESTERDAY';
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  const targetDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  const targetDay = dayjs().add(dayOffset, 'day').format('dddd');
  
  console.log(`🚀 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Western horoscope sync for ${modeDisplay}: ${targetDate} (${targetDay})`);
  console.log(`📊 Generating ${config.types.join(', ')} content for ${config.signs.length} zodiac sign(s): ${config.signs.join(', ')}`);

  for (const sign of config.signs) {
    const transaction = sanityClient.transaction();

    try {
      console.log(`⭐ [${dayjs().format('HH:mm:ss')}] Processing ${sign.toUpperCase()}...`);

      // Daily
      if (config.types.includes('daily')) {
        const dailyData = await generateHoroscope(sign, 'daily', 'daily', config);
        const dailyDoc = {
          _type: 'dailyWesternHoroscope',
          _id: `daily-${sign}-${dailyData.forDate}`,
          sign: sign,
          forDate: dailyData.forDate,
          horoscope: dailyData.horoscope,
          money: dailyData.money,
          social: dailyData.social,
          career: dailyData.career,
          love: dailyData.love,
          luckyColor: dailyData.luckyColor,
          luckyNumber: dailyData.luckyNumber
        };
        transaction.createOrReplace(dailyDoc);
        console.log(`   ✅ Daily horoscope prepared for ${dailyData.forDate}`);
      }

      // Weekly
      if (config.types.includes('weekly')) {
        const weeklyData = await generateHoroscope(sign, 'weekly', 'weekly', config);
        const weeklyDoc = {
          _type: 'weeklyWesternHoroscope',
          _id: `weekly-${sign}-${weeklyData.startDate}`,
          sign: sign,
          startDate: weeklyData.startDate,
          endDate: weeklyData.endDate,
          horoscope: weeklyData.horoscope,
          money: weeklyData.money,
          social: weeklyData.social,
          career: weeklyData.career,
          love: weeklyData.love,
          luckyColor: weeklyData.luckyColor,
          luckyNumber: weeklyData.luckyNumber
        };
        transaction.createOrReplace(weeklyDoc);
        console.log(`   ✅ Weekly horoscope prepared (${weeklyData.startDate} to ${weeklyData.endDate})`);
      }

      // Yearly
      if (config.types.includes('yearly')) {
        const yearlyData = await generateHoroscope(sign, 'yearly', 'yearly', config);
        const yearlyDoc = {
          _type: 'yearlyWesternHoroscope',
          _id: `yearly-${sign}-${yearlyData.year}`,
          sign: sign,
          year: yearlyData.year,
          overviewContent: yearlyData.overviewContent,
          loveContent: yearlyData.loveContent,
          careerContent: yearlyData.careerContent,
          wealthContent: yearlyData.wealthContent,
          socialContent: yearlyData.socialContent,
          luckyColor: yearlyData.luckyColor,
          luckyNumber: yearlyData.luckyNumber
        };
        transaction.createOrReplace(yearlyDoc);
        console.log(`   ✅ Yearly horoscope prepared for ${yearlyData.year}`);
      }
  
      await transaction.commit();
      console.log(`🎉 [${dayjs().format('HH:mm:ss')}] Successfully synced selected horoscopes for ${sign.toUpperCase()}`);
      
      // Add delay between signs to avoid rate limiting
      await delay(2000);
      
    } catch (error) {
      console.error(`💥 [${dayjs().format('HH:mm:ss')}] Failed to sync ${sign.toUpperCase()}:`, error.message);
    }
  }

  console.log(`🏆 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Western horoscope sync completed! Content prepared for ${targetDate} (${targetDay})`);
}

syncWesternHoroscopes();