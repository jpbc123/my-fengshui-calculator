// api/planetary-overview.js
import { createClient as createSanityClient } from '@sanity/client';

const sanityClient = createSanityClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    apiVersion: '2025-08-31',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

// Helper function to get consistent date format
const getCurrentDate = () => {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Use consistent date handling - default to current date
    const requestedDate = req.query.date || getCurrentDate();
    console.log(`API called for planetary overview - requested date: ${requestedDate}, current date: ${getCurrentDate()}`);
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    try {
        console.log(`Fetching planetary overview for: ${requestedDate}`);
        
        const query = `*[_type == "dailyPlanetaryOverview" && date == $requestedDate][0]{
            date,
            planetary_index,
            summary,
            article
        }`;
        const result = await sanityClient.fetch(query, { requestedDate });

        if (result) {
            console.log(`Found planetary overview for ${requestedDate}`);
            return res.json({
                date: result.date,
                planetary_index: result.planetary_index,
                summary: result.summary,
                article: result.article,
                timestamp: new Date().toISOString(),
                isFallback: false
            });
        } else {
            console.log(`No planetary overview found for ${requestedDate}, returning fallback`);
            return res.json({
                date: requestedDate,
                planetary_index: 3,
                summary: "Universal energies are in transition today. Take time for reflection.",
                article: "Today brings a blend of practical and intuitive energies. The planetary alignments suggest focusing on balance and mindful decision-making.",
                timestamp: new Date().toISOString(),
                isFallback: true
            });
        }
    } catch (error) {
        console.error('Error fetching planetary overview:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch planetary overview',
            timestamp: new Date().toISOString()
        });
    }
}