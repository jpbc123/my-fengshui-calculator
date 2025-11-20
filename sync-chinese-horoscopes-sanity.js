// sync-chinese-horoscopes-sanity.js - Updated to use Gemini 2.5 Flash
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

// Use gemini-2.5-flash which is the current supported model
const geminiApiUrlBase = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

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
 * These declarations **exactly** match the schemas you requested.
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

/**
 * Generate horoscope using function-calling so the model returns JSON
 * that strictly matches the schema. Returns a JS object matching your
 * existing script's expectations.
 */
async function generateHoroscope(sign, period, type, config) {
  let promptText;
  let identifier;
  let targetDate, targetWeekStart, targetWeekEnd, targetDayName;

  // Calculate target dates based on mode
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  
  const currentYear = dayjs().year();
  targetDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  targetWeekStart = dayjs().add(dayOffset, 'day').startOf('week').format('YYYY-MM-DD');
  targetWeekEnd = dayjs().add(dayOffset, 'day').endOf('week').format('YYYY-MM-DD');
  targetDayName = dayjs().add(dayOffset, 'day').format('dddd');

  // Build natural language prompt — the model will be instructed to call a function with exact JSON
  if (type === 'daily') {
    identifier = targetDate;
    promptText = `You are a helpful bilingual (Chinese and English) horoscope writer.
Please generate a detailed DAILY Chinese horoscope for the ${sign} sign for ${targetDate} (${targetDayName}).
Provide content in Chinese and English for these categories: horoscope, money, social, career, love.
Also provide a lucky color and lucky number in both Chinese and English.
Do not write any commentary outside the JSON. Instead, call the function named "daily_horoscope" with arguments that are valid JSON matching this exact schema:
{
  "horoscope": "...", "horoscope_en": "...",
  "money": "...", "money_en": "...",
  "social": "...", "social_en": "...",
  "career": "...", "career_en": "...",
  "love": "...", "love_en": "...",
  "lucky_color": "...", "lucky_color_en": "...",
  "lucky_number": "...", "lucky_number_en": "...",
  "lucky_number_cn": "..."
}
Use concise, natural language; ensure both language versions are consistent in meaning.`;
  } else if (type === 'weekly') {
    identifier = targetWeekStart;
    promptText = `You are a helpful bilingual (Chinese and English) horoscope writer.
Please generate a detailed WEEKLY Chinese horoscope for the ${sign} sign for the week starting ${targetWeekStart} and ending ${targetWeekEnd}.
Provide content in Chinese and English for these categories: horoscope, money, social, career, love.
Also provide a lucky color and lucky number in both Chinese and English.
Do not write any commentary outside the JSON. Instead, call the function named "weekly_horoscope" with arguments that are valid JSON matching this exact schema:
{
  "horoscope": "...", "horoscope_en": "...",
  "money": "...", "money_en": "...",
  "social": "...", "social_en": "...",
  "career": "...", "career_en": "...",
  "love": "...", "love_en": "...",
  "lucky_color": "...", "lucky_color_en": "...",
  "lucky_number": "...", "lucky_number_en": "...",
  "lucky_number_cn": "..."
}
Use concise, natural language; ensure both language versions are consistent in meaning.`;
  } else if (type === 'yearly') {
    identifier = currentYear;
    promptText = `You are a helpful bilingual (Chinese and English) horoscope writer.
Please generate a detailed YEARLY Chinese horoscope for the ${sign} sign for the year ${currentYear}.
Provide Chinese and English for overview, love, career, wealth, and social.
Also provide a lucky color and lucky number in both Chinese and English.
Do not write any commentary outside the JSON. Instead, call the function named "yearly_horoscope" with arguments that are valid JSON matching this exact schema:
{
  "overview_content": "...", "overview_content_cn": "...",
  "love_content": "...", "love_content_cn": "...",
  "career_content": "...", "career_content_cn": "...",
  "wealth_content": "...", "wealth_content_cn": "...",
  "social_content": "...", "social_content_cn": "...",
  "lucky_color": "...", "lucky_color_cn": "...",
  "lucky_number": "...", "lucky_number_cn": "..."
}
Use concise, natural language; ensure both language versions are consistent in meaning.`;
  }

  // Build the payload using the tools/function-calling interface
  const functionDeclarations = createFunctionDeclarations();

  const functionName =
    type === 'daily' ? 'daily_horoscope' :
    type === 'weekly' ? 'weekly_horoscope' :
    'yearly_horoscope';

  const payload = {
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.0,
      maxOutputTokens: 1600
    },
    // Tools: declare the function schemas for structured output
    tools: [
      {
        function_declarations: functionDeclarations
      }
    ],
    // Instruct the model which function it should call (only allow the specific one for this request)
    toolConfig: {
      function_calling_config: {
        mode: "ANY",
        allowed_function_names: [functionName]
      }
    }
  };

  // POST to the v1beta endpoint
  const response = await fetchWithBackoff(geminiApiUrlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  /**
   * The model should return a function call. Different responses may place
   * the function_call in different nesting, so we look for it in a few places:
   *
   * Typical successful structure:
   * result.candidates[0].content -> array of content pieces, one of which contains a function_call object:
   * { function_call: { name: "...", arguments: "{\"key\":\"value\"}" } }
   *
   * Some older/other responses may put JSON text into content.parts[0].text, so we handle that too.
   */
  const candidate = result?.candidates?.[0] || null;

  if (!candidate) {
    throw new Error(`No candidate returned from model: ${JSON.stringify(result)}`);
  }

  // Try to find a function_call inside content array
  let functionCallObj = null;
  
  // First check if content.parts exists directly
  if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
    for (const part of candidate.content.parts) {
      if (part && part.functionCall) {
        functionCallObj = part.functionCall;
        break;
      }
      if (part && part.function_call) {
        functionCallObj = part.function_call;
        break;
      }
    }
  }
  
  // Fallback: check if content is array
  if (!functionCallObj && Array.isArray(candidate.content)) {
    for (const piece of candidate.content) {
      if (piece && piece.function_call) {
        functionCallObj = piece.function_call;
        break;
      }
      if (piece && piece.functionCall) {
        functionCallObj = piece.functionCall;
        break;
      }
      // Sometimes it's nested as content.parts[0].function_call
      if (piece && Array.isArray(piece.parts)) {
        for (const p of piece.parts) {
          if (p && p.function_call) {
            functionCallObj = p.function_call;
            break;
          }
          if (p && p.functionCall) {
            functionCallObj = p.functionCall;
            break;
          }
        }
        if (functionCallObj) break;
      }
    }
  }

  // Fallback: some responses may put the final text under content.parts[0].text
  let jsonResponseText = null;
  if (functionCallObj && functionCallObj.args) {
    // In newer models, it's 'args' (already an object, not a string)
    jsonResponseText = typeof functionCallObj.args === 'string' 
      ? functionCallObj.args 
      : JSON.stringify(functionCallObj.args);
  } else if (functionCallObj && functionCallObj.arguments) {
    // arguments may already be a JSON string
    jsonResponseText = functionCallObj.arguments;
  } else if (Array.isArray(candidate.content) && candidate.content[0] && candidate.content[0].parts && candidate.content[0].parts[0]) {
    // try the plain text fallback
    const part = candidate.content[0].parts[0];
    if (part.functionCall && part.functionCall.args) {
      jsonResponseText = typeof part.functionCall.args === 'string' 
        ? part.functionCall.args 
        : JSON.stringify(part.functionCall.args);
    } else {
      jsonResponseText = part.text;
    }
  } else if (candidate.content && typeof candidate.content === 'string') {
    jsonResponseText = candidate.content;
  }

  if (!jsonResponseText) {
    console.error('Debug - Full result:', JSON.stringify(result, null, 2));
    console.error('Debug - Candidate structure:', JSON.stringify(candidate, null, 2));
    throw new Error(`No function_call.args/arguments or text response found in model result`);
  }

  // If arguments is a JSON string, parse it.
  let parsedData;
  try {
    parsedData = typeof jsonResponseText === 'string' ? JSON.parse(jsonResponseText) : jsonResponseText;
  } catch (err) {
    // If parse fails, try to recover by cleaning common issues (like starting/ending backticks)
    let cleaned = jsonResponseText.trim();
    // Remove triple/back ticks
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    try {
      parsedData = JSON.parse(cleaned);
    } catch (err2) {
      throw new Error(`Failed to parse JSON from model output. Raw output: ${jsonResponseText}. Error: ${err2.message}`);
    }
  }

  // Map parsed data to your expected return shape
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
    forDate: targetDate,
    startDate: targetWeekStart,
    endDate: targetWeekEnd
  };
}

