// sync-mercury-retrograde-accurate.js
// Uses hardcoded accurate astronomical data from professional sources
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config({ quiet: true });

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

// Accurate Mercury Retrograde dates from astronomical sources
// Sources: astro.com, cafeastrology.com, timeanddate.com
const MERCURY_RETROGRADE_DATA = {
  2024: [
    {
      preRetrograde: '2024-03-18',
      startDate: '2024-04-01',
      endDate: '2024-04-25',
      postRetrograde: '2024-05-13',
      sign: 'Aries',
      intensity: 'medium',
      description: 'Mercury retrograde in Aries brings impulsive communication mishaps and hasty decisions that need revision. Leadership initiatives may stall or require reconsideration.',
      effects: ['Impulsive decisions backfire', 'Rushed communication', 'Leadership challenges', 'Anger management needed', 'Initiative delays']
    },
    {
      preRetrograde: '2024-07-16',
      startDate: '2024-08-05',
      endDate: '2024-08-28',
      postRetrograde: '2024-09-11',
      sign: 'Leo',
      intensity: 'high',
      description: 'Mercury retrograde in Leo amplifies ego-driven miscommunications and creative blocks. Performance and self-expression face obstacles requiring patience and revision.',
      effects: ['Creative blocks', 'Ego conflicts', 'Performance anxiety', 'Recognition delays', 'Drama amplified']
    },
    {
      preRetrograde: '2024-11-07',
      startDate: '2024-11-26',
      endDate: '2024-12-15',
      postRetrograde: '2024-12-24',
      sign: 'Sagittarius',
      intensity: 'medium',
      description: 'Mercury retrograde in Sagittarius disrupts travel plans and challenges philosophical beliefs. Learning processes and long-distance communications face delays.',
      effects: ['Travel disruptions', 'Belief challenges', 'Learning delays', 'Philosophical debates', 'Optimism tested']
    }
  ],
  2025: [
    {
      preRetrograde: '2025-02-25',
      startDate: '2025-03-15',
      endDate: '2025-04-07',
      postRetrograde: '2025-04-23',
      sign: 'Pisces',
      intensity: 'high',
      description: 'Mercury retrograde in Pisces clouds intuition and blurs the line between dreams and reality. Confusion in communication reaches peak levels, requiring extra grounding.',
      effects: ['Confusion amplified', 'Illusions exposed', 'Intuition clouded', 'Escapism tempting', 'Boundaries blurred']
    },
    {
      preRetrograde: '2025-06-23',
      startDate: '2025-07-18',
      endDate: '2025-08-11',
      postRetrograde: '2025-08-27',
      sign: 'Leo',
      intensity: 'high',
      description: 'Mercury retrograde in Leo brings creative setbacks and ego clashes. Dramatic communications need careful handling, and performance-related matters require extra attention.',
      effects: ['Creative projects stall', 'Ego-driven mistakes', 'Performance issues', 'Recognition problems', 'Self-expression blocked']
    },
    {
      preRetrograde: '2025-10-24',
      startDate: '2025-11-09',
      endDate: '2025-11-29',
      postRetrograde: '2025-12-15',
      sign: 'Sagittarius',
      intensity: 'medium',
      description: 'Mercury retrograde in Sagittarius affects travel, education, and belief systems. Plans for expansion require review, and philosophical discussions may lead to misunderstandings.',
      effects: ['Travel delays', 'Educational disruptions', 'Belief questioning', 'Legal issues', 'Cultural misunderstandings']
    }
  ],
  2026: [
    {
      preRetrograde: '2026-02-10',
      startDate: '2026-02-26',
      endDate: '2026-03-20',
      postRetrograde: '2026-04-05',
      sign: 'Pisces',
      intensity: 'high',
      description: 'Mercury retrograde in Pisces creates foggy thinking and emotional miscommunications. Reality checks are essential as illusions and confusion peak.',
      effects: ['Mental fog', 'Emotional confusion', 'Deception risks', 'Intuitive errors', 'Dream confusion']
    },
    {
      preRetrograde: '2026-06-10',
      startDate: '2026-06-30',
      endDate: '2026-07-24',
      postRetrograde: '2026-08-09',
      sign: 'Cancer',
      intensity: 'medium',
      description: 'Mercury retrograde in Cancer brings emotional communications to the forefront. Family matters and home-related decisions need careful consideration and patience.',
      effects: ['Family miscommunications', 'Emotional outbursts', 'Home issues', 'Past resurfaces', 'Nurturing conflicts']
    },
    {
      preRetrograde: '2026-10-08',
      startDate: '2026-10-24',
      endDate: '2026-11-13',
      postRetrograde: '2026-11-29',
      sign: 'Scorpio',
      intensity: 'high',
      description: 'Mercury retrograde in Scorpio unearths hidden information and intensifies power struggles. Trust issues and secrets come to light, requiring honest communication.',
      effects: ['Secrets revealed', 'Trust issues', 'Power struggles', 'Intense confrontations', 'Hidden matters exposed']
    }
  ]
};

// Determine intensity based on duration and sign
function determineIntensity(startDate, endDate, sign) {
  const duration = dayjs(endDate).diff(dayjs(startDate), 'days');
  
  // Mercury retrograde in certain signs tends to be more intense
  const intenseSigns = ['Gemini', 'Virgo', 'Pisces', 'Scorpio'];
  const isIntenseSign = intenseSigns.includes(sign);
  
  if (duration > 24 || isIntenseSign) return 'high';
  if (duration > 20) return 'medium';
  return 'low';
}

