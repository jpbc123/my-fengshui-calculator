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
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Support flexible date parameter, default to today
    const requestedDate = req.query.date || new Date().toLocaleDateString('en-CA');
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
        return res.status(400).json({ 
            error: 'Invalid date format. Use YYYY-MM-DD',
            example: '2025-09-09'
        });
    }

    try {
        console.log(`Fetching daily wisdom for: ${requestedDate}`);
        
        // Query Sanity for daily wisdom by date
        const query = `*[_type == "dailyWisdom" && date == $requestedDate][0]{
            quote,
            article,
            date,
            _createdAt,
            _updatedAt
        }`;
        
        const result = await sanityClient.fetch(query, { requestedDate });

        if (result && result.quote && result.article) {
            console.log(`Found daily wisdom for ${requestedDate}`);
            return res.status(200).json({ 
                quote: result.quote, 
                article: result.article,
                date: requestedDate,
                isFallback: false,
                metadata: {
                    createdAt: result._createdAt,
                    updatedAt: result._updatedAt
                }
            });
        } else {
            console.log(`No daily wisdom found for ${requestedDate}, returning fallback`);
            return res.status(200).json({ 
                quote: "Wisdom comes to those who seek it with an open heart.",
                article: "Today brings opportunities for growth and self-reflection. Take time to listen to your inner voice and trust your intuition. Every moment offers a chance to learn something new about yourself and the world around you.",
                date: requestedDate,
                isFallback: true,
                metadata: {
                    message: "Fallback content - no specific wisdom found for this date"
                }
            });
        }
    } catch (error) {
        console.error('Error fetching daily wisdom:', error);
        
        // Return more detailed error information in development
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        return res.status(500).json({ 
            error: 'Failed to fetch daily wisdom',
            details: isDevelopment ? error.message : 'Internal server error',
            date: requestedDate,
            timestamp: new Date().toISOString()
        });
    }
}