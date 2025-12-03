// controllers/customerController.js
// This controller queries the 'users' collection from Convenz database
// and transforms it for the admin panel

import mongoose from 'mongoose';

// Create a User model that points to the 'users' collection
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

// Create a Subscription model
let Subscription;
try {
  Subscription = mongoose.model('Subscription');
} catch {
  const subscriptionSchema = new mongoose.Schema({}, { strict: false });
  Subscription = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
}

/**
 * GET /api/customers/getCustomers
 * Fetches users from Convenz database and transforms for admin panel
 * Optional query params:
 *  - status=Active|Expired|Pending
 *  - pack=<packName>
 *  - limit=10
 *  - page=1
 */
export const getCustomers = async (req, res) => {
  try {
    const { status, pack, limit, page } = req.query;

    const filter = {};
    // if (status) filter.status = status;  // Users don't have status field
    // if (pack) filter.currentPack = pack;   // Users don't have pack field

    const perPage = parseInt(limit, 10) || 0;
    const currentPage = parseInt(page, 10) || 1;

    let query = User.find(filter).sort({ createdAt: -1 });

    if (perPage > 0) {
      query = query.skip((currentPage - 1) * perPage).limit(perPage);
    }

    const [users, total] = await Promise.all([
      query.exec(),
      User.countDocuments(filter)
    ]);

    // Get user IDs to fetch subscriptions
    const userIds = users.map(user => user.user_id).filter(Boolean);
    
    // Fetch all subscriptions for these users
    const subscriptions = await Subscription.find({ 
      userId: { $in: userIds },
      status: 'Active' 
    }).sort({ createdAt: -1 });

    // Create a map of userId -> subscription
    const subscriptionMap = {};
    subscriptions.forEach(sub => {
      if (!subscriptionMap[sub.userId]) {
        subscriptionMap[sub.userId] = sub;
      }
    });

    // Transform users to admin panel format with subscription data
    const customers = users.map(user => {
      const subscription = subscriptionMap[user.user_id];
      
      return {
        _id: user._id,
        user_id: user.user_id,
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        gender: user.gender || '',
        address: user.address || '',
        isOnline: user.isOnline || false,
        subscription: user.subscription || null,
        // Use subscription data if available, otherwise N/A
        currentPack: subscription ? subscription.currentPack : 'N/A',
        status: subscription ? subscription.status : 'N/A',
        expiryDate: subscription ? subscription.expiryDate : null,
        isBlocked: user.isBlocked || false,
      };
    });

    res.json({
      data: customers,
      total
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/customers/:id
 */
export const getCustomerById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'Customer not found' });
    
    // Fetch subscription for this user
    const subscription = await Subscription.findOne({ 
      userId: user.user_id,
      status: 'Active'
    }).sort({ createdAt: -1 });
    
    const customer = {
      _id: user._id,
      user_id: user.user_id,
      name: user.name,
      phone: user.phone,
      email: user.email || '',
      gender: user.gender || '',
      address: user.address || '',
      isOnline: user.isOnline || false,
      subscription: user.subscription || null,
      // Use subscription data if available
      currentPack: subscription ? subscription.currentPack : 'N/A',
      status: subscription ? subscription.status : 'N/A',
      expiryDate: subscription ? subscription.expiryDate : null,
      isBlocked: user.isBlocked || false,
    };
    
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /api/customers/:id/block
 */
export const blockCustomer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Customer blocked', customer: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /api/customers/:id/unblock
 */
export const unblockCustomer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Customer unblocked', customer: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Sync customer data from user app
 */
export const syncCustomerFromUserApp = async (req, res) => {
  try {
    const { name, phone, currentPack, status, expiryDate } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const update = {
      ...(name && { name }),
      ...(currentPack && { currentPack }),
      ...(status && { status }),
      ...(expiryDate && { expiryDate })
    };

    const user = await User.findOneAndUpdate(
      { phone },
      { $set: update },
      { new: true, upsert: true }
    );

    res.json({ message: "Customer synced successfully", customer: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
