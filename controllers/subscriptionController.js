// controllers/subscriptionController.js
// Handles subscription queries from the Convenz database
// Subscriptions link users to plans

import mongoose from 'mongoose';

// Get or create Subscription model without redefining if it exists
let Subscription;
try {
  Subscription = mongoose.model('Subscription');
} catch {
  const subscriptionSchema = new mongoose.Schema({}, { strict: false });
  Subscription = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
}

// Get or create Plan model without redefining if it exists
let Plan;
try {
  Plan = mongoose.model('Plan');
} catch {
  const planSchema = new mongoose.Schema({}, { strict: false });
  Plan = mongoose.model('Plan', planSchema, 'plans');
}

/**
 * GET /api/subscriptions/all
 * Fetch all subscriptions
 */
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.json({
      data: subscriptions,
      total: subscriptions.length
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/subscriptions/user/:userId
 * Fetch subscription(s) for a specific user
 * userId is stored as a number in subscriptions collection
 */
export const getSubscriptionByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Convert userId to number since subscriptions store userId as integer
    const userIdNum = parseInt(userId, 10);

    const subscription = await Subscription.findOne({ userId: userIdNum });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found for this user' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/subscriptions/:id
 * Fetch a specific subscription by ID
 */
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subscription ID' });
    }

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/subscriptions/:id/with-plan
 * Fetch subscription with linked plan details
 */
export const getSubscriptionWithPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subscription ID' });
    }

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Try to fetch linked plan if planId exists
    let plan = null;
    if (subscription.planId) {
      plan = await Plan.findById(subscription.planId);
    }

    res.json({
      subscription,
      plan: plan || null
    });
  } catch (error) {
    console.error('Error fetching subscription with plan:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/subscriptions/add
 * Create a new subscription
 */
export const createSubscription = async (req, res) => {
  try {
    const { userId, planId, currentPack, price, startDate, expiryDate, status } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ message: 'userId and planId are required' });
    }

    const newSubscription = new Subscription({
      userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
      planId: mongoose.Types.ObjectId.isValid(planId) ? new mongoose.Types.ObjectId(planId) : planId,
      currentPack: currentPack || 'Standard',
      price: price || 0,
      startDate: startDate || new Date(),
      expiryDate: expiryDate || null,
      status: status || 'Active'
    });

    const savedSubscription = await newSubscription.save();
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: savedSubscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/subscriptions/update/:id
 * Update an existing subscription
 */
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subscription ID' });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/subscriptions/:id
 * Delete a subscription
 */
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subscription ID' });
    }

    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({
      message: 'Subscription deleted successfully',
      subscription
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: error.message });
  }
};
