import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PRICING_TIERS, type UserTier } from "@shared/business-types";
import { Check, Crown, Zap, Shield, Users, Star } from "lucide-react";

interface UserSubscription {
  active: boolean;
  tier: keyof typeof PRICING_TIERS;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const { data: subscription } = useQuery<UserSubscription>({
    queryKey: ['/api/user/subscription'],
    enabled: !!currentUser,
  });

  const upgradeMutation = useMutation({
    mutationFn: async (tierId: string) => {
      return apiRequest('POST', '/api/user/upgrade', { tierId, isYearly });
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
        toast({
          title: "Success",
          description: "Your subscription has been updated!",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade subscription",
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/user/cancel-subscription');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of your billing period.",
      });
    },
  });

  const getTierIcon = (tierId: string) => {
    const icons = {
      free: Zap,
      pro: Crown,
      team: Users,
      enterprise: Shield,
    };
    return icons[tierId as keyof typeof icons] || Zap;
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return monthlyPrice * 12 * 0.8; // 20% yearly discount
  };

  const formatPrice = (price: number, yearly: boolean) => {
    if (price === 0) return "Free";
    const displayPrice = yearly ? getYearlyPrice(price) : price;
    const period = yearly ? "/year" : "/month";
    return `$${displayPrice}${period}`;
  };

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'enterprise') {
      // For enterprise, redirect to contact
      window.open('mailto:sales@neocore.one?subject=Enterprise%20Inquiry', '_blank');
      return;
    }
    upgradeMutation.mutate(tierId);
  };

  const tiers = Object.values(PRICING_TIERS);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Scale your development with the right tools and resources
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-600 data-[state=checked]:to-purple-600"
          />
          <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Current Subscription Status */}
      {subscription && (
        <Card className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border-cyan-500/50">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Current Subscription
            </CardTitle>
            <CardDescription>
              You're currently on the {PRICING_TIERS[subscription.tier].name} plan
              {subscription.currentPeriodEnd && (
                <> until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
              )}
            </CardDescription>
          </CardHeader>
          {subscription.tier !== 'free' && (
            <CardContent>
              <Button
                variant="outline"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending || subscription.cancelAtPeriodEnd}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                {subscription.cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Cancel Subscription'}
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const Icon = getTierIcon(tier.id);
          const isCurrentTier = subscription?.tier === tier.id;
          const isPopular = tier.popular;

          return (
            <Card
              key={tier.id}
              className={`relative bg-gray-900/50 border-gray-700 transition-all hover:scale-105 ${
                isPopular ? 'ring-2 ring-cyan-500/50' : ''
              } ${isCurrentTier ? 'border-cyan-500' : ''}`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-purple-600">
                  Most Popular
                </Badge>
              )}
              {isCurrentTier && (
                <Badge className="absolute -top-3 right-4 bg-green-600">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-full w-fit">
                  <Icon className="h-8 w-8 text-cyan-400" />
                </div>
                <CardTitle className="text-xl text-white">{tier.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {tier.description}
                </CardDescription>
                <div className="pt-4">
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(tier.price, isYearly)}
                  </div>
                  {tier.price > 0 && isYearly && (
                    <div className="text-sm text-gray-400 line-through">
                      ${tier.price}/month
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                <div className="pt-4 space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="text-white">
                      {tier.limits.projects === -1 ? 'Unlimited' : tier.limits.projects}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Requests:</span>
                    <span className="text-white">
                      {tier.limits.aiRequests === -1 ? 'Unlimited' : `${tier.limits.aiRequests}/month`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage:</span>
                    <span className="text-white">{tier.limits.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collaborators:</span>
                    <span className="text-white">
                      {tier.limits.collaborators === -1 ? 'Unlimited' : tier.limits.collaborators}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full mt-6 ${
                    isCurrentTier
                      ? 'bg-gray-700 cursor-not-allowed'
                      : isPopular
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700'
                      : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                  }`}
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isCurrentTier || upgradeMutation.isPending}
                >
                  {isCurrentTier
                    ? 'Current Plan'
                    : tier.id === 'enterprise'
                    ? 'Contact Sales'
                    : tier.id === 'free'
                    ? 'Get Started'
                    : 'Upgrade Now'
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-white mb-2">Can I change my plan anytime?</h4>
            <p className="text-gray-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, 
              or at the end of your billing cycle for downgrades.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">What happens to my data if I downgrade?</h4>
            <p className="text-gray-400">
              Your data remains safe. If you exceed the limits of your new plan, you'll have read-only access 
              until you're within the limits or upgrade again.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Do you offer refunds?</h4>
            <p className="text-gray-400">
              We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-400">
              We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}