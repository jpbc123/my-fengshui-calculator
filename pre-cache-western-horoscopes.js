// pre-cache-western-horoscopes.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

dotenv.config({ path: './.env' }); // Assuming your .env file is named '.env'

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is missing. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const westernZodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

// Helper function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to get period identifiers
const getPeriodDetailsForCaching = (period, dayOffset = 0) => {
  const today = dayjs().add(dayOffset, 'day');
  let dateIdentifier = null;
  let weekIdentifier = null;
  let yearIdentifier = null;

  if (period === 'today' || period === 'yesterday') { // 'yesterday' uses dayOffset -1
    dateIdentifier = today.format('YYYY-MM-DD');
  } else if (period === 'weekly') {
    const startOfWeek = today.startOf('week'); // This assumes Sunday as start of week
    const endOfWeek = startOfWeek.add(6, 'day');
    weekIdentifier = `${startOfWeek.format('YYYY-MM-DD')}_${endOfWeek.format('YYYY-MM-DD')}`;
  } else if (period === 'yearly') {
    yearIdentifier = today.year();
  }
  return { dateIdentifier, weekIdentifier, yearIdentifier };
};

// Function to call the backend API endpoint for Western horoscopes
async function callWesternHoroscopeAPI(sign, period, category, dayOffset = 0) {
  const { dateIdentifier, weekIdentifier, yearIdentifier } = getPeriodDetailsForCaching(period, dayOffset);

  const payload = {
    sign,
    period,
    category,
    dateIdentifier,
    weekIdentifier,
    yearIdentifier,
  };

  try {
    const response = await fetch('http://localhost:3001/api/western-horoscope', { // Ensure this URL matches your server.js
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error body
      throw new Error(errorData.error || `API call failed with status ${response.status}.`);
    }

    const result = await response.json();
    return result.horoscope; // The backend returns { horoscope: {...} }
  } catch (error) {
    // Log the full error to help debug if the backend isn't sending JSON
    console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Detailed API call error for ${sign}, ${period}, ${category}:`, error);
    throw error; // Re-throw the error for the calling function to catch
  }
}

// Function to cache daily Western horoscopes
async function cacheDailyWesternHoroscopes(dayOffset = 0) {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Caching daily Western horoscopes for dayOffset ${dayOffset}...`);
  const date = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
  
  for (const sign of westernZodiacSigns) {
    try {
      // Call the API with category 'overview' initially, it generates all content
      const horoscopeData = await callWesternHoroscopeAPI(sign, dayOffset === 0 ? 'today' : 'yesterday', 'overview', dayOffset);

      if (horoscopeData) {
        const { error: upsertError } = await supabase
          .from('daily_western_horoscopes')
          .upsert({
            sign: sign,
            date: date,
            overview_content: horoscopeData.overview_content,
            love_content: horoscopeData.love_content,
            career_content: horoscopeData.career_content,
            wealth_content: horoscopeData.wealth_content,
            social_content: horoscopeData.social_content,
            lucky_color: horoscopeData.lucky_color,
            lucky_number: horoscopeData.lucky_number,
          }, { onConflict: 'sign,date' });

        if (upsertError) {
          console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error upserting daily Western horoscope for ${sign} on ${date}:`, upsertError);
        } else {
          console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully cached daily Western horoscope for ${sign} on ${date}.`);
        }
      }
    } catch (err) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to cache daily Western horoscope for ${sign} on ${date}:`, err.message);
    }
    await delay(10000); // Wait 10 seconds before the next call
  }
}

// Function to cache weekly Western horoscopes
async function cacheWeeklyWesternHoroscopes() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Caching weekly Western horoscopes...`);
  const { weekIdentifier } = getPeriodDetailsForCaching('weekly');
  const [weekStart, weekEnd] = weekIdentifier.split('_');

  for (const sign of westernZodiacSigns) {
    try {
      const horoscopeData = await callWesternHoroscopeAPI(sign, 'weekly', 'overview');

      if (horoscopeData) {
        const { error: upsertError } = await supabase
          .from('weekly_western_horoscopes')
          .upsert({
            sign: sign,
            week_identifier: weekIdentifier,
            overview_content: horoscopeData.overview_content,
            love_content: horoscopeData.love_content,
            career_content: horoscopeData.career_content,
            wealth_content: horoscopeData.wealth_content,
            social_content: horoscopeData.social_content,
            lucky_color: horoscopeData.lucky_color,
            lucky_number: horoscopeData.lucky_number,
          }, { onConflict: 'sign,week_identifier' });

        if (upsertError) {
          console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error upserting weekly Western horoscope for ${sign} (${weekIdentifier}):`, upsertError);
        } else {
          console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully cached weekly Western horoscope for ${sign} (${weekIdentifier}).`);
        }
      }
    } catch (err) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to cache weekly Western horoscope for ${sign}:`, err.message);
    }
    await delay(10000); // Wait 10 seconds before the next call
  }
}

// Function to cache yearly Western horoscopes
async function cacheYearlyWesternHoroscopes() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Caching yearly Western horoscopes...`);
  const currentYear = dayjs().year();

  for (const sign of westernZodiacSigns) {
    try {
      const horoscopeData = await callWesternHoroscopeAPI(sign, 'yearly', 'overview');

      if (horoscopeData) {
        const { error: upsertError } = await supabase
          .from('yearly_western_horoscopes')
          .upsert({
            sign: sign,
            year: currentYear,
            overview_content: horoscopeData.overview_content,
            love_content: horoscopeData.love_content,
            career_content: horoscopeData.career_content,
            wealth_content: horoscopeData.wealth_content,
            social_content: horoscopeData.social_content,
            lucky_color: horoscopeData.lucky_color,
            lucky_number: horoscopeData.lucky_number,
          }, { onConflict: 'sign,year' });

        if (upsertError) {
          console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Error upserting yearly Western horoscope for ${sign} (${currentYear}):`, upsertError);
        } else {
          console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully cached yearly Western horoscope for ${sign} (${currentYear}).`);
        }
      }
    } catch (err) {
      console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to cache yearly Western horoscope for ${sign}:`, err.message);
    }
    await delay(10000); // Wait 10 seconds before the next call
  }
}

// Main function to run the caching process
async function main() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting Western horoscope pre-caching process...`);
  // Add a 5-second initial delay just in case the server is starting up
  await delay(5000); 

  await cacheDailyWesternHoroscopes(0);  // Today's daily
  await cacheDailyWesternHoroscopes(1);  // Tomorrow's daily
  await cacheDailyWesternHoroscopes(-1); // Yesterday's daily (for potential "yesterday" tab)
  await cacheWeeklyWesternHoroscopes();  // Current week
  await cacheYearlyWesternHoroscopes();  // Current year
  
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Western horoscope pre-caching process completed.`);
}

main();