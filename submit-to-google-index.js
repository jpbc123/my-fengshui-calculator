// submit-to-google-index.js
//
// Notifies Google's Indexing API about every URL in public/sitemap.xml.
//
// IMPORTANT REALITY CHECK:
//   Google's Indexing API is officially only for pages with JobPosting or
//   BroadcastEvent (livestream) structured data. For regular content pages you
//   will get "200 OK" responses, but Google does NOT guarantee (and usually
//   does not do) indexing from this pipeline. Treat this as a free, harmless
//   "nudge" — not a fix for "Crawled - currently not indexed". The real levers
//   are content depth and internal linking.
//
// SETUP (one time):
//   1. Google Cloud Console -> new project -> enable "Web Search Indexing API".
//   2. IAM & Admin -> Service Accounts -> create one -> Keys -> Add Key ->
//      JSON. Save the downloaded file next to this script as
//      "service-account.json" (already git-ignored).
//   3. Google Search Console -> Settings -> Users and permissions -> Add User.
//      Paste the ...gserviceaccount.com email and set permission to OWNER
//      (Owner is required; Full/Restricted returns 403).
//
// RUN:
//   npm install googleapis
//   node submit-to-google-index.js            # submit all sitemap URLs
//   node submit-to-google-index.js --dry-run  # print URLs, send nothing

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KEY_PATH = path.join(__dirname, 'service-account.json');
const SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap.xml');
const DRY_RUN = process.argv.includes('--dry-run');
const DELAY_MS = 500; // gentle pacing to avoid rate-limit spikes

// Read every <loc> out of the sitemap. Simple regex is fine for our own
// well-formed sitemap; no XML dependency needed.
function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`Sitemap not found at ${SITEMAP_PATH}. Run "npm run generate-sitemap" first.`);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error('No <loc> entries found in sitemap.');
  return urls;
}

function loadKey() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(
      `service-account.json not found at ${KEY_PATH}.\n` +
        `Download it from Google Cloud (see SETUP at the top of this file) and place it there.`
    );
  }
  return JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
}

async function main() {
  const urls = readSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap.`);

  if (DRY_RUN) {
    urls.forEach((u) => console.log('  ' + u));
    console.log('\nDry run — nothing sent. Remove --dry-run to submit.');
    return;
  }

  const key = loadKey();
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );
  await jwtClient.authorize();
  console.log(`Authenticated as ${key.client_email}\n`);

  const indexing = google.indexing({ version: 'v3', auth: jwtClient });
  let ok = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      });
      ok++;
      console.log(`OK   ${url}  (${res.status})`);
    } catch (err) {
      failed++;
      const msg = err?.response?.data?.error?.message || err.message;
      console.error(`FAIL ${url}  -> ${msg}`);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
  if (failed > 0) {
    console.log(
      'If you see 403 errors: confirm the service account is added as an OWNER in Search Console.'
    );
  }
}

main().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
