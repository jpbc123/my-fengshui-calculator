// api/western-horoscope/[sign].js - Fixed timezone issue
import { createClient as createSanityClient } from '@sanity/client';

const sanityClient = createSanityClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    apiVersion: '2025-08-31',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

const allWesternZodiacs = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
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

// Get current week starting Sunday - FIXED to use local time
function getCurrentWeekDates(date = new Date()) {
    const day = date.getDay(); // 0 = Sunday
    const diff = date.getDate() - day;
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Use local time instead of UTC
    const formatLocalDate = (date) => {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    };

    return {
        start: formatLocalDate(startOfWeek),
        end: formatLocalDate(endOfWeek)
    };
}

// Get today's date - FIXED to use consistent local time
function getTodayDate(dayOffset = 0) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    
    // Use local time format to match other APIs
    return targetDate.getFullYear() + '-' + 
           String(targetDate.getMonth() + 1).padStart(2, '0') + '-' + 
           String(targetDate.getDate()).padStart(2, '0');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sign } = req.query;
    const period = req.query.period || 'daily';
    const dayOffset = parseInt(req.query.dayOffset || '0', 10);

    console.log("Western Horoscope API called:", sign, period, dayOffset);

    if (!allWesternZodiacs.includes(sign.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid Western zodiac sign provided.' });
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
            docType = 'dailyWesternHoroscope';
            // Get today's date + offset for daily queries - FIXED timezone
            identifierValue = getTodayDate(dayOffset);
            console.log(`Fetching daily horoscope for ${sign} on ${identifierValue} (offset: ${dayOffset})`);
            
            query = `*[_type == $docType && sign == $sign && forDate == $date][0]{
                ...,
                "for_date": forDate
            }`;
            params = { docType, sign: sign.toLowerCase(), date: identifierValue };
        } else if (period === 'weekly') {
            docType = 'weeklyWesternHoroscope';
            // Get current week starting Sunday - FIXED timezone
            const { start, end } = getCurrentWeekDates();
            identifierValue = start;
            console.log(`Fetching weekly horoscope for ${sign} for week ${start} to ${end}`);
            
            query = `*[_type == $docType && sign == $sign && startDate == $startDate][0]{
                ...,
                "start_date": startDate,
                "end_date": endDate
            }`;
            params = { docType, sign: sign.toLowerCase(), startDate: start };
        } else if (period === 'yearly') {
            docType = 'yearlyWesternHoroscope';
            identifierValue = new Date().getFullYear();
            console.log(`Fetching yearly horoscope for ${sign} for year ${identifierValue}`);
            
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
            return res.json({
                ...dataToReturn,
                timestamp: new Date().toISOString(),
                isFallback: false
            });
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
            Cover the following categories: horoscope, money, social, career, love.
            Also provide a lucky color and lucky number.
            Provide the output as a JSON object with these exact keys:
            {
              "horoscope": "General forecast...",
              "money": "Money outlook...",
              "social": "Social interactions...",
              "career": "Career outlook...",
              "love": "Love forecast...",
              "luckyColor": "Blue",
              "luckyNumber": "7"
            }`;
        } else if (period === 'weekly') {
            const { start, end } = getCurrentWeekDates();
            promptText = `Generate a detailed weekly Western horoscope for ${sign} for the period ${start} to ${end}.
            Cover the following categories: horoscope, money, social, career, love.
            Also provide a lucky color and lucky number.
            Provide the output as a JSON object with these exact keys:
            {
              "horoscope": "General forecast...",
              "money": "Money outlook...",
              "social": "Social interactions...",
              "career": "Career outlook...",
              "love": "Love forecast...",
              "luckyColor": "Green",
              "luckyNumber": "3"
            }`;
        } else if (period === 'yearly') {
            promptText = `Generate a detailed yearly Western horoscope for ${sign} for the year ${identifierValue}.
            Provide comprehensive content for: overview, love, career, wealth, and social.
            Also provide a lucky color and lucky number.
            Provide the output as a JSON object with these exact keys:
            {
              "overviewContent": "Detailed yearly overview...",
              "loveContent": "Yearly love forecast...",
              "careerContent": "Career outlook for the year...",
              "wealthContent": "Financial prospects...",
              "socialContent": "Social interactions and networking...",
              "luckyColor": "Red",
              "luckyNumber": "9"
            }`;
        }

        const payload = {
            contents: [{ role: "user", parts: [{ text: promptText }] }],
            generationConfig: { responseMimeType: "application/json" }
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
                sign: sign.toLowerCase(),
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

            console.log(`Creating new ${period} horoscope for ${sign} in Sanity...`);
            const createdDocument = await sanityClient.create(documentToCreate);

            if (!createdDocument) {
                throw new Error(`Failed to create ${period} Western horoscope in Sanity.`);
            }

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
            return res.json({
                ...transformedDocument,
                timestamp: new Date().toISOString(),
                isFallback: false
            });

        } catch (geminiError) {
            requestCache.delete(cacheKey);
            throw geminiError;
        }

    } catch (error) {
        console.error(`API call failed for ${sign} Western horoscope (${period}):`, error.message);
        res.status(500).json({ 
            error: `Failed to retrieve or generate ${sign} horoscope. ${error.message}`,
            timestamp: new Date().toISOString()
        });
    }
}