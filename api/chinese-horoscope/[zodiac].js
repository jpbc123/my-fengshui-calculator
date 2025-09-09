// api/chinese-horoscope/[zodiac].js
import { createClient as createSanityClient } from '@sanity/client';

const sanityClient = createSanityClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    apiVersion: '2025-08-31',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

const allChineseZodiacs = [
    "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse",
    "goat", "monkey", "rooster", "dog", "pig"
];

const requestCache = new Map();

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

// Get current week starting Sunday
function getCurrentWeekDates(date = new Date()) {
    const day = date.getDay(); // 0 = Sunday
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

// Get today's date
function getTodayDate(dayOffset = 0) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    return targetDate.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { zodiac } = req.query;
    const period = req.query.period || 'daily';
    const dayOffset = parseInt(req.query.dayOffset || '0', 10);

    console.log("Chinese Horoscope API called:", zodiac, period, dayOffset);
     
    if (!allChineseZodiacs.includes(zodiac.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid Chinese zodiac sign provided.' });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`;

    try {
        let dataToReturn = null;
        let docType;
        let query;
        let params;
        let identifierValue;
        let promptText;

        if (period === 'daily') {
            docType = 'dailyChineseHoroscope';
            // Get today's date + offset for daily queries
            identifierValue = getTodayDate(dayOffset);
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
            // Get current week starting Sunday
            const { start, end } = getCurrentWeekDates();
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
            const { start, end } = getCurrentWeekDates();
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
            const generatedData = JSON.parse(jsonResponseText);

            const documentToCreate = {
                _type: docType,
                sign: zodiac.toLowerCase(),
                ...generatedData
            };

            if (period === 'daily') {
                documentToCreate.forDate = identifierValue;
            } else if (period === 'weekly') {
                const { start, end } = getCurrentWeekDates();
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
}