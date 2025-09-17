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
  
  // Feng Shui subpages
  '/personal-element',
  '/kua-number-calculator',
  
  // Numerology subpages
  '/visiber-calculator',
  
  // Astrology subpages
  '/chinese-zodiac-calculator',
  '/chinese-zodiac-landing',
  '/western-zodiac-calculator',
  
  // Horoscope pages
  '/western-horoscope',
  
  // Tools
  '/daily-wisdom-article',
  '/aura-analysis',
  '/planetary-overview',
  
  // Games
  '/games-fun',
  '/lucky-numbers',
  '/name-compatibility',
  '/chinese-compatibility',
  '/western-compatibility',
  '/fortune-cookie',
  
  // Meditation
  '/meditation',
  '/meditate-visualization',
  '/meditate-yoga-pose',
  '/meditate-affirmation',
  '/meditate-morning',
  '/meditate-evening',
  
  // Services
  '/birth-chart',
  
  // Articles
  '/article',
  
  // Coming Soon (optional - you might want to exclude these)
  // '/community-chat',
  // '/coming-store',
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
  if (['/about-us', '/contact-us'].includes(route)) return '0.8';
  if (route.includes('/zodiac/')) return '0.7';
  if (route.includes('/games-') || route.includes('/meditate-')) return '0.6';
  return '0.7';
}

// Function to get change frequency
function getChangefreq(route) {
  if (route === '/') return 'daily';
  if (route.includes('/horoscope') || route.includes('/zodiac/')) return 'daily';
  if (route.includes('/daily-wisdom') || route.includes('/aura-')) return 'daily';
  if (['/feng-shui', '/numerology', '/astrology'].includes(route)) return 'weekly';
  if (route.includes('/games-') || route.includes('/meditate-')) return 'weekly';
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