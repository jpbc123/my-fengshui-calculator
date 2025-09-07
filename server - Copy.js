// server.js (backend server) - FIXED VERSION
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient as createSanityClient } from '@sanity/client';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Initialize Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Sanity client for READING and WRITING data
const sanityClient = createSanityClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    apiVersion: '2025-08-31',
    useCdn: false,
    //token: process.env.SANITY_WRITE_TOKEN,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

// In-memory cache to prevent duplicate requests
const requestCache = new Map();

// Define all Chinese zodiac signs for consistent generation and validation
const allChineseZodiacs = [
    "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse",
    "goat", "monkey", "rooster", "dog", "pig"
];

// Define all Western zodiac signs for consistent generation and validation
const allWesternZodiacs = [
    "aries", "taurus", "gemini", "cancer", "leo", "aquarius",
    "virgo", "libra", "scorpio", "sagittarius", "capricorn", "pisces"
];

// Helper function for exponential backoff for API calls
async function fetchWithBackoff(url, options, retries = 3, baseDelay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);

            if (response.status === 429 && i < retries - 1) {
                const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
                console.warn(`Rate limit hit (429), retrying in ${Math.round(delay / 1000)}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
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

            const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
            console.warn(`Retrying in ${Math.round(delay / 1000)}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("Maximum retries exceeded for API call.");
}

// Function to calculate start and end dates of the current week (Sunday to Saturday)
function getWeekDates(date = new Date()) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
        start: startOfWeek.toISOString().slice(0, 10),
        end: endOfWeek.toISOString().slice(0, 10)
    };
}

// Function to get a daily date with an optional offset
function getDailyDate(dayOffset = 0) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    return targetDate.toISOString().slice(0, 10);
}

