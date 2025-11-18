import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MARKETPLACE_ITEMS, MarketplaceItem } from '../lib/pricing';
import { ShoppingCart, BookOpen, FileText, GraduationCap, Sparkles, Lock } from 'lucide-react';

const CATEGORY_ICONS = {
  report: FileText,
  template: FileText,
  guide: BookOpen,
  course: GraduationCap,
};

const CATEGORY_LABELS = {
  report: 'Reports',
  template: 'Templates',
  guide: 'Guides',
  course: 'Courses',
};

export function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(MARKETPLACE_ITEMS.map(item => item.category)))];

  const filteredItems = selectedCategory === 'all' 
    ? MARKETPLACE_ITEMS 
    : MARKETPLACE_ITEMS.filter(item => item.category === selectedCategory);

  const handlePurchase = async (item: MarketplaceItem) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (item.requiredPlan && item.requiredPlan.length > 0) {
      // Check if user has required plan
      // TODO: Implement plan check from user metadata
      const hasAccess = false; // Replace with actual check
      if (!hasAccess) {
        alert(`This item requires a ${item.requiredPlan.join(' or ')} subscription. Please upgrade your plan.`);
        navigate('/pricing');
        return;
      }
    }

    setLoading(item.id);
    
    // TODO: Implement Stripe checkout for marketplace items
    setTimeout(() => {
      alert(`Purchase of ${item.name} initiated. This would redirect to Stripe checkout.`);
      setLoading(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary))] text-sm font-medium mb-4">
            <ShoppingCart className="h-4 w-4" />
            Premium Resources
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your BaZi practice with premium reports, guides, and courses from experts.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Items' : CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            </Button>
          ))}
        </div>

        {/* Marketplace Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = CATEGORY_ICONS[item.category];
            const isLocked = item.requiredPlan && item.requiredPlan.length > 0;

            return (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-3 rounded-lg bg-[hsl(var(--color-primary))]/10">
                      <Icon className="h-6 w-6 text-[hsl(var(--color-primary))]" />
                    </div>
                    {isLocked && (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {CATEGORY_LABELS[item.category]}
                  </Badge>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                  {isLocked && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Requires: {item.requiredPlan?.join(', ')} plan
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${item.price}
                    </span>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={loading === item.id}
                      size="sm"
                    >
                      {loading === item.id ? 'Processing...' : 'Purchase'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items found in this category.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-[hsl(var(--color-primary))] mb-2" />
              <CardTitle>Instant Access</CardTitle>
              <CardDescription>
                All digital products are delivered instantly after purchase. Start learning right away.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <GraduationCap className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Expert Created</CardTitle>
              <CardDescription>
                Content created by certified BaZi practitioners and ECM specialists.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Lifetime Updates</CardTitle>
              <CardDescription>
                Get free updates and improvements to all purchased content forever.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
