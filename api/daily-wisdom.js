// api/daily-wisdom.js
import { createClient as createSanityClient } from '@sanity/client';

const sanityClient = createSanityClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    apiVersion: '2025-08-31',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // FIXED: Get TODAY's date for frontend consumption
    const today = new Date().toISOString().slice(0, 10);

    try {
        console.log(`Fetching daily wisdom for TODAY: ${today}`);
        
        const query = `*[_type == "dailyWisdom" && date == $today][0]{quote, article}`;
        const result = await sanityClient.fetch(query, { today });

        if (result?.quote && result?.article) {
            console.log(`Found daily wisdom for ${today}`);
            return res.json({ 
                quote: result.quote, 
                article: result.article 
            });
        } else {
            console.log(`No daily wisdom found for ${today}, returning fallback`);
            return res.json({ 
                quote: "Wisdom comes to those who seek it with an open heart.",
                article: "Today brings opportunities for growth and self-reflection. Take time to listen to your inner voice and trust your intuition."
            });
        }
    } catch (error) {
        console.error('Error fetching daily wisdom:', error);
        return res.status(500).json({ error: 'Failed to fetch daily wisdom' });
    }
}