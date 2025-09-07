// pre-cache-daily-banner.js
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

// Load environment variables from .env
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Supabase URL or Service Role Key is missing. Please check your .env file.`);
  process.exit(1);
}

if (!geminiApiKey) {
  console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] GEMINI_API_KEY is missing. Please check your .env file.`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Helper function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to generate and cache the daily wisdom quote and article
async function cacheDailyWisdom() {
    const today = dayjs().format('YYYY-MM-DD');
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Checking for daily wisdom for ${today}...`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { data: existingData, error: selectError } = await supabase
        .from('daily_wisdom')
        .select('id')
        .eq('date', today);

    if (selectError) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error checking for existing daily wisdom:`, selectError.message);
        return;
    }

    if (existingData && existingData.length > 0) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Daily wisdom already exists for today. Skipping generation.`);
        return;
    }

    const quotePrompt = `Generate a unique, insightful, and concise daily wisdom quote, no longer than 150 characters. The quote should relate to personal growth, harmony, or inner peace, without directly referencing feng shui or astrology.`;
    const articlePrompt = `Expand on the following wisdom quote into a short, engaging article (around 200-300 words). Provide practical advice or a brief reflection on its meaning in daily life: "${quotePrompt}"`;

    try {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating new daily wisdom quote and article...`);
        const quoteResult = await model.generateContent(quotePrompt);
        const quote = quoteResult.response.text().trim();

        await delay(1000); // Add a small delay between API calls
        const articleResult = await model.generateContent(articlePrompt);
        const article = articleResult.response.text().trim();

        const { error: insertError } = await supabase
            .from('daily_wisdom')
            .insert({ date: today, quote, article });

        if (insertError) {
            console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error inserting daily wisdom:`, insertError.message);
        } else {
            console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully generated and stored daily wisdom.`);
        }

    } catch (err) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to generate daily wisdom:`, err.message);
    }
}

// Function to generate and cache today's Feng Shui tip and lucky number
async function cacheDailyFengShuiData() {
    const today = dayjs().format('YYYY-MM-DD');
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Checking for Feng Shui tip for ${today}...`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { data: existingData, error: selectError } = await supabase
        .from('fengshui_tips')
        .select('id')
        .eq('date', today);

    if (selectError) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error checking for existing Feng Shui tip:`, selectError.message);
        return;
    }

    if (existingData && existingData.length > 0) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Feng Shui tip and lucky number already exist for today. Skipping generation.`);
        return;
    }

    const prompt = `Generate a single, unique, and actionable daily Feng Shui tip. The tip should be concise, around 10-20 words, and directly applicable. Example: 'Clear your entryway to welcome positive chi into your home.'`;

    try {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating new Feng Shui tip...`);
        const result = await model.generateContent(prompt);
        const tip = result.response.text().trim();
        
        // Generate a random lucky number
        const luckyNumber = Math.floor(Math.random() * 9) + 1;

        const { error: insertError } = await supabase
            .from('fengshui_tips')
            .insert({ date: today, tip, lucky_number: luckyNumber });

        if (insertError) {
            console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error inserting Feng Shui tip and lucky number:`, insertError.message);
        } else {
            console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully generated and stored Feng Shui tip and lucky number.`);
        }

    } catch (err) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to generate Feng Shui tip:`, err.message);
    }
}

// New function to generate and cache the daily planetary overview
async function cacheDailyPlanetaryOverview() {
    const today = dayjs().format('YYYY-MM-DD');
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Checking for daily planetary overview for ${today}...`);
    
    // First, check if the data already exists
    const { data: existingData, error: selectError } = await supabase
        .from('daily_planetary_overview')
        .select('date')
        .eq('date', today);

    if (selectError) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error checking for existing planetary overview:`, selectError.message);
        return;
    }

    if (existingData && existingData.length > 0) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Planetary overview already exists for today. Skipping generation.`);
        return;
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20"
    });

    const prompt = `Using today's date, ${today}, and current astrological transits and planetary positions, generate a "Daily Planetary Overview". The response should be a JSON object ONLY, with the following properties: a 'planetary_index' (a number from 1 to 5), a concise 'summary' of no more than 150 characters, and a detailed 'article' of at least 200 words. The content should be insightful and easy to understand for a general audience.`;
    
    try {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating new planetary overview...`);

        const response = await model.generateContent({
            contents: [{
                parts: [{ text: prompt }]
            }],
            tools: [{ google_search: {} }],
        });

        // Extract and clean the JSON from the response text
        const responseText = response.response.text();
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        let jsonString = responseText;
        if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1];
        }

        const parsedData = JSON.parse(jsonString);
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generated data:`, parsedData);

        // Insert the generated data into the new Supabase table
        const { error: insertError } = await supabase
            .from('daily_planetary_overview')
            .insert({ 
                date: today, 
                planetary_index: parsedData.planetary_index, 
                summary: parsedData.summary, 
                article: parsedData.article 
            });

        if (insertError) {
            console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error inserting planetary overview:`, insertError.message);
        } else {
            console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully generated and stored daily planetary overview.`);
        }

    } catch (err) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to generate planetary overview:`, err.message);
    }
}

// Main function to run all caching jobs
async function main() {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting daily content pre-caching process...`);
    
    await cacheDailyWisdom();
    await delay(2000); // Wait for 2 seconds to avoid rate limiting
    await cacheDailyFengShuiData();
    await delay(2000);
    await cacheDailyPlanetaryOverview();
    
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Daily content pre-caching process completed.`);
}

main();
