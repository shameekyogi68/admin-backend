import Plan from "../models/Plan.js";

// Add a subscription plan
export const addPlan = async (req, res) => {
  try {
    const { name, price, duration, features, planType } = req.body;

    if (!name || !price || !duration || !planType) {
      return res.status(400).json({ message: "All fields required" });
    }

    const plan = await Plan.create({
      name,
      price,
      duration,
      planType,
      features: features || []
    });

    res.status(201).json({
      message: "Plan created successfully",
      plan
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating plan", error });
  }
};

// Get all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans", error });
  }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plan", error });
  }
};

// Update plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    res.json({ message: "Plan updated", plan });

  } catch (error) {
    res.status(500).json({ message: "Error updating plan", error });
  }
};

// Hard delete - actually remove from database
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    res.json({ message: "Plan deleted successfully", plan });

  } catch (error) {
    res.status(500).json({ message: "Error deleting plan", error });
  }
};
