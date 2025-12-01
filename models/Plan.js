import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  features: [{ type: String }],
  planType: { type: String, enum: ["vendor", "customer"], default: "customer" }
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
