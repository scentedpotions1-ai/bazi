import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, Compass, Target, MapPin, ArrowRight } from 'lucide-react';

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Discover Your Cosmic Blueprint
          </div>
          
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Numinax
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the secrets of your Eight Constitution Medicine type through precise BaZi Four Pillars analysis. 
            Ancient wisdom meets modern precision.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link to="/calculator">
                    Go to Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-16">
            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Four Pillars Analysis</CardTitle>
                <CardDescription>
                  Calculate your birth chart based on year, month, day, and hour pillars with precise solar time adjustments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-purple-100">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>ECM Constitution</CardTitle>
                <CardDescription>
                  Discover your constitutional type through Eight Constitution Medicine analysis of elemental balance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-pink-100">
                  <MapPin className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle>Precise Location</CardTitle>
                <CardDescription>
                  Automatic geocoding and DST detection ensures accurate calculations based on your birth location.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
