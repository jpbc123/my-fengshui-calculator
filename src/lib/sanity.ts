// src/lib/sanity.ts
import { createClient } from '@sanity/client';

// Environment variables - these should be in your .env file
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

// Create and export the Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if you need fresh data
  perspective: 'published', // Only fetch published content
});

// Helper function to check if client is properly configured
export const isClientConfigured = () => {
  return !!(projectId && dataset);
};

// Export individual config values if needed elsewhere
export { projectId, dataset, apiVersion };