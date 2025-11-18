import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Crown, CreditCard, Calendar, ArrowRight } from 'lucide-react';

export function Subscription() {

  // TODO: Fetch actual subscription data from Supabase/Stripe
  const currentPlan = {
    name: 'Free',
    status: 'active',
    renewalDate: null,
    calculationsUsed: 1,
    calculationsLimit: 3,
  };

  const isPaid = currentPlan.name !== 'Free';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Subscription</h1>
          <p className="text-gray-600">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[hsl(var(--color-primary))]/10">
                  <Crown className="h-6 w-6 text-[hsl(var(--color-primary))]" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentPlan.name} Plan</CardTitle>
                  <CardDescription>
                    {isPaid ? 'Active subscription' : 'Free tier'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={isPaid ? 'default' : 'secondary'}>
                {currentPlan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPaid ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Renews on {currentPlan.renewalDate || 'N/A'}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Update Payment Method
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel Subscription
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Calculations used: </span>
                  <span className="text-gray-600">
                    {currentPlan.calculationsUsed} / {currentPlan.calculationsLimit} this month
                  </span>
                </div>
                <Button asChild>
                  <Link to="/pricing">
                    Upgrade to Pro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing History */}
        {isPaid && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View your past invoices and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                No billing history yet.
              </div>
              {/* TODO: Add billing history table */}
            </CardContent>
          </Card>
        )}

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your usage and see how much value you're getting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calculations</span>
                <span className="font-medium">
                  {currentPlan.calculationsUsed} / {currentPlan.calculationsLimit === 999 ? '∞' : currentPlan.calculationsLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[hsl(var(--color-primary))] h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${(currentPlan.calculationsUsed / currentPlan.calculationsLimit) * 100}%` 
                  }}
                />
              </div>
            </div>

            {!isPaid && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Want unlimited calculations? Upgrade to unlock more features.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
