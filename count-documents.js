// count-documents.js - Count documents in Sanity collections
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

// Define all document types to count
const documentTypes = [
  { type: 'dailyChineseHoroscope', name: 'Daily Chinese Horoscopes' },
  { type: 'dailyWesternHoroscope', name: 'Daily Western Horoscopes' },
  { type: 'weeklyChineseHoroscope', name: 'Weekly Chinese Horoscopes' },
  { type: 'weeklyWesternHoroscope', name: 'Weekly Western Horoscopes' },
  { type: 'yearlyChineseHoroscope', name: 'Yearly Chinese Horoscopes' },
  { type: 'yearlyWesternHoroscope', name: 'Yearly Western Horoscopes' },
  { type: 'dailyWisdom', name: 'Daily Wisdom' },
  { type: 'dailyFengShuiTip', name: 'Daily Feng Shui Tips' },
  { type: 'dailyPlanetaryOverview', name: 'Daily Planetary Overview' },
];

const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
];

const westernZodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    detailed: false,
    bySign: false,
    dateRange: false,
    startDate: null,
    endDate: null,
    type: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--detailed':
        config.detailed = true;
        break;
      case '--by-sign':
        config.bySign = true;
        break;
      case '--date-range':
        config.dateRange = true;
        break;
      case '--start-date':
        if (i + 1 < args.length) {
          config.startDate = args[i + 1];
          i++;
        }
        break;
      case '--end-date':
        if (i + 1 < args.length) {
          config.endDate = args[i + 1];
          i++;
        }
        break;
      case '--type':
        if (i + 1 < args.length) {
          config.type = args[i + 1];
          i++;
        }
        break;
      case '--help':
        showHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}. Use --help for usage information.`);
        process.exit(1);
    }
  }

  return config;
}

function showHelp() {
  console.log(`
Sanity Document Counter

Usage: node count-documents.js [OPTIONS]

Options:
  --detailed             Show sample documents and date ranges
  --by-sign             Break down counts by zodiac sign (for horoscopes)
  --date-range          Show date range for each collection
  --start-date [DATE]   Count documents from this date onwards (YYYY-MM-DD)
  --end-date [DATE]     Count documents up to this date (YYYY-MM-DD)
  --type [TYPE]         Count only specific document type

Available types:
  dailyChineseHoroscope, dailyWesternHoroscope, weeklyChineseHoroscope,
  weeklyWesternHoroscope, yearlyChineseHoroscope, yearlyWesternHoroscope,
  dailyWisdom, dailyFengShuiTip, dailyPlanetaryOverview

