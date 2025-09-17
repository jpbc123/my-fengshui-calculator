// api/createPaymentIntent.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const { fullName, email, birthDate, birthTime, birthLocation, birthLocationDisplay } = req.body;

    // Validate required fields
    if (!fullName || !email || !birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 599, // $5.99 in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        fullName,
        email,
        birthDate,
        birthTime,
        birthLocation,
        birthLocationDisplay: birthLocationDisplay || birthLocation,
        service: 'birth_chart_analysis'
      },
      description: `Birth Chart Analysis for ${fullName}`,
      receipt_email: email,
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message
    });
  }
}