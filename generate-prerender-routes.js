// generate-prerender-routes.js
// This creates static HTML for all your routes so Google can see the content

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All your routes from sitemap.xml
const routes = [
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
  '/feng-shui/personal-element',
  '/feng-shui/kua-number',
  '/numerology/visiber-calculator',
  '/astrology/chinese-zodiac-calculator',
  '/astrology/western-zodiac-calculator',
  '/horoscope/chinese-zodiac',
  '/horoscope/western-zodiac',
  '/games-fun',
  '/games-fun/aura-analysis',
  '/games-fun/lucky-numbers-generator',
  '/games-fun/name-compatibility',
  '/games-fun/chinese-zodiac-compatibility',
  '/games-fun/western-zodiac-compatibility',
  '/games-fun/fortune-cookie',
  '/meditation',
  '/meditation/visualization-exercises',
  '/meditation/yoga',
  '/meditation/daily-affirmation',
  '/meditation/morning-mindfulness',
  '/meditation/evening-relaxation',
  '/birth-chart',
  '/auspicious-wedding-date-planner',
  '/article',
  '/zodiac/rat',
  '/zodiac/ox',
  '/zodiac/tiger',
  '/zodiac/rabbit',
  '/zodiac/dragon',
  '/zodiac/snake',
  '/zodiac/horse',
  '/zodiac/goat',
  '/zodiac/monkey',
  '/zodiac/rooster',
  '/zodiac/dog',
  '/zodiac/pig'
];

// Create the routes config for Vercel
const routesConfig = {
  version: 3,
  routes: routes.map(route => ({
    src: route === '/' ? '/' : route,
    dest: '/index.html'
  }))
};

// Write to dist folder
const distPath = path.join(__dirname, 'dist');
const routesPath = path.join(distPath, '_routes.json');

try {
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist folder not found. Run build first!');
    process.exit(1);
  }

  fs.writeFileSync(routesPath, JSON.stringify(routesConfig, null, 2));
  console.log('✅ Pre-render routes generated successfully!');
  console.log(`📄 Created: ${routesPath}`);
  console.log(`📊 Total routes: ${routes.length}`);
} catch (error) {
  console.error('❌ Error generating routes:', error);
  process.exit(1);
}