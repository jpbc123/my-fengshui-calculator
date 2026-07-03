// utils/generate-sitemap.js
import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://fengshuiandbeyond.com';

const STALE_ARTICLE_SLUGS = new Set([
  'october-2025-horoscope-zodiac-forecast',
  'feng-shui-astrology-for-october-2025',
  'universal-number-9-september-numerology',
  'mid-autumn-festival-guide',
]);

function getArticleRoutes() {
  try {
    const manifestPath = path.join(process.cwd(), 'src', 'data', 'articles-manifest.json');
    const articles = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return articles
      .filter((a) => !STALE_ARTICLE_SLUGS.has(a.slug.current))
      .map((a) => ({
        path: `/articles/${a.slug.current}`,
        lastmod: a.publishDate ? a.publishDate.split('T')[0] : undefined,
      }));
  } catch (err) {
    console.warn(`⚠️  Could not read articles manifest, sitemap will omit articles: ${err.message}`);
    return [];
  }
}

// Static routes with last meaningful content-change dates.
// Update the date when a page's content actually changes.
const staticRoutes = [
  { path: '/', lastmod: '2026-06-01' },
  { path: '/feng-shui', lastmod: '2026-01-15' },
  { path: '/numerology', lastmod: '2026-01-15' },
  { path: '/astrology', lastmod: '2026-01-15' },
  { path: '/horoscope', lastmod: '2026-01-15' },
  { path: '/store', lastmod: '2026-01-15' },
  { path: '/about-us', lastmod: '2026-01-15' },
  { path: '/contact-us', lastmod: '2026-01-15' },

  { path: '/feng-shui/personal-element', lastmod: '2026-01-15' },
  { path: '/feng-shui/kua-number', lastmod: '2026-01-15' },

  { path: '/numerology/visiber-calculator', lastmod: '2026-01-15' },

  { path: '/astrology/chinese-zodiac-calculator', lastmod: '2026-01-15' },
  { path: '/astrology/western-zodiac-calculator', lastmod: '2026-01-15' },

  { path: '/horoscope/chinese-zodiac', lastmod: '2026-01-15' },
  { path: '/horoscope/western-zodiac', lastmod: '2026-01-15' },

  { path: '/games-fun', lastmod: '2026-01-15' },
  { path: '/games-fun/aura-analysis', lastmod: '2026-01-15' },
  { path: '/games-fun/lucky-numbers-generator', lastmod: '2026-01-15' },
  { path: '/games-fun/name-compatibility', lastmod: '2026-01-15' },
  { path: '/games-fun/chinese-zodiac-compatibility', lastmod: '2026-01-15' },
  { path: '/games-fun/western-zodiac-compatibility', lastmod: '2026-01-15' },
  { path: '/games-fun/fortune-cookie', lastmod: '2026-01-15' },

  { path: '/meditation', lastmod: '2026-01-15' },
  { path: '/meditation/visualization-exercises', lastmod: '2026-01-15' },
  { path: '/meditation/yoga', lastmod: '2026-01-15' },
  { path: '/meditation/daily-affirmation', lastmod: '2026-01-15' },
  { path: '/meditation/morning-mindfulness', lastmod: '2026-01-15' },
  { path: '/meditation/evening-relaxation', lastmod: '2026-01-15' },

  { path: '/birth-chart', lastmod: '2026-01-15' },
  { path: '/auspicious-wedding-date-planner', lastmod: '2026-01-15' },

  { path: '/article', lastmod: '2026-06-01' },

  { path: '/mercury-retrograde', lastmod: '2026-01-15' },
  { path: '/full-moon-forecast', lastmod: '2026-01-15' },
];

const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

function generateAllRoutes() {
  const allRoutes = [...staticRoutes];

  chineseZodiacSigns.forEach(sign => {
    allRoutes.push({ path: `/zodiac/${sign}`, lastmod: '2026-01-15' });
  });

  getArticleRoutes().forEach(route => allRoutes.push(route));

  return allRoutes;
}

function generateSitemap() {
  const allRoutes = generateAllRoutes();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allRoutes.forEach(route => {
    sitemap += `\n  <url>\n    <loc>${DOMAIN}${route.path}</loc>`;
    if (route.lastmod) {
      sitemap += `\n    <lastmod>${route.lastmod}</lastmod>`;
    }
    sitemap += `\n  </url>`;
  });

  sitemap += '\n</urlset>';

  return sitemap;
}

function writeSitemap() {
  const sitemap = generateSitemap();
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  const count = generateAllRoutes().length;
  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  console.log(`📊 Total URLs: ${count}`);
  console.log(`🌐 Base URL: ${DOMAIN}`);
}

writeSitemap();

export { generateSitemap, generateAllRoutes };
