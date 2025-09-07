// pre-cache-chinese-horoscopes.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

// Load environment variables from .env (as you specified in your prompt)
dotenv.config({ path: './.env' }); 

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Supabase URL or Service Role Key is missing. Please check your .env file.`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const chineseZodiacSigns = [ // Renamed for clarity to avoid conflict with 'zodiacSigns' in comments
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

// Helper function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to get daily date for API calls
function getDailyDateForAPI(dayOffset = 0) {
    const targetDate = dayjs().add(dayOffset, 'day');
    return targetDate.format('YYYY-MM-DD');
}

// Helper to get week dates for API calls
function getWeekDatesForAPI() {
    const weekStartDate = dayjs().startOf('week'); // This defaults to the most recent Sunday
    const weekEndDate = weekStartDate.add(6, 'day'); // 6 days later is Saturday
    return {
        start: weekStartDate.format('YYYY-MM-DD'),
        end: weekEndDate.format('YYYY-MM-DD')
    };
}

// Function to call the backend API endpoint for Chinese horoscopes
async function callChineseHoroscopeAPI(sign, period, dayOffset = 0) {
    // Construct the URL parameters based on period and dayOffset
    let apiUrl = `http://localhost:3001/api/chinese-horoscope/${sign}?period=${period}`;
    if (period === 'daily') {
        apiUrl += `&dayOffset=${dayOffset}`;
    }

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        // The Chinese horoscope endpoint directly returns the horoscope object, not wrapped in { horoscope: {...} }
        return result; 
    } catch (error) {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Detailed API call error for ${sign}, ${period}:`, error);
        throw error;
    }
}

// Function to cache daily Chinese horoscopes
async function cacheDailyHoroscopes(dayOffset = 0) {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Caching daily Chinese horoscopes for dayOffset ${dayOffset}...`);
  const date = getDailyDateForAPI(dayOffset);
  
  for (const sign of chineseZodiacSigns) {
    try {
      // Call the API
      const horoscopeData = await callChineseHoroscopeAPI(sign, 'daily', dayOffset);

      if (horoscopeData) {
        const { error: upsertError } = await supabase
          .from('daily_chinese_horoscope') // Corrected table name
          .upsert({
            sign: sign,
            for_date: date,
            horoscope: horoscopeData.horoscope,
            horoscope_en: horoscopeData.horoscope_en,
            love: horoscopeData.love,
            love_en: horoscopeData.love_en,
            money: horoscopeData.money,
            money_en: horoscopeData.money_en,
            career: horoscopeData.career,
            career_en: horoscopeData.career_en,
            social: horoscopeData.social,
            social_en: horoscopeData.social_en,
            lucky_color: horoscopeData.lucky_color,
            lucky_color_en: horoscopeData.lucky_color_en,
            lucky_number: horoscopeData.lucky_number,
            lucky_number_en: horoscopeData.lucky_number_en,
          }, { onConflict: 'sign,for_date' });

        if (upsertError) {
          console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error upserting daily Chinese horoscope for ${sign} on ${date}:`, upsertError);
        } else {
          console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully cached daily Chinese horoscope for ${sign} on ${date}.`);
        }
      }
    } catch (err) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to cache daily Chinese horoscope for ${sign} on ${date}:`, err.message);
    }
    await delay(10000); // Wait 10 seconds before the next call
  }
}

// Function to cache weekly Chinese horoscopes
async function cacheWeeklyHoroscopes() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Caching weekly Chinese horoscopes...`);
  const { start, end } = getWeekDatesForAPI();
  
  for (const sign of chineseZodiacSigns) {
    try {
      // Call the API
      const horoscopeData = await callChineseHoroscopeAPI(sign, 'weekly');

      if (horoscopeData) {
        const { error: upsertError } = await supabase
          .from('weekly_chinese_horoscope') // Corrected table name
          .upsert({
            sign: sign,
            start_date: start,
            end_date: end,
            horoscope: horoscopeData.horoscope,
            horoscope_en: horoscopeData.horoscope_en,
            love: horoscopeData.love,
            love_en: horoscopeData.love_en,
            money: horoscopeData.money,
            money_en: horoscopeData.money_en,
            career: horoscopeData.career,
            career_en: horoscopeData.career_en,
            social: horoscopeData.social,
            social_en: horoscopeData.social_en,
            lucky_color: horoscopeData.lucky_color,
            lucky_color_en: horoscopeData.lucky_color_en,
            lucky_number: horoscopeData.lucky_number,
            lucky_number_en: horoscopeData.lucky_number_en,
          }, { onConflict: 'sign,start_date' });

        if (upsertError) {
          console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error upserting weekly Chinese horoscope for ${sign} (${start} to ${end}):`, upsertError);
        } else {
          console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully cached weekly Chinese horoscope for ${sign} (${start} to ${end}).`);
        }
      }
    } catch (err) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to cache weekly Chinese horoscope for ${sign}:`, err.message);
    }
    await delay(10000); // Wait 10 seconds before the next call
  }
}

// Function to cache yearly Chinese horoscopes
async function cacheYearlyHoroscopes() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Caching yearly Chinese horoscopes...`);
  const currentYear = dayjs().year();

  for (const sign of chineseZodiacSigns) {
    try {
      // Call the API
      const horoscopeData = await callChineseHoroscopeAPI(sign, 'yearly');

      if (horoscopeData) {
        const { error: upsertError } = await supabase
          .from('current_yr_general_chinese_horoscope') // Corrected table name
          .upsert({
            sign: sign,
            year: currentYear,
            horoscope: horoscopeData.horoscope,
            horoscope_en: horoscopeData.horoscope_en,
            love: horoscopeData.love,
            love_en: horoscopeData.love_en,
            money: horoscopeData.money,
            money_en: horoscopeData.money_en,
            career: horoscopeData.career,
            career_en: horoscopeData.career_en,
            social: horoscopeData.social,
            social_en: horoscopeData.social_en,
            lucky_color: horoscopeData.lucky_color,
            lucky_color_en: horoscopeData.lucky_color_en,
            lucky_number: horoscopeData.lucky_number,
            lucky_number_en: horoscopeData.lucky_number_en,
          }, { onConflict: 'sign,year' });

        if (upsertError) {
          console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error upserting yearly Chinese horoscope for ${sign} (${currentYear}):`, upsertError);
        } else {
          console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully cached yearly Chinese horoscope for ${sign} (${currentYear}).`);
        }
      }
    } catch (err) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to cache yearly Chinese horoscope for ${sign}:`, err.message);
    }
    await delay(10000); // Wait 10 seconds before the next call
  }
}

async function main() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Chinese horoscope pre-caching process...`);
  // Add a 5-second initial delay just in case the server is starting up
  await delay(5000); 
  
  await cacheDailyHoroscopes(0);  // Today's daily
  await cacheDailyHoroscopes(1);  // Tomorrow's daily
  await cacheDailyHoroscopes(-1); // Yesterday's daily
  await cacheWeeklyHoroscopes();  // Current week
  await cacheYearlyHoroscopes();  // Current year
  
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Chinese horoscope pre-caching process completed.`);
}

main();