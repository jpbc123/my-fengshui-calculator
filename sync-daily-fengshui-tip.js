// sync-daily-fengshui-tip.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import fetch from 'node-fetch';

dotenv.config();
dayjs.extend(weekOfYear);

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

// Support Functions for Enhanced Prompting
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
  const month = dayjs().month();
  if (month >= 2 && month <= 4) return 'spring (renewal and growth)';
  if (month >= 5 && month <= 7) return 'summer (energy and activity)';
  if (month >= 8 && month <= 10) return 'autumn (harvest and reflection)';
  return 'winter (rest and planning)';
}

function getWeeklyFocus() {
  const weekNumber = dayjs().week();
  const focuses = [
    'entrance and doorways', 'bedroom energy', 'kitchen and nourishment',
    'workspace optimization', 'bathroom cleansing', 'living room harmony',
    'color and lighting', 'outdoor spaces', 'storage and organization'
  ];
  return focuses[weekNumber % focuses.length];
}

function getDayOfWeekFocus() {
  const dayOfWeek = dayjs().day();
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

// Helper: backoff retries
async function fetchWithBackoff(url, options, retries = 5, baseDelay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * baseDelay + Math.random() * 5000;
        console.warn(`Rate limit hit (429), retrying in ${Math.round(delay / 1000)}s...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${await response.text()}`);
      }
      return response;
    } catch (err) {
      console.error(`Fetch attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      const delay = Math.pow(2, i) * baseDelay + Math.random() * 5000;
      console.warn(`Retrying in ${Math.round(delay / 1000)}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function getRecentTips(days = 7) {
  const cutoffDate = dayjs().subtract(days, 'days').format('YYYY-MM-DD');
  try {
    const recentTips = await sanityClient.fetch(
      `*[_type == "dailyFengShuiTip" && date > $cutoffDate] | order(date desc) {tip}`,
      { cutoffDate }
    );
    return recentTips.map(t => t.tip.toLowerCase());
  } catch (err) {
    console.warn('Could not fetch recent tips for uniqueness check:', err.message);
    return [];
  }
}

async function buildEnhancedPrompt(today) {
  const theme = getRandomTheme();
  const element = getRandomElement();
  const season = getSeason();
  const weeklyFocus = getWeeklyFocus();
  const dayFocus = getDayOfWeekFocus();
  const room = getRandomRoom();
  const action = getRandomAction();
  
  // Get recent tips to avoid repetition
  const recentTips = await getRecentTips(7);
  const avoidanceClause = recentTips.length > 0 
    ? `\n\nIMPORTANT: Avoid concepts similar to these recent tips: ${recentTips.slice(0, 5).join(', ')}`
    : '';

  return `Generate a unique, specific daily Feng Shui tip for ${today}.

CONTEXT & REQUIREMENTS:
- Date: ${today} (${dayjs(today).format('dddd')})
- Primary theme: ${theme}
- Element focus: ${element}  
- Season: ${season}
- Weekly focus area: ${weeklyFocus}
- Today's energy: ${dayFocus}

SPECIFICATIONS:
- Must be actionable and specific (15-30 words)
- Start with action verb: "${action}" or similar
- Include specific location: focus on ${room}
- Provide measurable detail (time, distance, quantity, color)
- Avoid generic advice like "clear clutter", "add plants", "improve energy"
- Make it seasonal and element-appropriate

GOOD EXAMPLES:
- "Place a small round mirror 6 inches left of your front door to activate wealth energy"
- "Move your ${room} chair 3 inches away from the wall to improve ${theme}"  
- "Light a ${element === 'fire' ? 'red' : element === 'water' ? 'blue' : 'white'} candle in your ${room} for exactly 9 minutes at sunset"
- "Add 2 small crystals to your ${room} windowsill to enhance ${theme} this ${season.split(' ')[0]}"

FORMAT: Return only the tip as a direct, specific instruction.${avoidanceClause}`;
}

async function syncDailyFengShuiTip() {
  const today = dayjs().format('YYYY-MM-DD');
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Checking Sanity for Feng Shui tip for ${today}...`);

  // Check if today's tip already exists
  const existing = await sanityClient.fetch(
    `*[_type == "dailyFengShuiTip" && date == $today][0]`,
    { today }
  );

  if (existing) {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Tip already exists for today. Skipping.`);
    return;
  }

  // Build enhanced prompt
  const prompt = await buildEnhancedPrompt(today);

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          tip: { type: "STRING" }
        },
        required: ["tip"]
      }
    }
  };

  try {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Generating new Feng Shui tip...`);
    console.log(`Theme: ${getRandomTheme()}, Element: ${getRandomElement()}, Focus: ${getWeeklyFocus()}`);
    
    const response = await fetchWithBackoff(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const jsonResponse = result.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(jsonResponse);
    const tip = parsed.tip;

    // Store in Sanity
    await sanityClient.createOrReplace({
      _type: 'dailyFengShuiTip',
      _id: `fengshui-${today}`,
      date: today,
      tip,
      createdAt: new Date().toISOString(),
      metadata: {
        generatedWith: 'enhanced-prompt-v2',
        season: getSeason(),
        theme: getRandomTheme(),
        element: getRandomElement()
      }
    });

    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully stored Feng Shui tip: "${tip}"`);
  } catch (err) {
    console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to generate/store Feng Shui tip:`, err.message);
  }
}

syncDailyFengShuiTip();