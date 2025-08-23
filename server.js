import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
// Remove the import for node-fetch since Node.js 18+ has a native fetch.
// import fetch from 'node-fetch';
import path from 'path';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client on the server
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Endpoint for Supabase-related requests
app.get('/api/supabase/get-data', async (req, res) => {
  try {
    const { data, error } = await supabase.from('your_table').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Supabase API error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Supabase' });
  }
});

// Endpoint for Gemini-related requests with more detailed logging
app.post('/api/gemini/generate', async (req, res) => {
  const { prompt, generationConfig } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig
  };

  try {
    console.log("Received request from client. Making call to Gemini API...");
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log(`Response status from Gemini API: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text(); // Read the error body for more info
      console.error("Gemini API returned an error:", errorBody);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Successfully received result from Gemini API.");
    res.json(result);
  } catch (error) {
    console.error("Gemini API call failed:", error.message);
    res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});