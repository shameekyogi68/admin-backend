// routes/subscriptionRoutes.js
import express from 'express';
import {
  getAllSubscriptions,
  getSubscriptionByUserId,
  getSubscriptionById,
  getSubscriptionWithPlan,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscriptionController.js';

const router = express.Router();

/**
 * GET /api/subscriptions/all
 * Fetch all subscriptions
 */
router.get('/all', getAllSubscriptions);

/**
 * GET /api/subscriptions/user/:userId
 * Fetch subscription for a specific user
 */
router.get('/user/:userId', getSubscriptionByUserId);

/**
 * GET /api/subscriptions/:id/with-plan
 * Fetch subscription with linked plan details
 */
router.get('/:id/with-plan', getSubscriptionWithPlan);

/**
 * GET /api/subscriptions/:id
 * Fetch a specific subscription by ID
 */
router.get('/:id', getSubscriptionById);

/**
 * POST /api/subscriptions/add
 * Create a new subscription
 */
router.post('/add', createSubscription);

/**
 * PATCH /api/subscriptions/update/:id
 * Update an existing subscription
 */
router.patch('/update/:id', updateSubscription);

/**
 * DELETE /api/subscriptions/:id
 * Delete a subscription
 */
router.delete('/:id', deleteSubscription);

export default router;