// ------------------- ENDPOINT FOR CHINESE HOROSCOPES (DAILY, WEEKLY, YEARLY) - SANITY.IO VERSION -------------------
app.get('/api/chinese-horoscope/:zodiac', async (req, res) => {
    const { zodiac } = req.params;
    const period = req.query.period || 'daily';
    const dayOffset = parseInt(req.query.dayOffset || '0', 10);

    console.log("Chinese Horoscope API called:", zodiac, period, dayOffset);
     
    if (!allChineseZodiacs.includes(zodiac.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid Chinese zodiac sign provided.' });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    try {
        let dataToReturn = null;
        let docType;
        let query;
        let params;
        let identifierValue;
        let promptText;
        let generatedData;

        if (period === 'daily') {
            docType = 'dailyChineseHoroscope';
            identifierValue = getDailyDate(dayOffset);
            query = `*[_type == $docType && sign == $zodiac && forDate == $date][0]{
                ...,
                "for_date": forDate,
                "horoscope_en": horoscopeEn,
                "money_en": moneyEn,
                "social_en": socialEn,
                "career_en": careerEn,
                "love_en": loveEn,
                "lucky_color": luckyColor,
                "lucky_color_en": luckyColorEn,
                "lucky_number": luckyNumber,
                "lucky_number_en": luckyNumberEn
            }`;
            params = { docType, zodiac: zodiac.toLowerCase(), date: identifierValue };
        } else if (period === 'weekly') {
            docType = 'weeklyChineseHoroscope';
            const { start, end } = getWeekDates();
            identifierValue = start;
            query = `*[_type == $docType && sign == $zodiac && startDate == $startDate][0]{
                ...,
                "start_date": startDate,
                "end_date": endDate,
                "horoscope_en": horoscopeEn,
                "money_en": moneyEn,
                "social_en": socialEn,
                "career_en": careerEn,
                "love_en": loveEn,
                "lucky_color": luckyColor,
                "lucky_color_en": luckyColorEn,
                "lucky_number": luckyNumber,
                "lucky_number_en": luckyNumberEn
            }`;
            params = { docType, zodiac: zodiac.toLowerCase(), startDate: start };
        } else if (period === 'yearly') {
            docType = 'yearlyChineseHoroscope';
            identifierValue = new Date().getFullYear();
            query = `*[_type == $docType && sign == $zodiac && year == $year][0]{
                ...,
                "horoscope": overviewContent,
                "horoscope_en": overviewContent,
                "love": loveContent,
                "love_en": loveContent,
                "career": careerContent,
                "career_en": careerContent,
                "money": wealthContent,
                "money_en": wealthContent,
                "social": socialContent,
                "social_en": socialContent,
                "lucky_color": luckyColor,
                "lucky_color_en": luckyColor,
                "lucky_number": string(luckyNumber),
                "lucky_number_en": string(luckyNumber)
            }`;
            params = { docType, zodiac: zodiac.toLowerCase(), year: identifierValue };
        } else {
            return res.status(400).json({ error: 'Invalid period specified. Use "daily", "weekly", or "yearly".' });
        }

        console.log(`Checking Sanity for ${zodiac} ${period} horoscope...`);
        dataToReturn = await sanityClient.fetch(query, params);
        
        if (dataToReturn) {
            console.log(`${period} horoscope for ${zodiac} found in Sanity.`);
            return res.json(dataToReturn);
        }

        // Check cache before making API call
        const cacheKey = `${zodiac}-${period}-${identifierValue}`;
        if (requestCache.has(cacheKey)) {
            console.log(`Request for ${cacheKey} already in progress, waiting...`);
            return res.status(202).json({ message: 'Request in progress, please try again in a moment' });
        }

        requestCache.set(cacheKey, true);

        console.log(`${period} horoscope for ${zodiac} not found. Generating with Gemini API...`);

        if (period === 'daily') {
            promptText = `Generate a detailed daily Chinese horoscope for the ${zodiac} sign for ${identifierValue}. Cover the following categories in both English and Chinese. Ensure the Chinese content is natural and culturally appropriate, and the English content is clear and engaging. The tone should be positive, insightful, and comprehensive for each section.
            Provide the output as a JSON object with these exact keys:
            {
              "horoscope": "中文生肖运势", "horoscopeEn": "English horoscope",
              "money": "中文财运", "moneyEn": "English money outlook",
              "social": "中文人际关系", "socialEn": "English social outlook",
              "career": "中文事业运", "careerEn": "English career outlook",
              "love": "中文爱情运", "loveEn": "English love outlook",
              "luckyColor": "中文幸运颜色", "luckyColorEn": "English lucky color",
              "luckyNumber": "中文幸运数字", "luckyNumberEn": "English lucky number"
            }`;
        } else if (period === 'weekly') {
            const { start, end } = getWeekDates();
            promptText = `Generate a detailed general Chinese horoscope for the ${zodiac} sign for the current week (${start} to ${end}). Cover the following categories in both English and Chinese. Focus on a general outlook for the week. The tone should be positive, insightful, and comprehensive for each section.
            Provide the output as a JSON object with these exact keys:
            {
              "horoscope": "中文生肖运势", "horoscopeEn": "English horoscope",
              "money": "中文财运", "moneyEn": "English money outlook",
              "social": "中文人际关系", "socialEn": "English social outlook",
              "career": "中文事业运", "careerEn": "English career outlook",
              "love": "中文爱情运", "loveEn": "English love outlook",
              "luckyColor": "中文幸运颜色", "luckyColorEn": "English lucky color",
              "luckyNumber": "中文幸运数字", "luckyNumberEn": "English lucky number"
            }`;
        } else if (period === 'yearly') {
            promptText = `Generate a detailed general Chinese horoscope for the ${zodiac} sign for the current year ${identifierValue}. Provide comprehensive content in English only (we'll use the same content for both languages). Focus on a broad outlook for the entire year. The tone should be positive, insightful, and comprehensive for each section.
            Provide the output as a JSON object with these exact keys:
            {
              "overviewContent": "Detailed yearly overview for ${zodiac}...",
              "loveContent": "Yearly love and relationship forecast...",
              "careerContent": "Career and professional outlook for the year...",
              "wealthContent": "Financial and wealth prospects...",
              "socialContent": "Social interactions and friendships...",
              "luckyColor": "Red",
              "luckyNumber": 7
            }`;
        }

        const payload = {
            contents: [{ role: "user", parts: [{ text: promptText }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: period === 'yearly' ? {
                    type: "OBJECT",
                    properties: {
                        "overviewContent": { "type": "STRING" },
                        "loveContent": { "type": "STRING" },
                        "careerContent": { "type": "STRING" },
                        "wealthContent": { "type": "STRING" },
                        "socialContent": { "type": "STRING" },
                        "luckyColor": { "type": "STRING" },
                        "luckyNumber": { "type": "INTEGER" }
                    },
                    required: ["overviewContent", "loveContent", "careerContent", "wealthContent", "socialContent", "luckyColor", "luckyNumber"]
                } : {
                    type: "OBJECT",
                    properties: {
                        "horoscope": { "type": "STRING" },
                        "horoscopeEn": { "type": "STRING" },
                        "money": { "type": "STRING" },
                        "moneyEn": { "type": "STRING" },
                        "social": { "type": "STRING" },
                        "socialEn": { "type": "STRING" },
                        "career": { "type": "STRING" },
                        "careerEn": { "type": "STRING" },
                        "love": { "type": "STRING" },
                        "loveEn": { "type": "STRING" },
                        "luckyColor": { "type": "STRING" },
                        "luckyColorEn": { "type": "STRING" },
                        "luckyNumber": { "type": "STRING" },
                        "luckyNumberEn": { "type": "STRING" }
                    },
                    required: ["horoscope", "horoscopeEn", "money", "moneyEn", "social", "socialEn", "career", "careerEn", "love", "loveEn", "luckyColor", "luckyColorEn", "luckyNumber", "luckyNumberEn"]
                }
            }
        };

        try {
            const geminiResponse = await fetchWithBackoff(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const geminiResult = await geminiResponse.json();
            const jsonResponseText = geminiResult.candidates[0].content.parts[0].text;
            generatedData = JSON.parse(jsonResponseText);

            const documentToCreate = {
                _type: docType,
                sign: zodiac.toLowerCase(),
                ...generatedData
            };

            if (period === 'daily') {
                documentToCreate.forDate = identifierValue;
            } else if (period === 'weekly') {
                const { start, end } = getWeekDates();
                documentToCreate.startDate = start;
                documentToCreate.endDate = end;
            } else if (period === 'yearly') {
                documentToCreate.year = identifierValue;
            }

            console.log(`Creating new ${period} horoscope for ${zodiac} in Sanity...`);
            const createdDocument = await sanityClient.create(documentToCreate);

            if (!createdDocument) {
                throw new Error(`Failed to create ${period} Chinese horoscope in Sanity.`);
            }

            let transformedDocument = createdDocument;
            
            if (period === 'daily' || period === 'weekly') {
                transformedDocument = {
                    ...createdDocument,
                    for_date: createdDocument.forDate,
                    start_date: createdDocument.startDate,
                    end_date: createdDocument.endDate,
                    horoscope_en: createdDocument.horoscopeEn,
                    money_en: createdDocument.moneyEn,
                    social_en: createdDocument.socialEn,
                    career_en: createdDocument.careerEn,
                    love_en: createdDocument.loveEn,
                    lucky_color: createdDocument.luckyColor,
                    lucky_color_en: createdDocument.luckyColorEn,
                    lucky_number: createdDocument.luckyNumber,
                    lucky_number_en: createdDocument.luckyNumberEn
                };
            } else if (period === 'yearly') {
                transformedDocument = {
                    ...createdDocument,
                    horoscope: createdDocument.overviewContent,
                    horoscope_en: createdDocument.overviewContent,
                    love: createdDocument.loveContent,
                    love_en: createdDocument.loveContent,
                    career: createdDocument.careerContent,
                    career_en: createdDocument.careerContent,
                    money: createdDocument.wealthContent,
                    money_en: createdDocument.wealthContent,
                    social: createdDocument.socialContent,
                    social_en: createdDocument.socialContent,
                    lucky_color: createdDocument.luckyColor,
                    lucky_color_en: createdDocument.luckyColor,
                    lucky_number: createdDocument.luckyNumber.toString(),
                    lucky_number_en: createdDocument.luckyNumber.toString()
                };
            }

            requestCache.delete(cacheKey);
            return res.json(transformedDocument);

        } catch (geminiError) {
            requestCache.delete(cacheKey);
            throw geminiError;
        }

    } catch (error) {
        console.error(`API call failed for ${zodiac} horoscope (${period}):`, error.message);
        res.status(500).json({ error: `Failed to retrieve or generate ${zodiac} horoscope. ${error.message}` });
    }
});

// ------------------- ENDPOINT FOR WESTERN HOROSCOPES (DAILY, WEEKLY, YEARLY) - SANITY.IO VERSION -------------------
// Replace your Western horoscope endpoint in server.js with this fixed version:

// Replace your Western horoscope endpoint in server.js with this fixed version:

app.get('/api/western-horoscope/:sign', async (req, res) => {
    const { sign } = req.params;
    const period = req.query.period || 'daily';
    const dayOffset = parseInt(req.query.dayOffset || '0', 10);

    console.log("Western Horoscope API called:", sign, period, dayOffset);

    if (!allWesternZodiacs.includes(sign.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid Western zodiac sign provided.' });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    try {
        let dataToReturn = null;
        let docType;
        let query;
        let params;
        let identifierValue;
        let promptText;
        let generatedData;

        if (period === 'daily') {
            docType = 'dailyWesternHoroscope';
            identifierValue = getDailyDate(dayOffset);
            query = `*[_type == $docType && sign == $sign && forDate == $date][0]{
                ...,
                "for_date": forDate
            }`;
            params = { docType, sign: sign.toLowerCase(), date: identifierValue };
        } else if (period === 'weekly') {
            docType = 'weeklyWesternHoroscope';
            const { start, end } = getWeekDates();
            identifierValue = start;
            query = `*[_type == $docType && sign == $sign && startDate == $startDate][0]{
                ...,
                "start_date": startDate,
                "end_date": endDate
            }`;
            params = { docType, sign: sign.toLowerCase(), startDate: start };
        } else if (period === 'yearly') {
            docType = 'yearlyWesternHoroscope';
            identifierValue = new Date().getFullYear();
            query = `*[_type == $docType && sign == $sign && year == $year][0]{
                ...,
                "horoscope": overviewContent,
                "love": loveContent,
                "career": careerContent,
                "money": wealthContent,
                "social": socialContent
            }`;
            params = { docType, sign: sign.toLowerCase(), year: identifierValue };
        } else {
            return res.status(400).json({ error: 'Invalid period specified. Use "daily", "weekly", or "yearly".' });
        }

        console.log(`Checking Sanity for ${sign} ${period} horoscope...`);
        dataToReturn = await sanityClient.fetch(query, params);

        if (dataToReturn) {
            console.log(`${period} horoscope for ${sign} found in Sanity.`);
            return res.json(dataToReturn);
        }

        // Check cache before making API call
        const cacheKey = `western-${sign}-${period}-${identifierValue}`;
        if (requestCache.has(cacheKey)) {
            console.log(`Request for ${cacheKey} already in progress, waiting...`);
            return res.status(202).json({ message: 'Request in progress, please try again in a moment' });
        }

        requestCache.set(cacheKey, true);

        console.log(`${period} horoscope for ${sign} not found. Generating with Gemini API...`);

        if (period === 'daily') {
            promptText = `Generate a detailed daily Western horoscope for ${sign} on ${identifierValue}.
            Provide the following keys in a JSON object:
            {
              "horoscope": "General forecast...",
              "money": "Money outlook...",
              "social": "Social interactions...",
              "career": "Career outlook...",
              "love": "Love forecast...",
              "luckyColor": "Blue",
              "luckyNumber": 7
            }`;
        } else if (period === 'weekly') {
            const { start, end } = getWeekDates();
            promptText = `Generate a detailed weekly Western horoscope for ${sign} for the period ${start} to ${end}.
            Provide the following keys in a JSON object:
            {
              "horoscope": "General forecast...",
              "money": "Money outlook...",
              "social": "Social interactions...",
              "career": "Career outlook...",
              "love": "Love forecast...",
              "luckyColor": "Green",
              "luckyNumber": 3
            }`;
        } else if (period === 'yearly') {
            promptText = `Generate a detailed yearly Western horoscope for ${sign} for the year ${identifierValue}.
            Provide the following keys in a JSON object:
            {
              "overviewContent": "Yearly overview...",
              "loveContent": "Love forecast...",
              "careerContent": "Career outlook...",
              "wealthContent": "Financial outlook...",
              "socialContent": "Social interactions...",
              "luckyColor": "Red",
              "luckyNumber": 9
            }`;
        }

        const payload = {
            contents: [{ role: "user", parts: [{ text: promptText }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        try {
            const geminiResponse = await fetchWithBackoff(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const geminiResult = await geminiResponse.json();
            const jsonResponseText = geminiResult.candidates[0].content.parts[0].text;
            generatedData = JSON.parse(jsonResponseText);

            // 👈 FIXED: Use consistent document ID pattern
            let documentId;
            if (period === 'daily') {
                documentId = `daily-${sign.toLowerCase()}-${identifierValue}`;
            } else if (period === 'weekly') {
                documentId = `weekly-${sign.toLowerCase()}-${identifierValue}`;
            } else if (period === 'yearly') {
                documentId = `yearly-${sign.toLowerCase()}-${identifierValue}`;
            }

            const documentToCreate = {
                _type: docType,
                _id: documentId, // 👈 FIXED: Set consistent ID
                sign: sign.toLowerCase(),
                ...generatedData
            };

            if (period === 'daily') {
                documentToCreate.forDate = identifierValue;
            } else if (period === 'weekly') {
                const { start, end } = getWeekDates();
                documentToCreate.startDate = start;
                documentToCreate.endDate = end;
            } else if (period === 'yearly') {
                documentToCreate.year = identifierValue;
            }

            console.log(`Creating new ${period} horoscope for ${sign} in Sanity...`);
            const createdDocument = await sanityClient.createOrReplace(documentToCreate); // 👈 FIXED: Use createOrReplace

            let transformedDocument = createdDocument;
            if (period === 'daily') {
                transformedDocument = {
                    ...createdDocument,
                    for_date: createdDocument.forDate
                };
            } else if (period === 'weekly') {
                transformedDocument = {
                    ...createdDocument,
                    start_date: createdDocument.startDate,
                    end_date: createdDocument.endDate
                };
            } else if (period === 'yearly') {
                transformedDocument = {
                    ...createdDocument,
                    horoscope: createdDocument.overviewContent,
                    love: createdDocument.loveContent,
                    career: createdDocument.careerContent,
                    money: createdDocument.wealthContent,
                    social: createdDocument.socialContent
                };
            }

            requestCache.delete(cacheKey);
            return res.json(transformedDocument);

        } catch (geminiError) {
            requestCache.delete(cacheKey);
            throw geminiError;
        }

    } catch (error) {
        console.error(`API call failed for ${sign} Western horoscope (${period}):`, error.message);
        res.status(500).json({ error: `Failed to retrieve or generate ${sign} horoscope. ${error.message}` });
    }
});

// ------------------- ENHANCED ENDPOINT FOR DAILY FENG SHUI TIP -------------------

// Support Functions (add these at the top of your server file)
function getRandomTheme() {
  const themes = [
    'wealth and prosperity', 'relationships and love', 'career advancement',
    'health and vitality', 'creativity and inspiration', 'travel and adventure',
    'family harmony', 'spiritual growth', 'protection and safety', 'mental clarity',
    'home office energy', 'sleep quality', 'social connections', 'personal growth'
  ];
  return themes[Math.floor(Math.random() * themes.length)];
}

function getRandomElement() {
  const elements = ['water', 'wood', 'fire', 'earth', 'metal'];
  return elements[Math.floor(Math.random() * elements.length)];
}

function getSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring (renewal and growth)';
  if (month >= 5 && month <= 7) return 'summer (energy and activity)';
  if (month >= 8 && month <= 10) return 'autumn (harvest and reflection)';
  return 'winter (rest and planning)';
}

function getWeeklyFocus() {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  const focuses = [
    'entrance and doorways', 'bedroom energy', 'kitchen and nourishment',
    'workspace optimization', 'bathroom cleansing', 'living room harmony',
    'color and lighting', 'outdoor spaces', 'storage and organization'
  ];
  return focuses[weekNumber % focuses.length];
}

function getDayOfWeekFocus() {
  const dayOfWeek = new Date().getDay();
  const dailyFocus = [
    'new beginnings and intentions', // Sunday
    'career and professional growth', // Monday  
    'communication and relationships', // Tuesday
    'creativity and self-expression', // Wednesday
    'abundance and gratitude', // Thursday
    'love and social connections', // Friday
    'rest and spiritual practices' // Saturday
  ];
  return dailyFocus[dayOfWeek];
}

function getRandomRoom() {
  const rooms = [
    'entryway', 'living room', 'bedroom', 'kitchen', 'bathroom', 
    'home office', 'dining room', 'closet', 'hallway', 'balcony'
  ];
  return rooms[Math.floor(Math.random() * rooms.length)];
}

function getRandomAction() {
  const actions = [
    'Place', 'Move', 'Add', 'Remove', 'Rearrange', 'Light', 'Open', 'Close',
    'Clean', 'Declutter', 'Position', 'Activate', 'Balance', 'Enhance'
  ];
  return actions[Math.floor(Math.random() * actions.length)];
}

async function getRecentTips(sanityClient, days = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffString = cutoffDate.toISOString().split('T')[0];
  
  try {
    const recentTips = await sanityClient.fetch(
      `*[_type == "dailyFengShuiTip" && date > $cutoffDate] | order(date desc) {tip}`,
      { cutoffDate: cutoffString }
    );
    return recentTips.map(t => t.tip.toLowerCase());
  } catch (err) {
    console.warn('Could not fetch recent tips for uniqueness check:', err.message);
    return [];
  }
}

// ------------------- NEW: ENHANCED DAILY WISDOM PROMPT FUNCTION -------------------
async function buildDailyWisdomPrompt(sanityClient) {
  const topics = ['feng shui', 'numerology', 'astrology'];
  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

  const avoidanceClause = await getRecentTips(sanityClient, 7);
  const avoidedTipsText = avoidanceClause.length > 0
    ? `\n\nIMPORTANT: Avoid concepts similar to these recent tips: ${avoidanceClause.slice(0, 5).join(', ')}`
    : '';

  return `Generate a concise, uplifting motivational quote (under 15 words) 
  related to ${selectedTopic}. Then, expand on that quote with a short, insightful article 
  (about 250-300 words) that provides practical advice or deeper meaning. 
  Format the output as a JSON object with 'quote' and 'article' keys.
  
  Topic focus: ${selectedTopic}. Ensure the entire response (quote and article) is exclusively about this topic.
  ${avoidedTipsText}`;
}

app.get('/api/daily-fengshui-tip', async (req, res) => {
  const today = getDailyDate();
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;
  
  try {
    console.log("Checking Sanity for today's feng shui tip...");
    
    // Check if today's tip already exists
    const query = `*[_type == "dailyFengShuiTip" && date == $date][0]{tip}`;
    const params = { date: today };
    const existingDoc = await sanityClient.fetch(query, params);
    
    if (existingDoc?.tip) {
      console.log("Feng shui tip found in Sanity. Returning cached data.");
      return res.json({ tip: existingDoc.tip });
    }

    // Check cache before making API call
    const cacheKey = `fengshui-tip-${today}`;
    if (requestCache.has(cacheKey)) {
      console.log(`Request for ${cacheKey} already in progress, waiting...`);
      return res.status(202).json({ message: 'Request in progress, please try again in a moment' });
    }
    requestCache.set(cacheKey, true);

    console.log("No feng shui tip found. Generating with enhanced prompt...");
    
    // Build enhanced prompt with context
    const prompt = await buildEnhancedPrompt(today, sanityClient);
    console.log("Enhanced prompt context:", {
      theme: getRandomTheme(),
      element: getRandomElement(),
      season: getSeason(),
      focus: getWeeklyFocus()
    });

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "tip": { "type": "STRING" }
          },
          required: ["tip"]
        }
      }
    };

    try {
      const response = await fetchWithBackoff(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const jsonResponse = result.candidates[0].content.parts[0].text;
      const parsedJson = JSON.parse(jsonResponse);

      // Store in Sanity with metadata
      const createdDoc = await sanityClient.create({
        _type: "dailyFengShuiTip",
        date: today,
        tip: parsedJson.tip,
        createdAt: new Date().toISOString(),
        metadata: {
          generatedWith: 'enhanced-prompt-v2',
          season: getSeason(),
          theme: getRandomTheme(),
          element: getRandomElement(),
          focus: getWeeklyFocus()
        }
      });

      if (!createdDoc) {
        throw new Error('Failed to store feng shui tip in Sanity.');
      }

      requestCache.delete(cacheKey);
      console.log(`Successfully generated and stored tip: "${parsedJson.tip}"`);
      return res.json({ tip: parsedJson.tip });
      
    } catch (geminiError) {
      requestCache.delete(cacheKey);
      throw geminiError;
    }
    
  } catch (error) {
    console.error("Failed to get daily feng shui tip:", error.message);
    res.status(500).json({ error: "Failed to retrieve or generate daily feng shui tip" });
  }
});

// ------------------- ENDPOINT FOR PLANETARY OVERVIEW - FIXED -------------------
app.get('/api/planetary-overview', async (req, res) => {
  const today = getDailyDate();
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

  try {
    console.log("Checking Sanity for today's planetary overview...");
    // Fixed: Use the correct schema name and fields
    const query = `*[_type == "dailyPlanetaryOverview" && date == $date][0]{
      date,
      planetary_index,
      summary,
      article
    }`;
    const params = { date: today };
    const existingDoc = await sanityClient.fetch(query, params);

    if (existingDoc) {
      console.log("Planetary overview found in Sanity. Returning cached data.");
      return res.json({
        date: existingDoc.date,
        planetary_index: existingDoc.planetary_index,
        summary: existingDoc.summary,
        article: existingDoc.article
      });
    }

    // Check cache before making API call
    const cacheKey = `planetary-overview-${today}`;
    if (requestCache.has(cacheKey)) {
      console.log(`Request for ${cacheKey} already in progress, waiting...`);
      return res.status(202).json({ message: 'Request in progress, please try again in a moment' });
    }

    requestCache.set(cacheKey, true);

    console.log("No planetary overview found. Generating with Gemini...");
    const prompt = `Generate a planetary overview for astrology enthusiasts for ${today}.
    Include a planetary index (1-5 scale), a short summary (max 150 chars), and a detailed article.
    Format as JSON:
    {
      "planetary_index": 3,
      "summary": "Your short summary...",
      "article": "Your detailed article..."
    }`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "planetary_index": { "type": "INTEGER", "minimum": 1, "maximum": 5 },
            "summary": { "type": "STRING" },
            "article": { "type": "STRING" }
          },
          required: ["planetary_index", "summary", "article"]
        }
      }
    };

    try {
      const response = await fetchWithBackoff(geminiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const jsonResponse = result.candidates[0].content.parts[0].text;
      const parsedJson = JSON.parse(jsonResponse);

      // Store in Sanity using correct schema
      const createdDoc = await sanityClient.create({
        _type: "dailyPlanetaryOverview",
        date: today,
        planetary_index: parsedJson.planetary_index,
        summary: parsedJson.summary,
        article: parsedJson.article
      });

      if (!createdDoc) {
        throw new Error('Failed to store planetary overview in Sanity.');
      }

      requestCache.delete(cacheKey);
      return res.json({
        date: today,
        planetary_index: parsedJson.planetary_index,
        summary: parsedJson.summary,
        article: parsedJson.article
      });

    } catch (geminiError) {
      requestCache.delete(cacheKey);
      throw geminiError;
    }

  } catch (error) {
    console.error("Failed to get planetary overview:", error.message);
    res.status(500).json({ error: "Failed to retrieve or generate planetary overview" });
  }
});

app.get('/api/daily-wisdom', async (req, res) => {
    const today = getDailyDate();
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    try {
        console.log("Checking Sanity for today's daily wisdom...");
        const query = `*[_type == "dailyWisdom" && date == $date][0]`;
        const existing = await sanityClient.fetch(query, { date: today });

        if (existing) {
            console.log("Daily wisdom found in Sanity. Returning cached data.");
            return res.json({ quote: existing.quote, article: existing.article });
        }

        const cacheKey = `daily-wisdom-${today}`;
        if (requestCache.has(cacheKey)) {
            console.log(`Request for ${cacheKey} already in progress, waiting...`);
            return res.status(202).json({ message: 'Request in progress, please try again in a moment' });
        }
        requestCache.set(cacheKey, true);

        console.log("Daily wisdom not found. Generating a new one with Gemini API...");
        
        // Use the new, dynamic prompt function
        const prompt = await buildDailyWisdomPrompt(sanityClient);

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "quote": { "type": "STRING" },
                        "article": { "type": "STRING" }
                    },
                    required: ["quote", "article"]
                }
            }
        };

        try {
            const response = await fetchWithBackoff(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const jsonResponse = result.candidates[0].content.parts[0].text;
            const parsedJson = JSON.parse(jsonResponse);

            const generatedQuote = parsedJson.quote;
            const generatedArticle = parsedJson.article;

            console.log("Successfully generated new wisdom. Storing it in Sanity...");
            const createdDoc = await sanityClient.create({
                _type: 'dailyWisdom',
                date: today,
                quote: generatedQuote,
                article: generatedArticle
            });

            if (!createdDoc) {
                throw new Error('Failed to store daily wisdom in Sanity.');
            }

            requestCache.delete(cacheKey);
            res.json({ quote: generatedQuote, article: generatedArticle });

        } catch (geminiError) {
            requestCache.delete(cacheKey);
            throw geminiError;
        }

    } catch (error) {
        console.error("API call failed:", error.message);
        res.status(500).json({ error: 'Failed to retrieve or generate daily wisdom' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});