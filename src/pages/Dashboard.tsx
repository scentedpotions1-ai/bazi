import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calculator, History, Settings, BookOpen, ArrowRight, Crown, ShoppingBag, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.user_metadata?.full_name || 'there'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Access your BaZi calculator and explore your cosmic blueprint.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary transition-colors group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Calculator className="h-10 w-10 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4">BaZi Calculator</CardTitle>
              <CardDescription>
                Calculate your Four Pillars and discover your ECM constitution type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/calculator">Start Calculation</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <User className="h-10 w-10 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4">Health Profile</CardTitle>
              <CardDescription>
                View your personalized health recommendations and download your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <History className="h-10 w-10 text-purple-500" />
              <CardTitle className="mt-4">Calculation History</CardTitle>
              <CardDescription>
                View your past calculations and saved results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-medium">
                Coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Settings className="h-10 w-10 text-pink-500" />
              <CardTitle className="mt-4">Account Settings</CardTitle>
              <CardDescription>
                Manage your profile and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-medium">
                Coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-500" />
              <CardTitle className="mt-4">Learn More</CardTitle>
              <CardDescription>
                Explore BaZi and ECM constitution medicine resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 font-medium">
                Coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[hsl(var(--color-primary))]">
            <CardHeader>
              <Crown className="h-10 w-10 text-[hsl(var(--color-primary))]" />
              <CardTitle className="mt-4 flex items-center gap-2">
                Subscription
                <Badge>Free</Badge>
              </CardTitle>
              <CardDescription>
                Manage your plan and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/subscription">View Subscription</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <ShoppingBag className="h-10 w-10 text-green-500" />
              <CardTitle className="mt-4">Marketplace</CardTitle>
              <CardDescription>
                Browse premium reports, guides, and courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
