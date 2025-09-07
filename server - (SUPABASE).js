// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini API

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

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

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
async function fetchWithBackoff(url, options, retries = 5, baseDelay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);

            // If a response is received, check if it's a rate limit error.
            if (response.status === 429 && i < retries - 1) {
                const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
                console.warn(`Rate limit hit (429), retrying in ${Math.round(delay / 1000)}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue; // Continue to the next loop iteration to retry
            }

            // If the response is OK, return it.
            if (response.ok) {
                return response;
            }

            // If it's a different error, throw it so the outer catch block can handle it.
            throw new Error(`HTTP error! Status: ${response.status}, Body: ${await response.text()}`);
        } catch (error) {
            // Log the error and decide whether to retry.
            console.error(`Fetch attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) {
                // Last attempt, throw the error
                throw error;
            }

            const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
            console.warn(`Retrying in ${Math.round(delay / 1000)}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // If the loop finishes without a successful response
    throw new Error("Maximum retries exceeded for API call.");
}

// Function to calculate start and end dates of the current week (Sunday to Saturday)
function getWeekDates(date = new Date()) {
    const day = date.getDay(); // 0 = Sunday, 
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


// ------------------- ENDPOINT FOR CHINESE HOROSCOPES (DAILY, WEEKLY, YEARLY) -------------------
app.get('/api/chinese-horoscope/:zodiac', async (req, res) => {
    const { zodiac } = req.params;
    const period = req.query.period || 'daily'; // 'daily', 'weekly', 'yearly'
    const dayOffset = parseInt(req.query.dayOffset || '0', 10);

    // Basic validation for the zodiac sign
    if (!allChineseZodiacs.includes(zodiac.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid Chinese zodiac sign provided.' });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    try {
        let dataToReturn = null;
        let tableName;
        let identifierColumn;
        let identifierValue;
        let onConflictKeys;
        let promptText;
        let generatedData;

        // Determine table and identifier based on period
        if (period === 'daily') {
            tableName = 'daily_chinese_horoscope';
            identifierColumn = 'for_date';
            identifierValue = getDailyDate(dayOffset);
            onConflictKeys = ['sign', 'for_date'];
        } else if (period === 'weekly') {
            tableName = 'weekly_chinese_horoscope';
            identifierColumn = 'start_date';
            identifierValue = getWeekDates().start;
            onConflictKeys = ['sign', 'start_date'];
        } else if (period === 'yearly') {
            tableName = 'current_yr_general_chinese_horoscope';
            identifierColumn = 'year';
            identifierValue = new Date().getFullYear();
            onConflictKeys = ['sign', 'year'];
        } else {
            return res.status(400).json({ error: 'Invalid period specified. Use "daily", "weekly", or "yearly".' });
        }

        // 1. Try to fetch from Supabase (cache)
        console.log(`Checking Supabase for ${zodiac} ${period} horoscope...`);
        const { data, error: supabaseFetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('sign', zodiac.toLowerCase())
            .eq(identifierColumn, identifierValue)
            .single();
        
        if (data) {
            console.log(`${period} horoscope for ${zodiac} found in Supabase.`);
            dataToReturn = data;
        } else if (supabaseFetchError && supabaseFetchError.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error(`Supabase fetch error for ${zodiac} ${period}:`, supabaseFetchError);
            // Don't throw, just proceed to generate if cache error
        }

        // 2. If no data is in cache, generate with Gemini API
        if (!dataToReturn) {
            console.log(`${period} horoscope for ${zodiac} not found. Generating with Gemini API...`);

            // Construct prompt based on period
            if (period === 'daily') {
                promptText = `Generate a detailed daily Chinese horoscope for the ${zodiac} sign for ${identifierValue}. Cover the following categories in both English and Chinese. Ensure the Chinese content is natural and culturally appropriate, and the English content is clear and engaging. The tone should be positive, insightful, and comprehensive for each section.
                Provide the output as a JSON object with these exact keys:
                {
                  "horoscope": "中文生肖運勢", "horoscope_en": "English horoscope",
                  "money": "中文財運", "money_en": "English money outlook",
                  "social": "中文人際關係", "social_en": "English social outlook",
                  "career": "中文事業運", "career_en": "English career outlook",
                  "love": "中文愛情運", "love_en": "English love outlook",
                  "lucky_color": "中文幸運顏色", "lucky_color_en": "English lucky color",
                  "lucky_number": "中文幸運數字", "lucky_number_en": "English lucky number"
                }`;
            } else if (period === 'weekly') {
                const { start, end } = getWeekDates();
                promptText = `Generate a detailed general Chinese horoscope for the ${zodiac} sign for the current week (${start} to ${end}). Cover the following categories in both English and Chinese. Focus on a general outlook for the week. The tone should be positive, insightful, and comprehensive for each section.
                Provide the output as a JSON object with these exact keys:
                {
                  "horoscope": "中文生肖運勢", "horoscope_en": "English horoscope",
                  "money": "中文財運", "money_en": "English money outlook",
                  "social": "中文人際關係", "social_en": "English social outlook",
                  "career": "中文事業運", "career_en": "English career outlook",
                  "love": "中文愛情運", "love_en": "English love outlook",
                  "lucky_color": "中文幸運顏色", "lucky_color_en": "English lucky color",
                  "lucky_number": "中文幸運數字", "lucky_number_en": "English lucky number"
                }`;
            } else if (period === 'yearly') {
                promptText = `Generate a detailed general Chinese horoscope for the ${zodiac} sign for the current year ${identifierValue}. Cover the following categories in both English and Chinese. Focus on a broad outlook for the entire year. The tone should be positive, insightful, and comprehensive for each section.
                Provide the output as a JSON object with these exact keys:
                {
                  "horoscope": "中文生肖運勢", "horoscope_en": "English horoscope",
                  "money": "中文財運", "money_en": "English money outlook",
                  "social": "中文人際關係", "social_en": "English social outlook",
                  "career": "中文事業運", "career_en": "English career outlook",
                  "love": "中文愛情運", "love_en": "English love outlook",
                  "lucky_color": "中文幸運顏色", "lucky_color_en": "English lucky color",
                  "lucky_number": "中文幸運數字", "lucky_number_en": "English lucky number"
                }`;
            }

            const payload = {
                contents: [{ role: "user", parts: [{ text: promptText }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "horoscope": { "type": "STRING" }, "horoscope_en": { "type": "STRING" },
                            "money": { "type": "STRING" }, "money_en": { "type": "STRING" },
                            "social": { "type": "STRING" }, "social_en": { "type": "STRING" },
                            "career": { "type": "STRING" }, "career_en": { "type": "STRING" },
                            "love": { "type": "STRING" }, "love_en": { "type": "STRING" },
                            "lucky_color": { "type": "STRING" }, "lucky_color_en": { "type": "STRING" },
                            "lucky_number": { "type": "STRING" }, "lucky_number_en": { "type": "STRING" }
                        },
                        required: ["horoscope", "horoscope_en", "money", "money_en", "social", "social_en", "career", "career_en", "love", "love_en", "lucky_color", "lucky_color_en", "lucky_number", "lucky_number_en"]
                    }
                }
            };

            const geminiResponse = await fetchWithBackoff(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const geminiResult = await geminiResponse.json();
            const jsonResponseText = geminiResult.candidates[0].content.parts[0].text;
            generatedData = JSON.parse(jsonResponseText);

            // 3. Perform an upsert to store the data
            const dataToUpsert = {
                sign: zodiac.toLowerCase(),
                ...generatedData,
                updated_at: new Date().toISOString()
            };
            if (period === 'daily') {
                dataToUpsert.for_date = identifierValue;
            } else if (period === 'weekly') {
                const { start, end } = getWeekDates();
                dataToUpsert.start_date = start;
                dataToUpsert.end_date = end;
            } else if (period === 'yearly') {
                dataToUpsert.year = identifierValue;
            }

            // --- START OF MODIFIED LOGIC ---
            // The `insert` statement below has been changed to `upsert` to match the Western horoscope logic.
            // This ensures that new data is inserted or existing data is updated, preventing duplicate errors
            // and making the endpoint a robust fallback cache.
            console.log(`Upserting new ${period} horoscope for ${zodiac} in Supabase...`);
            const { data: upsertedData, error: upsertError } = await supabase
                .from(tableName)
                .upsert(dataToUpsert, { onConflict: onConflictKeys })
                .select()
                .single();

            if (upsertError) {
                console.error(`Failed to upsert ${zodiac} ${period} horoscope into Supabase:`, upsertError);
                throw new Error(`Failed to store ${period} Chinese horoscope.`);
            }
            // --- END OF MODIFIED LOGIC ---
            
            dataToReturn = upsertedData;
        }

        if (dataToReturn) {
            return res.json(dataToReturn);
        } else {
            return res.status(404).json({ error: 'Horoscope data not found and could not be generated.' });
        }

    } catch (error) {
        console.error(`API call failed for ${zodiac} horoscope (${period}):`, error.message);
        res.status(500).json({ error: `Failed to retrieve or generate ${zodiac} horoscope. ${error.message}` });
    }
});

// ------------------- NEW ENDPOINT FOR WESTERN HOROSCOPES (DAILY, WEEKLY, YEARLY) -------------------
app.post('/api/western-horoscope', async (req, res) => {
    const { sign, period, category, dateIdentifier, weekIdentifier, yearIdentifier } = req.body;

    if (!sign || !period || !category) {
        return res.status(400).json({ error: 'Missing sign, period, or category.' });
    }

    if (!allWesternZodiacs.includes(sign.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid Western zodiac sign provided.' });
    }

    let tableName;
    let identifierColumn;
    let identifierValue;

    switch (period) {
        case 'today':
        case 'yesterday':
            tableName = 'daily_western_horoscopes';
            identifierColumn = 'date';
            identifierValue = dateIdentifier;
            break;
        case 'weekly':
            tableName = 'weekly_western_horoscopes';
            identifierColumn = 'week_identifier';
            identifierValue = weekIdentifier;
            break;
        case 'yearly':
            tableName = 'yearly_western_horoscopes';
            identifierColumn = 'year';
            identifierValue = yearIdentifier;
            break;
        default:
            return res.status(400).json({ error: 'Invalid period specified. Use "today", "yesterday", "weekly", or "yearly".' });
    }

    try {
        // 1. Try to fetch from Supabase (cache)
        let { data: cachedHoroscope, error: cacheError } = await supabase
            .from(tableName)
            .select('*')
            .eq('sign', sign.toLowerCase())
            .eq(identifierColumn, identifierValue)
            .single();

        if (cacheError && cacheError.code !== 'PGRST116') { // PGRST116 means "no rows found"
            console.error('Supabase cache error:', cacheError);
            // Don't throw, just proceed to generate if cache error
        }

        // If specific category content exists, return the full cached object
        // Otherwise, if the main record exists but is missing the category, we'll regenerate
        if (cachedHoroscope && cachedHoroscope[`${category}_content`] && period !== 'yesterday') {
             // For yesterday, we don't regenerate missing categories, just return what's there
            return res.json({ horoscope: cachedHoroscope });
        }
        
        // If cachedHoroscope exists but is missing the specific category (or if it's yesterday)
        // or if no cachedHoroscope at all, generate with Gemini API
        if (!cachedHoroscope || (period !== 'yesterday' && !cachedHoroscope[`${category}_content`])) {
            console.log(`Generating Western horoscope for ${sign}, ${period}, ${category}. Cache hit: ${!!cachedHoroscope}`);

            const promptText = `Generate a concise and insightful Western horoscope for ${sign} for ${period}.
            Please provide the following categories as a JSON object. Ensure each category is a string.
            - overview_content: A general daily/weekly/yearly forecast.
            - love_content: Insights into romantic relationships.
            - career_content: Guidance on professional life.
            - wealth_content: Advice on financial matters.
            - social_content: Tips for social interactions.
            - lucky_color: A specific lucky color for the period (e.g., "Blue", "Green", "Gold").
            - lucky_number: A specific lucky number for the period (e.g., 7, 3, 9).
    
            The response should be a JSON object with all the specified keys. Example for 'today' and 'aries':
            {
              "overview_content": "Aries, today is a day for bold moves...",
              "love_content": "Your passion shines in relationships...",
              "career_content": "New opportunities arise at work...",
              "wealth_content": "Financial stability is within reach...",
              "social_content": "Connect with friends old and new...",
              "lucky_color": "Red",
              "lucky_number": 9
            }`;

            const payload = {
                contents: [{ role: "user", parts: [{ text: promptText }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "overview_content": { "type": "STRING" },
                            "love_content": { "type": "STRING" },
                            "career_content": { "type": "STRING" },
                            "wealth_content": { "type": "STRING" },
                            "social_content": { "type": "STRING" },
                            "lucky_color": { "type": "STRING" },
                            "lucky_number": { "type": "INTEGER" }
                        },
                        required: ["overview_content", "love_content", "career_content", "wealth_content", "social_content", "lucky_color", "lucky_number"]
                    }
                }
            };

            const geminiResponse = await fetchWithBackoff(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const geminiResult = await geminiResponse.json();
            const jsonResponseText = geminiResult.candidates[0].content.parts[0].text;
            let parsedGeminiData;
            try {
                 // The Gemini API might sometimes return the JSON wrapped in markdown code block.
                const jsonMatch = jsonResponseText.match(/```json\n([\s\S]*?)\n```/);
                parsedGeminiData = JSON.parse(jsonMatch ? jsonMatch[1] : jsonResponseText);
            } catch (e) {
                console.error("Failed to parse Gemini API response:", jsonResponseText, e);
                throw new Error("Failed to parse horoscope content from AI.");
            }

            // 3. Store or Update in Supabase
            const dataToUpsert = {
                sign: sign.toLowerCase(),
                overview_content: parsedGeminiData.overview_content,
                love_content: parsedGeminiData.love_content,
                career_content: parsedGeminiData.career_content,
                wealth_content: parsedGeminiData.wealth_content,
                social_content: parsedGeminiData.social_content,
                lucky_color: parsedGeminiData.lucky_color,
                lucky_number: parsedGeminiData.lucky_number,
                updated_at: new Date().toISOString()
            };

            if (period === 'today' || period === 'yesterday') {
                dataToUpsert.date = identifierValue;
            } else if (period === 'weekly') {
                dataToUpsert.week_identifier = identifierValue;
            } else if (period === 'yearly') {
                dataToUpsert.year = identifierValue;
            }

            console.log(`Upserting Western horoscope for ${sign}, ${period} into ${tableName}...`);
            const { data: upsertedData, error: upsertError } = await supabase
                .from(tableName)
                .upsert(dataToUpsert, { onConflict: ['sign', identifierColumn] })
                .select()
                .single();

            if (upsertError) {
                console.error(`Failed to upsert Western horoscope into Supabase:`, upsertError);
                throw new Error('Failed to store Western horoscope.');
            }
            return res.json({ horoscope: upsertedData });
        } else if (cachedHoroscope) {
             // If cachedHoroscope exists and period is 'yesterday', return it without regenerating
            return res.json({ horoscope: cachedHoroscope });
        }


    } catch (error) {
        console.error(`API call failed for ${sign} Western horoscope (${period}):`, error.message);
        res.status(500).json({ error: `Failed to retrieve or generate ${sign} horoscope. ${error.message}` });
    }
});


// ------------------- EXISTING ENDPOINT FOR DAILY WISDOM -------------------
app.get('/api/daily-wisdom', async (req, res) => {
    const today = getDailyDate();
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    try {
        console.log("Checking Supabase for today's daily wisdom...");
        const { data, error } = await supabase
            .from('daily_wisdom')
            .select('quote, article')
            .eq('date', today)
            .single();

        if (data) {
            console.log("Daily wisdom found in Supabase. Returning cached data.");
            return res.json({ quote: data.quote, article: data.article });
        }

        console.log("Daily wisdom not found. Generating a new one with Gemini API...");
        const prompt = "Generate a concise, uplifting motivational quote (under 15 words) related to feng shui, numerology, or astrology. Then, expand on that quote with a short, insightful article (about 250-300 words) that provides practical advice or deeper meaning. Format the output as a JSON object with 'quote' and 'article' keys.";
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "quote": { "type": "STRING" },
                        "article": { "type": "STRING" }
                    }
                }
            }
        };

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

        console.log("Successfully generated new wisdom. Storing it in Supabase...");
        const { error: insertError } = await supabase
            .from('daily_wisdom')
            .insert({
                date: today,
                quote: generatedQuote,
                article: generatedArticle
            });

        if (insertError) {
            console.error("Failed to insert data into Supabase:", insertError);
            throw new Error('Failed to store daily wisdom.');
        }

        res.json({ quote: generatedQuote, article: generatedArticle });

    } catch (error) {
        console.error("API call failed:", error.message);
        res.status(500).json({ error: 'Failed to retrieve or generate daily wisdom' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});