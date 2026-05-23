// utils/generate-sitemap.js
import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://fengshuiandbeyond.com';

// Extract all your routes from App.tsx - update this array when you add new routes
const routes = [
  // Main pages
  '/',
  '/feng-shui',
  '/numerology',
  '/astrology',
  '/horoscope',
  '/store',
  '/about-us',
  '/contact-us',
  '/privacy-policy',
  '/terms-of-service',
  '/credits',
  '/sitemap',

  // Feng Shui subpages
  '/feng-shui/personal-element',
  '/feng-shui/kua-number',

  // Numerology subpages
  '/numerology/visiber-calculator',

  // Astrology subpages
  '/astrology/chinese-zodiac-calculator',
  '/astrology/western-zodiac-calculator',

  // Horoscope pages
  '/horoscope/chinese-zodiac',
  '/horoscope/western-zodiac',

  // Games
  '/games-fun',
  '/games-fun/aura-analysis',
  '/games-fun/lucky-numbers-generator',
  '/games-fun/name-compatibility',
  '/games-fun/chinese-zodiac-compatibility',
  '/games-fun/western-zodiac-compatibility',
  '/games-fun/fortune-cookie',

  // Meditation
  '/meditation',
  '/meditation/visualization-exercises',
  '/meditation/yoga',
  '/meditation/daily-affirmation',
  '/meditation/morning-mindfulness',
  '/meditation/evening-relaxation',

  // Services
  '/birth-chart',
  '/auspicious-wedding-date-planner',

  // Articles
  '/article',
  '/articles/feng-shui-2026-lucky-colors-symbols-zodiac-forecast',
  '/articles/flying-stars-2026-feng-shui-sector-guide',
  '/articles/feng-shui-2026-year-of-fire-horse',
  '/articles/chinese-zodiac-hilarious-roast',
  '/articles/astrology-101-complete-beginners-guide',
  '/articles/feng-shui-traditional-vs-modern',
  '/articles/astrology-roast-zodiac-signs',
  '/articles/dating-by-elements',
  '/articles/house-numbers-destiny',
  '/articles/must-have-feng-shui-items-for-a-happier-balanced-home',
  '/articles/hollywood-success-fengshui',
  '/articles/the-number-33',

  // Dedicated astrology pages
  '/mercury-retrograde',
  '/full-moon-forecast',
  '/daily-wisdom-article',
  '/planetary-overview',
];

// Chinese zodiac signs for dynamic routes
const chineseZodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

// Function to get priority based on page importance
function getPriority(route) {
  if (route === '/') return '1.0';
  if (['/feng-shui', '/numerology', '/astrology', '/horoscope'].includes(route)) return '0.9';
  if (['/meditation', '/games-fun', '/article', '/birth-chart'].includes(route)) return '0.9';
  if (route.startsWith('/articles/')) return '0.8';
  if (['/about-us', '/contact-us'].includes(route)) return '0.8';
  if (route.includes('/zodiac/')) return '0.7';
  if (route.includes('/games-fun/') || route.includes('/meditation/')) return '0.6';
  return '0.7';
}

// Function to get change frequency
function getChangefreq(route) {
  if (route === '/') return 'daily';
  if (route.includes('/horoscope') || route.includes('/zodiac/')) return 'daily';
  if (route.includes('/daily-wisdom') || route.includes('/aura-')) return 'daily';
  if (['/feng-shui', '/numerology', '/astrology'].includes(route)) return 'weekly';
  if (route.includes('/games-fun/') || route.includes('/meditation/')) return 'weekly';
  if (route.startsWith('/articles/')) return 'monthly';
  return 'monthly';
}

// Generate all routes including dynamic ones
function generateAllRoutes() {
  const allRoutes = [...routes];
  
  // Add Chinese zodiac dynamic routes
  chineseZodiacSigns.forEach(sign => {
    allRoutes.push(`/zodiac/${sign}`);
  });
  
  // TODO: Add article routes dynamically
  // You can add logic here to scan your articles and add them
  // For now, adding a few example article routes
  // allRoutes.push('/articles/feng-shui-basics');
  // allRoutes.push('/articles/numerology-guide');
  
  return allRoutes;
}

// Generate XML sitemap
function generateSitemap() {
  const allRoutes = generateAllRoutes();
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allRoutes.forEach(route => {
    sitemap += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${getChangefreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`;
  });

  sitemap += '\n</urlset>';
  
  return sitemap;
}

// Write sitemap to public directory
function writeSitemap() {
  const sitemap = generateSitemap();
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  console.log(`📊 Total URLs: ${generateAllRoutes().length}`);
  console.log(`🌐 Base URL: ${DOMAIN}`);
}

// Run the generator
writeSitemap();

// Export for programmatic use
export { generateSitemap, generateAllRoutes };