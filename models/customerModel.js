// models/customerModel.js
import mongoose from 'mongoose';

/**
 * Schema to track usage of a customer's plan or service
 */
const usageSchema = new mongoose.Schema({
  used: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

// Main Customer Schema
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true }, // better as String to keep leading 0s, country codes etc.
    currentPack: { type: String },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Pending'],
      default: 'Active'
    },

    // NEW: expiry date of the current pack
    expiryDate: { type: Date },

    // NEW: separate flag to block/unblock without touching status
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Customer', customerSchema);
