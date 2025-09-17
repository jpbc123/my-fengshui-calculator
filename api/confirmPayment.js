// api/confirmPayment.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
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
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID is required' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Extract metadata
    const metadata = paymentIntent.metadata;

    // Store order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('birth_chart_orders')
      .insert({
        full_name: metadata.fullName,
        email: metadata.email,
        birth_date: metadata.birthDate,
        birth_time: metadata.birthTime,
        birth_location: metadata.birthLocation,
        birth_location_display: metadata.birthLocationDisplay,
        status: 'processing',
        payment_intent_id: paymentIntentId,
        stripe_payment_status: paymentIntent.status,
        amount_paid: paymentIntent.amount / 100, // Convert cents to dollars
        currency: paymentIntent.currency,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      throw new Error('Failed to save order');
    }

    // Trigger chart calculation
    const calculationURL = process.env.NODE_ENV === 'production' 
      ? `${req.headers.origin}/api/calculateBirthChart`
      : `http://localhost:3000/api/calculateBirthChart`;
      
    fetch(calculationURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id })
    }).catch(console.error);

    return res.status(200).json({ 
      success: true,
      orderId: order.id,
      message: 'Payment confirmed and chart processing started'
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({ 
      error: 'Failed to confirm payment',
      details: error.message
    });
  }
}