async function syncMercuryRetrograde() {
  try {
    const args = process.argv.slice(2);
    let yearToGenerate;
    
    // Parse year argument
    if (args.includes('--this-year')) {
      yearToGenerate = new Date().getFullYear();
    } else if (args.includes('--next-year')) {
      yearToGenerate = new Date().getFullYear() + 1;
    } else {
      const customYearArg = args.find(arg => arg.startsWith('--year='));
      if (customYearArg) {
        const customYear = customYearArg.split('=')[1];
        if (/^\d{4}$/.test(customYear)) {
          yearToGenerate = parseInt(customYear);
        } else {
          console.error('Invalid year format. Use --year=YYYY');
          process.exit(1);
        }
      } else {
        yearToGenerate = new Date().getFullYear();
      }
    }
    
    const shouldForceRegenerate = args.includes('--force');
    
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Syncing Mercury Retrograde data for ${yearToGenerate}`);
    console.log(`Using astronomically accurate data from professional sources`);
    console.log(`Force regenerate: ${shouldForceRegenerate}`);
    console.log('---');

    // Check if we have data for this year
    if (!MERCURY_RETROGRADE_DATA[yearToGenerate]) {
      console.error(`No Mercury Retrograde data available for ${yearToGenerate}`);
      console.error(`Available years: ${Object.keys(MERCURY_RETROGRADE_DATA).join(', ')}`);
      console.error('\nTo add more years, update the MERCURY_RETROGRADE_DATA object in this script.');
      console.error('Get accurate dates from: https://cafeastrology.com/mercuryretrogradedates.html');
      process.exit(1);
    }

    // Check if data already exists
    const existingRetrogrades = await sanityClient.fetch(
      `*[_type == "mercuryRetrograde" && year == ${yearToGenerate}]`
    );

    if (existingRetrogrades.length > 0 && !shouldForceRegenerate) {
      console.log(`Mercury Retrograde data already exists for ${yearToGenerate} (${existingRetrogrades.length} periods).`);
      console.log('Use --force to regenerate.');
      return;
    }

    const retrogrades = MERCURY_RETROGRADE_DATA[yearToGenerate];
    console.log(`Found ${retrogrades.length} Mercury Retrograde periods for ${yearToGenerate}`);
    console.log('---');

    // Store in Sanity
    for (let i = 0; i < retrogrades.length; i++) {
      const retrograde = retrogrades[i];
      
      const doc = {
        _type: 'mercuryRetrograde',
        _id: `mercury-retrograde-${yearToGenerate}-${i + 1}`,
        year: yearToGenerate,
        phase: i + 1,
        startDate: retrograde.startDate,
        endDate: retrograde.endDate,
        preRetrograde: retrograde.preRetrograde,
        postRetrograde: retrograde.postRetrograde,
        sign: retrograde.sign,
        intensity: retrograde.intensity,
        description: retrograde.description,
        effects: retrograde.effects,
        autoGenerated: false,
        source: 'astronomical-data',
        createdAt: new Date().toISOString(),
      };
      
      await sanityClient.createOrReplace(doc);
      
      console.log(`✓ Phase ${i + 1}: ${retrograde.sign}`);
      console.log(`  Pre-Shadow: ${retrograde.preRetrograde}`);
      console.log(`  Retrograde: ${retrograde.startDate} to ${retrograde.endDate}`);
      console.log(`  Post-Shadow: ${retrograde.postRetrograde}`);
      console.log(`  Duration: ${dayjs(retrograde.endDate).diff(dayjs(retrograde.startDate), 'days')} days`);
      console.log(`  Intensity: ${retrograde.intensity}`);
      console.log('');
    }

    console.log('---');
    console.log(`✓ Successfully stored ${retrogrades.length} astronomically accurate Mercury Retrograde periods for ${yearToGenerate}`);
    console.log('\nYour countdown should now show the correct number of days!');
    
  } catch (error) {
    console.error('Failed to sync Mercury Retrograde data:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node sync-mercury-retrograde-accurate.js [options]

This script uses astronomically accurate Mercury Retrograde dates from professional sources.
No additional packages required - data is hardcoded from verified astronomical sources.

Data Sources:
- Cafe Astrology (cafeastrology.com)
- Astro.com
- TimeAndDate.com

Available Years: ${Object.keys(MERCURY_RETROGRADE_DATA).join(', ')}

Year Options:
  --this-year       Generate for current year (default)
  --next-year       Generate for next year
  --year=YYYY       Generate for specific year

Other Options:
  --force           Force regenerate even if exists
  --help, -h        Show this help message

Examples:
  node sync-mercury-retrograde-accurate.js --this-year
  node sync-mercury-retrograde-accurate.js --year=2025 --force
  node sync-mercury-retrograde-accurate.js --next-year

To add more years:
  1. Visit https://cafeastrology.com/mercuryretrogradedates.html
  2. Copy accurate dates for the year
  3. Add to MERCURY_RETROGRADE_DATA object in this script
  `);
  process.exit(0);
}

syncMercuryRetrograde().catch((err) => {
  console.error('Failed to sync Mercury Retrograde:', err.message);
  process.exit(1);
});