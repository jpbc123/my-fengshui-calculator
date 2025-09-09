// delete-western-horoscope-data.js - Enhanced with safety features
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import readline from 'readline';

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

// Define the document types to delete
const documentTypesToDelete = [
  'dailyWesternHoroscope',
  'weeklyWesternHoroscope', 
  'yearlyWesternHoroscope',
];

const westernZodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    dryRun: false,
    force: false,
    types: documentTypesToDelete,
    signs: westernZodiacSigns,
    dateFilter: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--force':
        config.force = true;
        break;
      case '--daily-only':
        config.types = ['dailyWesternHoroscope'];
        break;
      case '--weekly-only':
        config.types = ['weeklyWesternHoroscope'];
        break;
      case '--yearly-only':
        config.types = ['yearlyWesternHoroscope'];
        break;
      case '--sign':
        if (i + 1 < args.length) {
          const sign = args[i + 1].toLowerCase();
          if (westernZodiacSigns.includes(sign)) {
            config.signs = [sign];
            i++; // skip next arg since we used it
          } else {
            console.error(`Invalid sign: ${args[i + 1]}. Valid signs: ${westernZodiacSigns.join(', ')}`);
            process.exit(1);
          }
        }
        break;
      case '--date':
        if (i + 1 < args.length) {
          config.dateFilter = args[i + 1];
          i++; // skip next arg since we used it
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
Western Horoscope Delete Script

Usage: node delete-western-horoscope-data.js [OPTIONS]

Safety Options:
  --dry-run      Show what would be deleted without actually deleting
  --force        Skip confirmation prompt (USE WITH CAUTION)

Type Options (choose one):
  --daily-only   Delete only daily horoscopes
  --weekly-only  Delete only weekly horoscopes  
  --yearly-only  Delete only yearly horoscopes
  (default: deletes all types)

Filter Options:
  --sign [SIGN]  Delete for specific zodiac sign only
  --date [DATE]  Delete for specific date (YYYY-MM-DD format)
                 For daily: exact date match
                 For weekly: week containing this date
                 For yearly: year containing this date

Examples:
  node delete-western-horoscope-data.js --dry-run
  node delete-western-horoscope-data.js --daily-only --sign aries
  node delete-western-horoscope-data.js --date 2025-09-09
  node delete-western-horoscope-data.js --weekly-only --force
  `);
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function askConfirmation(message) {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function buildQuery(docType, config) {
  let query = `*[_type == "${docType}"`;
  
  // Add sign filter
  if (config.signs.length < westernZodiacSigns.length) {
    const signFilter = config.signs.map(sign => `"${sign}"`).join(', ');
    query += ` && sign in [${signFilter}]`;
  }
  
  // Add date filter
  if (config.dateFilter) {
    const targetDate = dayjs(config.dateFilter);
    if (!targetDate.isValid()) {
      throw new Error(`Invalid date format: ${config.dateFilter}. Use YYYY-MM-DD format.`);
    }
    
    if (docType === 'dailyWesternHoroscope') {
      query += ` && forDate == "${config.dateFilter}"`;
    } else if (docType === 'weeklyWesternHoroscope') {
      const weekStart = targetDate.startOf('week').format('YYYY-MM-DD');
      query += ` && startDate == "${weekStart}"`;
    } else if (docType === 'yearlyWesternHoroscope') {
      const year = targetDate.year();
      query += ` && year == ${year}`;
    }
  }
  
  query += ']';
  return query;
}

async function deleteHoroscopeData() {
  const config = parseArgs();
  
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${config.dryRun ? 'DRY RUN - ' : ''}Starting Western horoscope deletion...`);
  console.log(`Target types: ${config.types.join(', ')}`);
  console.log(`Target signs: ${config.signs.join(', ')}`);
  if (config.dateFilter) {
    console.log(`Date filter: ${config.dateFilter}`);
  }
  console.log('---');

  try {
    let totalToDelete = 0;
    const deletionPlan = [];

    // First, count what will be deleted
    for (const docType of config.types) {
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Analyzing ${docType}...`);

      const query = await buildQuery(docType, config);
      const docs = await sanityClient.fetch(`${query}{_id, sign, forDate, startDate, endDate, year}`);

      if (docs.length === 0) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] No documents of type "${docType}" found matching criteria.`);
        continue;
      }

      deletionPlan.push({
        docType,
        docs,
        count: docs.length
      });

      totalToDelete += docs.length;
      
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Found ${docs.length} documents of type "${docType}"`);
      
      // Show sample of what will be deleted
      if (docs.length <= 5) {
        docs.forEach(doc => {
          const dateInfo = doc.forDate || `${doc.startDate || ''}-${doc.endDate || ''}` || doc.year || 'unknown';
          console.log(`   - ${doc.sign} (${dateInfo})`);
        });
      } else {
        docs.slice(0, 3).forEach(doc => {
          const dateInfo = doc.forDate || `${doc.startDate || ''}-${doc.endDate || ''}` || doc.year || 'unknown';
          console.log(`   - ${doc.sign} (${dateInfo})`);
        });
        console.log(`   ... and ${docs.length - 3} more`);
      }
    }

    if (totalToDelete === 0) {
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] No documents found matching the specified criteria.`);
      return;
    }

    console.log('---');
    console.log(`TOTAL DOCUMENTS TO DELETE: ${totalToDelete}`);

    if (config.dryRun) {
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] DRY RUN COMPLETE - No documents were actually deleted.`);
      return;
    }

    // Confirmation prompt (unless --force is used)
    if (!config.force) {
      const confirmed = await askConfirmation(`Are you sure you want to DELETE ${totalToDelete} Western horoscope documents? This action cannot be undone.`);
      if (!confirmed) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Deletion cancelled by user.`);
        return;
      }
    }

    // Perform actual deletion
    let deletedCount = 0;
    for (const plan of deletionPlan) {
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Deleting ${plan.count} documents of type "${plan.docType}"...`);

      const ids = plan.docs.map(doc => doc._id);
      
      // Use a transaction to delete all documents by ID
      const transaction = sanityClient.transaction();
      ids.forEach(id => transaction.delete(id));

      const result = await transaction.commit();
      deletedCount += plan.count;
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully deleted ${plan.count} documents of type "${plan.docType}".`);
    }

    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Deletion complete. Total documents deleted: ${deletedCount}`);
  } catch (error) {
    console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to perform deletion:`, error);
  }
}

deleteHoroscopeData();