Examples:
  node count-documents.js
  node count-documents.js --detailed
  node count-documents.js --by-sign --type dailyChineseHoroscope
  node count-documents.js --date-range --start-date 2025-09-01
  node count-documents.js --type dailyWisdom --detailed
  `);
}

async function getDateRange(docType) {
  let dateField = 'date';
  
  // Determine the correct date field for each type
  if (docType.includes('daily')) {
    if (docType.includes('Horoscope')) {
      dateField = 'forDate';
    } else {
      dateField = 'date';
    }
  } else if (docType.includes('weekly')) {
    dateField = 'startDate';
  } else if (docType.includes('yearly')) {
    dateField = 'year';
  }

  try {
    const result = await sanityClient.fetch(`{
      "earliest": *[_type == "${docType}"] | order(${dateField} asc)[0].${dateField},
      "latest": *[_type == "${docType}"] | order(${dateField} desc)[0].${dateField}
    }`);
    
    return result;
  } catch (error) {
    return { earliest: null, latest: null };
  }
}

async function getCountBySign(docType, config) {
  const isChineseHoroscope = docType.includes('Chinese');
  const isWesternHoroscope = docType.includes('Western');
  
  if (!isChineseHoroscope && !isWesternHoroscope) {
    return null; // Not a horoscope type
  }

  const signs = isChineseHoroscope ? chineseZodiacSigns : westernZodiacSigns;
  const signCounts = {};

  for (const sign of signs) {
    let query = `count(*[_type == "${docType}" && sign == "${sign}"])`;
    
    // Add date filters if specified
    if (config.startDate || config.endDate) {
      let dateField = docType.includes('daily') ? 'forDate' : 
                     docType.includes('weekly') ? 'startDate' : 'year';
      
      const conditions = [`_type == "${docType}"`, `sign == "${sign}"`];
      
      if (config.startDate) {
        conditions.push(`${dateField} >= "${config.startDate}"`);
      }
      if (config.endDate) {
        conditions.push(`${dateField} <= "${config.endDate}"`);
      }
      
      query = `count(*[${conditions.join(' && ')}])`;
    }
    
    try {
      const count = await sanityClient.fetch(query);
      signCounts[sign] = count;
    } catch (error) {
      signCounts[sign] = 0;
    }
  }

  return signCounts;
}

async function getSampleDocuments(docType, limit = 3) {
  try {
    let dateField = 'date';
    if (docType.includes('daily') && docType.includes('Horoscope')) {
      dateField = 'forDate';
    } else if (docType.includes('weekly')) {
      dateField = 'startDate';
    } else if (docType.includes('yearly')) {
      dateField = 'year';
    }

    const docs = await sanityClient.fetch(`
      *[_type == "${docType}"] | order(${dateField} desc)[0...${limit}] {
        _id,
        ${dateField},
        ${docType.includes('Horoscope') ? 'sign,' : ''}
        _createdAt
      }
    `);
    
    return docs;
  } catch (error) {
    return [];
  }
}

async function countDocuments() {
  const config = parseArgs();
  
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Counting Sanity documents...`);
  if (config.startDate || config.endDate) {
    console.log(`Date filter: ${config.startDate || 'beginning'} to ${config.endDate || 'end'}`);
  }
  console.log('='.repeat(80));

  try {
    const typesToCount = config.type ? 
      documentTypes.filter(dt => dt.type === config.type) : 
      documentTypes;

    if (config.type && typesToCount.length === 0) {
      console.error(`Invalid document type: ${config.type}`);
      console.log('Available types:', documentTypes.map(dt => dt.type).join(', '));
      return;
    }

    let totalDocuments = 0;

    for (const docTypeInfo of typesToCount) {
      const { type: docType, name: displayName } = docTypeInfo;
      
      console.log(`\n📊 ${displayName}`);
      console.log('-'.repeat(50));

      // Build count query with date filters
      let countQuery = `count(*[_type == "${docType}"])`;
      
      if (config.startDate || config.endDate) {
        let dateField = docType.includes('daily') ? 
                       (docType.includes('Horoscope') ? 'forDate' : 'date') :
                       docType.includes('weekly') ? 'startDate' : 'year';
        
        const conditions = [`_type == "${docType}"`];
        
        if (config.startDate) {
          conditions.push(`${dateField} >= "${config.startDate}"`);
        }
        if (config.endDate) {
          conditions.push(`${dateField} <= "${config.endDate}"`);
        }
        
        countQuery = `count(*[${conditions.join(' && ')}])`;
      }

      const count = await sanityClient.fetch(countQuery);
      totalDocuments += count;
      
      console.log(`Total documents: ${count}`);

      // Show date range if requested
      if (config.dateRange && count > 0) {
        const dateRange = await getDateRange(docType);
        if (dateRange.earliest && dateRange.latest) {
          console.log(`Date range: ${dateRange.earliest} to ${dateRange.latest}`);
        }
      }

      // Show count by sign if requested and applicable
      if (config.bySign && count > 0) {
        const signCounts = await getCountBySign(docType, config);
        if (signCounts) {
          console.log('By sign:');
          Object.entries(signCounts).forEach(([sign, signCount]) => {
            console.log(`  ${sign}: ${signCount}`);
          });
        }
      }

      // Show sample documents if detailed view requested
      if (config.detailed && count > 0) {
        const samples = await getSampleDocuments(docType);
        if (samples.length > 0) {
          console.log('Recent documents:');
          samples.forEach(doc => {
            const dateValue = doc.forDate || doc.date || doc.startDate || doc.year;
            const signInfo = doc.sign ? ` (${doc.sign})` : '';
            console.log(`  - ${dateValue}${signInfo} (${doc._id})`);
          });
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`TOTAL DOCUMENTS: ${totalDocuments}`);
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Count complete.`);

  } catch (error) {
    console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to count documents:`, error);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

countDocuments();