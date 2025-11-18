import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Download, User, Calendar, MapPin, Heart, Utensils, Dumbbell, Moon, Sparkles } from 'lucide-react';
import { getHealthProfile } from '../lib/ecmHealthProfiles';
import { generateProfilePDF } from '../lib/pdfGenerator';

interface StoredBaziResult {
  bazi: {
    hourPillar: { stem: string; branch: string };
    dayPillar: { stem: string; branch: string };
    monthPillar: { stem: string; branch: string };
    yearPillar: { stem: string; branch: string };
  };
  ecm: {
    constitutionType: string;
    element: string;
    polarity: string;
    rootStrengthScore: number;
    stability: string;
  };
  input: {
    fullName: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<StoredBaziResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load saved BaZi data from localStorage
    const savedData = localStorage.getItem('lastBaziCalculation');
    if (savedData) {
      try {
        setProfileData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleDownloadPDF = () => {
    if (!profileData) return;

    const healthProfile = getHealthProfile(profileData.ecm.constitutionType);
    
    generateProfilePDF({
      userName: profileData.input.fullName || user?.email || 'User',
      birthDate: profileData.input.birthDate,
      birthTime: profileData.input.birthTime,
      birthPlace: profileData.input.birthPlace,
      bazi: profileData.bazi,
      ecm: profileData.ecm,
      healthProfile,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Profile Data</CardTitle>
            <CardDescription>
              You haven't completed a BaZi calculation yet. Calculate your chart first to see your personalized health profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.href = '/calculator'}
              className="w-full"
              style={{ backgroundColor: 'hsl(var(--color-primary))', color: 'white' }}
            >
              Go to Calculator
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const healthProfile = getHealthProfile(profileData.ecm.constitutionType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profileData.input.fullName || 'Your Profile'}</h1>
              <p className="text-purple-100 text-lg">
                {healthProfile.constitutionType} Constitution
              </p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              className="bg-white text-purple-600 hover:bg-purple-50 gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Birth Date & Time</p>
                  <p className="font-medium">{profileData.input.birthDate} at {profileData.input.birthTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Birth Place</p>
                  <p className="font-medium">{profileData.input.birthPlace}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Element & Polarity</p>
                  <p className="font-medium">{profileData.ecm.element} ({profileData.ecm.polarity})</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BaZi Four Pillars */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your BaZi Four Pillars</CardTitle>
            <CardDescription>The foundational energy structure of your birth chart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Hour', pillar: profileData.bazi.hourPillar },
                { name: 'Day', pillar: profileData.bazi.dayPillar },
                { name: 'Month', pillar: profileData.bazi.monthPillar },
                { name: 'Year', pillar: profileData.bazi.yearPillar },
              ].map(({ name, pillar }) => (
                <div key={name} className="bg-gradient-to-b from-purple-50 to-white p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-500 text-center mb-2">{name} Pillar</p>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-900">{pillar.stem}</p>
                    <p className="text-lg text-purple-700">{pillar.branch}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Constitution Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Constitution Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge className="mb-2 text-base px-4 py-2" style={{ backgroundColor: 'hsl(var(--color-primary))', color: 'white' }}>
                {healthProfile.constitutionType}
              </Badge>
              <p className="text-gray-700 text-lg mb-4">{healthProfile.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Key Characteristics:</p>
                  <ul className="space-y-1">
                    {healthProfile.characteristics.map((char, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Constitution Stats:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Root Strength:</span>
                      <span className="font-semibold text-purple-900">{profileData.ecm.rootStrengthScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stability:</span>
                      <span className="font-semibold text-purple-900">{profileData.ecm.stability}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Dietary Recommendations
            </CardTitle>
            <CardDescription>Foods that support your constitutional balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  ✓ Foods to Embrace
                </h3>
                <ul className="space-y-1 mb-4">
                  {healthProfile.dietRecommendations.recommended.map((food, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  ★ Beneficial Foods
                </h3>
                <div className="flex flex-wrap gap-2">
                  {healthProfile.dietRecommendations.beneficialFoods.map((food, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  ✗ Foods to Avoid
                </h3>
                <ul className="space-y-1 mb-4">
                  {healthProfile.dietRecommendations.avoid.map((food, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  🔥 Cooking Methods
                </h3>
                <div className="flex flex-wrap gap-2">
                  {healthProfile.dietRecommendations.cookingMethods.map((method, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Lifestyle Recommendations
            </CardTitle>
            <CardDescription>Daily practices to enhance your wellbeing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-purple-700 mb-2">Exercise</h3>
                <ul className="space-y-1 mb-4">
                  {healthProfile.lifestyleRecommendations.exercise.map((ex, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Sleep
                </h3>
                <ul className="space-y-1">
                  {healthProfile.lifestyleRecommendations.sleep.map((sleep, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{sleep}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700 mb-2">Environment</h3>
                <ul className="space-y-1 mb-4">
                  {healthProfile.lifestyleRecommendations.environment.map((env, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{env}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-purple-700 mb-2">Recommended Activities</h3>
                <ul className="space-y-1">
                  {healthProfile.lifestyleRecommendations.activities.map((act, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Wellness Insights</CardTitle>
            <CardDescription>Understanding your strengths and areas to watch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Strengths</h3>
                <ul className="space-y-1">
                  {healthProfile.wellness.strengths.map((strength, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Areas to Watch</h3>
                <ul className="space-y-1">
                  {healthProfile.wellness.vulnerabilities.map((vuln, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-amber-600 mt-1">⚠</span>
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-purple-700 mb-2">Preventive Care</h3>
              <ul className="space-y-1">
                {healthProfile.wellness.preventiveCare.map((care, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Seasonal Advice</h3>
              <ul className="space-y-1">
                {healthProfile.wellness.seasonalAdvice.map((advice, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Wellness */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Emotional Wellness</CardTitle>
            <CardDescription>Supporting your emotional balance and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-purple-700 mb-2">Common Tendencies</h3>
                <ul className="space-y-1">
                  {healthProfile.emotionalWellness.tendencies.map((tend, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{tend}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Balancing Practices</h3>
                <ul className="space-y-1">
                  {healthProfile.emotionalWellness.balancingPractices.map((practice, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="bg-gray-100 p-4 rounded-lg text-center text-sm text-gray-600">
          <p>
            <strong>Disclaimer:</strong> This report is for informational purposes only and is not medical advice. 
            Always consult with qualified healthcare professionals before making changes to your diet, exercise, or health regimen.
          </p>
        </div>
      </div>
    </div>
  );
}
