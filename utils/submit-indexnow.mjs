// utils/submit-indexnow.mjs
// Submits all sitemap URLs to IndexNow (Bing/Yandex/Naver/Seznam).
// Idempotent and free — safe to run on every deploy.

import fs from 'fs';
import path from 'path';

const DOMAIN = 'fengshuiandbeyond.com';
const KEY = 'f3e8d2a1b7c4e9f0d5a6b3c8e2f1a4d7';

async function main() {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

  if (!fs.existsSync(sitemapPath)) {
    console.warn('[indexnow] No sitemap.xml found — skipping.');
    return;
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  if (urls.length === 0) {
    console.warn('[indexnow] No URLs found in sitemap.xml — skipping.');
    return;
  }

  const body = {
    host: DOMAIN,
    key: KEY,
    keyLocation: `https://${DOMAIN}/${KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    if (res.ok || res.status === 202) {
      console.log(`[indexnow] Submitted ${urls.length} URLs (${res.status} ${res.statusText})`);
    } else {
      const text = await res.text();
      console.warn(`[indexnow] ${res.status}: ${text}`);
    }
  } catch (err) {
    console.warn(`[indexnow] Submission failed (non-fatal): ${err.message}`);
  }
}

main();
