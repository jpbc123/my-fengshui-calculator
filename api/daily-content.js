// api/daily-content.js
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

// Fallback data
const fallbackData = {
    planetaryOverview: {
        planetary_index: 3,
        summary: "Universal energies are in transition today. Take time for reflection.",
        article: "Today brings a blend of practical and intuitive energies. The planetary alignments suggest focusing on balance and mindful decision-making.",
    },
    fengShuiTip: {
        tip: "Clear your mind to welcome positive chi.",
    },
    dailyWisdom: {
        quote: "Wisdom comes to those who seek it with an open heart.",
        article: "Today brings opportunities for growth and self-reflection. Take time to listen to your inner voice and trust your intuition. Every moment offers a chance to learn something new about yourself and the world around you.",
    }
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
    console.log(`API called for daily content - requested date: ${requestedDate}, current date: ${getCurrentDate()}`);
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    try {
        console.log(`Fetching daily content for: ${requestedDate}`);
        
        // Fetch all three content types in parallel
        const [planetaryOverview, fengShuiTip, dailyWisdom] = await Promise.all([
            // Planetary Overview
            sanityClient.fetch(
                `*[_type == "dailyPlanetaryOverview" && date == $requestedDate][0]{
                    date,
                    planetary_index,
                    summary,
                    article
                }`,
                { requestedDate }
            ),
            // Feng Shui Tip
            sanityClient.fetch(
                `*[_type == "dailyFengShuiTip" && date == $requestedDate][0]{tip}`,
                { requestedDate }
            ),
            // Daily Wisdom
            sanityClient.fetch(
                `*[_type == "dailyWisdom" && date == $requestedDate][0]{
                    quote,
                    article,
                    date
                }`,
                { requestedDate }
            )
        ]);

        // Prepare response with fallbacks where needed
        const response = {
            date: requestedDate,
            timestamp: new Date().toISOString(),
            planetaryOverview: {
                planetary_index: planetaryOverview?.planetary_index ?? fallbackData.planetaryOverview.planetary_index,
                summary: planetaryOverview?.summary ?? fallbackData.planetaryOverview.summary,
                article: planetaryOverview?.article ?? fallbackData.planetaryOverview.article,
                isFallback: !planetaryOverview
            },
            fengShuiTip: {
                tip: fengShuiTip?.tip ?? fallbackData.fengShuiTip.tip,
                isFallback: !fengShuiTip?.tip
            },
            dailyWisdom: {
                quote: dailyWisdom?.quote ?? fallbackData.dailyWisdom.quote,
                article: dailyWisdom?.article ?? fallbackData.dailyWisdom.article,
                isFallback: !(dailyWisdom?.quote && dailyWisdom?.article)
            }
        };

        // Log which data sources were found
        console.log(`Planetary Overview: ${planetaryOverview ? 'found' : 'using fallback'}`);
        console.log(`Feng Shui Tip: ${fengShuiTip?.tip ? 'found' : 'using fallback'}`);
        console.log(`Daily Wisdom: ${(dailyWisdom?.quote && dailyWisdom?.article) ? 'found' : 'using fallback'}`);

        return res.json(response);
    } catch (error) {
        console.error('Error fetching daily content:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch daily content',
            timestamp: new Date().toISOString()
        });
    }
}