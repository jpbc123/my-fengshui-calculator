// cleanup-old-daily-horoscopes.js
// Deletes daily horoscope documents older than N days (default: 2)
// Usage:
//   node cleanup-old-daily-horoscopes.js --dry-run          # preview what gets deleted
//   node cleanup-old-daily-horoscopes.js --force            # delete without confirmation
//   node cleanup-old-daily-horoscopes.js --keep-days 5      # keep last 5 days instead of 2
//   node cleanup-old-daily-horoscopes.js --western-only     # only clean western
//   node cleanup-old-daily-horoscopes.js --chinese-only     # only clean chinese

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

// --- Config from CLI args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    dryRun: false,
    force: false,
    keepDays: 2,
    types: ['dailyWesternHoroscope', 'dailyChineseHoroscope'],
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--force':
        config.force = true;
        break;
      case '--keep-days':
        config.keepDays = parseInt(args[++i], 10);
        if (isNaN(config.keepDays) || config.keepDays < 0) {
          console.error('--keep-days must be a non-negative integer');
          process.exit(1);
        }
        break;
      case '--western-only':
        config.types = ['dailyWesternHoroscope'];
        break;
      case '--chinese-only':
        config.types = ['dailyChineseHoroscope'];
        break;
      case '--help':
        console.log(`
Cleanup Old Daily Horoscopes

Usage: node cleanup-old-daily-horoscopes.js [OPTIONS]

Options:
  --dry-run         Preview what would be deleted (no actual deletion)
  --force           Skip confirmation prompt
  --keep-days N     Keep the last N days (default: 2, meaning today + 2 days back)
  --western-only    Only clean Western daily horoscopes
  --chinese-only    Only clean Chinese daily horoscopes
  --help            Show this help message
`);
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${args[i]}. Use --help for usage.`);
        process.exit(1);
    }
  }
  return config;
}

function askConfirmation(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function run() {
  const config = parseArgs();
  const today = dayjs().format('YYYY-MM-DD');
  const cutoffDate = dayjs().subtract(config.keepDays, 'day').format('YYYY-MM-DD');

  const tag = config.dryRun ? 'DRY RUN' : 'CLEANUP';
  console.log(`[${tag}] Keeping daily horoscopes from ${cutoffDate} to ${today} (last ${config.keepDays} days + today)`);
  console.log(`[${tag}] Will delete documents with forDate < "${cutoffDate}"`);
  console.log(`[${tag}] Target types: ${config.types.join(', ')}`);
  console.log('---');

  let grandTotal = 0;
  const plans = [];

  for (const docType of config.types) {
    // Fetch all documents with forDate older than the cutoff
    const query = `*[_type == "${docType}" && forDate < "${cutoffDate}"] | order(forDate asc)`;
    const docs = await sanityClient.fetch(`${query}{ _id, sign, forDate }`);

    if (docs.length === 0) {
      console.log(`  ${docType}: 0 old documents found — nothing to delete`);
      continue;
    }

    const oldest = docs[0].forDate;
    const newest = docs[docs.length - 1].forDate;
    console.log(`  ${docType}: ${docs.length} documents to delete (${oldest} → ${newest})`);

    plans.push({ docType, docs });
    grandTotal += docs.length;
  }

  console.log('---');

  if (grandTotal === 0) {
    console.log('Nothing to clean up. You are all good!');
    return;
  }

  console.log(`TOTAL TO DELETE: ${grandTotal} documents`);

  if (config.dryRun) {
    console.log('\nDry run complete — no documents were deleted.');
    return;
  }

  if (!config.force) {
    const ok = await askConfirmation(`\nProceed with deleting ${grandTotal} documents? This cannot be undone.`);
    if (!ok) {
      console.log('Cancelled.');
      return;
    }
  }

  // Delete in batches of 100 (Sanity transaction limit is ~200, stay safe)
  const BATCH_SIZE = 100;
  let deletedTotal = 0;

  for (const { docType, docs } of plans) {
    const ids = docs.map((d) => d._id);

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const tx = sanityClient.transaction();
      batch.forEach((id) => tx.delete(id));
      await tx.commit();
      deletedTotal += batch.length;
      console.log(`  Deleted ${Math.min(i + BATCH_SIZE, ids.length)}/${ids.length} from ${docType}`);
    }
  }

  console.log(`\nDone! Deleted ${deletedTotal} old daily horoscope documents.`);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
