// Consolidated models with consistent naming
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ==================== Admin Model ====================
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["super-admin", "admin"], default: "admin" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const Admin = mongoose.model("Admin", adminSchema);

// ==================== Vendor Model ====================
const vendorSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    jobsCompleted: { type: Number, default: 0 },
    currentPack: { type: String, enum: ["Free", "Basic", "Premium", "Gold"], default: "Free" },
    status: { type: String, enum: ["pending", "approved", "blocked", "rejected"], default: "pending" },
    isBlocked: { type: Boolean, default: false },
    notification: { type: String, default: "" },
  },
  { timestamps: true }
);

vendorSchema.pre("save", async function (next) {
  if (!this.vendorId) {
    const count = await mongoose.model("Vendor").countDocuments();
    this.vendorId = "VEND-" + String(count + 1).padStart(5, "0");
  }
  next();
});

export const Vendor = mongoose.model("Vendor", vendorSchema);

// ==================== Customer Model ====================
const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: String,
    currentPack: String,
    status: { type: String, enum: ["Active", "Expired", "Pending"], default: "Pending" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);

// ==================== Plan Model ====================
const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    features: [{ type: String }],
    active: { type: Boolean, default: true },
    planType: { type: String, enum: ["vendor", "customer"], default: "customer" },
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);

// ==================== Booking Model ====================
const bookingSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    customerName: { type: String, required: true },
    services: { type: [String], required: true },
    bookingStatus: { type: String, enum: ["pending", "completed", "rejected", "confirmed"], default: "pending" },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);

// ==================== Admin Dashboard Stats Model ====================
const adminDashboardStatSchema = new mongoose.Schema(
  {
    totalVendors: Number,
    totalCustomers: Number,
    totalBookings: Number,
    vendorRevenue: Number,
    subscriptionRevenue: Number,
    activeSubscriptions: Number,
  },
  { timestamps: true }
);

export const AdminDashboardStat = mongoose.model("AdminDashboardStat", adminDashboardStatSchema);
