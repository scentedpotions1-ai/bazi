import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PRICING_PLANS } from '../lib/pricing';
import { Check, Sparkles } from 'lucide-react';
import { isStripeConfigured } from '../lib/stripe';

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (!isStripeConfigured()) {
      alert('Payment system is not configured. Please contact support.');
      return;
    }

    setLoading(planId);
    
    // TODO: Implement Stripe checkout session creation
    // This would typically call your backend API to create a checkout session
    setTimeout(() => {
      alert(`Subscription to ${planId} plan initiated. This would redirect to Stripe checkout.`);
      setLoading(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))] text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core BaZi calculation features.
          </p>
        </div>

        {!isStripeConfigured() && (
          <div className="max-w-3xl mx-auto mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              ⚠️ Payment system not configured. Plans are for preview only.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-[hsl(var(--color-primary))] border-2 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge>Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  {plan.interval !== 'lifetime' && (
                    <span className="text-gray-600">/{plan.interval}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || plan.id === 'free'}
                >
                  {loading === plan.id ? 'Processing...' : plan.id === 'free' ? 'Current Plan' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
                <CardDescription>
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                <CardDescription>
                  We accept all major credit cards, debit cards, and various payment methods through Stripe.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
                <CardDescription>
                  We offer a 30-day money-back guarantee for all paid plans. No questions asked.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
