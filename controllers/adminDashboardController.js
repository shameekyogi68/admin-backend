// controllers/adminDashboardController.js

import mongoose from 'mongoose';
import Vendor from "../models/vendor.js";
import Booking from "../models/bookingModel.js";

// Get or create User model for users collection
let User;
try {
  User = mongoose.model('User');
} catch {
  const userSchema = new mongoose.Schema({}, { strict: false });
  User = mongoose.model('User', userSchema, 'users');
}

// Get or create Subscription model
let Subscription;
try {
  Subscription = mongoose.model('Subscription');
} catch {
  const subscriptionSchema = new mongoose.Schema({}, { strict: false });
  Subscription = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');
}

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVendors,
      totalCustomers,
      totalBookings,
      vendorRevenueAgg,
      subscriptionRevenueAgg,
      activeSubscriptions,
    ] = await Promise.all([
      // Count all vendors
      Vendor.countDocuments(),

      // Count all users (customers) from Convenz
      User.countDocuments(),

      // Count bookings with status confirmed or completed
      Booking.countDocuments({
        status: { $in: ["confirmed", "completed"] },
      }),

      // Vendor revenue from completed bookings (sum of `amount`)
      Booking.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      // Subscription revenue (sum of `price` for active + expired)
      Subscription.aggregate([
        {
          $match: { status: { $in: ["Active", "active", "expired", "Expired"] } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" },
          },
        },
      ]),

      // Active subscriptions count from Convenz
      Subscription.countDocuments({ status: { $in: ["Active", "active"] } }),
    ]);

    // Safely extract aggregation values
    const vendorRevenue =
      Array.isArray(vendorRevenueAgg) && vendorRevenueAgg.length > 0
        ? vendorRevenueAgg[0].total
        : 0;

    const subscriptionRevenue =
      Array.isArray(subscriptionRevenueAgg) &&
      subscriptionRevenueAgg.length > 0
        ? subscriptionRevenueAgg[0].total
        : 0;

    // Total revenue = vendor revenue + subscription revenue
    const totalRevenue = vendorRevenue + subscriptionRevenue;

    // As per your requirement: profit only from subscription revenue
    const totalProfit = subscriptionRevenue;

    // Total users = vendors + customers
    const totalUsers = totalVendors + totalCustomers;

    return res.status(200).json({
      success: true,
      message: "Admin dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalVendors,
        totalCustomers,
        totalBookings,
        revenue: {
          totalRevenue,
          vendorRevenue,
          subscriptionRevenue,
        },
        totalProfit,
        activeSubscriptions,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard stats",
      error: error.message,
    });
  }
};
