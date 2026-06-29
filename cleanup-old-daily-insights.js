// cleanup-old-daily-insights.js
// Deletes old dailyFengShuiTip and dailyWisdom documents from Sanity
// Usage:
//   node cleanup-old-daily-insights.js --dry-run              # preview what gets deleted
//   node cleanup-old-daily-insights.js --force                # delete without confirmation
//   node cleanup-old-daily-insights.js --keep-days 5          # keep last 5 days instead of 2
//   node cleanup-old-daily-insights.js --fengshui-only        # only clean dailyFengShuiTip
//   node cleanup-old-daily-insights.js --wisdom-only          # only clean dailyWisdom

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
    types: ['dailyFengShuiTip', 'dailyWisdom'],
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
      case '--fengshui-only':
        config.types = ['dailyFengShuiTip'];
        break;
      case '--wisdom-only':
        config.types = ['dailyWisdom'];
        break;
      case '--help':
        console.log(`
Cleanup Old Daily Insights (Feng Shui Tips, Daily Wisdom)

Usage: node cleanup-old-daily-insights.js [OPTIONS]

Options:
  --dry-run           Preview what would be deleted (no actual deletion)
  --force             Skip confirmation prompt
  --keep-days N       Keep the last N days (default: 2, meaning today + 2 days back)
  --fengshui-only     Only clean Daily Feng Shui Tips
  --wisdom-only       Only clean Daily Wisdom
  --help              Show this help message
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
  console.log(`[${tag}] Keeping daily insights from ${cutoffDate} to ${today} (last ${config.keepDays} days + today)`);
  console.log(`[${tag}] Will delete documents with date < "${cutoffDate}"`);
  console.log(`[${tag}] Target types: ${config.types.join(', ')}`);
  console.log('---');

  let grandTotal = 0;
  const plans = [];

  for (const docType of config.types) {
    const query = `*[_type == "${docType}" && date < "${cutoffDate}"] | order(date asc)`;
    const docs = await sanityClient.fetch(`${query}{ _id, date }`);

    if (docs.length === 0) {
      console.log(`  ${docType}: 0 old documents found — nothing to delete`);
      continue;
    }

    const oldest = docs[0].date;
    const newest = docs[docs.length - 1].date;
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

  console.log(`\nDone! Deleted ${deletedTotal} old daily insight documents.`);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
