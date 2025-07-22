// Business Features - User Management and Pricing Types

export interface UserTier {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    projects: number;
    aiRequests: number;
    storage: string;
    collaborators: number;
    apiCalls: number;
  };
  popular?: boolean;
}

export const PRICING_TIERS: Record<string, UserTier> = {
  free: {
    id: 'free',
    name: 'Developer',
    description: 'Perfect for individual developers and small projects',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      'Up to 3 projects',
      '100 AI assistant requests/month',
      'Basic database management',
      'API playground',
      'Community support'
    ],
    limits: {
      projects: 3,
      aiRequests: 100,
      storage: '1GB',
      collaborators: 1,
      apiCalls: 1000
    }
  },
  
  pro: {
    id: 'pro',
    name: 'Professional',
    description: 'For growing teams and professional development',
    price: 29,
    billingPeriod: 'monthly',
    features: [
      'Unlimited projects',
      '1,000 AI assistant requests/month',
      'Advanced database features',
      'Custom AI assistants',
      'Team collaboration',
      'Priority support',
      'Advanced analytics'
    ],
    limits: {
      projects: -1, // unlimited
      aiRequests: 1000,
      storage: '10GB',
      collaborators: 5,
      apiCalls: 10000
    },
    popular: true
  },
  
  team: {
    id: 'team',
    name: 'Team',
    description: 'For larger teams and enterprise needs',
    price: 99,
    billingPeriod: 'monthly',
    features: [
      'Everything in Professional',
      '5,000 AI assistant requests/month',
      'Advanced security features',
      'SSO integration',
      'Custom integrations',
      'Dedicated support',
      'Advanced team management',
      'Audit logs'
    ],
    limits: {
      projects: -1,
      aiRequests: 5000,
      storage: '100GB',
      collaborators: 25,
      apiCalls: 50000
    }
  },
  
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 0, // Contact for pricing
    billingPeriod: 'monthly',
    features: [
      'Everything in Team',
      'Unlimited AI requests',
      'On-premise deployment',
      'Custom AI models',
      'White-label options',
      '24/7 dedicated support',
      'Custom SLA',
      'Advanced compliance'
    ],
    limits: {
      projects: -1,
      aiRequests: -1,
      storage: 'Unlimited',
      collaborators: -1,
      apiCalls: -1
    }
  }
};

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tier: keyof typeof PRICING_TIERS;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    soundEffects: boolean;
    defaultAIAssistant: string;
  };
  usage: {
    aiRequests: number;
    apiCalls: number;
    storageUsed: number;
    projectsCount: number;
  };
  subscription?: {
    active: boolean;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
  };
}

export interface TeamMember {
  userId: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  permissions: string[];
  joinedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: TeamMember[];
  tier: keyof typeof PRICING_TIERS;
  createdAt: Date;
  settings: {
    allowGuestAccess: boolean;
    defaultProjectVisibility: 'private' | 'team' | 'public';
    requireApprovalForJoining: boolean;
  };
}

export const getUserTierLimits = (tierId: keyof typeof PRICING_TIERS) => {
  return PRICING_TIERS[tierId].limits;
};

export const canUserPerformAction = (
  user: UserProfile, 
  action: keyof UserTier['limits'], 
  currentUsage: number
): boolean => {
  const limits = getUserTierLimits(user.tier);
  const limit = limits[action] as number;
  
  if (limit === -1) return true; // unlimited
  return currentUsage < limit;
};