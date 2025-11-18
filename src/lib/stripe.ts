import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key || key === 'your_stripe_publishable_key_here') {
      console.warn('⚠️ Stripe not configured. Payment features are disabled.');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const isStripeConfigured = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  return key && key !== 'your_stripe_publishable_key_here';
};
