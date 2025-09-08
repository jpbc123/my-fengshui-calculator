// api/western-horoscope/[sign].js
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
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            if (response.ok) return response;
            throw new Error(`HTTP error! Status: ${response.status}`);
        } catch (error) {
            if (i === retries - 1) throw error;
            const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

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

// FIXED: Default to current date (0 offset) for frontend requests
function getDailyDate(dayOffset = 0) {
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

    const { sign } = req.query;
    const period = req.query.period || 'daily';
    // FIXED: Map frontend requests to correct data
    // Frontend sends: today=0, yesterday=-1
    // But data is stored with: today=1, yesterday=0
    let dayOffset = parseInt(req.query.dayOffset || '0', 10);
    
    // Map frontend offset to data offset
    if (period === 'daily') {
        dayOffset = dayOffset + 1; // today(0) -> data(1), yesterday(-1) -> data(0)
    }

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
            return res.status(400).json({ error: 'Invalid period specified.' });
        }

        console.log(`Checking Sanity for ${sign} ${period} horoscope...`);
        dataToReturn = await sanityClient.fetch(query, params);

        if (dataToReturn) {
            console.log(`${period} horoscope for ${sign} found in Sanity.`);
            return res.json(dataToReturn);
        }

        const cacheKey = `western-${sign}-${period}-${identifierValue}`;
        if (requestCache.has(cacheKey)) {
            return res.status(202).json({ message: 'Request in progress, please try again in a moment' });
        }

        requestCache.set(cacheKey, true);

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
                _id: documentId,
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

            const createdDocument = await sanityClient.createOrReplace(documentToCreate);

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
}