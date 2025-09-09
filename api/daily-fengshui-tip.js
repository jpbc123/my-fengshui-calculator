// api/daily-fengshui-tip.js
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
    console.log(`API called for feng shui tip - requested date: ${requestedDate}, current date: ${getCurrentDate()}`);
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    try {
        console.log(`Fetching feng shui tip for: ${requestedDate}`);
        
        const query = `*[_type == "dailyFengShuiTip" && date == $requestedDate][0]{tip}`;
        const result = await sanityClient.fetch(query, { requestedDate });

        if (result?.tip) {
            console.log(`Found feng shui tip for ${requestedDate}`);
            return res.json({ 
                tip: result.tip,
                date: requestedDate,
                timestamp: new Date().toISOString(),
                isFallback: false
            });
        } else {
            console.log(`No feng shui tip found for ${requestedDate}, returning fallback`);
            return res.json({ 
                tip: "Clear your mind to welcome positive chi.",
                date: requestedDate,
                timestamp: new Date().toISOString(),
                isFallback: true
            });
        }
    } catch (error) {
        console.error('Error fetching feng shui tip:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch feng shui tip',
            timestamp: new Date().toISOString()
        });
    }
}