// api/daily-fengshui-tip.js
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
        console.log(`Fetching feng shui tip for TODAY: ${today}`);
        
        const query = `*[_type == "dailyFengShuiTip" && date == $today][0]{tip}`;
        const result = await sanityClient.fetch(query, { today });

        if (result?.tip) {
            console.log(`Found feng shui tip for ${today}`);
            return res.json({ tip: result.tip });
        } else {
            console.log(`No feng shui tip found for ${today}, returning fallback`);
            return res.json({ tip: "Clear your mind to welcome positive chi." });
        }
    } catch (error) {
        console.error('Error fetching feng shui tip:', error);
        return res.status(500).json({ error: 'Failed to fetch feng shui tip' });
    }
}