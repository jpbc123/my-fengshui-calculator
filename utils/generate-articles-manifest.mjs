// utils/generate-articles-manifest.mjs
//
// SINGLE SOURCE OF TRUTH for articles, generated at BUILD TIME.
//
// Fetches every article from Sanity and unions them with the hardcoded
// component-based articles (the-number-33, famous-celebrity-birthdays), then
// writes:
//   - src/data/articles-manifest.ts   (typed exports for app code: routes,
//     listing widgets, ArticlePage content seed)
//   - src/data/articles-manifest.json (metadata only, for the plain-Node
//     generate-sitemap.js script)
//
// WHY: the app fetches Sanity client-side, so article links + content are
// missing from the prerendered (vite-react-ssg) HTML that Googlebot reads.
// Baking a build-time manifest puts real links + content into static HTML and
// keeps the sitemap / static paths from ever going stale again.
//
// BUILD SAFETY: if the Sanity fetch fails and a manifest already exists on
// disk, we keep the last-good files and exit 0 so the build never breaks.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const TS_PATH = path.join(DATA_DIR, 'articles-manifest.ts');
const CONTENT_PATH = path.join(DATA_DIR, 'articles-content.ts');
const JSON_PATH = path.join(DATA_DIR, 'articles-manifest.json');

// --- read env (VITE_ vars from .env or the real environment on Vercel) ---
function readEnv() {
  const env = { ...process.env };
  const dotenv = path.join(ROOT, '.env');
  if (fs.existsSync(dotenv)) {
    for (const line of fs.readFileSync(dotenv, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

// --- hardcoded component-based articles (NOT in Sanity) ---
const STATIC_ARTICLES = [
  {
    _id: 'static-number-33',
    _type: 'article',
    source: 'static',
    slug: { current: 'the-number-33' },
    title: 'The Number 33: Elite Obsession, Hidden Patterns, or a Trick of Your Mind?',
    publishDate: '2026-05-24',
    tags: ['Numerology'],
    metaDescription:
      'Why does the number 33 appear everywhere—from Freemasonry to the human spine to world-changing events? Explore the conspiracies, the coincidences, and the psychological trick that might explain it all.',
    mainImageUrl: '/the-number-33.jpg',
    mainImageAlt: 'Glowing numerology artwork featuring the number 33',
  },
  {
    _id: 'static-celebrity-birthdays',
    _type: 'article',
    source: 'static',
    slug: { current: 'famous-celebrity-birthdays' },
    title: 'Famous Celebrity Birthdays & Their Zodiac Signs',
    publishDate: '2026-05-25',
    tags: ['Celebrity'],
    metaDescription:
      'Explore famous celebrity birthdays organized by month. Discover the Western zodiac signs and Chinese zodiac animals of your favorite stars.',
    mainImageUrl: '/celebrity-birthdays.jpg',
    mainImageAlt: 'Famous celebrity birthdays and zodiac signs',
  },
];

function bail(msg) {
  console.warn(`\n[articles-manifest] ${msg}`);
  if (fs.existsSync(TS_PATH) && fs.existsSync(CONTENT_PATH) && fs.existsSync(JSON_PATH)) {
    console.warn('[articles-manifest] Keeping existing manifest (last-good). Build continues.\n');
    process.exit(0);
  }
  console.error('[articles-manifest] No existing manifest to fall back to. Failing build.\n');
  process.exit(1);
}

async function main() {
  const env = readEnv();
  const projectId = env.VITE_SANITY_PROJECT_ID;
  const dataset = env.VITE_SANITY_DATASET;
  const apiVersion = env.VITE_SANITY_API_VERSION || '2024-01-01';

  if (!projectId || !dataset) bail('Missing VITE_SANITY_PROJECT_ID / VITE_SANITY_DATASET.');

  const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' });

  let fetched;
  try {
    const query = `*[_type == "article"] | order(publishDate desc){
      "slug": slug.current,
      title,
      subtitle,
      publishDate,
      tags,
      metaDescription,
      mainImage,
      body
    }`;
    fetched = await client.fetch(query);
  } catch (err) {
    bail(`Sanity fetch failed: ${err.message}`);
  }

  if (!Array.isArray(fetched) || fetched.length === 0) bail('Sanity returned no articles.');

  // metadata for every article (Sanity + static), newest first
  const sanityMeta = fetched.map((a) => ({
    _id: `sanity-${a.slug}`,
    _type: 'article',
    source: 'sanity',
    slug: { current: a.slug },
    title: a.title,
    publishDate: a.publishDate,
    tags: a.tags || [],
    metaDescription: a.metaDescription || '',
    ...(a.mainImage ? { mainImage: a.mainImage } : {}),
  }));

  const ARTICLES = [...sanityMeta, ...STATIC_ARTICLES].sort(
    (x, y) => new Date(y.publishDate).getTime() - new Date(x.publishDate).getTime()
  );

  // heavy content (body/subtitle/image) keyed by slug — Sanity articles only
  const ARTICLE_CONTENT = {};
  for (const a of fetched) {
    ARTICLE_CONTENT[a.slug] = {
      body: a.body || [],
      ...(a.subtitle ? { subtitle: a.subtitle } : {}),
      ...(a.mainImage ? { mainImage: a.mainImage } : {}),
    };
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });

  const header = `// AUTO-GENERATED by utils/generate-articles-manifest.mjs — DO NOT EDIT BY HAND.\n// Regenerate with: npm run generate-articles\n\n`;

  // Lightweight metadata — safe to import anywhere (routes, listing widgets).
  const ts =
    header +
    `export interface ArticleMeta {\n` +
    `  _id: string;\n  _type: 'article';\n  source: 'sanity' | 'static';\n` +
    `  slug: { current: string };\n  title: string;\n  publishDate: string;\n` +
    `  tags: string[];\n  metaDescription?: string;\n` +
    `  mainImage?: any;\n  mainImageUrl?: string;\n  mainImageAlt?: string;\n}\n\n` +
    `export const ARTICLES: ArticleMeta[] = ${JSON.stringify(ARTICLES, null, 2)};\n`;

  // Heavy article bodies — imported ONLY by ArticlePage so this large payload
  // never lands in the homepage/hub bundles.
  const contentTs =
    header +
    `export interface ArticleContent {\n  body: any[];\n  subtitle?: string;\n  mainImage?: any;\n}\n\n` +
    `export const ARTICLE_CONTENT: Record<string, ArticleContent> = ${JSON.stringify(ARTICLE_CONTENT, null, 2)};\n`;

  fs.writeFileSync(TS_PATH, ts, 'utf8');
  fs.writeFileSync(CONTENT_PATH, contentTs, 'utf8');
  fs.writeFileSync(JSON_PATH, JSON.stringify(ARTICLES, null, 2), 'utf8');

  console.log(`\n[articles-manifest] Wrote ${ARTICLES.length} articles (${sanityMeta.length} Sanity + ${STATIC_ARTICLES.length} static).`);
  console.log(`[articles-manifest]   -> ${path.relative(ROOT, TS_PATH)}  (metadata)`);
  console.log(`[articles-manifest]   -> ${path.relative(ROOT, CONTENT_PATH)}  (bodies)`);
  console.log(`[articles-manifest]   -> ${path.relative(ROOT, JSON_PATH)}  (metadata for sitemap)\n`);
}

main();
