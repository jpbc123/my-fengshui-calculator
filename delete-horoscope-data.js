// delete-horoscope-data.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-08-31',
  useCdn: false,
});

// Define the document types to delete
const documentTypesToDelete = [
  'dailyChineseHoroscope',
  'weeklyChineseHoroscope',
  'yearlyChineseHoroscope',
];

async function deleteHoroscopeData() {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Starting bulk deletion of horoscope documents...`);
  try {
    let deletedCount = 0;
    for (const docType of documentTypesToDelete) {
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Deleting documents of type: ${docType}`);

      // Fetch all IDs of the specified document type
      const ids = await sanityClient.fetch(`*[_type == "${docType}"][]._id`);

      if (ids.length === 0) {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] No documents of type "${docType}" found.`);
        continue;
      }

      // Use a transaction to delete all documents by ID
      const transaction = sanityClient.transaction();
      ids.forEach(id => transaction.delete(id));

      const result = await transaction.commit();
      deletedCount += ids.length;
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Successfully deleted ${ids.length} documents of type "${docType}".`);
    }

    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Bulk deletion complete. Total documents deleted: ${deletedCount}`);
  } catch (error) {
    console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Failed to perform bulk deletion:`, error);
  }
}

deleteHoroscopeData();