// sync-daily-fengshui-tip.js - UPDATED FOR DAY+1 GENERATION
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import fetch from 'node-fetch';

dotenv.config();
dayjs.extend(weekOfYear);

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

// Support Functions for Enhanced Prompting
function getRandomTheme() {
  const themes = [
    'wealth and prosperity', 'relationships and love', 'career advancement',
    'health and vitality', 'creativity and inspiration', 'travel and adventure',
    'family harmony', 'spiritual growth', 'protection and safety', 'mental clarity',
    'home office energy', 'sleep quality', 'social connections', 'personal growth'
  ];
  return themes[Math.floor(Math.random() * themes.length)];
}

function getRandomElement() {
  const elements = ['water', 'wood', 'fire', 'earth', 'metal'];
  return elements[Math.floor(Math.random() * elements.length)];
}

function getSeason() {
  const month = dayjs().month();
  if (month >= 2 && month <= 4) return 'spring (renewal and growth)';
  if (month >= 5 && month <= 7) return 'summer (energy and activity)';
  if (month >= 8 && month <= 10) return 'autumn (harvest and reflection)';
  return 'winter (rest an