export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic BaZi calculations',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '3 calculations per month',
      'Basic Four Pillars analysis',
      'ECM constitution type',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For enthusiasts and practitioners',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    popular: true,
    stripePriceId: 'price_pro_monthly', // Replace with your actual Stripe Price ID
    features: [
      'Unlimited calculations',
      'Advanced analysis reports',
      'Calculation history storage',
      'Export to PDF',
      'Priority email support',
      'Access to marketplace',
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'For professional practitioners',
    price: 49.99,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_expert_monthly', // Replace with your actual Stripe Price ID
    features: [
      'Everything in Pro',
      'Client management system',
      'Bulk calculations',
      'API access',
      'Custom branding',
      'White-label reports',
      'Premium marketplace access',
      'Dedicated support',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    description: 'One-time payment, lifetime access',
    price: 299,
    currency: 'USD',
    interval: 'lifetime',
    stripePriceId: 'price_lifetime', // Replace with your actual Stripe Price ID
    features: [
      'All Expert features',
      'Lifetime access',
      'All future updates',
      'Priority feature requests',
      'Exclusive marketplace items',
    ],
  },
];

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'report' | 'template' | 'guide' | 'course';
  image?: string;
  stripePriceId?: string;
  requiredPlan?: string[];
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'detailed-report',
    name: 'Comprehensive BaZi Report',
    description: 'In-depth 30+ page analysis with life cycle predictions',
    price: 49.99,
    currency: 'USD',
    category: 'report',
    stripePriceId: 'price_detailed_report',
    requiredPlan: ['pro', 'expert', 'lifetime'],
  },
  {
    id: 'compatibility-report',
    name: 'Relationship Compatibility Analysis',
    description: 'Compare two BaZi charts for compatibility insights',
    price: 39.99,
    currency: 'USD',
    category: 'report',
    stripePriceId: 'price_compatibility',
    requiredPlan: ['pro', 'expert', 'lifetime'],
  },
  {
    id: 'business-timing',
    name: 'Business Timing Strategy',
    description: 'Optimal timing for business decisions based on your chart',
    price: 59.99,
    currency: 'USD',
    category: 'report',
    stripePriceId: 'price_business_timing',
    requiredPlan: ['expert', 'lifetime'],
  },
  {
    id: 'bazi-mastery-course',
    name: 'BaZi Mastery Course',
    description: 'Complete video course on BaZi interpretation',
    price: 199,
    currency: 'USD',
    category: 'course',
    stripePriceId: 'price_course',
  },
  {
    id: 'ecm-diet-guide',
    name: 'ECM Constitution Diet Guide',
    description: 'Personalized diet recommendations based on your ECM type',
    price: 29.99,
    currency: 'USD',
    category: 'guide',
    stripePriceId: 'price_diet_guide',
    requiredPlan: ['pro', 'expert', 'lifetime'],
  },
];
