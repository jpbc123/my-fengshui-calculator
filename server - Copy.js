// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// ------------------- NEW ENDPOINT FOR DAILY WISDOM -------------------
app.get('/api/daily-wisdom', async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

    try {
        // 1. Check Supabase for today's wisdom
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

        // 2. If not found, generate with Gemini API
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

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API error: ${response.statusText}, Body: ${errorBody}`);
        }

        const result = await response.json();
        const jsonResponse = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonResponse);

        // 3. Store the new wisdom in Supabase
        console.log("Successfully generated new wisdom. Storing it in Supabase...");
        const { error: insertError } = await supabase
            .from('daily_wisdom')
            .insert({
                date: today,
                quote: parsedJson.quote,
                article: parsedJson.article
            });

        if (insertError) {
            console.error("Failed to insert data into Supabase:", insertError);
            throw new Error('Failed to store daily wisdom.');
        }

        // 4. Return the newly generated wisdom
        res.json({ quote: parsedJson.quote, article: parsedJson.article });

    } catch (error) {
        console.error("API call failed:", error.message);
        res.status(500).json({ error: 'Failed to retrieve or generate daily wisdom' });
    }
});

// Remove the old /api/gemini/generate endpoint as its functionality is now in /api/daily-wisdom.

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});