async function syncChineseHoroscopes() {
  const config = parseArgs();
  
  const modeDisplay = config.mode === 'today' ? 'TODAY' : config.mode === 'tomorrow' ? 'TOMORROW' : 'YESTERDAY';
  const dayOffset = config.mode === 'today' ? 0 : config.mode === 'tomorrow' ? 1 : -1;
  const targetDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  const targetDay = dayjs().add(dayOffset, 'day').format('dddd');
  
  console.log(`🚀 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Chinese horoscope sync for ${modeDisplay}: ${targetDate} (${targetDay})`);
  console.log(`📊 Generating ${config.types.join(', ')} content for ${config.signs.length} zodiac sign(s): ${config.signs.join(', ')}`);

  for (const sign of config.signs) {
    const transaction = sanityClient.transaction();

    try {
      console.log(`🐉 [${dayjs().format('HH:mm:ss')}] Processing ${sign.toUpperCase()}...`);

      // Daily
      if (config.types.includes('daily')) {
        const dailyData = await generateHoroscope(sign, 'daily', 'daily', config);
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
        console.log(`   ✅ Daily horoscope prepared for ${dailyData.forDate}`);
      }

      // Weekly
      if (config.types.includes('weekly')) {
        const weeklyData = await generateHoroscope(sign, 'weekly', 'weekly', config);
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
        console.log(`   ✅ Weekly horoscope prepared (${weeklyData.startDate} to ${weeklyData.endDate})`);
      }

      // Yearly
      if (config.types.includes('yearly')) {
        const yearlyData = await generateHoroscope(sign, 'yearly', 'yearly', config);
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
        console.log(`   ✅ Yearly horoscope prepared for ${yearlyData.year}`);
      }
  
      await transaction.commit();
      console.log(`🎉 [${dayjs().format('HH:mm:ss')}] Successfully synced selected horoscopes for ${sign.toUpperCase()}`);

      // Add delay between signs to avoid rate limiting
      await delay(2000);
      
    } catch (error) {
      console.error(`💥 [${dayjs().format('HH:mm:ss')}] Failed to sync ${sign.toUpperCase()}:`, error.message || error);
    }
  }

  console.log(`🏆 [${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Chinese horoscope sync completed! Content prepared for ${targetDate} (${targetDay})`);
}

syncChineseHoroscopes();