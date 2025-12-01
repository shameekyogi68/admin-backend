// models/AdminDashboardModel.js

import mongoose from "mongoose";

const adminDashboardSchema = new mongoose.Schema(
  {
    // Basic counts
    totalVendors: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCustomers: {
      type: Number,
      required: true,
      default: 0,
    },
    totalUsers: {
      type: Number,
      required: true,
      default: 0,
    },
    totalBookings: {
      type: Number,
      required: true,
      default: 0,
    },

    // Revenue details
    vendorRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    subscriptionRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },

    // Profit (as per your requirement: from subscription)
    totalProfit: {
      type: Number,
      required: true,
      default: 0,
    },

    // Active subscriptions count
    activeSubscriptions: {
      type: Number,
      required: true,
      default: 0,
    },

    // Optional: to know what time / period this snapshot is for
    periodType: {
      type: String,
      enum: ["overall", "daily", "weekly", "monthly"],
      default: "overall",
    },
    periodStart: {
      type: Date,
    },
    periodEnd: {
      type: Date,
    },

    // When this snapshot was calculated
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const AdminDashboardStat = mongoose.model(
  "AdminDashboardStat",
  adminDashboardSchema
);

export default AdminDashboardStat;
