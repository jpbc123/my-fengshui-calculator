// api/contact.js
import { createClient as createSanityClient } from '@sanity/client';

const sanityClient = createSanityClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    apiVersion: '2025-08-31',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Basic server-side validation to ensure required fields are present
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Sanity document to be created
    const docToSubmit = {
        _type: 'contactMessage', // This must match the name in your Sanity schema
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || 'No subject provided',
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'new' // You can use this for tracking message status
    };

    try {
        const result = await sanityClient.create(docToSubmit);
        console.log('Successfully wrote contact message to Sanity:', {
            id: result._id,
            name: result.name,
            email: result.email,
            subject: result.subject
        });
        
        return res.status(200).json({ 
            success: true, 
            message: 'Message submitted successfully.',
            id: result._id 
        });
    } catch (error) {
        console.error('Sanity write error:', error);
        // Send a 500 error if there's an issue with the Sanity API
        return res.status(500).json({ 
            error: 'Failed to submit message. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}