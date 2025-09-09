// sync-daily-fengshui-tip.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import fetch from 'node-fetch';

dotenv.config({ quiet: true });
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

function getSeason(targetDate) {
  const month = dayjs(targetDate).month();
  if (month >= 2 && month <= 4) return 'spring (renewal and growth)';
  if (month >= 5 && month <= 7) return 'summer (energy and activity)';
  if (month >= 8 && month <= 10) return 'autumn (harvest and reflection)';
  return 'winter (rest and planning)';
}

function getWeeklyFocus(targetDate) {
  const weekNumber = dayjs(targetDate).week();
  const focuses = [
    'entrance and doorways', 'bedroom energy', 'kitchen and nourishment',
    'workspace optimization', 'bathroom cleansing', 'living room harmony',
    'color and lighting', 'outdoor spaces', 'storage and organization'
  ];
  return focuses[weekNumber % focuses.length];
}

function getDayOfWeekFocus(targetDate) {
  const dayOfWeek = dayjs(targetDate).day();
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

async function fetchWithBackoff(url, options, retries = 3, baseDelay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      const delay = Math.pow(2, i) * baseDelay + Math.random() * 1000;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function getRecentTips(days = 7, excludeDate = null) {
  let cutoffDate = dayjs().subtract(days, 'days').format('YYYY-MM-DD');
  let query = `*[_type == "dailyFengShuiTip" && date > $cutoffDate] | order(date desc) {tip}`;
  let params = { cutoffDate };
  
  if (excludeDate) {
    query = `*[_type == "dailyFengShuiTip" && date > $cutoffDate && date != $excludeDate] | order(date desc) {tip}`;
    params.excludeDate = excludeDate;
  }
  
  try {
    const recentTips = await sanityClient.fetch(query, params);
    return recentTips.map(t => t.tip.toLowerCase());
  } catch (err) {
    return [];
  }
}

async function buildEnhancedPrompt(targetDate) {
  const theme = getRandomTheme();
  const element = getRandomElement();
  const season = getSeason(targetDate);
  const weeklyFocus = getWeeklyFocus(targetDate);
  const dayFocus = getDayOfWeekFocus(targetDate);
  const room = getRandomRoom();
  const action = getRandomAction();
  
  const recentTips = await getRecentTips(7, targetDate);
  const avoidanceClause = recentTips.length > 0 
    ? `\n\nIMPORTANT: Avoid concepts similar to these recent tips: ${recentTips.slice(0, 5).join(', ')}`
    : '';

  const dayName = dayjs(targetDate).format('dddd');

  return `Generate a unique, specific daily Feng Shui tip for ${targetDate} (${dayName}).

CONTEXT & REQUIREMENTS:
- Primary theme: ${theme}
- Element focus: ${element}  
- Season: ${season}
- Weekly focus area: ${weeklyFocus}
- Day's energy: ${dayFocus}

SPECIFICATIONS:
- Must be actionable and specific (15-30 words)
- Start with action verb: "${action}" or similar
- Include specific location: focus on ${room}
- Provide measurable detail (time, distance, quantity, color)
- Avoid generic advice like "clear clutter", "add plants", "improve energy"
- Make it seasonal and element-appropriate

FORMAT: Return only the tip as a direct, specific instruction.${avoidanceClause}`;
}

async function syncDailyFengShuiTip() {
  try {
    // Parse command line arguments for date control
    const args = process.argv.slice(2);
    let dateToGenerate;
    
    if (args.includes('--today')) {
      dateToGenerate = dayjs().format('YYYY-MM-DD');
    } else if (args.includes('--tomorrow')) {
      dateToGenerate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    } else if (args.includes('--yesterday')) {
      dateToGenerate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    } else {
      const customDateArg = args.find(arg => arg.startsWith('--date='));
      if (customDateArg) {
        const customDate = customDateArg.split('=')[1];
        if (dayjs(customDate).isValid()) {
          dateToGenerate = dayjs(customDate).format('YYYY-MM-DD');
        } else {
          console.error('Invalid date format. Use YYYY-MM-DD');
          process.exit(1);
        }
      } else {
        dateToGenerate = dayjs().add(1, 'day').format('YYYY-MM-DD'); // Default to tomorrow
      }
    }
    
    const shouldForceRegenerate = args.includes('--force');
    const targetDay = dayjs(dateToGenerate).format('dddd');
    
    console.log(`Generating feng shui tip for ${dateToGenerate} (${targetDay})...`);

    // Check if content already exists
    const existing = await sanityClient.fetch(
      `*[_type == "dailyFengShuiTip" && date == $targetDate][0]`,
      { targetDate: dateToGenerate }
    );

    if (existing && !shouldForceRegenerate) {
      console.log(`Tip already exists for ${dateToGenerate}. Use --force to regenerate.`);
      return;
    }

    const prompt = await buildEnhancedPrompt(dateToGenerate);

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

    const response = await fetchWithBackoff(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const jsonResponse = result.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(jsonResponse);
    const tip = parsed.tip;

    await sanityClient.createOrReplace({
      _type: 'dailyFengShuiTip',
      _id: `fengshui-${dateToGenerate}`,
      date: dateToGenerate,
      tip,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      metadata: {
        generatedWith: 'enhanced-prompt-v2',
        season: getSeason(dateToGenerate),
        theme: getRandomTheme(),
        element: getRandomElement()
      }
    });

    console.log(`Successfully generated feng shui tip for ${dateToGenerate}`);
    console.log(`Tip: "${tip}"`);
    
  } catch (error) {
    console.error('Failed to generate feng shui tip:', error.message);
    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node sync-daily-fengshui-tip.js [options]

Options:
  --today           Generate for today
  --tomorrow        Generate for tomorrow (default)
  --yesterday       Generate for yesterday  
  --date=YYYY-MM-DD Generate for specific date
  --force           Force regenerate even if exists
  --help, -h        Show this help message

Examples:
  node sync-daily-fengshui-tip.js --today
  node sync-daily-fengshui-tip.js --date=2025-01-15
  node sync-daily-fengshui-tip.js --tomorrow --force
  `);
  process.exit(0);
}

syncDailyFengShuiTip();