// api/planetary-overview.js
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
        console.log(`Fetching planetary overview for TODAY: ${today}`);
        
        const query = `*[_type == "dailyPlanetaryOverview" && date == $today][0]{
            date,
            planetary_index,
            summary,
            article
        }`;
        const result = await sanityClient.fetch(query, { today });

        if (result) {
            console.log(`Found planetary overview for ${today}`);
            return res.json({
                date: result.date,
                planetary_index: result.planetary_index,
                summary: result.summary,
                article: result.article
            });
        } else {
            console.log(`No planetary overview found for ${today}, returning fallback`);
            return res.json({
                date: today,
                planetary_index: 3,
                summary: "Universal energies are in transition today. Take time for reflection.",
                article: "Today brings a blend of practical and intuitive energies. The planetary alignments suggest focusing on balance and mindful decision-making."
            });
        }
    } catch (error) {
        console.error('Error fetching planetary overview:', error);
        return res.status(500).json({ error: 'Failed to fetch planetary overview' });
    }
}