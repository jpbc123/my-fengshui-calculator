// src/components/StripePaymentForm.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Check, CreditCard, AlertCircle } from 'lucide-react';

// Make sure to add your publishable key to your environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ formData, selectedLocationDisplay, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/createPaymentIntent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            birthLocationDisplay: selectedLocationDisplay
          })
        });

        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.error || 'Failed to create payment intent');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setPaymentError(error.message);
      }
    };

    if (formData.fullName && formData.email) {
      createPaymentIntent();
    }
  }, [formData, selectedLocationDisplay]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.fullName,
            email: formData.email,
          },
        }
      });

      if (error) {
        console.error('Payment failed:', error);
        setPaymentError(error.message);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        
        // Confirm payment with our backend
        const confirmResponse = await fetch('/api/confirmPayment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        });

        const confirmResult = await confirmResponse.json();
        
        if (confirmResult.success) {
          onPaymentSuccess(confirmResult.orderId);
        } else {
          throw new Error(confirmResult.error || 'Failed to confirm payment');
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentError(error.message);
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-red-700 text-sm">{paymentError}</div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="bg-white border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your payment information is secure and encrypted
        </p>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-purple-800">Order Summary</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Professional Birth Chart Analysis</span>
            <span className="font-semibold">$5.99</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Name: {formData.fullName}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Email: {formData.email}</span>
          </div>
        </div>
        <div className="border-t border-purple-200 pt-3">
          <div className="flex justify-between items-center font-bold text-purple-800">
            <span>Total</span>
            <span>$5.99 USD</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !clientSecret || isProcessing}
        className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center ${
          !stripe || !clientSecret || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay $5.99 - Complete Order
          </>
        )}
      </button>

      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center">
          <Check className="w-4 h-4 mr-1 text-green-500" />
          SSL Encrypted
        </div>
        <div className="flex items-center">
          <Check className="w-4 h-4 mr-1 text-green-500" />
          Secure Payment
        </div>
        <div className="flex items-center">
          <Check className="w-4 h-4 mr-1 text-green-500" />
          No Hidden Fees
        </div>
      </div>
    </form>
  );
};

const StripePaymentForm = ({ formData, selectedLocationDisplay, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        formData={formData}
        selectedLocationDisplay={selectedLocationDisplay}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default StripePaymentForm;