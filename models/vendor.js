// models/vendor.js
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,   // Service category
    },

    jobsCompleted: {
      type: Number,
      default: 0,
    },

    currentPack: {
      type: String,
      enum: ["Free", "Basic", "Premium", "Gold"],
      default: "Free",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "blocked", "rejected"],
      default: "pending",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    notification: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate vendorId (VEND-00001 format)
vendorSchema.pre("save", async function (next) {
  if (!this.vendorId) {
    const count = await mongoose.model("Vendor").countDocuments();
    this.vendorId = "VEND-" + String(count + 1).padStart(5, "0");
  }
  next();
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
