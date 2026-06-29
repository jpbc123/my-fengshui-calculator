// cleanup-old-planetary-overviews.js
// Deletes old dailyPlanetaryOverview documents from Sanity
// Usage:
//   node cleanup-old-planetary-overviews.js --dry-run          # preview what gets deleted
//   node cleanup-old-planetary-overviews.js --force            # delete without confirmation
//   node cleanup-old-planetary-overviews.js --keep-days 45     # keep last 45 days instead of 31

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

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    dryRun: false,
    force: false,
    keepDays: 31,
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
      case '--help':
        console.log(`
Cleanup Old Daily Planetary Overviews

Usage: node cleanup-old-planetary-overviews.js [OPTIONS]

Options:
  --dry-run         Preview what would be deleted (no actual deletion)
  --force           Skip confirmation prompt
  --keep-days N     Keep the last N days (default: 31)
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
  console.log(`[${tag}] Keeping planetary overviews from ${cutoffDate} to ${today} (last ${config.keepDays} days + today)`);
  console.log(`[${tag}] Will delete documents with date < "${cutoffDate}"`);
  console.log('---');

  const query = `*[_type == "dailyPlanetaryOverview" && date < "${cutoffDate}"] | order(date asc)`;
  const docs = await sanityClient.fetch(`${query}{ _id, date }`);

  if (docs.length === 0) {
    console.log('No old planetary overview documents found — nothing to delete.');
    return;
  }

  const oldest = docs[0].date;
  const newest = docs[docs.length - 1].date;
  console.log(`  dailyPlanetaryOverview: ${docs.length} documents to delete (${oldest} → ${newest})`);
  console.log('---');
  console.log(`TOTAL TO DELETE: ${docs.length} documents`);

  if (config.dryRun) {
    console.log('\nDry run complete — no documents were deleted.');
    return;
  }

  if (!config.force) {
    const ok = await askConfirmation(`\nProceed with deleting ${docs.length} documents? This cannot be undone.`);
    if (!ok) {
      console.log('Cancelled.');
      return;
    }
  }

  const BATCH_SIZE = 100;
  const ids = docs.map((d) => d._id);
  let deletedTotal = 0;

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const tx = sanityClient.transaction();
    batch.forEach((id) => tx.delete(id));
    await tx.commit();
    deletedTotal += batch.length;
    console.log(`  Deleted ${Math.min(i + BATCH_SIZE, ids.length)}/${ids.length} from dailyPlanetaryOverview`);
  }

  console.log(`\nDone! Deleted ${deletedTotal} old planetary overview documents.`);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
