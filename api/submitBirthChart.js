// api/submitBirthChart.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, email, birthDate, birthTime, birthLocation, birthLocationDisplay } = req.body;

    // Validate required fields
    if (!fullName || !email || !birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Store order in Supabase with both coordinates and display name
    const { data: order, error: orderError } = await supabase
      .from('birth_chart_orders')
      .insert({
        full_name: fullName,
        email,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_location: birthLocation, // coordinates
        birth_location_display: birthLocationDisplay || birthLocation, // readable name
        status: 'processing',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Trigger chart calculation (environment-aware URL)
    const calculationURL = process.env.NODE_ENV === 'production' 
      ? `${req.headers.origin || 'https://your-domain.com'}/api/calculateBirthChart`
      : `http://localhost:3000/api/calculateBirthChart`;
      
    // Use global fetch (available in Node.js 18+)
    fetch(calculationURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id })
    }).catch(console.error);

    return res.status(200).json({ 
      success: true, 
      orderId: order.id,
      message: 'Chart processing started' 
    });

  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: 'Failed to process order' });
  }
}