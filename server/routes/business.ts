import { Router } from "express";
import { PRICING_TIERS } from "@shared/business-types";

const router = Router();

// Get current user subscription
router.get('/user/subscription', async (req, res) => {
  try {
    // Mock user subscription data
    const subscription = {
      active: true,
      tier: 'pro',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      cancelAtPeriodEnd: false
    };

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Failed to fetch subscription' });
  }
});

// Upgrade user subscription
router.post('/user/upgrade', async (req, res) => {
  try {
    const { tierId, isYearly } = req.body;

    if (!tierId || !PRICING_TIERS[tierId as keyof typeof PRICING_TIERS]) {
      return res.status(400).json({ message: 'Invalid tier ID' });
    }

    const tier = PRICING_TIERS[tierId as keyof typeof PRICING_TIERS];

    // For enterprise tier, redirect to contact
    if (tierId === 'enterprise') {
      return res.json({ 
        message: 'Please contact sales for enterprise pricing',
        contactEmail: 'sales@neocore.one'
      });
    }

    // For free tier
    if (tierId === 'free') {
      return res.json({ 
        message: 'Downgraded to free tier',
        tier: 'free'
      });
    }

    // For paid tiers, return mock Stripe checkout URL
    const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_${tierId}_${isYearly ? 'yearly' : 'monthly'}`;

    res.json({
      checkoutUrl,
      tier: tierId,
      isYearly
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: 'Failed to upgrade subscription' });
  }
});

// Cancel user subscription
router.post('/user/cancel-subscription', async (req, res) => {
  try {
    // Mock cancellation
    res.json({ 
      message: 'Subscription cancelled successfully',
      cancelAtPeriodEnd: true
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

// Get user usage stats
router.get('/user/usage', async (req, res) => {
  try {
    // Mock usage data
    const usage = {
      aiRequests: 234,
      apiCalls: 1567,
      storageUsed: 2.4 * 1024 * 1024 * 1024, // 2.4 GB in bytes
      projectsCount: 5,
      period: 'monthly',
      lastReset: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
    };

    res.json(usage);
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ message: 'Failed to fetch usage' });
  }
});

// Get teams
router.get('/teams', async (req, res) => {
  try {
    // Mock teams data
    const teams = [
      {
        id: 1,
        name: 'Development Team',
        description: 'Main development team for NeoCore projects',
        ownerId: 'demo-user',
        tier: 'team',
        createdAt: new Date().toISOString(),
        settings: {
          allowGuestAccess: false,
          defaultProjectVisibility: 'private',
          requireApprovalForJoining: true
        },
        memberCount: 8
      }
    ];

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});

// Create team
router.post('/teams', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = {
      id: Date.now(),
      name,
      description: description || '',
      ownerId: 'demo-user',
      tier: 'team',
      createdAt: new Date().toISOString(),
      settings: {
        allowGuestAccess: false,
        defaultProjectVisibility: 'private',
        requireApprovalForJoining: true
      },
      memberCount: 1
    };

    res.json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

export default router;